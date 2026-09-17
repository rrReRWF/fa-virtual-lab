import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Building2, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, FlaskConical, Wrench, Layers } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPE HELPERS
   ═══════════════════════════════════════════════════════════════════════════════ */

interface QuarterData {
  period: string
  revenue: string
  grossProfit: string
  netProfit: string
  operatingCashFlow: string
  freeCashFlow?: string
  grossMargin: string
  netMargin: string
  eps: string
  revenueGrowth: string
  netProfitGrowth: string
}

interface CashFlowItem {
  item: string
  q2026q1: string
  q2025q4: string
  q2025q3: string
  q2025q2: string
  q2025q1: string
  q2024q4: string
}

/* ═══════════════════════════════════════════════════════════════════════════════
   BRUKER DATA (力学与热学分析设备)
   ═══════════════════════════════════════════════════════════════════════════════ */

const brukerOverview = {
  name: 'Bruker Corporation',
  ticker: 'BRKR',
  exchange: 'NASDAQ',
  hq: 'Billerica, MA, USA',
  fiscalYear2025Revenue: '$34.4亿',
  description: '全球领先的科学仪器与分析诊断设备制造商，产品覆盖X射线衍射(XRD)、荧光光谱(XRF)、纳米压痕、热分析等领域。Bruker D8 Advance XRD和S8 Tiger XRF为本虚拟实验室核心模拟设备。',
  equipment: [
    { name: 'Bruker D8 Advance', type: 'XRD衍射仪', category: '成分与相分析' },
    { name: 'Bruker S8 Tiger', type: 'XRF荧光光谱仪', category: '成分与相分析' },
    { name: 'Hysitron TI 950', type: '纳米压痕仪', category: '力学与热学分析' },
  ],
}

const brukerQuarterlyData: QuarterData[] = [
  { period: '2026 Q1', revenue: '8.234亿', grossProfit: '3.798亿', netProfit: '1,440万', operatingCashFlow: '7,120万', freeCashFlow: '4,700万', grossMargin: '46.13%', netMargin: '1.91%', eps: '$0.02', revenueGrowth: '+2.75%', netProfitGrowth: '-17.24%' },
  { period: '2025 Q4', revenue: '9.772亿', grossProfit: '4.492亿', netProfit: '2,600万', operatingCashFlow: '2.298亿', freeCashFlow: '1.743亿', grossMargin: '45.97%', netMargin: '2.99%', eps: '$0.10', revenueGrowth: '-0.24%', netProfitGrowth: '+89.78%' },
  { period: '2025 Q3', revenue: '8.605亿', grossProfit: '3.794亿', netProfit: '-5,960万', operatingCashFlow: '-3,320万', freeCashFlow: '-5,700万', grossMargin: '44.09%', netMargin: '-6.80%', eps: '-$0.41', revenueGrowth: '-0.45%', netProfitGrowth: '-245.72%' },
  { period: '2025 Q2', revenue: '7.974亿', grossProfit: '3.579亿', netProfit: '760万', operatingCashFlow: '-1.275亿', freeCashFlow: '-1.486亿', grossMargin: '44.88%', netMargin: '0.53%', eps: '$0.05', revenueGrowth: '-0.41%', netProfitGrowth: '0%' },
  { period: '2025 Q1', revenue: '8.014亿', grossProfit: '3.912亿', netProfit: '1,740万', operatingCashFlow: '6,500万', freeCashFlow: '3,890万', grossMargin: '48.81%', netMargin: '2.10%', eps: '$0.11', revenueGrowth: '+11.04%', netProfitGrowth: '-65.82%' },
  { period: '2024 Q4', revenue: '9.796亿', grossProfit: '4.933亿', netProfit: '1,370万', operatingCashFlow: '1.900亿', freeCashFlow: '1.534亿', grossMargin: '50.36%', netMargin: '1.42%', eps: '$0.09', revenueGrowth: '+14.64%', netProfitGrowth: '-93.33%' },
]

