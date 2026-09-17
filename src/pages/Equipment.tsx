import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Microscope, DollarSign, TrendingUp, FileText, ChevronDown, ChevronUp, BarChart2, Globe, TrendingDown } from 'lucide-react'

const equipmentCategories = [
  {
    id: 'microstructure',
    title: '微观结构分析设备',
    icon: Microscope,
    color: 'from-navy-500 to-navy-600',
    devices: [
      { name: 'SEM扫描电镜', model: 'Zeiss Sigma 300', price: 280, status: '已配置' },
      { name: 'TEM透射电镜', model: 'FEI Talos F200X', price: 450, status: '待配置' },
      { name: 'FIB聚焦离子束', model: 'FEI Helios 5', price: 380, status: '待配置' },
      { name: 'EDS能谱仪', model: 'Oxford X-Max', price: 85, status: '已配置' },
    ],
    econAnalysis: {
      title: '设备贷款方案比较',
      content: '以SEM电镜（¥280万）为例，对比四种还款方案：Plan1等额本金总利息¥42万；Plan2只付利息总利息¥70万；Plan3等额还款总利息¥52.6万；Plan4到期一次总利息¥91.4万。最优方案为Plan3等额还款，年度现金流压力均衡。',
      factors: ['F/P系数: (1+i)^n', 'A/P系数: 资本回收', 'P/A系数: 收益现值'],
    },
  },
  {
    id: 'composition',
    title: '成分与相分析设备',
    icon: FileText,
    color: 'from-navy-400 to-navy-500',
    devices: [
      { name: 'XRD衍射仪', model: 'Bruker D8 Advance', price: 120, status: '已配置' },
      { name: 'XRF荧光光谱', model: 'Bruker S8 Tiger', price: 95, status: '待配置' },
      { name: '拉曼光谱仪', model: 'Renishaw inVia', price: 78, status: '已配置' },
      { name: '质谱联用系统', model: 'Thermo Q Exactive', price: 160, status: '待配置' },
    ],
    econAnalysis: {
      title: '投资回收期与折旧策略',
      content: 'XRD设备¥120万，预计年收益¥25万（检测服务+论文项目）。静态投资回收期4.8年，动态回收期(i=8%)约5.6年。采用双倍余额递减法加速折旧，前3年节税效应显著，NPV提升约¥8万。',
      factors: ['静态回收期', '动态回收期', '加速折旧NPV'],
    },
  },
  {
    id: 'mechanical',
    title: '力学与热学分析设备',
    icon: TrendingUp,
    color: 'from-navy-500 to-navy-600',
    devices: [
      { name: '纳米压痕仪', model: 'Hysitron TI 950', price: 68, status: '已配置' },
      { name: 'DSC差示扫描量热', model: 'Mettler DSC3', price: 42, status: '已配置' },
      { name: 'TGA热重分析仪', model: 'Netzsch TG 209', price: 38, status: '待配置' },
      { name: '万能材料试验机', model: 'Instron 5985', price: 55, status: '已配置' },
    ],
    econAnalysis: {
      title: '盈亏平衡使用率分析',
      content: '万能试验机年度固定成本¥11万（折旧+维护），单次检测可变成本¥200，对外收费¥800/次。盈亏平衡点：110000/(800-200)=183次/年，即每月约15次即可覆盖成本。当前利用率约65%，尚有提升空间。',
      factors: ['固定成本', '可变成本', '盈亏平衡点'],
    },
  },
  {
    id: 'surface',
    title: '表面与形貌分析设备',
    icon: Microscope,
    color: 'from-navy-400 to-navy-500',
    devices: [
      { name: '原子力显微镜AFM', model: 'Bruker Dimension Icon', price: 88, status: '待配置' },
      { name: '轮廓仪/台阶仪', model: 'KLA-Tencor P-7', price: 45, status: '待配置' },
      { name: '光学显微镜', model: 'Leica DM6 M', price: 25, status: '已配置' },
      { name: '3D激光共聚焦', model: 'Keyence VK-X3000', price: 62, status: '待配置' },
    ],
    econAnalysis: {
      title: '机会成本：外送检测 vs 自购',
      content: 'AFM外送检测均价¥1500/样，年检测需求约200样，外送年费用¥30万。自购AFM(¥88万)+年运维¥8万，使用P/A系数(i=8%,n=10)计算年度等值成本约¥21.1万。自购方案年度节约¥8.9万，NPV约¥37万，建议自购。',
      factors: ['外送费用现值', '自购年度等值', 'P/A系数'],
    },
  },
  {
    id: 'sample',
    title: '制样与辅助设备',
    icon: FileText,
    color: 'from-navy-500 to-navy-600',
    devices: [
      { name: '金相制样系统', model: 'Struers Tegramin', price: 32, status: '已配置' },
      { name: '离子减薄仪', model: 'Gatan PIPS', price: 48, status: '待配置' },
      { name: '镀膜/喷金设备', model: 'Quorum Q150R', price: 18, status: '已配置' },
      { name: '超纯水系统', model: 'Milli-Q Direct 8', price: 12, status: '已配置' },
    ],
    econAnalysis: {
      title: '全生命周期成本LCC',
      content: '超纯水系统购置¥12万，安装¥1万，年耗电¥0.8万，年耗材¥1.2万，年维护¥0.5万，10年后残值¥2万。使用A/P系数(i=8%,n=10)换算年度等值成本约¥5.2万/年。若采用租赁方案¥6万/年，购置方案更优。',
      factors: ['LCC年度等值', 'A/P换算', '租赁对比'],
    },
  },
]

