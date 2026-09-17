import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, DollarSign, Clock, BarChart3, PieChart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

/* ─── Helpers ─── */
const round2 = (n: number) => Math.round(n * 100) / 100
const num = (v: number | '') => v === '' ? '' : v
const toNum = (e: React.ChangeEvent<HTMLInputElement>) => e.target.value === '' ? '' : Number(e.target.value)
const safeNum = (v: number | '') => Number(v) || 0

/* ═══════════════════════════════════════════════════════════════
   TAB 1: Loan Comparison (四种还款方案)
   ═══════════════════════════════════════════════════════════════ */
function LoanComparator() {
  const [P, setP] = useState<number | ''>(500)
  const [rate, setRate] = useState<number | ''>(8)
  const [years, setYears] = useState<number | ''>(5)

  const p = safeNum(P)
  const i = safeNum(rate) / 100
  const n = safeNum(years) || 0

  const data = useMemo(() => {
    if (n <= 0) return { summary: [], chartData: [] }

    // Plan 1: Constant Principal (等额本金)
    const principalPerYear = p / n
    let balance1 = p, totalInterest1 = 0, totalPayment1 = 0
    const plan1 = []
    for (let y = 1; y <= n; y++) {
      const interest = balance1 * i
      const payment = principalPerYear + interest
      totalInterest1 += interest
      totalPayment1 += payment
      plan1.push({ year: y, payment: round2(payment), interest: round2(interest), principal: round2(principalPerYear), balance: round2(balance1) })
      balance1 -= principalPerYear
    }

    // Plan 2: Interest Only (只付利息)
    let totalInterest2 = 0, totalPayment2 = 0
    const plan2 = []
    for (let y = 1; y <= n; y++) {
      const interest = p * i
      const payment = y === n ? p + interest : interest
      totalInterest2 += interest
      totalPayment2 += payment
      plan2.push({ year: y, payment: round2(payment), interest: round2(interest), principal: y === n ? p : 0, balance: y === n ? 0 : p })
    }

    // Plan 3: Constant Payment (等额还款)
    const A = (n > 0 && i > 0) ? p * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : 0
    let balance3 = p, totalInterest3 = 0, totalPayment3 = 0
    const plan3 = []
    for (let y = 1; y <= n; y++) {
      const interest = balance3 * i
      const principal = A - interest
      totalInterest3 += interest
      totalPayment3 += A
      plan3.push({ year: y, payment: round2(A), interest: round2(interest), principal: round2(principal), balance: round2(balance3) })
      balance3 -= principal
    }

    // Plan 4: All at Maturity (到期一次)
    const F = p * Math.pow(1 + i, n)
    const totalInterest4 = F - p

    const chartData = []
    for (let y = 1; y <= n; y++) {
      chartData.push({
        year: `第${y}年`,
        等额本金: plan1[y - 1].payment,
        只付利息: plan2[y - 1].payment,
        等额还款: plan3[y - 1].payment,
        到期一次: y === n ? round2(F) : 0,
      })
    }

    return {
      summary: [
        { name: '等额本金', totalInterest: round2(totalInterest1), totalPayment: round2(totalPayment1), color: '#1e6091' },
        { name: '只付利息', totalInterest: round2(totalInterest2), totalPayment: round2(totalPayment2), color: '#4a9fc5' },
        { name: '等额还款', totalInterest: round2(totalInterest3), totalPayment: round2(totalPayment3), color: '#e66c2c' },
        { name: '到期一次', totalInterest: round2(totalInterest4), totalPayment: round2(F), color: '#1b3a5f' },
      ],
      chartData,
    }
  }, [p, i, n])

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">设备价格 P (万元)</label>
          <input type="number" value={num(P)} onChange={(e) => setP(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">年利率 i (%)</label>
          <input type="number" value={num(rate)} onChange={(e) => setRate(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">期限 n (年)</label>
          <input type="number" value={num(years)} onChange={(e) => setYears(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.summary.map((plan) => (
          <div key={plan.name} className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
              <span className="text-sm font-bold text-navy-700">{plan.name}</span>
            </div>
            <p className="text-xs text-navy-400 mb-1">总利息</p>
            <p className="text-lg font-bold text-econ-500">¥{plan.totalInterest.toLocaleString()}万</p>
            <p className="text-xs text-navy-400 mt-2">总还款 ¥{plan.totalPayment.toLocaleString()}万</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">年度还款额对比 (万元)</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Legend />
            <Bar dataKey="等额本金" fill="#1e6091" radius={[2, 2, 0, 0]} />
            <Bar dataKey="只付利息" fill="#4a9fc5" radius={[2, 2, 0, 0]} />
            <Bar dataKey="等额还款" fill="#e66c2c" radius={[2, 2, 0, 0]} />
            <Bar dataKey="到期一次" fill="#1b3a5f" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB 2: Investment Calculator (NPV / IRR / Payback)
   ═══════════════════════════════════════════════════════════════ */
function InvestmentCalculator() {
  const [cost, setCost] = useState<number | ''>(120)
  const [annualRevenue, setAnnualRevenue] = useState<number | ''>(25)
  const [annualCost, setAnnualCost] = useState<number | ''>(8)
  const [rate, setRate] = useState<number | ''>(8)
  const [life, setLife] = useState<number | ''>(10)

  const c = safeNum(cost)
  const ar = safeNum(annualRevenue)
  const ac = safeNum(annualCost)
  const i = safeNum(rate) / 100
  const n = safeNum(life) || 0

  const result = useMemo(() => {
    if (n <= 0 || i <= 0) return { npv: 0, simplePayback: 0, discPayback: 0, annualWorth: 0, chartData: [] }

    const netAnnual = ar - ac
    // NPV
    let npv = -c
    for (let y = 1; y <= n; y++) {
      npv += netAnnual / Math.pow(1 + i, y)
    }

    // Simple payback
    const simplePayback = netAnnual > 0 ? c / netAnnual : 0

    // Discounted payback
    let cum = -c
    let discPayback = n
    for (let y = 1; y <= n; y++) {
      cum += netAnnual / Math.pow(1 + i, y)
      if (cum >= 0 && discPayback === n) {
        const prevCum = cum - netAnnual / Math.pow(1 + i, y)
        discPayback = y - 1 + Math.abs(prevCum) / (netAnnual / Math.pow(1 + i, y))
        break
      }
    }

    // Annual Worth (A/P)
    const apFactor = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
    const annualWorth = npv * apFactor

    // Chart data
    const chartData = []
    let cumulative = -c
    for (let y = 0; y <= n; y++) {
      if (y > 0) cumulative += netAnnual / Math.pow(1 + i, y)
      chartData.push({ year: `第${y}年`, cumulative: round2(cumulative) })
    }

    return { npv: round2(npv), simplePayback: round2(simplePayback), discPayback: round2(discPayback), annualWorth: round2(annualWorth), chartData }
  }, [c, ar, ac, i, n])

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">设备成本 (万元)</label>
          <input type="number" value={num(cost)} onChange={(e) => setCost(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">年收益 (万元)</label>
          <input type="number" value={num(annualRevenue)} onChange={(e) => setAnnualRevenue(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">年运维成本 (万元)</label>
          <input type="number" value={num(annualCost)} onChange={(e) => setAnnualCost(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">折现率 (%)</label>
          <input type="number" value={num(rate)} onChange={(e) => setRate(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">使用寿命 (年)</label>
          <input type="number" value={num(life)} onChange={(e) => setLife(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'NPV 净现值', value: `¥${result.npv}万`, color: result.npv >= 0 ? 'text-green-600' : 'text-red-500', bg: result.npv >= 0 ? 'bg-green-50' : 'bg-red-50' },
          { label: '静态回收期', value: `${result.simplePayback}年`, color: 'text-navy-700', bg: 'bg-navy-50' },
          { label: '动态回收期', value: `${result.discPayback}年`, color: 'text-navy-700', bg: 'bg-navy-50' },
          { label: '年度等值 AW', value: `¥${result.annualWorth}万`, color: 'text-econ-600', bg: 'bg-econ-50' },
        ].map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl p-4 border border-navy-100`}>
            <p className="text-xs text-navy-400 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* NPV Chart */}
      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">累计净现值曲线 (万元)</h4>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={result.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Line type="monotone" dataKey="cumulative" stroke="#e66c2c" strokeWidth={2} dot={{ r: 3 }} name="累计NPV" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB 3: Compound Interest Visualizer
   ═══════════════════════════════════════════════════════════════ */
function CompoundVisualizer() {
  const [P, setP] = useState<number | ''>(1000)
  const [rate, setRate] = useState<number | ''>(8)
  const [years, setYears] = useState<number | ''>(20)

  const p = safeNum(P)
  const i = safeNum(rate) / 100
  const n = safeNum(years) || 0

  const data = useMemo(() => {
    if (n <= 0) return { chartData: [], doublingTime: 0 }

    const chartData = []
    for (let y = 0; y <= n; y++) {
      const simple = p * (1 + i * y)
      const compound = p * Math.pow(1 + i, y)
      chartData.push({
        year: `第${y}年`,
        单利: round2(simple),
        复利: round2(compound),
      })
    }
    const doublingTime = i > 0 ? Math.log(2) / Math.log(1 + i) : 0
    return { chartData, doublingTime: round2(doublingTime) }
  }, [p, i, n])

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">本金 P (元)</label>
          <input type="number" value={num(P)} onChange={(e) => setP(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">年利率 i (%)</label>
          <input type="number" value={num(rate)} onChange={(e) => setRate(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy-600 mb-1">期限 n (年)</label>
          <input type="number" value={num(years)} onChange={(e) => setYears(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" />
        </div>
      </div>

      <div className="bg-econ-50 rounded-xl p-4 border border-econ-100 flex items-center gap-4">
        <Clock className="w-8 h-8 text-econ-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-navy-700">72法则估算</p>
          <p className="text-sm text-navy-600">在 {rate || 0}% 利率下，资金大约需要 <span className="text-econ-600 font-bold">{data.doublingTime} 年</span> 翻倍（72÷{rate || 0}≈{round2(72 / (Number(rate) || 1))}年）</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm">
        <h4 className="text-sm font-bold text-navy-700 mb-4">单利 vs 复利增长对比</h4>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} interval={2} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
            <Legend />
            <Line type="monotone" dataKey="单利" stroke="#4a9fc5" strokeWidth={2} dot={false} name="单利 F=P(1+in)" />
            <Line type="monotone" dataKey="复利" stroke="#e66c2c" strokeWidth={2} dot={false} name="复利 F=P(1+i)^n" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TAB 4: Life Cycle Cost
   ═══════════════════════════════════════════════════════════════ */
function LifeCycleCost() {
  const [purchase, setPurchase] = useState<number | ''>(120)
  const [install, setInstall] = useState<number | ''>(5)
  const [annualOps, setAnnualOps] = useState<number | ''>(8)
  const [annualMaint, setAnnualMaint] = useState<number | ''>(3)
  const [salvage, setSalvage] = useState<number | ''>(10)
  const [rate, setRate] = useState<number | ''>(8)
  const [life, setLife] = useState<number | ''>(10)

  const pv = safeNum(purchase)
  const iv = safeNum(install)
  const ao = safeNum(annualOps)
  const am = safeNum(annualMaint)
  const sv = safeNum(salvage)
  const i = safeNum(rate) / 100
  const n = safeNum(life) || 0

  const result = useMemo(() => {
    if (n <= 0 || i <= 0) return { totalPV: 0, annualWorth: 0, purchasePct: 0, opsPct: 0, salvagePct: 0 }

    const paFactor = (1 - Math.pow(1 + i, -n)) / i
    const totalPV = pv + iv + (ao + am) * paFactor - sv / Math.pow(1 + i, n)
    const apFactor = (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
    const annualWorth = totalPV * apFactor

    return {
      totalPV: round2(totalPV),
      annualWorth: round2(annualWorth),
      purchasePct: round2((pv / totalPV) * 100),
      opsPct: round2(((ao + am) * paFactor) / totalPV * 100),
      salvagePct: round2((sv / Math.pow(1 + i, n) / totalPV) * 100),
    }
  }, [pv, iv, ao, am, sv, i, n])

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div><label className="block text-sm font-medium text-navy-600 mb-1">购置费 (万)</label><input type="number" value={num(purchase)} onChange={(e) => setPurchase(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">安装费 (万)</label><input type="number" value={num(install)} onChange={(e) => setInstall(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">年运维 (万)</label><input type="number" value={num(annualOps)} onChange={(e) => setAnnualOps(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">年维护 (万)</label><input type="number" value={num(annualMaint)} onChange={(e) => setAnnualMaint(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">残值 (万)</label><input type="number" value={num(salvage)} onChange={(e) => setSalvage(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">折现率 (%)</label><input type="number" value={num(rate)} onChange={(e) => setRate(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
        <div><label className="block text-sm font-medium text-navy-600 mb-1">寿命 (年)</label><input type="number" value={num(life)} onChange={(e) => setLife(toNum(e))} className="w-full px-3 py-2 rounded-lg border border-navy-200 focus:border-econ-400 focus:ring-1 focus:ring-econ-400 outline-none" /></div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm">
          <p className="text-sm text-navy-400 mb-1">总成本现值 (LCC)</p>
          <p className="text-3xl font-bold text-navy-700">¥{result.totalPV}万</p>
        </div>
        <div className="bg-econ-50 rounded-xl p-5 border border-econ-100 shadow-sm">
          <p className="text-sm text-econ-400 mb-1">年度等值成本 (A/P系数)</p>
          <p className="text-3xl font-bold text-econ-600">¥{result.annualWorth}万/年</p>
        </div>
      </div>

      {/* Cost breakdown bars */}
      <div className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-navy-700 mb-2">成本结构占比</h4>
        <div>
          <div className="flex justify-between text-xs text-navy-500 mb-1"><span>购置费</span><span>{result.purchasePct}%</span></div>
          <div className="h-3 bg-navy-100 rounded-full overflow-hidden"><div className="h-full bg-navy-500 rounded-full" style={{ width: `${Math.min(result.purchasePct, 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-navy-500 mb-1"><span>运维+维护 (现值)</span><span>{result.opsPct}%</span></div>
          <div className="h-3 bg-navy-100 rounded-full overflow-hidden"><div className="h-full bg-navy-400 rounded-full" style={{ width: `${Math.min(result.opsPct, 100)}%` }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-navy-500 mb-1"><span>残值抵扣</span><span>{result.salvagePct}%</span></div>
          <div className="h-3 bg-navy-100 rounded-full overflow-hidden"><div className="h-full bg-econ-400 rounded-full" style={{ width: `${Math.min(result.salvagePct, 100)}%` }} /></div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
const tools = [
  { id: 'loan', label: '贷款方案比较器', icon: BarChart3, component: LoanComparator, desc: '四种还款方案可视化对比' },
  { id: 'invest', label: '设备投资计算器', icon: TrendingUp, component: InvestmentCalculator, desc: 'NPV/IRR/回收期自动计算' },
  { id: 'compound', label: '复利单利可视化', icon: DollarSign, component: CompoundVisualizer, desc: '交互式增长曲线与72法则' },
  { id: 'lcc', label: '全生命周期成本', icon: PieChart, component: LifeCycleCost, desc: '购置+运维年度等值分析' },
]

export default function EconTools() {
  const [activeTab, setActiveTab] = useState('loan')
  const activeTool = tools.find((t) => t.id === activeTab)!
  const ActiveComponent = activeTool.component

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-400/20 text-econ-300 text-sm font-medium mb-4 border border-econ-400/30">
              <Calculator className="w-4 h-4" />
              F/P · P/F · F/A · A/F · P/A · A/P 六大系数实战
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">工程经济学工具</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              将课程知识转化为可交互的计算工具。输入实验室设备的真实参数，即刻获得贷款方案比较、投资回收期、
              复利增长曲线、全生命周期成本等专业分析结果。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Textbook Reference — moved up between hero and tools */}
      <section className="py-8 bg-slate-100">
        <div className="max-w-5xl mx-auto section-padding">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h2 className="text-lg font-bold text-navy-700">课程教材</h2>
                  <p className="text-xs text-navy-400">Engineering Economic Analysis, 11th Edition · Oxford University Press</p>
                </div>
              </div>
              <a
                href="/textbook/engineering-economics-11th.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-lg bg-econ-400 hover:bg-econ-300 text-white font-bold text-sm transition-colors text-center"
              >
                在线阅读
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { ch: 'Ch.3', title: 'Interest and Equivalence', desc: '利息与等值' },
                { ch: 'Ch.4', title: 'Repeated Cash Flows', desc: '等额序列' },
                { ch: 'Ch.5', title: 'Present Worth', desc: '现值分析' },
                { ch: 'Ch.6', title: 'Annual Worth', desc: '年值分析' },
                { ch: 'Ch.7', title: 'Rate of Return', desc: '收益率分析' },
                { ch: 'Ch.9', title: 'Other Techniques', desc: '其他方法' },
              ].map((item, i) => (
                <div key={i} className="bg-navy-50 rounded-lg p-3 border border-navy-100">
                  <p className="text-[10px] text-econ-500 font-bold">{item.ch}</p>
                  <p className="text-[11px] font-semibold text-navy-700 leading-tight">{item.title}</p>
                  <p className="text-[10px] text-navy-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool Tabs */}
      <section className="py-8 bg-navy-50">
        <div className="max-w-5xl mx-auto section-padding">
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {tools.map((tool) => {
              const Icon = tool.icon
              const isActive = activeTab === tool.id
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-white border-econ-300 shadow-md shadow-econ-200'
                      : 'bg-white/60 border-navy-100 hover:bg-white hover:border-navy-200'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-econ-500' : 'text-navy-400'}`} />
                  <div className="text-center">
                    <p className={`text-sm font-semibold ${isActive ? 'text-navy-700' : 'text-navy-500'}`}>{tool.label}</p>
                    <p className="text-xs text-navy-400 mt-0.5">{tool.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Tool */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 lg:p-8 border border-navy-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-navy-100">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-econ-400 to-econ-300 flex items-center justify-center">
                <activeTool.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-700">{activeTool.label}</h2>
                <p className="text-sm text-navy-400">{activeTool.desc}</p>
              </div>
            </div>
            <ActiveComponent />
          </motion.div>
        </div>
      </section>

      {/* Formula Reference */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto section-padding">
          <h2 className="text-2xl font-bold text-navy-700 mb-6 text-center">核心公式速查</h2>

          {/* Variable Legend */}
          <div className="bg-navy-700 rounded-xl p-5 mb-6 text-white">
            <p className="text-xs font-bold text-econ-300 mb-3 uppercase tracking-wider">Variable Legend / 变量说明</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
              {[
                { sym: 'P', en: 'Present sum', cn: '现值（现在的钱）' },
                { sym: 'F', en: 'Future sum', cn: '终值（未来的钱）' },
                { sym: 'A', en: 'Annuity', cn: '年金（每期等额收付）' },
                { sym: 'i', en: 'Interest rate', cn: '利率（每期有效利率）' },
                { sym: 'n', en: 'Periods', cn: '期数（计息期数）' },
              ].map(v => (
                <div key={v.sym} className="bg-navy-600 rounded-lg px-3 py-2">
                  <span className="text-lg font-bold text-econ-300 font-mono">{v.sym}</span>
                  <p className="text-[10px] text-navy-300">{v.en}</p>
                  <p className="text-[11px] text-white">{v.cn}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '复利终值', en: 'Compound Amount', formula: 'F = P(1+i)ⁿ', factor: '(F/P,i,n)', desc: '已知现值 P，求 n 期后终值 F' },
              { name: '现值系数', en: 'Present Worth', formula: 'P = F(1+i)⁻ⁿ', factor: '(P/F,i,n)', desc: '已知终值 F，求现在等值 P' },
              { name: '年金终值', en: 'Uniform Series Compound Amount', formula: 'F = A[(1+i)ⁿ−1]/i', factor: '(F/A,i,n)', desc: '已知等额年金 A，求 n 期末终值 F' },
              { name: '偿债基金', en: 'Sinking Fund', formula: 'A = F·i/[(1+i)ⁿ−1]', factor: '(A/F,i,n)', desc: '已知终值 F，求等额存入年金 A' },
              { name: '年金现值', en: 'Uniform Series Present Worth', formula: 'P = A[(1+i)ⁿ−1]/[i(1+i)ⁿ]', factor: '(P/A,i,n)', desc: '已知等额年金 A，求现值 P' },
              { name: '资本回收', en: 'Capital Recovery', formula: 'A = P·i(1+i)ⁿ/[(1+i)ⁿ−1]', factor: '(A/P,i,n)', desc: '已知现值 P，求等额年金 A（还款）' },
            ].map((item, idx) => (
              <div key={idx} className="bg-navy-50 rounded-xl p-4 border border-navy-100 hover:border-econ-300 transition-colors">
                <p className="text-xs text-econ-500 font-semibold mb-1">{item.factor}</p>
                <p className="text-sm font-bold text-navy-700">{item.name}</p>
                <p className="text-xs text-navy-400 mb-1 italic">{item.en}</p>
                <p className="text-sm text-navy-500 font-mono mb-2">{item.formula}</p>
                <p className="text-[11px] text-navy-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Checklist Table */}
          <FormulaChecklist />
        </div>
      </section>

    </div>
  )
}

/* ─── Formula Checklist Component ─── */
function FormulaChecklist() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-8 border border-navy-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-navy-700 text-white hover:bg-navy-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">📋 工程经济学公式自查表</span>
          <span className="text-xs bg-econ-400 text-white px-2 py-0.5 rounded-full">课本变量说明 + 6大公式</span>
        </div>
        <span className="text-xl">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="bg-white p-6 space-y-8">
          {/* Variable definitions */}
          <div>
            <h3 className="text-sm font-bold text-navy-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-econ-400 text-white text-[10px] flex items-center justify-center font-bold">变</span>
              标准变量符号说明（来源：Engineering Economic Analysis 11th）
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy-50">
                    <th className="border border-navy-200 px-3 py-2 text-left text-navy-700 font-semibold w-12">符号</th>
                    <th className="border border-navy-200 px-3 py-2 text-left text-navy-700 font-semibold">含义</th>
                    <th className="border border-navy-200 px-3 py-2 text-left text-navy-700 font-semibold w-20">单位</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { sym: 'i', def: '每期有效利率（effective interest rate per interest period）', unit: '小数' },
                    { sym: 'n', def: '计息期数（number of interest periods）', unit: '期' },
                    { sym: 'P', def: '现在某时刻的一笔资金（present sum of money）', unit: '元' },
                    { sym: 'F', def: '第n期末的未来一笔资金，与P在利率i下等值（future sum）', unit: '元' },
                    { sym: 'A', def: '每期期末的等额收付款（uniform end-of-period cash receipt or disbursement in a uniform series continuing for n periods）', unit: '元/期' },
                    { sym: 'G', def: '每期均匀递增/递减的现金流量（uniform period-by-period increase or decrease）；算术梯度（arithmetic gradient）', unit: '元/期' },
                    { sym: 'g', def: '现金流量每期的均匀增长率（uniform rate of cash flow increase/decrease from period to period）；几何梯度（geometric gradient）', unit: '%' },
                    { sym: 'r', def: '名义利率（nominal interest rate per interest period）', unit: '%' },
                    { sym: 'iₐ', def: '有效年利率（effective annual interest rate）', unit: '%' },
                    { sym: 'm', def: '每期复利子期数（number of compounding subperiods per period）', unit: '次' },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-navy-50/50'}>
                      <td className="border border-navy-200 px-3 py-2 font-mono font-bold text-econ-600">{row.sym}</td>
                      <td className="border border-navy-200 px-3 py-2 text-navy-600">{row.def}</td>
                      <td className="border border-navy-200 px-3 py-2 text-navy-400 text-center">{row.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formulas */}
          <div>
            <h3 className="text-sm font-bold text-navy-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-navy-600 text-white text-[10px] flex items-center justify-center font-bold">式</span>
              六大标准公式（Single Payment + Uniform Series）
            </h3>
            <div className="space-y-3">
              {[
                {
                  group: 'Single Payment Formulas（单一支付）',
                  color: 'bg-blue-50 border-blue-200',
                  items: [
                    { name: '复利终值（Compound Amount）', factor: 'F/P,i,n', formula: 'F = P(1+i)ⁿ', check: '已知P求F：把P放n期后值多少' },
                    { name: '现值系数（Present Worth）', factor: 'P/F,i,n', formula: 'P = F(1+i)⁻ⁿ', check: '已知F求P：n期后的F折算到现在值多少' },
                  ]
                },
                {
                  group: 'Uniform Series Formulas（等额序列）',
                  color: 'bg-green-50 border-green-200',
                  items: [
                    { name: '年金终值（Compound Amount）', factor: 'F/A,i,n', formula: 'F = A[(1+i)ⁿ−1]/i', check: '已知年金A求终值F：每期存A，n期后总共多少' },
                    { name: '偿债基金（Sinking Fund）', factor: 'A/F,i,n', formula: 'A = F·i/[(1+i)ⁿ−1]', check: '已知终值F求年金A：n期后要有F，每期存多少' },
                    { name: '资本回收（Capital Recovery）', factor: 'A/P,i,n', formula: 'A = P·i(1+i)ⁿ/[(1+i)ⁿ−1]', check: '已知现值P求年金A：借了P，每期还多少（等额还款）' },
                    { name: '年金现值（Present Worth）', factor: 'P/A,i,n', formula: 'P = A[(1+i)ⁿ−1]/[i(1+i)ⁿ]', check: '已知年金A求现值P：每期收A，折现到现在值多少' },
                  ]
                },
              ].map((grp, gi) => (
                <div key={gi} className={`rounded-xl border p-4 ${grp.color}`}>
                  <p className="text-xs font-bold text-navy-600 mb-3">{grp.group}</p>
                  <div className="space-y-2">
                    {grp.items.map((item, ii) => (
                      <div key={ii} className="bg-white rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border border-white/80 shadow-sm">
                        <span className="text-[10px] text-econ-500 font-bold font-mono w-24 shrink-0">({item.factor})</span>
                        <span className="text-sm font-semibold text-navy-700 flex-1">{item.name}</span>
                        <span className="text-sm font-mono text-navy-600 w-52 shrink-0">{item.formula}</span>
                        <span className="text-[11px] text-navy-400 flex-1">✔ {item.check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nominal vs Effective */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2">⚡ 名义利率 vs 有效利率</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <p className="font-mono font-bold text-navy-700">iₐ = (1 + r/m)ᵐ − 1</p>
                <p className="text-[11px] text-navy-400 mt-1">名义年利率r，每年复利m次 → 有效年利率iₐ</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100">
                <p className="font-mono font-bold text-navy-700">i = (1 + r/m)^(m/k) − 1</p>
                <p className="text-[11px] text-navy-400 mt-1">k次计算期内的有效利率（如季度/月度）</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