const brukerCashFlowData: CashFlowItem[] = [
  { item: '净利润', q2026q1: '1,570万', q2025q4: '2,920万', q2025q3: '-5,850万', q2025q2: '420万', q2025q1: '1,680万', q2024q4: '1,390万' },
  { item: '折旧及摊销', q2026q1: '5,830万', q2025q4: '5,810万', q2025q3: '5,570万', q2025q2: '5,610万', q2025q1: '5,040万', q2024q4: '5,290万' },
  { item: '存货变动', q2026q1: '-4,720万', q2025q4: '--', q2025q3: '--', q2025q2: '--', q2025q1: '-2,840万', q2024q4: '--' },
  { item: '应付账款变动', q2026q1: '1,120万', q2025q4: '690万', q2025q3: '-5,690万', q2025q2: '--', q2025q1: '2,640万', q2024q4: '8,320万' },
  { item: '经营现金流净额', q2026q1: '7,120万', q2025q4: '2.298亿', q2025q3: '-3,320万', q2025q2: '-1.275亿', q2025q1: '6,500万', q2024q4: '1.900亿' },
  { item: '购买固定资产', q2026q1: '-2,420万', q2025q4: '-2,260万', q2025q3: '-2,090万', q2025q2: '-2,130万', q2025q1: '-2,600万', q2024q4: '-3,670万' },
  { item: '收购附属公司', q2026q1: '-1,600万', q2025q4: '-420万', q2025q3: '-20万', q2025q2: '-6,840万', q2025q1: '-110万', q2024q4: '-2,290万' },
  { item: '投资现金流净额', q2026q1: '-3,970万', q2025q4: '-5,550万', q2025q3: '-2,380万', q2025q2: '-9,110万', q2025q1: '-2,610万', q2024q4: '-6,060万' },
]

