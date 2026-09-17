import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, AlertTriangle, CheckCircle2, ArrowUpDown, Info, Calculator } from 'lucide-react'
import tables from '../data/compoundInterestTables.json'

type FactorKey = 'FP' | 'PF' | 'AF' | 'AP' | 'FA' | 'PA' | 'AG' | 'PG'

interface FactorInfo {
  key: FactorKey
  notation: string
  name: string
  nameEn: string
  formula: string
  description: string
}

const factorList: FactorInfo[] = [
  { key: 'FP', notation: '(F/P, i, n)', name: '复利终值系数', nameEn: 'Single Payment Compound Amount', formula: '(1+i)^n', description: '已知现值P，求终值F' },
  { key: 'PF', notation: '(P/F, i, n)', name: '复利现值系数', nameEn: 'Single Payment Present Worth', formula: '(1+i)^{-n}', description: '已知终值F，求现值P' },
  { key: 'FA', notation: '(F/A, i, n)', name: '等额年金终值系数', nameEn: 'Uniform Series Compound Amount', formula: '[(1+i)^n-1]/i', description: '已知等额年金A，求终值F' },
  { key: 'PA', notation: '(P/A, i, n)', name: '等额年金现值系数', nameEn: 'Uniform Series Present Worth', formula: '[(1+i)^n-1]/[i(1+i)^n]', description: '已知等额年金A，求现值P' },
  { key: 'AF', notation: '(A/F, i, n)', name: '偿债基金系数', nameEn: 'Sinking Fund Factor', formula: 'i/[(1+i)^n-1]', description: '已知终值F，求等额年金A' },
  { key: 'AP', notation: '(A/P, i, n)', name: '资本回收系数', nameEn: 'Capital Recovery Factor', formula: 'i(1+i)^n/[(1+i)^n-1]', description: '已知现值P，求等额年金A' },
  { key: 'AG', notation: '(A/G, i, n)', name: '等差梯度年金系数', nameEn: 'Gradient to Uniform Series', formula: '{1-[ni/((1+i)^n-1)]}/i', description: '已知梯度G，求等额年金A' },
  { key: 'PG', notation: '(P/G, i, n)', name: '等差梯度现值系数', nameEn: 'Gradient Present Worth', formula: '[(1+i)^n-in-1]/[i^2(1+i)^n]', description: '已知梯度G，求现值P' },
]

interface TableRow {
  n: number
  [key: string]: number
}

interface LookupResult {
  value: number
  exact: boolean
  source: 'table' | 'formula' | 'interpolated'
  interpolated?: {
    low: number
    high: number
    lowVal: number
    highVal: number
  }
}

// Format number: 4 decimal places, remove trailing zeros
function fmt(v: number): string {
  if (!isFinite(v)) return '—'
  return v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0000')
}

// ====== Formula calculation for any rate ======
function computeFactor(key: FactorKey, i: number, n: number): number {
  const v = Math.pow(1 + i, n)
  switch (key) {
    case 'FP': return v
    case 'PF': return 1 / v
    case 'FA': return (v - 1) / i
    case 'PA': return (v - 1) / (i * v)
    case 'AF': return i / (v - 1)
    case 'AP': return (i * v) / (v - 1)
    case 'AG': return (1 / i) - (n / (v - 1))
    case 'PG': return (v - i * n - 1) / (Math.pow(i, 2) * v)
  }
}

// Find the two closest n values for interpolation within table rows
function findBracketingRows(rows: TableRow[], targetN: number): { low: TableRow; high: TableRow } | null {
  if (rows.length === 0) return null
  const nLow = Math.floor(targetN)
  const nHigh = Math.ceil(targetN)

  if (nLow === nHigh) {
    const exact = rows.find(r => r.n === nLow)
    if (exact) return { low: exact, high: exact }
    return null
  }

  const lowRow = rows.find(r => r.n === nLow)
  const highRow = rows.find(r => r.n === nHigh)

  if (lowRow && highRow) return { low: lowRow, high: highRow }
  if (lowRow) return { low: lowRow, high: lowRow }
  if (highRow) return { low: highRow, high: highRow }
  return null
}

// Linear interpolation
function interpolate(valueAtLow: number, valueAtHigh: number, nLow: number, nHigh: number, targetN: number): number {
  if (nLow === nHigh) return valueAtLow
  const fraction = (targetN - nLow) / (nHigh - nLow)
  return valueAtLow + fraction * (valueAtHigh - valueAtLow)
}

