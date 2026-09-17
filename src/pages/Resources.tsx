import { motion } from 'framer-motion'
import { Download, BookOpen, Database, ExternalLink, Link2, Calculator } from 'lucide-react'
import PdfPlaceholder from '../components/PdfPlaceholder'

const resourceCategories = [
  {
    title: '开源工具与软件',
    icon: Calculator,
    color: 'bg-navy-500',
    items: [
      { name: '设备投资决策计算器', desc: '网页版NPV/IRR/回收期计算工具', link: '/econ-tools' },
      { name: '现金流图绘制模板', desc: 'Excel模板，支持多期现金流输入', link: '#' },
      { name: '贷款方案比较表', desc: '四种还款方案自动对比Excel', link: '#' },
    ],
  },
  {
    title: '数据集与标准',
    icon: Database,
    color: 'bg-navy-600',
    items: [
      { name: '常见材料失效图谱', desc: 'SEM/TEM典型失效形貌图片集', link: '#' },
      { name: '设备性能参数库', desc: '主流失效分析设备技术规格汇总', link: '#' },
      { name: '检测收费标准参考', desc: '第三方检测机构收费价格区间', link: '#' },
    ],
  },
  {
    title: '教学资源',
    icon: BookOpen,
    color: 'bg-econ-400',
    items: [
      { name: '工程经济学课件Session 1-5', desc: '课程讲义、习题与参考答案', link: '#' },
      { name: '失效分析基础教程', desc: 'SEM/XRD/力学测试入门教程', link: '#' },
      { name: '经济分析案例视频', desc: '设备采购决策案例分析录播', link: '#' },
    ],
  },
  {
    title: '常用链接',
    icon: Link2,
    color: 'bg-navy-500',
    items: [
      { name: '苏州城市学院官网', desc: '合作高校官方网站', link: 'https://www.szcu.edu.cn' },
      { name: '知网学术期刊', desc: '论文检索与下载平台', link: '#' },
      { name: '工程经济学教学网', desc: '课程资源共享平台', link: '#' },
    ],
  },
]

export default function Resources() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-navy-200 text-sm font-medium mb-4 border border-white/20">
              <Download className="w-4 h-4" />
              开源工具 · 数据集 · 教学课件 · 常用链接
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">资源中心</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              汇集失效分析工具、工程经济学计算模板、教学课件、数据集与外部资源链接，
              为实验室运营与课程学习提供一站式资源支持。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="grid sm:grid-cols-2 gap-6">
            {resourceCategories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 lg:p-8 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-navy-700">{cat.title}</h2>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item, ii) => (
                      <a
                        key={ii}
                        href={item.link}
                        className="flex items-start gap-3 p-3 rounded-lg bg-navy-50/50 border border-navy-100 hover:border-econ-300 hover:bg-white transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-navy-100 flex items-center justify-center shrink-0 group-hover:border-econ-300 transition-colors">
                          {item.link.startsWith('http') ? (
                            <ExternalLink className="w-4 h-4 text-navy-400" />
                          ) : (
                            <Download className="w-4 h-4 text-navy-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy-700 text-sm group-hover:text-econ-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-navy-400 mt-0.5">{item.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PDF Placeholders */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy-700 mb-2">可下载文档资源</h2>
            <p className="text-navy-400 text-sm">课件、模板、数据集等PDF文档占位区域，后续可替换为实际文件</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PdfPlaceholder title="工程经济学课件合集" description="Session 1-5 完整讲义与习题" filename="EngEcon_All_Sessions.pdf" />
            <PdfPlaceholder title="失效分析入门教程" description="SEM/XRD/力学测试基础教程" filename="FA_Basics_Tutorial.pdf" />
            <PdfPlaceholder title="贷款比较Excel模板" description="四种方案自动计算与图表生成" filename="Loan_Comparison_Template.xlsx" />
            <PdfPlaceholder title="设备参数数据库" description="主流分析设备规格与报价汇总表" filename="Equipment_Database.xlsx" />
          </div>
        </div>
      </section>
    </div>
  )
}