export default function Equipment() {
  const [expanded, setExpanded] = useState<string | null>('microstructure')

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-400/20 text-econ-300 text-sm font-medium mb-4 border border-econ-400/30">
              <DollarSign className="w-4 h-4" />
              核心融合区 · 虚拟设备经济决策档案
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">设备资产</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              虚拟失效分析设备库 + 工程经济学决策档案。每一台虚拟设备的背后，都有一份包含贷款方案比较、投资回收期、
              盈亏平衡分析、全生命周期成本核算的经济决策报告。
              <span className="block mt-2 text-xs text-navy-400">（注：以下设备均为虚拟模拟，仅供课程学习参考）</span>
            </p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              { label: '模拟设备', value: '20+', color: 'bg-white/10' },
              { label: '模拟资产', value: '¥2200万+', color: 'bg-econ-400/20' },
              { label: '已配置', value: '12台', color: 'bg-white/10' },
              { label: '待配置', value: '8台', color: 'bg-white/10' },
            ].map((stat, i) => (
              <div key={i} className={`${stat.color} backdrop-blur-sm rounded-xl p-4 border border-white/10`}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-navy-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Accordion */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-5xl mx-auto section-padding">
          <div className="space-y-4">
            {equipmentCategories.map((cat) => {
              const isOpen = expanded === cat.id
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl overflow-hidden bg-white border border-navy-100 shadow-sm"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : cat.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-navy-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-700 text-lg">{cat.title}</h3>
                        <p className="text-sm text-navy-400">{cat.devices.length} 台设备</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-econ-50 text-econ-600 text-xs font-medium">
                        <DollarSign className="w-3 h-3" />
                        {cat.econAnalysis.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-navy-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-navy-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-navy-100">
                          {/* Device Table */}
                          <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-navy-100">
                                  <th className="text-left py-3 px-3 text-navy-500 font-medium">设备名称</th>
                                  <th className="text-left py-3 px-3 text-navy-500 font-medium">型号</th>
                                  <th className="text-right py-3 px-3 text-navy-500 font-medium">单价(万元)</th>
                                  <th className="text-center py-3 px-3 text-navy-500 font-medium">状态</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cat.devices.map((dev, i) => (
                                  <tr key={i} className="border-b border-navy-50 hover:bg-navy-50/50 transition-colors">
                                    <td className="py-3 px-3 font-medium text-navy-700">{dev.name}</td>
                                    <td className="py-3 px-3 text-navy-500">{dev.model}</td>
                                    <td className="py-3 px-3 text-right font-semibold text-navy-700">¥{dev.price}</td>
                                    <td className="py-3 px-3 text-center">
                                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                        dev.status === '已配置'
                                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                                      }`}>
                                        {dev.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Economic Analysis */}
                          <div className="bg-gradient-to-br from-econ-50 to-white rounded-xl p-5 border border-econ-100">
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-5 h-5 text-econ-500" />
                              <h4 className="font-bold text-navy-700">{cat.econAnalysis.title}</h4>
                            </div>
                            <p className="text-sm text-navy-600 leading-relaxed mb-4">
                              {cat.econAnalysis.content}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {cat.econAnalysis.factors.map((factor, fi) => (
                                <span
                                  key={fi}
                                  className="px-3 py-1 rounded-md bg-white border border-econ-200 text-econ-600 text-xs font-medium"
                                >
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== A股公司对比模块 ===== */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-100 text-econ-600 text-sm font-medium mb-4">
              <BarChart2 className="w-4 h-4" />
              上市公司财务对比 · 工程经济学实践案例
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-700 mb-3">A股相关公司财务对比</h2>
            <p className="text-navy-400 max-w-2xl mx-auto text-sm leading-relaxed">
              选取科学仪器检测行业的A股上市公司与国际巨头，对比其盈利能力、现金流状况与费用结构，
              结合工程经济学指标分析各公司的投资价值。
            </p>
          </motion.div>

          {/* 国际巨头：赛默飞 vs 蔡司 vs 日立 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center shadow">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy-700">国际仪器巨头对比（赛默飞 · 蔡司 · 日立）</h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-navy-700 to-navy-800 text-white">
                    <th className="text-left py-3.5 px-4 font-semibold rounded-tl-2xl">对比维度</th>
                    <th className="text-center py-3.5 px-4 font-semibold">赛默飞世尔（TMO）</th>
                    <th className="text-center py-3.5 px-4 font-semibold">蔡司（CZMWY）</th>
                    <th className="text-center py-3.5 px-4 font-semibold rounded-tr-2xl">日立（6501）</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: '报告期', tmo: '2026Q1（1—3月）', zeiss: 'FY2025/26 Q1（10—12月）', hitachi: 'FY2025全年（截至2026.3）' },
                    { label: '营业收入', tmo: '110.05亿美元', zeiss: '4.67亿欧元', hitachi: '10.59万亿日元' },
                    { label: '营收同比', tmo: '▲ +6.18%', zeiss: '▼ -4.8%', hitachi: '▲ +8%', colorTmo: 'text-green-600', colorZeiss: 'text-red-500', colorHitachi: 'text-green-600' },
                    { label: '净利润 / 利润', tmo: '16.51亿美元', zeiss: 'EBITA: 0.081亿欧元', hitachi: '8,023亿日元' },
                    { label: '利润同比', tmo: '▲ +9.60%', zeiss: '▼ EBITA -77%', hitachi: '▲ +30.3%', colorTmo: 'text-green-600', colorZeiss: 'text-red-500', colorHitachi: 'text-green-600' },
                    { label: '营业利润率', tmo: '21.8%（调整后）', zeiss: 'EBITA margin: 1.7%', hitachi: 'EBITA margin: 12.4%' },
                    { label: '经营现金流', tmo: '11.9亿美元', zeiss: '数据未披露', hitachi: '110.69亿美元（FY25全年）' },
                    { label: '自由现金流', tmo: '8.25亿（同比+121%）', zeiss: '—', hitachi: '87.35亿美元（FY25全年）' },
                    { label: '市盈率（TTM）', tmo: '25.46倍', zeiss: '—', hitachi: '约42倍' },
                    { label: '股息率', tmo: '0.38%', zeiss: '—', hitachi: '每股50日元' },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-navy-50 ${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'} hover:bg-econ-50/30 transition-colors`}>
                      <td className="py-3 px-4 font-semibold text-navy-600 whitespace-nowrap">{row.label}</td>
                      <td className={`py-3 px-4 text-center ${(row as any).colorTmo || 'text-navy-700'}`}>{row.tmo}</td>
                      <td className={`py-3 px-4 text-center ${(row as any).colorZeiss || 'text-navy-700'}`}>{row.zeiss}</td>
                      <td className={`py-3 px-4 text-center ${(row as any).colorHitachi || 'text-navy-700'}`}>{row.hitachi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-400 mt-2 pl-1">数据来源：SEC EDGAR、各公司官方季报/年报 · 整理于2025年</p>
          </motion.div>

          {/* A股公司：行业横向对比 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-econ-400 to-econ-500 flex items-center justify-center shadow">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy-700">A股检测认证行业横向对比（2025年报）</h3>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-econ-400 to-econ-500 text-white">
                    {['公司（代码）', '2025年营收', '营收同比', '归母净利润', '经营性现金流', '毛利率', '净利率'].map((h, i) => (
                      <th key={i} className={`py-3.5 px-4 font-semibold text-left ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === 6 ? 'rounded-tr-2xl' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '华测检测（300012）', revenue: '66.21亿', revGrowth: '+8.82%', netProfit: '10.16亿', ocf: '13.71亿（+29%）', grossMargin: '48.62%', netMargin: '15.35%', up: true },
                    { name: '苏试试验（300416）', revenue: '22.48亿', revGrowth: '+10.97%', netProfit: '2.57亿', ocf: '6.55亿（+35%）', grossMargin: '—', netMargin: '—', up: true },
                    { name: '天溯计量（301449）', revenue: '8.66亿', revGrowth: '+8.22%', netProfit: '1.03亿', ocf: '—', grossMargin: '51.18%', netMargin: '—', up: true },
                    { name: '谱尼测试（300887）', revenue: '5.65亿（H1）', revGrowth: 'H1亏损', netProfit: '-1.80亿', ocf: '—', grossMargin: '—', netMargin: '—', up: false },
                    { name: '西测测试（301306）', revenue: '3.24亿', revGrowth: '-16.71%', netProfit: '减亏中', ocf: '1,337万（转正）', grossMargin: '—', netMargin: '—', up: false },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-navy-50 ${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'} hover:bg-econ-50/30 transition-colors`}>
                      <td className="py-3 px-4 font-semibold text-navy-700 whitespace-nowrap">{row.name}</td>
                      <td className="py-3 px-4 text-navy-600">{row.revenue}</td>
                      <td className={`py-3 px-4 font-semibold ${row.up ? 'text-red-500' : 'text-green-600'}`}>{row.revGrowth}</td>
                      <td className={`py-3 px-4 ${row.netProfit.startsWith('-') ? 'text-green-600' : 'text-red-500'} font-semibold`}>{row.netProfit}</td>
                      <td className="py-3 px-4 text-navy-600">{row.ocf}</td>
                      <td className="py-3 px-4 text-navy-600">{row.grossMargin}</td>
                      <td className="py-3 px-4 text-navy-600">{row.netMargin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-navy-400 mt-2 pl-1">数据来源：东方财富、新浪财经、各公司年报 · 注：中国股市惯例，股价上涨显示为红色</p>
          </motion.div>

          {/* A股推荐组合 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center shadow">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy-700">科学仪器赛道A股推荐组合</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  badge: '推荐首选',
                  badgeColor: 'bg-econ-400 text-white',
                  title: '方案A：聚光科技 + 海能技术',
                  subtitle: '国产高端分析仪器与高增长组合',
                  desc: '纯A股组合，数据获取最方便，适合关注国产替代逻辑。聚光科技（300203）为国产高端质谱/色谱领军企业，海能技术（920476）近年业绩增速居前。',
                  tags: ['国产替代', 'A股', '质谱/色谱'],
                  icon: TrendingUp,
                  iconColor: 'text-econ-500',
                  borderColor: 'border-econ-300',
                  bg: 'bg-econ-50/40',
                },
                {
                  badge: '推荐次选',
                  badgeColor: 'bg-navy-600 text-white',
                  title: '方案B：聚光科技 + 禾信仪器',
                  subtitle: '质谱领域国产阵营组合',
                  desc: '两家均为质谱赛道A股公司。注意：禾信仪器（688622）2025年业绩大幅下滑，分析时需关注其实际财务表现。',
                  tags: ['质谱', '细分赛道', '注意风险'],
                  icon: TrendingDown,
                  iconColor: 'text-navy-500',
                  borderColor: 'border-navy-200',
                  bg: 'bg-navy-50/40',
                },
                {
                  badge: '国际对照',
                  badgeColor: 'bg-gray-500 text-white',
                  title: '方案C：赛默飞 + 沃特世',
                  subtitle: '国际分析仪器龙头对比参考',
                  desc: '赛默飞世尔（NYSE: TMO）与沃特世（NYSE: WAT）为全球分析仪器市场头部企业，可作为估值基准与竞争格局参考。数据来源：SEC EDGAR。',
                  tags: ['美股', '估值基准', 'SEC EDGAR'],
                  icon: Globe,
                  iconColor: 'text-gray-500',
                  borderColor: 'border-gray-200',
                  bg: 'bg-gray-50/40',
                },
              ].map((plan, i) => {
                const Icon = plan.icon
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border ${plan.borderColor} ${plan.bg} p-5 shadow-sm hover:shadow-md transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                      <Icon className={`w-5 h-5 ${plan.iconColor}`} />
                    </div>
                    <h4 className="font-bold text-navy-700 text-base mb-1">{plan.title}</h4>
                    <p className="text-xs text-navy-400 mb-3">{plan.subtitle}</p>
                    <p className="text-sm text-navy-500 leading-relaxed mb-4">{plan.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.tags.map((tag, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded-md bg-white border border-navy-200 text-navy-500 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* 赛默飞年度现金流摘要 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-econ-400 to-econ-500 flex items-center justify-center shadow">
                <BarChart2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-navy-700">赛默飞世尔年度现金流趋势（单位：亿美元）</h3>
            </div>
            <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-navy-700 to-navy-800 text-white">
                      {['项目', '2025年', '2024年', '2023年', '2022年', '2021年'].map((h, i) => (
                        <th key={i} className={`py-3 px-4 font-semibold text-left ${i === 0 ? 'rounded-tl-none' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '净利润', vals: ['67.21亿', '63.38亿', '59.55亿', '69.60亿', '77.28亿'] },
                      { label: '折旧及摊销', vals: ['27.80亿', '31.08亿', '34.06亿', '33.81亿', '25.92亿'] },
                      { label: '经营活动现金流净额', vals: ['78.18亿', '86.67亿', '84.06亿', '91.54亿', '93.12亿'], bold: true },
                      { label: '购买固定资产（资本开支）', vals: ['-15.25亿', '-14.00亿', '-14.79亿', '-22.43亿', '-25.23亿'] },
                      { label: '收购附属公司', vals: ['-40.37亿', '-31.32亿', '-36.60亿', '-3900万', '-194.0亿'] },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-navy-50 ${i % 2 === 0 ? 'bg-white' : 'bg-navy-50/30'}`}>
                        <td className={`py-3 px-4 text-navy-600 ${row.bold ? 'font-bold text-navy-700' : ''} whitespace-nowrap`}>{row.label}</td>
                        {row.vals.map((v, vi) => (
                          <td key={vi} className={`py-3 px-4 text-center ${row.bold ? 'font-bold text-econ-600' : 'text-navy-600'} ${v.startsWith('-') ? 'text-red-500' : ''}`}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-navy-50/50 border-t border-navy-100">
                <p className="text-xs text-navy-400">
                  数据来源：赛默飞世尔科技年报 · SEC EDGAR ·
                  <span className="text-econ-500 font-medium"> 经营活动现金流持续强劲，体现科学仪器龙头的稳定盈利质量</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
