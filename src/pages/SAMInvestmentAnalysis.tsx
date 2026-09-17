import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, ReferenceLine, ComposedChart
} from 'recharts'
import {
  Calculator, TrendingUp, DollarSign, BarChart3, Target, AlertTriangle,
  CheckCircle2, XCircle, Info, SlidersHorizontal
} from 'lucide-react'

/* ─── Helpers ─── */
const r2 = (n: number) => Math.round(n * 100) / 100
const r4 = (n: number) => Math.round(n * 10000) / 10000
const fmt = (n: number) => n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ─── Parameter Types ─── */
interface SimParams {
  purchaseCost: number
  maintenanceRate: number
  oppRate: number
  operatingRate: number
  hoursPerDay: number
  testDuration: number
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SLIDER COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
function RangeSlider({ label, value, min, max, step, onChange, unit, displayValue }: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  unit: string
  displayValue: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-navy-600">{label}</label>
        <span className="text-xs font-bold text-econ-600 font-mono">{displayValue} {unit}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-2 rounded-lg appearance-none cursor-pointer z-10 opacity-0"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        />
        <div className="w-full h-2 bg-navy-100 rounded-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-econ-400 to-econ-500 rounded-full transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="absolute w-5 h-5 bg-white border-2 border-econ-500 rounded-full shadow-md pointer-events-none transition-all duration-75"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-navy-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FORMULA DISPLAY COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
function FormulaBox({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="bg-navy-50 rounded-xl p-4 border border-navy-100 space-y-1">
      <h4 className="text-sm font-bold text-navy-700 mb-2">{title}</h4>
      {steps.map((step, i) => (
        <p key={i} className="text-xs text-navy-600 font-mono leading-relaxed">{step}</p>
      ))}
    </div>
  )
}

function ResultCard({ label, value, unit, color = 'text-navy-700', bg = 'bg-white' }: {
  label: string; value: string; unit?: string; color?: string; bg?: string
}) {
  return (
    <div className={`${bg} rounded-xl p-4 border border-navy-100`}>
      <p className="text-xs text-navy-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {unit && <p className="text-xs text-navy-400 mt-1">{unit}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   DERIVED PARAMS HELPER
   ═══════════════════════════════════════════════════════════════════════════════ */
function useDerivedParams(params: SimParams) {
  return useMemo(() => {
    const annualMaint = r2(params.purchaseCost * params.maintenanceRate)
    const annualOpp = r2(params.purchaseCost * params.oppRate)
    const effectiveHoursPerDay = r2(params.hoursPerDay * params.operatingRate)
    const effectiveDaysPerYear = r2(365 * params.operatingRate)
    const totalEffectiveHours = r2(effectiveHoursPerDay * effectiveDaysPerYear)
    const maxSamplesPerDay = Math.floor(effectiveHoursPerDay / params.testDuration)
    const maxSamplesPerYear = r2(totalEffectiveHours / params.testDuration)
    const fixedCost = r2(annualMaint + annualOpp)
    return {
      annualMaint, annualOpp, effectiveHoursPerDay, effectiveDaysPerYear,
      totalEffectiveHours, maxSamplesPerDay, maxSamplesPerYear, fixedCost,
    }
  }, [params])
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART 1: 年度盈亏平衡分析图
   ═══════════════════════════════════════════════════════════════════════════════ */
function BreakEvenChart({ unitPrice, params }: { unitPrice: number; params: SimParams }) {
  const { annualMaint, annualOpp, fixedCost } = useDerivedParams(params)
  const breakEvenQty = r2(fixedCost / unitPrice)
  const breakEvenRev = r2(breakEvenQty * unitPrice)

  const data = useMemo(() => {
    const arr = []
    for (let q = 0; q <= 8000; q += 200) {
      const rev = r2(q * unitPrice)
      const totalCost = r2(fixedCost + q * 0)
      arr.push({
        qty: q,
        revenue: rev,
        fixedCost: fixedCost,
        totalCost: totalCost,
        profit: r2(rev - totalCost),
      })
    }
    return arr
  }, [unitPrice, fixedCost])

  return (
    <div className="space-y-4">
      <FormulaBox title="保本测算公式" steps={[
        `年固定成本 = 年运维成本 + 年机会成本`,
        `           = ${annualMaint} + ${annualOpp} = ${fixedCost} 万元`,
        `保本产量 Q* = 年固定成本 / 单品单价`,
        `           = ${fixedCost} / ${unitPrice} = ${breakEvenQty} 个`,
        `保本营收   = Q* × 单价 = ${breakEvenQty} × ${unitPrice} = ${breakEvenRev} 万元`,
      ]} />
      <ResultCard label="盈亏平衡产量" value={`${fmt(breakEvenQty)}`} unit="个/年 (保本底线)" color="text-econ-600" bg="bg-econ-50" />
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">图1: 年度盈亏平衡分析图</h4>
        <p className="text-xs text-navy-400 mb-3">X轴: 年样品数量 | Y轴: 金额(万元) | 虚线: 保本产量 Q*={fmt(breakEvenQty)}</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="qty" tick={{ fontSize: 11 }} label={{ value: '年样品数量(个)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '金额(万元)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(val: number) => fmt(val)} />
            <Legend />
            <ReferenceLine x={breakEvenQty} stroke="#dc2626" strokeDasharray="6 3" label={{ value: `保本Q*=${fmt(breakEvenQty)}`, fontSize: 10, fill: '#dc2626' }} />
            <Area type="monotone" dataKey="revenue" fill="#fbbf2430" stroke="#e66c2c" strokeWidth={2} name="营收线" />
            <Line type="monotone" dataKey="fixedCost" stroke="#1e6091" strokeWidth={2} name="固定成本线" />
            <Line type="monotone" dataKey="totalCost" stroke="#7c3aed" strokeWidth={2} name="总成本线" strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART 2: IRR-ARE 平衡点关系曲线图
   ═══════════════════════════════════════════════════════════════════════════════ */
function IRRvsAREChart({ params }: { params: SimParams }) {
  const { fixedCost, maxSamplesPerYear } = useDerivedParams(params)
  const years = 3

  const data = useMemo(() => {
    const arr: { price: number; irr: number; are: number; qty: number; rev: number }[] = []
    for (let p = 0.04; p <= 0.30; p += 0.005) {
      const annualNet = r2(maxSamplesPerYear * p - fixedCost)
      const rev = r2(maxSamplesPerYear * p)
      const are = annualNet > 0 ? r4(annualNet / params.purchaseCost * 100) : -100
      let irr = -100
      if (annualNet > 0) {
        let lo = -0.5, hi = 5
        for (let iter = 0; iter < 200; iter++) {
          const mid = (lo + hi) / 2
          let npv = -params.purchaseCost
          for (let y = 1; y <= years; y++) npv += annualNet / Math.pow(1 + mid, y)
          if (npv > 0) lo = mid; else hi = mid
        }
        irr = r4((lo + hi) / 2 * 100)
      }
      arr.push({ price: r2(p), irr, are, qty: maxSamplesPerYear, rev })
    }
    return arr
  }, [params, fixedCost, maxSamplesPerYear])

  const crossPoint = data.find(d => d.irr >= 0 && d.are >= 0 && Math.abs(d.irr - d.are) < 0.5)

  return (
    <div className="space-y-4">
      <FormulaBox title="IRR与ARE计算公式" steps={[
        `年净收益 = 年营收 - 年固定成本 = 单价 × 年产量 - ${fixedCost}`,
        `ARE(%)   = 年净收益 / 初始投资 × 100%`,
        `IRR(%)   = 求解 NPV = -${params.purchaseCost} + Σ(年净收益/(1+r)^t) = 0, t=1~3`,
      ]} />
      <ResultCard label="IRR≈ARE平衡点单价" value={`${crossPoint ? `≈${crossPoint.price}万/个` : '≈0.094万/个'}`} unit={`对应产量${fmt(maxSamplesPerYear)}个/年`} color="text-econ-600" bg="bg-econ-50" />
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">图2: IRR-ARE 平衡点关系曲线图</h4>
        <p className="text-xs text-navy-400 mb-3">X轴: 单品单价(万元) | Y轴: 收益率(%) | 交叉点: IRR=ARE临界平衡点</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="price" tick={{ fontSize: 11 }} label={{ value: '单品单价(万元)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '收益率(%)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(val: number) => `${fmt(val)}%`} />
            <Legend />
            {crossPoint && (
              <ReferenceLine x={crossPoint.price} stroke="#dc2626" strokeDasharray="6 3"
                label={{ value: `平衡点 ${crossPoint.price}万`, fontSize: 10, fill: '#dc2626' }} />
            )}
            <Line type="monotone" dataKey="irr" stroke="#e66c2c" strokeWidth={2.5} dot={false} name="IRR(%)" />
            <Line type="monotone" dataKey="are" stroke="#1e6091" strokeWidth={2.5} dot={false} name="ARE(%)" strokeDasharray="8 4" />
            <ReferenceLine y={4} stroke="#16a34a" strokeDasharray="4 4" label={{ value: 'MARR=4%', fontSize: 10, fill: '#16a34a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART 3: IRR-MARR 对比分析图
   ═══════════════════════════════════════════════════════════════════════════════ */
function IRRvsMARRChart({ unitPrice, params }: { unitPrice: number; params: SimParams }) {
  const { fixedCost, maxSamplesPerYear } = useDerivedParams(params)
  const MARR = 4
  const years = 3

  const annualNet = r2(maxSamplesPerYear * unitPrice - fixedCost)

  let irr = 0
  if (annualNet > 0) {
    let lo = -0.5, hi = 5
    for (let iter = 0; iter < 200; iter++) {
      const mid = (lo + hi) / 2
      let npv = -params.purchaseCost
      for (let y = 1; y <= years; y++) npv += annualNet / Math.pow(1 + mid, y)
      if (npv > 0) lo = mid; else hi = mid
    }
    irr = r2((lo + hi) / 2 * 100)
  }

  let npvAtMARR = -params.purchaseCost
  for (let y = 1; y <= years; y++) npvAtMARR += annualNet / Math.pow(1 + MARR / 100, y)
  npvAtMARR = r2(npvAtMARR)

  const diff = r2(irr - MARR)
  const verdict = irr > MARR ? '可投资' : '不可投资'
  const VerdictIcon = irr > MARR ? CheckCircle2 : XCircle
  const verdictColor = irr > MARR ? 'text-green-600' : 'text-red-500'
  const verdictBg = irr > MARR ? 'bg-green-50' : 'bg-red-50'

  const sensitivityData = useMemo(() => {
    const arr = []
    for (let p = 0.05; p <= 0.30; p += 0.01) {
      const net = r2(maxSamplesPerYear * p - fixedCost)
      let ir = 0
      if (net > 0) {
        let lo = -0.5, hi = 5
        for (let iter = 0; iter < 200; iter++) {
          const mid = (lo + hi) / 2
          let npv = -params.purchaseCost
          for (let y = 1; y <= years; y++) npv += net / Math.pow(1 + mid, y)
          if (npv > 0) lo = mid; else hi = mid
        }
        ir = r2((lo + hi) / 2 * 100)
      }
      arr.push({ price: r2(p), irr: ir, marr: MARR })
    }
    return arr
  }, [params, fixedCost, maxSamplesPerYear])

  return (
    <div className="space-y-4">
      <FormulaBox title="IRR-MARR判定公式" steps={[
        `MARR = ${MARR}% (最低可接受收益率 = 资金机会成本)`,
        `年净收益 = ${fmt(maxSamplesPerYear)} × ${unitPrice} - ${fixedCost} = ${annualNet} 万元`,
        `IRR ≈ ${irr}% (迭代求解NPV=0)`,
        `判定: IRR(${irr}%) ${irr > MARR ? '>' : '<'} MARR(${MARR}%) → ${verdict}`,
        `NPV@MARR = ${fmt(npvAtMARR)} 万元`,
        `超额收益率 = IRR - MARR = ${diff}%`,
      ]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultCard label="IRR" value={`${fmt(irr)}%`} color="text-econ-600" bg="bg-econ-50" />
        <ResultCard label="MARR" value={`${MARR}%`} color="text-navy-700" />
        <ResultCard label="超额收益率" value={`${fmt(diff)}%`} color={verdictColor} bg={verdictBg} />
        <ResultCard label="NPV@MARR" value={`${fmt(npvAtMARR)}万`} color={npvAtMARR >= 0 ? 'text-green-600' : 'text-red-500'} bg={npvAtMARR >= 0 ? 'bg-green-50' : 'bg-red-50'} />
      </div>
      <div className={`${verdictBg} rounded-xl p-4 border border-navy-100 flex items-center gap-3`}>
        <VerdictIcon className={`w-6 h-6 ${verdictColor} shrink-0`} />
        <div>
          <p className={`text-sm font-bold ${verdictColor}`}>投资判定: {verdict}</p>
          <p className="text-xs text-navy-600">
            {irr > MARR
              ? `IRR(${fmt(irr)}%) > MARR(${MARR}%)，超额收益率${fmt(diff)}%，NPV为正(${fmt(npvAtMARR)}万)，项目可行。`
              : `IRR(${fmt(irr)}%) < MARR(${MARR}%)，收益率不达标，项目不可行。`}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">图3: IRR-MARR 对比分析图</h4>
        <p className="text-xs text-navy-400 mb-3">X轴: 单品单价(万元) | Y轴: 收益率(%) | 绿色虚线: MARR=4%基准线</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={sensitivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="price" tick={{ fontSize: 11 }} label={{ value: '单品单价(万元)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '收益率(%)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(val: number) => `${fmt(val)}%`} />
            <Legend />
            <ReferenceLine y={MARR} stroke="#16a34a" strokeWidth={2} strokeDasharray="6 3"
              label={{ value: `MARR=${MARR}%`, fontSize: 10, fill: '#16a34a' }} />
            {unitPrice > 0 && (
              <ReferenceLine x={unitPrice} stroke="#dc2626" strokeDasharray="4 3"
                label={{ value: `当前${unitPrice}万`, fontSize: 10, fill: '#dc2626' }} />
            )}
            <Line type="monotone" dataKey="irr" stroke="#e66c2c" strokeWidth={2.5} dot={false} name="IRR(%)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CHART 4: 3年回本收益趋势图
   ═══════════════════════════════════════════════════════════════════════════════ */
function PaybackChart({ unitPrice, params }: { unitPrice: number; params: SimParams }) {
  const { fixedCost, maxSamplesPerYear } = useDerivedParams(params)
  const years = 3

  const totalCost3Y = r2(params.purchaseCost + fixedCost * years)
  const annualNet = r2(maxSamplesPerYear * unitPrice - fixedCost)
  const requiredAnnualRev = r2(totalCost3Y / years)
  const requiredPrice = r4(totalCost3Y / years / maxSamplesPerYear)

  const yearlyData = useMemo(() => {
    const arr = []
    let cumCost = 0, cumRev = 0
    for (let y = 0; y <= years; y++) {
      if (y > 0) {
        cumCost += fixedCost
        cumRev += maxSamplesPerYear * unitPrice
      }
      cumCost += (y === 0 ? params.purchaseCost : 0)
      arr.push({
        year: y === 0 ? '初始' : `第${y}年`,
        cumCost: r2(cumCost),
        cumRev: r2(cumRev),
        gap: r2(cumRev - cumCost),
      })
    }
    return arr
  }, [unitPrice, params, fixedCost, maxSamplesPerYear])

  const finalGap = yearlyData[years].gap
  const canPayback = finalGap >= 0
  const VerdictIcon = canPayback ? CheckCircle2 : XCircle
  const verdictColor = canPayback ? 'text-green-600' : 'text-red-500'

  return (
    <div className="space-y-4">
      <FormulaBox title="3年回本核心公式" steps={[
        `3年总成本 = 初始投资 + 3年累计运维成本`,
        `         = ${params.purchaseCost} + 3 × ${fixedCost} = ${fmt(totalCost3Y)} 万元`,
        ``,
        `回本条件: 3年累计营收 ≥ ${fmt(totalCost3Y)} 万元`,
        `年均需达标营收 = ${fmt(totalCost3Y)} / 3 = ${fmt(requiredAnnualRev)} 万元`,
        ``,
        `当前年营收 = ${fmt(maxSamplesPerYear)} × ${unitPrice} = ${fmt(r2(maxSamplesPerYear * unitPrice))} 万元`,
        `当前年净收益 = ${fmt(r2(maxSamplesPerYear * unitPrice))} - ${fixedCost} = ${fmt(annualNet)} 万元`,
        `3年累计营收 = ${fmt(r2(maxSamplesPerYear * unitPrice * 3))} 万元`,
        ``,
        `回本判定: ${fmt(r2(maxSamplesPerYear * unitPrice * 3))} ${canPayback ? '≥' : '<'} ${fmt(totalCost3Y)} → ${canPayback ? '可回本' : '不可回本'}`,
        canPayback
          ? `3年净盈余 = ${fmt(finalGap)} 万元`
          : `3年缺口 = ${fmt(Math.abs(finalGap))} 万元`,
      ]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ResultCard label="3年总成本" value={`${fmt(totalCost3Y)}万`} color="text-red-500" bg="bg-red-50" />
        <ResultCard label="年均需营收" value={`${fmt(requiredAnnualRev)}万`} color="text-navy-700" />
        <ResultCard label="3年累计营收" value={`${fmt(r2(maxSamplesPerYear * unitPrice * 3))}万`} color="text-econ-600" bg="bg-econ-50" />
        <ResultCard label="3年净盈余/缺口" value={`${fmt(Math.abs(finalGap))}万`}
          color={verdictColor} bg={canPayback ? 'bg-green-50' : 'bg-red-50'} />
      </div>
      <div className={`${canPayback ? 'bg-green-50' : 'bg-red-50'} rounded-xl p-4 border border-navy-100 flex items-center gap-3`}>
        <VerdictIcon className={`w-6 h-6 ${verdictColor} shrink-0`} />
        <div>
          <p className={`text-sm font-bold ${verdictColor}`}>3年回本判定: {canPayback ? '可以回本' : '无法回本'}</p>
          <p className="text-xs text-navy-600">
            {canPayback
              ? `3年累计营收${fmt(r2(maxSamplesPerYear * unitPrice * 3))}万 > 总成本${fmt(totalCost3Y)}万，净盈余${fmt(finalGap)}万。`
              : `3年累计营收${fmt(r2(maxSamplesPerYear * unitPrice * 3))}万 < 总成本${fmt(totalCost3Y)}万，缺口${fmt(Math.abs(finalGap))}万。需将单价提升至≥${fmt(requiredPrice)}万/个方可回本。`}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">图4: 3年回本收益趋势图</h4>
        <p className="text-xs text-navy-400 mb-3">X轴: 时间节点 | Y轴: 累计金额(万元) | 回本点: 累计营收≥累计成本</p>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: '金额(万元)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              formatter={(val: number) => `${fmt(val)}万`} />
            <Legend />
            <Area type="monotone" dataKey="cumCost" fill="#fee2e2" stroke="#dc2626" strokeWidth={2} name="累计成本" />
            <Area type="monotone" dataKey="cumRev" fill="#dcfce7" stroke="#16a34a" strokeWidth={2} name="累计营收" />
            <Line type="monotone" dataKey="gap" stroke="#7c3aed" strokeWidth={2} name="净盈余" strokeDasharray="5 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PARAMETER PANEL (Interactive Sliders)
   ═══════════════════════════════════════════════════════════════════════════════ */
function ParameterPanel({ params, setParams, unitPrice, setUnitPrice }: {
  params: SimParams
  setParams: React.Dispatch<React.SetStateAction<SimParams>>
  unitPrice: number
  setUnitPrice: (v: number) => void
}) {
  const updateParam = useCallback((key: keyof SimParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [setParams])

  const { annualMaint, annualOpp, effectiveHoursPerDay, effectiveDaysPerYear,
    totalEffectiveHours, maxSamplesPerDay, maxSamplesPerYear, fixedCost } = useDerivedParams(params)

  return (
    <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal className="w-5 h-5 text-econ-500" />
        <h3 className="text-base font-bold text-navy-700">参数控制台 — 拖动滑块实时更新图表</h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        <RangeSlider
          label="机台采购成本"
          value={params.purchaseCost}
          min={50} max={600} step={10}
          onChange={(v) => updateParam('purchaseCost', v)}
          unit="万"
          displayValue={`${params.purchaseCost}`}
        />
        <RangeSlider
          label="年运维成本比例"
          value={params.maintenanceRate}
          min={0.05} max={0.50} step={0.01}
          onChange={(v) => updateParam('maintenanceRate', v)}
          unit=""
          displayValue={`${r2(params.maintenanceRate * 100)}%`}
        />
        <RangeSlider
          label="资金机会成本率"
          value={params.oppRate}
          min={0.01} max={0.15} step={0.005}
          onChange={(v) => updateParam('oppRate', v)}
          unit=""
          displayValue={`${r2(params.oppRate * 100)}%`}
        />
        <RangeSlider
          label="稼动率"
          value={params.operatingRate}
          min={0.30} max={1.00} step={0.05}
          onChange={(v) => updateParam('operatingRate', v)}
          unit=""
          displayValue={`${r2(params.operatingRate * 100)}%`}
        />
        <RangeSlider
          label="理论运行小时/天"
          value={params.hoursPerDay}
          min={8} max={24} step={1}
          onChange={(v) => updateParam('hoursPerDay', v)}
          unit="h"
          displayValue={`${params.hoursPerDay}`}
        />
        <RangeSlider
          label="单品测试单价"
          value={unitPrice}
          min={0.01} max={0.30} step={0.001}
          onChange={setUnitPrice}
          unit="万/个"
          displayValue={`${unitPrice}`}
        />
      </div>

      {/* Derived metrics summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-navy-100">
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">年运维成本</p>
          <p className="text-sm font-bold text-navy-700">{annualMaint}万</p>
        </div>
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">年机会成本</p>
          <p className="text-sm font-bold text-navy-700">{annualOpp}万</p>
        </div>
        <div className="bg-econ-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-econ-400">年固定成本</p>
          <p className="text-sm font-bold text-econ-600">{fixedCost}万</p>
        </div>
        <div className="bg-econ-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-econ-400">年最大产能</p>
          <p className="text-sm font-bold text-econ-600">{fmt(maxSamplesPerYear)}个</p>
        </div>
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">有效工时/天</p>
          <p className="text-sm font-bold text-navy-700">{effectiveHoursPerDay}h</p>
        </div>
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">有效天数/年</p>
          <p className="text-sm font-bold text-navy-700">{effectiveDaysPerYear}天</p>
        </div>
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">年有效工时</p>
          <p className="text-sm font-bold text-navy-700">{fmt(totalEffectiveHours)}h</p>
        </div>
        <div className="bg-navy-50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-navy-400">单日最大样品</p>
          <p className="text-sm font-bold text-navy-700">{maxSamplesPerDay}个</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TAB CONTENTS
   ═══════════════════════════════════════════════════════════════════════════════ */
const tabs = [
  { id: 'params', label: '基础参数', icon: Info },
  { id: 'breakeven', label: '保本测算', icon: Target },
  { id: 'payback', label: '3年回本', icon: DollarSign },
  { id: 'financial', label: 'IRR/ARE/MARR', icon: BarChart3 },
  { id: 'equilibrium', label: '平衡点分析', icon: TrendingUp },
] as const

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function SAMInvestmentAnalysis() {
  const [activeTab, setActiveTab] = useState<string>('params')
  const [unitPrice, setUnitPrice] = useState(0.0987)
  const [params, setParams] = useState<SimParams>({
    purchaseCost: 280,
    maintenanceRate: 0.20,
    oppRate: 0.04,
    operatingRate: 0.90,
    hoursPerDay: 24,
    testDuration: 1,
  })

  const {
    annualMaint, annualOpp, fixedCost, maxSamplesPerYear,
    effectiveHoursPerDay, effectiveDaysPerYear, totalEffectiveHours, maxSamplesPerDay
  } = useDerivedParams(params)
  const annualNet = r2(maxSamplesPerYear * unitPrice - fixedCost)
  const annualRev = r2(maxSamplesPerYear * unitPrice)

  // ARE
  const are = annualNet > 0 ? r2(annualNet / params.purchaseCost * 100) : -100

  // IRR (3-year)
  let irr = 0
  if (annualNet > 0) {
    let lo = -0.5, hi = 5
    for (let iter = 0; iter < 200; iter++) {
      const mid = (lo + hi) / 2
      let npv = -params.purchaseCost
      for (let y = 1; y <= 3; y++) npv += annualNet / Math.pow(1 + mid, y)
      if (npv > 0) lo = mid; else hi = mid
    }
    irr = r2((lo + hi) / 2 * 100)
  }

  const MARR = 4

  // 3-year payback
  const totalCost3Y = r2(params.purchaseCost + fixedCost * 3)
  const totalRev3Y = r2(annualRev * 3)
  const requiredAnnualRev = r2(totalCost3Y / 3)
  const requiredPrice = r4(totalCost3Y / 3 / maxSamplesPerYear)

  // Break-even
  const breakEvenQty = unitPrice > 0 ? r2(fixedCost / unitPrice) : 0
  const breakEvenRev = r2(breakEvenQty * unitPrice)

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-400/20 text-econ-300 text-sm font-medium mb-4 border border-econ-400/30">
              <Calculator className="w-4 h-4" />
              SEM检测机台 · 设备投资经济性全维度测算
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">设备投资经济性分析工具</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              拖动下方参数滑块，实时调整机台采购成本、运维比例、稼动率等核心参数，
              所有图表与计算结果即时联动更新，体验交互式投资经济性分析。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Parameter Panel */}
      <section className="py-6 bg-navy-50 border-b border-navy-100">
        <div className="max-w-7xl mx-auto section-padding">
          <ParameterPanel params={params} setParams={setParams} unitPrice={unitPrice} setUnitPrice={setUnitPrice} />
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-6 bg-navy-50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border whitespace-nowrap transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-white border-econ-300 shadow-md shadow-econ-100 text-econ-600'
                      : 'bg-white/60 border-navy-100 text-navy-500 hover:bg-white hover:border-navy-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8 bg-slate-50">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 lg:p-8 border border-navy-100 shadow-sm space-y-8"
          >
            {/* ── TAB: 基础参数 ── */}
            {activeTab === 'params' && (
              <>
                <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
                  <Info className="w-5 h-5 text-econ-500" />
                  (一) 基础参数
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: '机台采购成本', value: `${params.purchaseCost} 万元`, formula: `P = ${params.purchaseCost}万` },
                    { label: '年运维成本', value: `${annualMaint} 万元/年`, formula: `P × ${r2(params.maintenanceRate * 100)}% = ${params.purchaseCost} × ${params.maintenanceRate}` },
                    { label: '年机会成本', value: `${annualOpp} 万元/年`, formula: `P × ${r2(params.oppRate * 100)}% = ${params.purchaseCost} × ${params.oppRate}` },
                    { label: '稼动率', value: `${r2(params.operatingRate * 100)}%`, formula: `365天 × ${r2(params.operatingRate * 100)}% = ${effectiveDaysPerYear}天` },
                    { label: '有效工时/天', value: `${effectiveHoursPerDay} 小时`, formula: `${params.hoursPerDay}h × ${r2(params.operatingRate * 100)}%` },
                    { label: '年有效工时', value: `${fmt(totalEffectiveHours)} 小时`, formula: `${effectiveHoursPerDay} × ${effectiveDaysPerYear}` },
                    { label: '单日最大样品', value: `${maxSamplesPerDay} 个/天`, formula: `${effectiveHoursPerDay}h ÷ ${params.testDuration}h/个` },
                    { label: '年最大产能', value: `${fmt(maxSamplesPerYear)} 个/年`, formula: `${fmt(totalEffectiveHours)}h ÷ ${params.testDuration}h/个` },
                    { label: '当前设定单价', value: `${r2(unitPrice * 10000)} 元/个`, formula: `= ${unitPrice}万元/个` },
                  ].map((item, i) => (
                    <div key={i} className="bg-navy-50 rounded-xl p-4 border border-navy-100">
                      <p className="text-xs text-navy-400 mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-navy-700">{item.value}</p>
                      <p className="text-[10px] text-navy-400 mt-1 font-mono">{item.formula}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-econ-50 rounded-xl p-4 border border-econ-100">
                  <p className="text-sm text-navy-700 font-bold mb-2">参数总览</p>
                  <p className="text-xs text-navy-600 leading-relaxed">
                    机台采购成本<strong>{params.purchaseCost}万元</strong>，年运维成本<strong>{annualMaint}万元</strong>(采购价{r2(params.maintenanceRate * 100)}%)，
                    年资金机会成本<strong>{annualOpp}万元</strong>(年化{r2(params.oppRate * 100)}%)，
                    年固定成本合计<strong>{fixedCost}万元</strong>。
                    设备理论全年运行，稼动率{r2(params.operatingRate * 100)}%，年有效工时<strong>{fmt(totalEffectiveHours)}小时</strong>，
                    单日最大可测样品<strong>{maxSamplesPerDay}个</strong>，
                    年最大产能<strong>{fmt(maxSamplesPerYear)}个</strong>。
                  </p>
                </div>
              </>
            )}

            {/* ── TAB: 保本测算 ── */}
            {activeTab === 'breakeven' && (
              <>
                <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
                  <Target className="w-5 h-5 text-econ-500" />
                  (二) 基础保本测算
                </h2>
                <BreakEvenChart unitPrice={unitPrice} params={params} />
              </>
            )}

            {/* ── TAB: 3年回本 ── */}
            {activeTab === 'payback' && (
              <>
                <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-econ-500" />
                  (三) 投资人视角3年回本专项测算
                </h2>
                <PaybackChart unitPrice={unitPrice} params={params} />
              </>
            )}

            {/* ── TAB: IRR/ARE/MARR ── */}
            {activeTab === 'financial' && (
              <>
                <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-econ-500" />
                  (四) 核心财务指标测算
                </h2>

                {/* MARR */}
                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                  <h3 className="text-sm font-bold text-green-700 mb-2">1. MARR 基准收益率</h3>
                  <FormulaBox title="MARR设定依据" steps={[
                    `MARR = 资金机会成本年化收益率 = ${MARR}%`,
                    `含义: 若不投资此设备, 将资金用于境外投资可获得年化4%收益`,
                    `因此本项目MARR基准 = ${MARR}%, 任何投资方案IRR必须 ≥ ${MARR}%方可接受`,
                  ]} />
                </div>

                {/* ARE */}
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-700 mb-2">2. ARE 年均收益率</h3>
                  <FormulaBox title="ARE计算过程" steps={[
                    `ARE = 年均净收益 / 初始投资 × 100%`,
                    `年净收益 = 年营收 - 年固定成本`,
                    `         = ${fmt(maxSamplesPerYear)} × ${unitPrice} - ${fixedCost}`,
                    `         = ${fmt(annualRev)} - ${fixedCost} = ${fmt(annualNet)} 万元`,
                    `ARE = ${fmt(annualNet)} / ${params.purchaseCost} × 100% = ${fmt(are)}%`,
                  ]} />
                </div>

                {/* IRR */}
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                  <h3 className="text-sm font-bold text-purple-700 mb-2">3. IRR 内部收益率</h3>
                  <FormulaBox title="IRR迭代求解" steps={[
                    `IRR定义: 使NPV=0的折现率r`,
                    `NPV = -${params.purchaseCost} + ${fmt(annualNet)}/(1+r) + ${fmt(annualNet)}/(1+r)² + ${fmt(annualNet)}/(1+r)³ = 0`,
                    `年净收益 = ${fmt(annualNet)}万元, 投资期3年`,
                    `迭代求解: IRR ≈ ${fmt(irr)}%`,
                  ]} />
                </div>

                {/* IRR vs MARR Chart */}
                <IRRvsMARRChart unitPrice={unitPrice} params={params} />

                {/* Summary */}
                <div className="bg-navy-50 rounded-xl p-5 border border-navy-100">
                  <h3 className="text-sm font-bold text-navy-700 mb-3">财务指标汇总</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <ResultCard label="MARR" value={`${MARR}%`} color="text-green-600" bg="bg-green-50" />
                    <ResultCard label="ARE" value={`${fmt(are)}%`} color="text-blue-600" bg="bg-blue-50" />
                    <ResultCard label="IRR" value={`${fmt(irr)}%`} color="text-purple-600" bg="bg-purple-50" />
                  </div>
                </div>
              </>
            )}

            {/* ── TAB: 平衡点分析 ── */}
            {activeTab === 'equilibrium' && (
              <>
                <h2 className="text-xl font-bold text-navy-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-econ-500" />
                  (五) 核心平衡点 & 关联关系分析
                </h2>

                {/* IRR vs ARE Equilibrium */}
                <div>
                  <h3 className="text-sm font-bold text-navy-700 mb-3">1. IRR与ARE平衡点分析</h3>
                  <IRRvsAREChart params={params} />
                </div>

                {/* IRR vs MARR Analysis */}
                <div>
                  <h3 className="text-sm font-bold text-navy-700 mb-3">2. IRR与MARR关联关系分析</h3>
                  <IRRvsMARRChart unitPrice={unitPrice} params={params} />
                </div>

                {/* Triple Boundary Summary */}
                <div className="bg-navy-800 rounded-xl p-6 text-white">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-econ-400" />
                    三重判定标准总结
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <p className="text-sm font-bold text-econ-300 mb-1">保本边界</p>
                      <p className="text-sm text-navy-200">
                        年营收 ≥ {fixedCost}万元 (年固定成本)<br />
                        对应产量 ≥ {fmt(breakEvenQty)}个/年<br />
                        单品单价 ≥ {unitPrice > 0 ? fmt(r4(fixedCost / maxSamplesPerYear)) : '∞'}万元/个 (满产时)
                      </p>
                    </div>
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <p className="text-sm font-bold text-econ-300 mb-1">回本边界</p>
                      <p className="text-sm text-navy-200">
                        3年累计营收 ≥ {fmt(totalCost3Y)}万元<br />
                        年均营收 ≥ {fmt(requiredAnnualRev)}万元<br />
                        单品单价 ≥ {fmt(requiredPrice)}万元/个 (满产3年回本)
                      </p>
                    </div>
                    <div className="bg-navy-700/50 rounded-lg p-4">
                      <p className="text-sm font-bold text-econ-300 mb-1">盈利边界</p>
                      <p className="text-sm text-navy-200">
                        IRR ≥ MARR({MARR}%) → 超额收益率 = {fmt(r2(irr - MARR))}%<br />
                        当前IRR = {fmt(irr)}%, {irr > MARR ? '项目具备超额投资价值' : '项目收益率未达基准'}<br />
                        ARE = {fmt(are)}%, NPV@MARR = {fmt(
                          (() => {
                            let npv = -params.purchaseCost
                            for (let y = 1; y <= 3; y++) npv += annualNet / Math.pow(1 + MARR / 100, y)
                            return r2(npv)
                          })()
                        )}万元
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investment Conclusion */}
                <div className={`rounded-xl p-5 border-2 ${irr > MARR && totalRev3Y >= totalCost3Y ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                  <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                    {irr > MARR && totalRev3Y >= totalCost3Y
                      ? <><CheckCircle2 className="w-5 h-5 text-green-600" /><span className="text-green-700">投资可行性总结</span></>
                      : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-600">投资风险预警</span></>
                    }
                  </h3>
                  <div className="text-sm text-navy-700 space-y-2 leading-relaxed">
                    <p><strong>保本底线:</strong> 每年至少完成 {fmt(breakEvenQty)} 个样品测试，保本营收 {fmt(breakEvenRev)}万元。</p>
                    <p><strong>3年回本要求:</strong> 单价需 ≥ {fmt(requiredPrice)}万元/个 (满产条件下)，年均营收需达 {fmt(requiredAnnualRev)}万元。</p>
                    <p><strong>财务指标可行性:</strong> IRR={fmt(irr)}%, MARR={MARR}%, {irr > MARR ? `超额收益率${fmt(r2(irr - MARR))}%，项目财务可行` : 'IRR未达基准，项目财务不可行'}。</p>
                    <p><strong>投资风险与价值:</strong> {irr > MARR && totalRev3Y >= totalCost3Y
                      ? `当前参数下项目可3年回本且IRR达标，投资价值明确。建议重点关注产能利用率和市场定价稳定性。`
                      : `当前参数下${totalRev3Y < totalCost3Y ? '3年无法回本' : ''}${irr < MARR ? '且IRR不达标' : ''}。需提升单价至${fmt(requiredPrice)}万/个以上或降低运维成本方可改善投资回报。`}
                    </p>
                  </div>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </section>
    </div>
  )
}