const brukeyKeyRatios = [
  { label: 'ROE (净资产收益率)', values: ['0.59%', '1.06%', '-2.81%', '0.42%', '0.97%', '0.76%'] },
  { label: 'ROA (总资产净利率)', values: ['0.23%', '0.41%', '-0.93%', '0.12%', '0.30%', '0.23%'] },
  { label: '流动比率', values: ['1.55', '1.73', '1.85', '1.61', '1.57', '1.60'] },
  { label: '速动比率', values: ['0.72', '0.87', '0.91', '0.70', '0.74', '0.77'] },
  { label: '资产负债率', values: ['59.18%', '59.78%', '61.27%', '70.55%', '68.80%', '68.74%'] },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   METTLER TOLEDO DATA (力学与热学分析设备)
   ═══════════════════════════════════════════════════════════════════════════════ */

const mettlerOverview = {
  name: 'Mettler Toledo',
  ticker: 'MDT',
  exchange: 'NYSE',
  hq: 'Greifensee, Switzerland',
  description: '全球精密仪器领导企业，专注于天平、热分析(DSC/TGA)、水分测定等领域。Mettler DSC3差示扫描量热仪为本虚拟实验室热分析核心设备。',
  equipment: [
    { name: 'Mettler DSC3', type: '差示扫描量热仪', category: '力学与热学分析' },
  ],
}

const mettlerQuarterlyData: QuarterData[] = [
  { period: '2026 Q1', revenue: '9.471亿', grossProfit: '5.558亿', netProfit: '1.695亿', operatingCashFlow: '1.398亿', freeCashFlow: '1.224亿', grossMargin: '58.68%', netMargin: '17.89%', eps: '$8.35', revenueGrowth: '+7.17%', netProfitGrowth: '+3.59%' },
  { period: '2025 Q4', revenue: '11.30亿', grossProfit: '6.754亿', netProfit: '2.858亿', operatingCashFlow: '9.558亿', freeCashFlow: '7.619亿', grossMargin: '59.79%', netMargin: '25.29%', eps: '$14.02', revenueGrowth: '+8.10%', netProfitGrowth: '+13.26%' },
  { period: '2025 Q3', revenue: '10.30亿', grossProfit: '6.095亿', netProfit: '2.175亿', operatingCashFlow: '7.302亿', freeCashFlow: '5.767亿', grossMargin: '59.19%', netMargin: '21.12%', eps: '$10.60', revenueGrowth: '+7.87%', netProfitGrowth: '+2.83%' },
  { period: '2025 Q2', revenue: '9.832亿', grossProfit: '5.799亿', netProfit: '2.023亿', operatingCashFlow: '4.308亿', freeCashFlow: '3.762亿', grossMargin: '58.98%', netMargin: '20.58%', eps: '$9.78', revenueGrowth: '+3.85%', netProfitGrowth: '-8.78%' },
  { period: '2025 Q1', revenue: '8.837亿', grossProfit: '5.259亿', netProfit: '1.636亿', operatingCashFlow: '1.944亿', freeCashFlow: '1.874亿', grossMargin: '59.51%', netMargin: '18.51%', eps: '$7.84', revenueGrowth: '-4.56%', netProfitGrowth: '-7.84%' },
  { period: '2024 Q4', revenue: '10.45亿', grossProfit: '6.393亿', netProfit: '2.523亿', operatingCashFlow: '9.683亿', freeCashFlow: '8.648亿', grossMargin: '61.17%', netMargin: '24.14%', eps: '$12.00', revenueGrowth: '+11.78%', netProfitGrowth: '+36.53%' },
]

const mettlerCashFlowData: CashFlowItem[] = [
  { item: '净利润', q2026q1: '1.695亿', q2025q4: '8.692亿', q2025q3: '5.834亿', q2025q2: '3.659亿', q2025q1: '1.636亿', q2024q4: '8.631亿' },
  { item: '折旧及摊销', q2026q1: '3,277万', q2025q4: '1.256亿', q2025q3: '9,285万', q2025q2: '6,011万', q2025q1: '2,966万', q2024q4: '1.232亿' },
  { item: '存货变动', q2026q1: '-1,989万', q2025q4: '-765万', q2025q3: '-2,743万', q2025q2: '-1,806万', q2025q1: '-992万', q2024q4: '2,413万' },
  { item: '应付账款变动', q2026q1: '-3,809万', q2025q4: '3,376万', q2025q3: '1,858万', q2025q2: '-868万', q2025q1: '-1,611万', q2024q4: '1,208万' },
  { item: '经营现金流净额', q2026q1: '1.398亿', q2025q4: '9.558亿', q2025q3: '7.302亿', q2025q2: '4.308亿', q2025q1: '1.944亿', q2024q4: '9.683亿' },
  { item: '购买固定资产', q2026q1: '-1,741万', q2025q4: '-1.071亿', q2025q3: '-6,562万', q2025q2: '-4,113万', q2025q1: '-1,726万', q2024q4: '-1.039亿' },
  { item: '收购附属公司', q2026q1: '-224万', q2025q4: '-9,384万', q2025q3: '-7,543万', q2025q2: '-292万', q2025q1: '--', q2024q4: '-1,009万' },
  { item: '投资现金流净额', q2026q1: '-3,135万', q2025q4: '-1.939亿', q2025q3: '-1.535亿', q2025q2: '-5,456万', q2025q1: '-691万', q2024q4: '-1.195亿' },
  { item: '回购股份', q2026q1: '-2.063亿', q2025q4: '-8.000亿', q2025q3: '-6.562亿', q2025q2: '-4.375亿', q2025q1: '-2.187亿', q2024q4: '-8.500亿' },
  { item: '新增借款', q2026q1: '5.136亿', q2025q4: '19.96亿', q2025q3: '15.58亿', q2025q2: '11.23亿', q2025q1: '5.125亿', q2024q4: '21.57亿' },
]

const mettlerKeyRatios = [
  { label: 'ROA (总资产净利率)', values: ['4.59%', '7.90%', '6.28%', '6.10%', '5.05%', '7.69%'] },
  { label: '流动比率', values: ['1.20', '1.14', '1.07', '1.12', '1.01', '1.02'] },
  { label: '速动比率', values: ['0.84', '0.81', '0.74', '0.77', '0.70', '0.73'] },
  { label: '资产负债率', values: ['101.14%', '100.64%', '107.08%', '107.61%', '105.63%', '103.92%'] },
  { label: '经营现金流/流动负债', values: ['0.13', '0.19', '0.25', '0.21', '0.17', '0.23'] },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   RENISHAW DATA (成分与相分析设备)
   ═══════════════════════════════════════════════════════════════════════════════ */

const renishawOverview = {
  name: 'Renishaw plc',
  ticker: 'RSW',
  exchange: 'LSE (London)',
  hq: 'Gloucestershire, UK',
  description: '英国精密工程与测量技术公司，拉曼光谱仪(inVia)领域的全球领导者。Renishaw inVia拉曼光谱仪为本虚拟实验室成分与相分析核心设备。公司同时生产坐标测量机(CMM)和增材制造(3D打印)设备。',
  equipment: [
    { name: 'Renishaw inVia', type: '拉曼光谱仪', category: '成分与相分析' },
  ],
}

const renishawAnnualData = [
  { year: 'FY2025', revenue: '7.13亿英镑', operatingProfit: '1.12亿英镑', netProfit: '1.002亿英镑', revenueGrowth: '+3.16%', overseasPct: '95.2%' },
  { year: 'FY2024', revenue: '6.91亿英镑', operatingProfit: '1.09亿英镑', netProfit: '9,689万英镑', revenueGrowth: '+0.40%', overseasPct: '94.5%' },
  { year: 'FY2023', revenue: '6.89亿英镑', operatingProfit: '1.30亿英镑', netProfit: '1.13亿英镑', revenueGrowth: '+2.60%', overseasPct: '94.4%' },
  { year: 'FY2022', revenue: '6.71亿英镑', operatingProfit: '1.61亿英镑', netProfit: '1.35亿英镑', revenueGrowth: '+18.55%', overseasPct: '95.3%' },
]

const renishawBalanceSheet = [
  { item: '总权益', fy2025: '9.26亿英镑', fy2024: '8.96亿英镑' },
  { item: '无形资产(净值)', fy2025: '3,928万英镑', fy2024: '3,462万英镑' },
  { item: '存货', fy2025: '1.006亿英镑', fy2024: '1.048亿英镑' },
  { item: '贸易应收款', fy2025: '4,367万英镑', fy2024: '4,869万英镑' },
  { item: '投资性房产(净值)', fy2025: '666万英镑', fy2024: '586万英镑' },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   THERMO FISHER DATA (成分与相分析设备)
   ═══════════════════════════════════════════════════════════════════════════════ */

const thermoOverview = {
  name: 'Thermo Fisher Scientific',
  ticker: 'TMO',
  exchange: 'NYSE',
  hq: 'Waltham, MA, USA',
  description: '全球科学服务领域领导者，产品涵盖质谱联用系统、色谱仪等高端分析仪器。Thermo Q Exactive质谱联用系统为本虚拟实验室成分分析关键设备。',
  equipment: [
    { name: 'Thermo Q Exactive', type: '质谱联用系统', category: '成分与相分析' },
  ],
}

const thermoIncomeData = [
  { period: '至2026/3/31', revenue: '196.62亿', cost: '136.42亿', grossProfit: '60.21亿', sgaExpense: '36.40亿', ebit: '23.81亿', interest: '9,082万', preTaxProfit: '13.98亿', tax: '4.66亿', netProfit: '10.44亿', eps: '$0.23', ebitda: '31.69亿' },
  { period: '至2025/12/31', revenue: '176.18亿', cost: '123.67亿', grossProfit: '52.51亿', sgaExpense: '31.89亿', ebit: '20.62亿', interest: '2,638万', preTaxProfit: '22.23亿', tax: '10.51亿', netProfit: '10.75亿', eps: '$0.24', ebitda: '28.27亿' },
  { period: '至2025/9/30', revenue: '171.55亿', cost: '119.70亿', grossProfit: '51.85亿', sgaExpense: '31.70亿', ebit: '20.15亿', interest: '6,998万', preTaxProfit: '27.32亿', tax: '7.80亿', netProfit: '19.04亿', eps: '$0.42', ebitda: '27.70亿' },
  { period: '至2025/6/30', revenue: '156.21亿', cost: '110.46亿', grossProfit: '45.75亿', sgaExpense: '31.16亿', ebit: '14.60亿', interest: '9,602万', preTaxProfit: '18.29亿', tax: '4.95亿', netProfit: '13.29亿', eps: '$0.29', ebitda: '21.86亿' },
  { period: '至2025/3/31', revenue: '181.89亿', cost: '128.39亿', grossProfit: '53.50亿', sgaExpense: '32.72亿', ebit: '20.78亿', interest: '--', preTaxProfit: '18.27亿', tax: '7.69亿', netProfit: '12.13亿', eps: '$0.27', ebitda: '27.63亿' },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   BRUKER vs METTLER Q1 2026 COMPARISON
   ═══════════════════════════════════════════════════════════════════════════════ */

const q1Comparison = [
  { metric: '营业收入', bruker: '8.234亿美元', mettler: '9.471亿美元', winner: 'mettler' },
  { metric: '营收同比', bruker: '+2.75%', mettler: '+7.17%', winner: 'mettler' },
  { metric: '归属净利润', bruker: '1,440万美元', mettler: '1.695亿美元', winner: 'mettler' },
  { metric: '利润同比', bruker: '-17.24%', mettler: '+3.59%', winner: 'mettler' },
  { metric: '基本EPS', bruker: '$0.02', mettler: '$8.35', winner: 'mettler' },
  { metric: '经营现金流', bruker: '7,120万美元', mettler: '1.398亿美元', winner: 'mettler' },
  { metric: '自由现金流', bruker: '4,700万美元', mettler: '1.224亿美元', winner: 'mettler' },
  { metric: '毛利率', bruker: '46.13%', mettler: '58.68%', winner: 'mettler' },
  { metric: '净利率', bruker: '1.91%', mettler: '17.89%', winner: 'mettler' },
]

/* ═══════════════════════════════════════════════════════════════════════════════
   COLLAPSIBLE SECTION COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children, color = 'navy' }: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
  color?: 'navy' | 'econ'
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const colors = color === 'navy' ? 'bg-navy-600 hover:bg-navy-700' : 'bg-econ-500 hover:bg-econ-600'

  return (
    <div className="border border-navy-100 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 ${colors} text-white transition-colors`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-bold text-sm">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 bg-white"
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   QUARTERLY TABLE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

function QuarterlyTable({ data }: { data: QuarterData[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-navy-50">
            <th className="px-3 py-2.5 text-left font-bold text-navy-700 border-b border-navy-200">季度</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">营业收入</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">毛利率</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">净利润</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">净利率</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">营收增长</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">EPS</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">经营现金流</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">自由现金流</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-econ-50/30 transition-colors`}>
              <td className="px-3 py-2.5 font-bold text-navy-700 border-b border-navy-50">{row.period}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.revenue}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.grossMargin}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50 font-medium">{row.netProfit}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.netMargin}</td>
              <td className={`px-3 py-2.5 text-right border-b border-navy-50 font-medium ${row.revenueGrowth.startsWith('+') ? 'text-green-600' : row.revenueGrowth.startsWith('-') ? 'text-red-500' : 'text-navy-600'}`}>
                <span className="inline-flex items-center gap-0.5">
                  {row.revenueGrowth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : row.revenueGrowth.startsWith('-') ? <ArrowDownRight className="w-3 h-3" /> : null}
                  {row.revenueGrowth}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.eps}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.operatingCashFlow}</td>
              <td className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.freeCashFlow || '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CASH FLOW TABLE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

function CashFlowTable({ data }: { data: CashFlowItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-navy-50">
            <th className="px-3 py-2.5 text-left font-bold text-navy-700 border-b border-navy-200">项目</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2026 Q1</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2025 Q4</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2025 Q3</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2025 Q2</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2025 Q1</th>
            <th className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">2024 Q4</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isHighlight = row.item.includes('净额')
            return (
              <tr key={i} className={`${isHighlight ? 'bg-econ-50 font-bold text-navy-700' : i % 2 === 0 ? 'bg-white text-navy-600' : 'bg-slate-50/50 text-navy-600'} hover:bg-econ-50/30 transition-colors`}>
                <td className={`px-3 py-2.5 border-b border-navy-50 ${isHighlight ? 'font-bold text-navy-700' : ''}`}>{row.item}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2026q1}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2025q4}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2025q3}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2025q2}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2025q1}</td>
                <td className="px-3 py-2.5 text-right border-b border-navy-50">{row.q2024q4}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function VendorFinancials() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-navy-700 via-navy-600 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-400/20 text-econ-300 text-sm font-medium mb-4 border border-econ-400/30">
              <BarChart3 className="w-4 h-4" />
              设备厂商财务调研
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">设备生产公司财务报告</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              内容组收集的4家设备厂商（Bruker、Mettler Toledo、Renishaw、赛默飞）的季报、年报与现金流分析数据，直接呈现在本页供查阅。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Equipment-Company Mapping */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <h2 className="text-xl font-bold text-navy-700 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-econ-500" />
            设备与生产厂商对应关系
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { equipment: 'Bruker D8 Advance\nXRD衍射仪', company: 'Bruker Corporation', category: '成分与相分析', icon: Layers, color: 'from-navy-500 to-navy-600' },
              { equipment: 'Bruker S8 Tiger\nXRF荧光光谱', company: 'Bruker Corporation', category: '成分与相分析', icon: FlaskConical, color: 'from-navy-600 to-navy-700' },
              { equipment: 'Mettler DSC3\n差示扫描量热仪', company: 'Mettler Toledo', category: '力学与热学分析', icon: Wrench, color: 'from-econ-500 to-econ-400' },
              { equipment: 'Renishaw inVia\n拉曼光谱仪', company: 'Renishaw plc', category: '成分与相分析', icon: FlaskConical, color: 'from-navy-500 to-navy-600' },
              { equipment: 'Hysitron TI 950\n纳米压痕仪', company: 'Bruker Corporation', category: '力学与热学分析', icon: Wrench, color: 'from-econ-400 to-econ-300' },
              { equipment: 'Thermo Q Exactive\n质谱联用系统', company: 'Thermo Fisher', category: '成分与相分析', icon: FlaskConical, color: 'from-navy-600 to-navy-700' },
              { equipment: 'Netzsch TG 209\n热重分析仪', company: 'NETZSCH', category: '力学与热学分析', icon: Wrench, color: 'from-econ-500 to-econ-400' },
              { equipment: 'Instron 5985\n万能材料试验机', company: 'Instron', category: '力学与热学分析', icon: Wrench, color: 'from-navy-500 to-navy-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-xl p-4 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-50 text-navy-500 font-medium">{item.category}</span>
                </div>
                <p className="text-xs font-bold text-navy-700 whitespace-pre-line leading-tight">{item.equipment}</p>
                <p className="text-[11px] text-navy-400 mt-1">{item.company}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Q1 2026 Comparison */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto section-padding">
          <h2 className="text-xl font-bold text-navy-700 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-econ-500" />
            Bruker vs Mettler Toledo — 2026年Q1 对比
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-navy-600 to-navy-700 text-white">
                    <th className="px-5 py-3 text-left font-bold">对比维度</th>
                    <th className="px-5 py-3 text-right font-bold">Bruker</th>
                    <th className="px-5 py-3 text-right font-bold">Mettler Toledo</th>
                  </tr>
                </thead>
                <tbody>
                  {q1Comparison.map((row, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-econ-50/30 transition-colors`}>
                      <td className="px-5 py-3 font-medium text-navy-700 border-b border-navy-50">{row.metric}</td>
                      <td className={`px-5 py-3 text-right border-b border-navy-50 ${row.winner === 'bruker' ? 'font-bold text-green-600' : 'text-navy-600'}`}>{row.bruker}</td>
                      <td className={`px-5 py-3 text-right border-b border-navy-50 ${row.winner === 'mettler' ? 'font-bold text-green-600' : 'text-navy-600'}`}>{row.mettler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 bg-econ-50 border-t border-econ-100">
              <p className="text-xs text-econ-600 font-medium">Mettler Toledo 在几乎所有维度均优于 Bruker。Mettler 净利率（17.89%）约为 Bruker（1.91%）的 9.4倍，EPS差距达400倍以上。</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bruker Section */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-600 to-navy-700 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-700">{brukerOverview.name}</h2>
              <p className="text-xs text-navy-400">{brukerOverview.ticker} · {brukerOverview.exchange} · {brukerOverview.hq} · FY2025营收 {brukerOverview.fiscalYear2025Revenue}</p>
            </div>
          </div>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">{brukerOverview.description}</p>
          <p className="text-xs text-navy-400 mb-6">调研负责人：蒋羽（力学与热学分析设备）、吴宇轩（成分与相分析设备）</p>

          <div className="space-y-4">
            <CollapsibleSection title="季度盈利数据（6个季度）" icon={DollarSign} defaultOpen>
              <QuarterlyTable data={brukerQuarterlyData} />
            </CollapsibleSection>
            <CollapsibleSection title="现金流量表" icon={TrendingUp}>
              <CashFlowTable data={brukerCashFlowData} />
            </CollapsibleSection>
            <CollapsibleSection title="关键财务比率" icon={BarChart3}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-navy-50">
                      <th className="px-3 py-2.5 text-left font-bold text-navy-700 border-b border-navy-200">指标</th>
                      {['2026 Q1', '2025 Q4', '2025 Q3', '2025 Q2', '2025 Q1', '2024 Q4'].map(q => (
                        <th key={q} className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">{q}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {brukeyKeyRatios.map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-3 py-2.5 font-medium text-navy-700 border-b border-navy-50">{row.label}</td>
                        {row.values.map((v, j) => (
                          <td key={j} className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </section>

      {/* Mettler Toledo Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-econ-500 to-econ-400 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-700">{mettlerOverview.name}</h2>
              <p className="text-xs text-navy-400">{mettlerOverview.ticker} · {mettlerOverview.exchange} · {mettlerOverview.hq}</p>
            </div>
          </div>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">{mettlerOverview.description}</p>
          <p className="text-xs text-navy-400 mb-6">调研负责人：蒋羽（力学与热学分析设备）</p>

          <div className="space-y-4">
            <CollapsibleSection title="季度盈利数据（6个季度）" icon={DollarSign} defaultOpen color="econ">
              <QuarterlyTable data={mettlerQuarterlyData} />
            </CollapsibleSection>
            <CollapsibleSection title="现金流量表（含回购与借款）" icon={TrendingUp} color="econ">
              <CashFlowTable data={mettlerCashFlowData} />
            </CollapsibleSection>
            <CollapsibleSection title="关键财务比率" icon={BarChart3} color="econ">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-econ-50">
                      <th className="px-3 py-2.5 text-left font-bold text-navy-700 border-b border-econ-200">指标</th>
                      {['2026 Q1', '2025 Q4', '2025 Q3', '2025 Q2', '2025 Q1', '2024 Q4'].map(q => (
                        <th key={q} className="px-3 py-2.5 text-right font-bold text-navy-700 border-b border-econ-200">{q}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mettlerKeyRatios.map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-3 py-2.5 font-medium text-navy-700 border-b border-navy-50">{row.label}</td>
                        {row.values.map((v, j) => (
                          <td key={j} className="px-3 py-2.5 text-right text-navy-600 border-b border-navy-50">{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 px-3">
                <p className="text-xs text-amber-600 font-medium">注意：Mettler Toledo 资产负债率超过100%（约101-107%），股东权益为负，ROE不适用。公司大量回购股份导致净资产为负值。</p>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </section>

      {/* Renishaw Section */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-500 to-navy-600 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-700">{renishawOverview.name}</h2>
              <p className="text-xs text-navy-400">{renishawOverview.ticker} · {renishawOverview.exchange} · {renishawOverview.hq}</p>
            </div>
          </div>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">{renishawOverview.description}</p>
          <p className="text-xs text-navy-400 mb-6">调研负责人：吴宇轩（成分与相分析设备）</p>

          <div className="space-y-4">
            <CollapsibleSection title="年度财务数据（FY2022-FY2025）" icon={DollarSign} defaultOpen>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-navy-50">
                      <th className="px-4 py-2.5 text-left font-bold text-navy-700 border-b border-navy-200">财政年度</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">总收入</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">营业利润</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">净利润</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">营收增长</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">海外收入占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renishawAnnualData.map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-econ-50/30 transition-colors`}>
                        <td className="px-4 py-2.5 font-bold text-navy-700 border-b border-navy-50">{row.year}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.revenue}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.operatingProfit}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.netProfit}</td>
                        <td className={`px-4 py-2.5 text-right border-b border-navy-50 font-medium ${row.revenueGrowth.startsWith('+') ? 'text-green-600' : 'text-navy-600'}`}>{row.revenueGrowth}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.overseasPct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 px-4">
                <p className="text-xs text-navy-500">货币单位：英镑（GBP）。Renishaw 95%以上收入来自海外市场，是一家高度国际化的英国企业。</p>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="资产负债表摘要" icon={BarChart3}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-navy-50">
                      <th className="px-4 py-2.5 text-left font-bold text-navy-700 border-b border-navy-200">项目</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">FY2025</th>
                      <th className="px-4 py-2.5 text-right font-bold text-navy-700 border-b border-navy-200">FY2024</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renishawBalanceSheet.map((row, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-2.5 font-medium text-navy-700 border-b border-navy-50">{row.item}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.fy2025}</td>
                        <td className="px-4 py-2.5 text-right text-navy-600 border-b border-navy-50">{row.fy2024}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </section>

      {/* Thermo Fisher Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-econ-500 to-econ-400 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-700">{thermoOverview.name}</h2>
              <p className="text-xs text-navy-400">{thermoOverview.ticker} · {thermoOverview.exchange} · {thermoOverview.hq}</p>
            </div>
          </div>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">{thermoOverview.description}</p>
          <p className="text-xs text-navy-400 mb-6">调研负责人：吴宇轩（成分与相分析设备）</p>

          <div className="space-y-4">
            <CollapsibleSection title="季度损益表（5个季度）" icon={DollarSign} defaultOpen color="econ">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-econ-50">
                      <th className="px-3 py-2.5 text-left font-bold text-navy-700 border-b border-econ-200">项目</th>
                      {thermoIncomeData.map(d => (
                        <th key={d.period} className="px-2 py-2.5 text-right font-bold text-navy-700 border-b border-econ-200 whitespace-nowrap">{d.period}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '营业总收入', key: 'revenue' as const },
                      { label: '营业成本', key: 'cost' as const },
                      { label: '毛利', key: 'grossProfit' as const, highlight: true },
                      { label: '销售管理费用', key: 'sgaExpense' as const },
                      { label: 'EBIT', key: 'ebit' as const },
                      { label: '税前净利润', key: 'preTaxProfit' as const },
                      { label: '净利润', key: 'netProfit' as const, highlight: true },
                      { label: '每股收益', key: 'eps' as const },
                      { label: 'EBITDA', key: 'ebitda' as const, highlight: true },
                    ].map((row, i) => (
                      <tr key={i} className={`${row.highlight ? 'bg-econ-50 font-bold' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className={`px-3 py-2.5 border-b border-navy-50 ${row.highlight ? 'font-bold text-navy-700' : 'text-navy-600'}`}>{row.label}</td>
                        {thermoIncomeData.map(d => (
                          <td key={d.period} className={`px-2 py-2.5 text-right border-b border-navy-50 ${row.highlight ? 'font-bold text-navy-700' : 'text-navy-600'}`}>{d[row.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 px-3">
                <p className="text-xs text-navy-500">货币单位：美元。赛默飞为全球最大科学服务公司，季度收入规模约156-197亿美元，远超Bruker和Mettler Toledo。</p>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </section>

    </div>
  )
}