// Main lookup function
function lookupFactor(
  rows: TableRow[],
  factorKey: FactorKey,
  targetN: number,
  rateDecimal: number,
  hasExactRate: boolean,
  tableMaxN: number
): LookupResult {
  // If target n is beyond what the table has, use formula regardless
  if (hasExactRate && rows.length > 0 && targetN <= tableMaxN) {
    const bracket = findBracketingRows(rows, targetN)
    if (!bracket) {
      return { value: computeFactor(factorKey, rateDecimal, targetN), exact: true, source: 'formula' }
    }
    const { low, high } = bracket
    if (low.n === high.n) {
      return { value: low[factorKey], exact: true, source: 'table' }
    }
    const value = interpolate(low[factorKey], high[factorKey], low.n, high.n, targetN)
    return {
      value,
      exact: false,
      source: 'interpolated',
      interpolated: {
        low: low.n,
        high: high.n,
        lowVal: low[factorKey],
        highVal: high[factorKey],
      },
    }
  }

  // Either rate not in table, or n > table range — compute with formulas
  return { value: computeFactor(factorKey, rateDecimal, targetN), exact: true, source: 'formula' }
}

// Generate extended rows up to maxN using formulas for n beyond table range
function generateExtendedRows(rows: TableRow[], rateDecimal: number, maxN: number): TableRow[] {
  if (rows.length === 0 || maxN <= rows[rows.length - 1].n) return rows
  const extended = [...rows]
  const tableMaxN = rows[rows.length - 1].n
  for (let n = tableMaxN + 1; n <= maxN; n++) {
    extended.push({
      n,
      FP: computeFactor('FP', rateDecimal, n),
      PF: computeFactor('PF', rateDecimal, n),
      AF: computeFactor('AF', rateDecimal, n),
      AP: computeFactor('AP', rateDecimal, n),
      FA: computeFactor('FA', rateDecimal, n),
      PA: computeFactor('PA', rateDecimal, n),
      AG: computeFactor('AG', rateDecimal, n),
      PG: computeFactor('PG', rateDecimal, n),
    })
  }
  return extended
}

const rateLabels: Record<string, string> = {
  '0.25': '1/4%', '0.5': '1/2%', '0.75': '3/4%', '1.25': '1 1/4%', '1.5': '1 1/2%',
  '1.75': '1 3/4%', '2.5': '2 1/2%', '3.5': '3 1/2%', '4.5': '4 1/2%',
}

const sortedRates = Object.keys(tables).sort((a, b) => parseFloat(a) - parseFloat(b))
const MAX_GLOBAL_N = 400 // unified max n for both table and formula modes

