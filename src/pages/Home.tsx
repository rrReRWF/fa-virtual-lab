import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Microscope, Calculator, BookOpen, TrendingUp, ChevronRight, Activity, DollarSign, Clock, Award } from 'lucide-react'

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const step = target / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt="FA Laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-700/80 via-navy-700/60 to-navy-700/90" />
          <div className="absolute inset-0 bg-[url('/hero-overlay.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto section-padding text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-econ-400 animate-pulse" />
              苏州城市学院 · 工程经济学 · 虚拟仿真项目 · 第二组
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              失效分析实验室
              <span className="block text-econ-300 mt-2">Failure Analysis Lab</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              基于失效分析（Failure Analysis）概念构建虚拟仿真实验室，融合工程经济学决策方法，体验"设备投资-运营分析-经济评估"全流程模拟实践。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/equipment"
                className="px-8 py-3.5 rounded-lg bg-gradient-to-r from-econ-400 to-econ-300 text-white font-semibold shadow-glow-orange hover:shadow-glow-orange hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Microscope className="w-5 h-5" />
                浏览设备资产
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/econ-tools"
                className="px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                <Calculator className="w-5 h-5" />
                经济分析工具
              </Link>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-3 rounded-full bg-white/60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {[
              { icon: Microscope, value: 5, suffix: '类', label: '设备分类', color: 'from-navy-500 to-navy-600' },
              { icon: DollarSign, value: 20, suffix: '+', label: '虚拟设备', color: 'from-econ-400 to-econ-500' },
              { icon: Activity, value: 4, suffix: '套', label: '经济分析工具', color: 'from-navy-500 to-navy-600' },
              { icon: BookOpen, value: 10, suffix: '人', label: '项目成员', color: 'from-econ-400 to-econ-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative rounded-2xl p-6 bg-gradient-to-br text-white overflow-hidden group hover-lift"
                style={{ background: `linear-gradient(135deg, ${i % 2 === 0 ? '#1e6091' : '#e66c2c'} 0%, ${i % 2 === 0 ? '#1b3a5f' : '#d45a1a'} 100%)` }}
              >
                <div className="relative z-10">
                  <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-3xl lg:text-4xl font-bold mb-1">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lab Introduction */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-100 text-econ-600 text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                关于本项目
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-700 mb-4">
                微观世界的<span className="text-econ-500">经济决策</span>
              </h2>
              <p className="text-navy-500 leading-relaxed mb-6">
                FA实验室是一个基于苏州城市学院工程经济学课程的虚拟仿真项目，将失效分析（Failure Analysis）技术与工程经济决策方法深度融合。
                我们模拟材料与器件的失效分析场景，并运用工程经济学工具进行设备采购投资回报、贷款方案比较与全生命周期成本分析。
              </p>
              <p className="text-navy-500 leading-relaxed mb-8">
                通过现金流量图、复利计算、等额还款方案比较等工程经济学工具，为虚拟设备投资决策提供科学依据，
                体验"技术+经济"双驱动的课程实践过程。
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-econ-500 font-semibold hover:text-econ-600 transition-colors"
              >
                了解更多 <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/equip-sem.jpg"
                  alt="SEM Equipment"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-navy-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-navy-600" />
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">创建于</p>
                    <p className="text-sm font-bold text-navy-700">2026年春季学期</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipment Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-700 mb-3">设备资产概览</h2>
            <p className="text-navy-400 max-w-2xl mx-auto">
              虚拟模拟覆盖微观结构、成分分析、力学热学、表面形貌等五大类失效分析设备，每台设备均附经济决策档案
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: '微观结构分析',
                devices: 'SEM / TEM / FIB / EDS',
                image: '/equip-sem.jpg',
                econ: '贷款方案Plan1-4对比',
              },
              {
                title: '成分与相分析',
                devices: 'XRD / XRF / 拉曼光谱',
                image: '/equip-xrd.jpg',
                econ: '投资回收期计算',
              },
              {
                title: '力学与热学分析',
                devices: '纳米压痕 / DSC / TGA',
                image: '/equip-mechanical.jpg',
                econ: '盈亏平衡使用率',
              },
              {
                title: '表面与形貌分析',
                devices: 'AFM / 轮廓仪 / 共聚焦',
                image: '/hero-overlay.jpg',
                econ: '机会成本分析',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group rounded-2xl overflow-hidden bg-navy-50 border border-navy-100 hover:border-econ-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-navy-700 mb-1">{item.title}</h3>
                  <p className="text-sm text-navy-400 mb-3">{item.devices}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-econ-50 text-econ-600 text-xs font-medium">
                    <DollarSign className="w-3 h-3" />
                    {item.econ}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy-700 text-white font-medium hover:bg-navy-600 transition-colors"
            >
              查看全部设备 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Econ Tools Preview */}
      <section className="py-16 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-400/20 text-econ-300 text-sm font-medium mb-4 border border-econ-400/30">
                <Calculator className="w-4 h-4" />
                工程经济学工具
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                课程知识 · 实战转化
              </h2>
              <p className="text-navy-200 leading-relaxed mb-6">
                将工程经济学课程中的单利复利、现金流量图、F/P·P/F·F/A·A/F·P/A·A/P六大系数、
                四种贷款还款方案等核心知识，转化为可交互的实验室设备投资决策工具。
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: TrendingUp, text: '贷款方案比较器 — Plan1-4四种还款方式可视化对比' },
                  { icon: Activity, text: '设备投资计算器 — NPV/IRR/回收期自动计算' },
                  { icon: Clock, text: '复利单利可视化 — 交互式增长曲线与72法则' },
                  { icon: DollarSign, text: '全生命周期成本 — 购置+运维+耗材年度等值分析' },
                ].map((tool, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <tool.icon className="w-4 h-4 text-econ-300" />
                    </div>
                    <p className="text-sm text-navy-100">{tool.text}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/econ-tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-econ-400 text-white font-semibold hover:bg-econ-500 transition-colors shadow-glow-orange"
              >
                开始使用工具 <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-navy-200">贷款方案比较示例</span>
                  <span className="text-xs text-navy-300 bg-white/10 px-2 py-1 rounded">示例：SEM电镜（虚拟）</span>
                </div>
                <div className="space-y-3">
                  {[
                    { plan: 'Plan 1 等额本金', total: '¥6,200', interest: '¥1,200', color: 'bg-navy-500' },
                    { plan: 'Plan 2 只付利息', total: '¥7,000', interest: '¥2,000', color: 'bg-navy-400' },
                    { plan: 'Plan 3 等额还款', total: '¥6,260', interest: '¥1,260', color: 'bg-econ-400' },
                    { plan: 'Plan 4 到期一次', total: '¥7,347', interest: '¥2,347', color: 'bg-navy-600' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-navy-300 w-24 shrink-0">{item.plan}</span>
                      <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full flex items-center justify-end px-2`}
                          style={{ width: `${(parseInt(item.total.replace(/[^0-9]/g, '')) / 7347) * 100}%` }}
                        >
                          <span className="text-[10px] text-white font-medium">{item.total}</span>
                        </div>
                      </div>
                      <span className="text-xs text-navy-300 w-16 text-right">利息{item.interest}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-navy-300">
                  <span>本金：¥5,000 | 利率：8% | 期限：5年</span>
                  <span className="text-econ-300">等额还款最优 →</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}
