import { motion } from 'framer-motion'
import { FlaskConical, DollarSign, TrendingUp, Activity, Shield, Layers, Factory, FileText, BarChart3, ArrowRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const researchAreas = [
  {
    title: '材料失效机理研究',
    icon: Shield,
    color: 'bg-navy-500',
    techContent: ['金属疲劳/腐蚀失效机理', '断裂失效分析（宏观/微观）', '高温蠕变与氧化失效', '疲劳寿命预测模型'],
    econModel: {
      title: '失效检测成本模型',
      desc: '预防性维护NPV计算： annual inspection cost × P/A系数 vs failure loss × P/F系数。以航空铝合金为例，年度检测费¥5万，潜在失效损失¥200万，折现率8%，10年期NPV节约约¥78万，检测投入具有显著经济价值。',
      factors: ['F/A系数: 年度维护累积', 'P/F系数: 失效损失现值', '预防性维护NPV'],
    },
  },
  {
    title: '电子器件可靠性分析',
    icon: Activity,
    color: 'bg-navy-600',
    techContent: ['芯片封装失效分析', 'PCB焊点可靠性评估', 'ESD/EOS损伤表征', '可靠性加速寿命试验'],
    econModel: {
      title: '可靠性投资回报率ROI',
      desc: '可靠性实验室建设投入¥150万，年减少客诉损失¥40万，年提升产品溢价¥20万。年度净收益¥60万，A/P系数(i=8%,n=10)年度等值收益¥8.94万。投资回收期2.5年，ROI=260%(10年)。',
      factors: ['A/P系数: 年度等值', 'ROI计算', '质保成本期望'],
    },
  },
  {
    title: '涂层与表面工程分析',
    icon: Layers,
    color: 'bg-navy-500',
    techContent: ['附着力失效机制研究', '磨损与腐蚀协同作用', '氧化/渗层失效分析', '涂层残余应力表征'],
    econModel: {
      title: '表面处理工艺成本比较',
      desc: '比较PVD镀膜(¥80/件) vs 化学镀镍(¥45/件) vs 热喷涂(¥35/件)。以10万件/年、5年周期计算，使用P/A系数换算总成本现值：PVD¥320万、化学镀镍¥180万、热喷涂¥140万。但需结合使用寿命修正NPV。',
      factors: ['P/A系数: 总成本现值', '不同方案NPV对比', '寿命周期修正'],
    },
  },
  {
    title: '复合材料结构分析',
    icon: Factory,
    color: 'bg-navy-600',
    techContent: ['分层/脱粘失效检测', '纤维断裂/拔出机制', '界面相失效分析', '冲击损伤表征'],
    econModel: {
      title: '全生命周期成本LCC',
      desc: '碳纤维复合材料部件，初始成本高¥50万但寿命20年；铝合金部件初始¥20万但寿命10年需更换。折现率8%，使用P/A系数计算20年等值成本：碳纤维年度等值¥5.1万，铝合金(更换一次)年度等值¥6.3万。碳纤维LCC更优。',
      factors: ['LCC年度等值', '替换决策树', '边际成本分析'],
    },
  },
  {
    title: '工业现场失效诊断',
    icon: TrendingUp,
    color: 'bg-econ-400',
    techContent: ['在线监测技术', '失效预警模型开发', '残余寿命预测', '数字孪生应用'],
    econModel: {
      title: '监测投入 vs 停机损失',
      desc: '安装在线监测系统¥30万，年运维¥3万，可减少非计划停机损失¥50万/年。年度净收益¥47万，P/A(i=8%,5)=3.9927，5年NPV=¥157.6万。最优检测间隔经济模型：检测成本+停机损失期望值最小化，求得最优间隔T*=sqrt(2C/D)。',
      factors: ['监测投入NPV', '最优检测间隔', '机会成本权衡'],
    },
  },
]

export default function Research() {
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
              <FlaskConical className="w-4 h-4" />
              失效分析技术路线 × 经济学评估模型
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">研究方向</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              五大虚拟研究方向覆盖材料、电子、涂层、复合材料与工业现场诊断，每个方向均建立技术路线与经济学评估模型的双维度模拟研究框架。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Cards */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-8"
          >
            {researchAreas.map((area, i) => {
              const Icon = area.icon
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl overflow-hidden border border-navy-100 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Tech Side */}
                    <div className="lg:col-span-3 p-6 lg:p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <div className={`w-12 h-12 rounded-xl ${area.color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-navy-700">{area.title}</h3>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {area.techContent.map((item, ti) => (
                          <div key={ti} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-navy-400 mt-2 shrink-0" />
                            <span className="text-sm text-navy-600">{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-navy-400">
                        <FileText className="w-4 h-4" />
                        <span>课程作业与报告见本学期作业页</span>
                      </div>
                    </div>

                    {/* Econ Side */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-econ-50 to-white p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-econ-100">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-5 h-5 text-econ-500" />
                        <h4 className="font-bold text-navy-700">{area.econModel.title}</h4>
                      </div>
                      <p className="text-sm text-navy-600 leading-relaxed mb-4">
                        {area.econModel.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {area.econModel.factors.map((factor, fi) => (
                          <span
                            key={fi}
                            className="px-2.5 py-1 rounded-md bg-white border border-econ-200 text-econ-600 text-xs font-medium"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Vendor Financials Link */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-navy-600 to-econ-500 rounded-2xl p-8 lg:p-10 text-white shadow-lg"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm font-medium text-white/80">设备厂商财务调研</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">设备生产公司财务报告</h2>
                <p className="text-white/70 text-sm max-w-xl">
                  内容组收集的Bruker、Mettler Toledo、Renishaw、赛默飞4家厂商的季报、年报与现金流数据，包含Q1 2026对比分析、关键财务比率等完整内容。
                </p>
              </div>
              <a
                href="/vendor-financials"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-navy-700 font-bold text-sm hover:bg-navy-50 transition-colors shadow-md"
              >
                查看完整报告
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