export default function FactorLookup() {
  const [inputRate, setInputRate] = useState('10')
  const [inputN, setInputN] = useState('')
  const [showTable, setShowTable] = useState(false)

  const rateDecimal = parseFloat(inputRate) / 100
  const targetN = parseFloat(inputN)

  // Check if this exact rate exists in the textbook tables
  const hasExactRate = sortedRates.includes(inputRate)
  const selectedRateKey = hasExactRate ? inputRate : ''

  const currentRows: TableRow[] = useMemo(() => {
    return selectedRateKey ? (tables as Record<string, TableRow[]>)[selectedRateKey] || [] : []
  }, [selectedRateKey])

  const tableMaxN = hasExactRate ? (currentRows[currentRows.length - 1]?.n || 0) : 0
  const maxN = MAX_GLOBAL_N

  const isValidN = !isNaN(targetN) && targetN >= 1 && targetN <= maxN

  // Extended rows: table values + formula-computed values up to 400
  const extendedRows: TableRow[] = useMemo(() => {
    if (!hasExactRate || currentRows.length === 0) return currentRows
    return generateExtendedRows(currentRows, rateDecimal, MAX_GLOBAL_N)
  }, [currentRows, hasExactRate, rateDecimal])

  const results = useMemo(() => {
    if (!isValidN || isNaN(rateDecimal) || rateDecimal <= 0) return null
    const res: Record<FactorKey, LookupResult> = {} as Record<FactorKey, LookupResult>
    for (const f of factorList) {
      res[f.key] = lookupFactor(currentRows, f.key, targetN, rateDecimal, hasExactRate, tableMaxN)
    }
    return res
  }, [currentRows, isValidN, targetN, rateDecimal, hasExactRate, tableMaxN])

  // Filter table rows for display
  const filteredRows = useMemo(() => {
    if (!showTable) return extendedRows.slice(0, 30)
    return extendedRows
  }, [extendedRows, showTable])

  const displayRate = rateLabels[inputRate] || `${inputRate}%`

  // Source badge helper
  const SourceBadge = ({ res }: { res: LookupResult }) => {
    if (res.source === 'table') {
      return (
        <span className="flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle2 className="w-3.5 h-3.5" />查表值
        </span>
      )
    }
    if (res.source === 'interpolated') {
      return (
        <span className="flex items-center gap-1 text-xs text-amber-600">
          <AlertTriangle className="w-3.5 h-3.5" />插值
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-xs text-blue-600">
        <Calculator className="w-3.5 h-3.5" />公式计算
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-12 bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-econ-400/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-econ-400" />
              </div>
              <div>
                <p className="text-navy-300 text-xs font-medium tracking-wider uppercase">Appendix C Lookup Tool</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">复利系数查表工具</h1>
              </div>
            </div>
            <p className="text-navy-200/70 max-w-2xl text-sm leading-relaxed">
              基于《Engineering Economic Analysis》第11版 附录C 的复利系数表，支持
              <strong className="text-econ-300"> 0.01%~100% </strong>
              任意利率（两位小数）、整数与<strong className="text-econ-300">小数期数</strong>查询。
              课本表内利率直接查表，表外利率使用标准公式实时计算。
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rate Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                利率 i (%)（0.01 ~ 100）
              </label>
              <input
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={inputRate}
                onChange={e => setInputRate(e.target.value)}
                placeholder="输入利率，如 10.25"
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold text-navy-800 placeholder:text-slate-300 hover:border-econ-400 focus:border-econ-400 focus:ring-2 focus:ring-econ-400/20 transition-all outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                {hasExactRate ? (
                  <span className="text-emerald-600 font-medium">
                    该利率在课本附录C中有完整系数表，将直接查表。
                  </span>
                ) : (
                  <span className="text-blue-600 font-medium">
                    该利率不在课本表中，将使用标准复利公式实时计算。
                  </span>
                )}
              </p>
            </div>

            {/* N Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                期数 n（支持小数，如 4.5）
              </label>
              <input
                type="number"
                min="1"
                max={maxN}
                step="0.1"
                value={inputN}
                onChange={e => setInputN(e.target.value)}
                placeholder={`输入期数（1 ~ 400）`}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold text-navy-800 placeholder:text-slate-300 hover:border-econ-400 focus:border-econ-400 focus:ring-2 focus:ring-econ-400/20 transition-all outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                最大支持期数：400 期
              </p>
            </div>
          </div>

          {/* Info badge */}
          <div className="mt-4 flex items-start gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              数据来源：Engineering Economic Analysis, 11th Edition, Appendix C — Compound Interest Tables。
              {inputN && isValidN && hasExactRate && !Number.isInteger(targetN) && targetN <= tableMaxN && (
                <span className="text-amber-700 font-medium">
                  {' '}当前为小数期数，使用线性插值法计算（基于相邻两个整数期的表值）。
                </span>
              )}
              {inputN && isValidN && hasExactRate && targetN > tableMaxN && (
                <span className="text-blue-700 font-medium">
                  {' '}当前期数超出课本表范围（n &gt; {tableMaxN}），使用标准公式计算。
                </span>
              )}
              {inputN && isValidN && !hasExactRate && (
                <span className="text-blue-700 font-medium">
                  {' '}当前利率不在课本表中，所有系数使用标准公式直接计算，精度与查表一致。
                </span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              key={`${inputRate}-${targetN}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {factorList.map((factor, idx) => {
                  const res = results[factor.key]
                  return (
                    <motion.div
                      key={factor.key}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden hover:shadow-xl transition-shadow group"
                    >
                      <div className="p-4">
                        {/* Bilingual title */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-col gap-0.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md w-fit ${
                              idx < 2 ? 'bg-emerald-100 text-emerald-700' :
                              idx < 4 ? 'bg-blue-100 text-blue-700' :
                              idx < 6 ? 'bg-amber-100 text-amber-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {factor.name}
                            </span>
                            <span className="text-[10px] text-slate-400 italic leading-tight">
                              {factor.nameEn}
                            </span>
                          </div>
                          <SourceBadge res={res} />
                        </div>
                        <p className="text-xs text-slate-400 mb-1 font-mono">{factor.notation.replace('i', displayRate).replace('n', String(targetN))}</p>
                        <p className="text-2xl font-bold text-navy-800 font-mono tracking-tight">
                          {fmt(res.value)}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{factor.description}</p>

                        {/* Interpolation detail */}
                        {res.source === 'interpolated' && res.interpolated && (
                          <div className="mt-2 pt-2 border-t border-dashed border-slate-200">
                            <p className="text-[10px] text-slate-500">
                              线性插值：n={res.interpolated.low} → {fmt(res.interpolated.lowVal)}，
                              n={res.interpolated.high} → {fmt(res.interpolated.highVal)}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {inputN && !isValidN && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
          >
            请输入有效期数（1 &le; n &le; 400）
          </motion.div>
        )}

        {/* Data Table — only show when exact rate exists */}
        {hasExactRate && currentRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-800">
                  完整系数表 — i = {displayRate}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  前 {tableMaxN} 行为课本附录C原始数据，n &gt; {tableMaxN} 部分由公式计算补充（共 {extendedRows.length} 行）
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">按期数排列</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 border-b sticky left-0 bg-slate-50 z-10">n</th>
                    {factorList.map(f => (
                      <th key={f.key} className="px-3 py-3 text-center font-semibold text-slate-600 border-b whitespace-nowrap">
                        <span className="block font-mono text-xs">{f.key}</span>
                        <span className="block text-[10px] text-slate-400">{f.notation.split(',')[0]}{f.notation.split(',')[1]}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => {
                    const isHighlighted = isValidN && (row.n === targetN || (targetN > row.n && idx === filteredRows.length - 1))
                    const isFormulaRow = row.n > tableMaxN
                    return (
                      <tr
                        key={row.n}
                        className={`border-b border-slate-100 hover:bg-blue-50/50 transition-colors ${
                          isHighlighted ? 'bg-econ-400/10 font-semibold' : ''
                        } ${isFormulaRow ? 'opacity-70' : ''}`}
                      >
                        <td className={`px-4 py-2 text-center font-mono font-bold sticky left-0 z-10 ${
                          isHighlighted ? 'bg-econ-400/10 text-econ-600' : 'bg-white text-slate-800'
                        }`}>
                          {row.n}
                          {isFormulaRow && <span className="ml-1 text-[8px] text-blue-400" title="公式计算">公式</span>}
                        </td>
                        {factorList.map(f => (
                          <td key={f.key} className={`px-3 py-2 text-center font-mono text-xs ${
                            isHighlighted ? 'text-econ-700 font-bold' : 'text-slate-600'
                          }`}>
                            {fmt(row[f.key])}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {currentRows.length > 30 && !showTable && (
              <div className="px-6 py-4 border-t border-slate-200 text-center">
                <button
                  onClick={() => setShowTable(true)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                >
                  显示全部 {currentRows.length} 行
                </button>
              </div>
            )}
            {showTable && currentRows.length > 30 && (
              <div className="px-6 py-4 border-t border-slate-200 text-center">
                <button
                  onClick={() => setShowTable(false)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                >
                  收起
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* When using formula mode, show the formulas used */}
        {!hasExactRate && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden mt-8"
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-navy-800">
                计算公式参考 — i = {displayRate}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                以下公式用于实时计算，其中 i = {inputRate}% = {rateDecimal.toFixed(4)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {factorList.map((factor, idx) => (
                <div
                  key={factor.key}
                  className={`px-6 py-4 ${idx % 2 === 0 ? 'border-r border-slate-100' : ''} ${idx < factorList.length - 2 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-navy-700">{factor.key}</span>
                    <span className="text-xs text-slate-500">{factor.name}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-mono">
                    {factor.formula}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reference note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            数据来源：Engineering Economic Analysis, 11th Edition (Newnan, Lavelle, Eschenbach) — Appendix C: Compound Interest Tables
          </p>
          <p className="text-xs text-slate-300 mt-1">
            课本表内利率：n &le; 表最大期数 时直接查表，n &gt; 表最大期数 时由公式计算补充至400期。表外利率全程使用标准复利公式直接计算。
          </p>
        </div>
      </div>
    </div>
  )
}
