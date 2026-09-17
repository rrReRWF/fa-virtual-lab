import { useState } from 'react'
import { motion } from 'framer-motion'
import { FlaskConical, MapPin, Calendar, Target, Lightbulb, GraduationCap, UserCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const teamMembers = [
  { role: 'Pre成员', name: '仲雯茜', type: 'pre' },
  { role: '网站开发', name: '籍梓柔', type: 'tech' },
  { role: '网站开发', name: '陈雨欣', type: 'tech' },
  { role: '网站开发', name: '孙安宁', type: 'tech' },
  { role: '内容收集', name: '杜诚', type: 'content' },
  { role: '内容收集', name: '蒋羽', type: 'content' },
  { role: '内容收集', name: '张潇月', type: 'content' },
  { role: '内容收集', name: '吴宇轩', type: 'content' },
  { role: 'Pre成员', name: '赵焕棋', type: 'pre' },
  { role: 'Pre成员', name: '张芳豪', type: 'pre' },
]

const milestones = [
  { year: '2026.03', title: '项目立项', desc: '工程经济学课程项目启动，第二组正式成立' },
  { year: '2026.04', title: '内容收集', desc: '杜诚、蒋羽、张潇月、吴宇轩四人负责设备数据与经济分析内容收集' },
  { year: '2026.04-05', title: '网站开发', desc: '籍梓柔、陈雨欣、孙安宁三人负责前端架构搭建与功能开发' },
  { year: '2026.05', title: '成果展示', desc: '课程展示，仲雯茜、赵焕棋、张芳豪进行课程Pre汇报' },
]

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-br from-navy-700 via-navy-600 to-navy-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-econ-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-navy-400 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto section-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              苏州城市学院 · 工程经济学课程
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">关于我们</h1>
            <p className="text-navy-200 text-lg max-w-2xl mx-auto">
              第二组课程项目 · 虚拟仿真实验室构思实践
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lab Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-navy-700 mb-6">项目定位与使命</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-navy-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-700 mb-1">精准定位</h3>
                    <p className="text-sm text-navy-500">基于失效分析概念构建虚拟仿真实验室，将工程经济学方法融入模拟设备投资决策全过程</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-econ-100 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-econ-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-700 mb-1">创新理念</h3>
                    <p className="text-sm text-navy-500">将现金流量图、复利计算、贷款方案比较等工程经济学工具，应用于实验室设备投资决策全过程</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center shrink-0">
                    <FlaskConical className="w-5 h-5 text-navy-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-700 mb-1">技术覆盖</h3>
                    <p className="text-sm text-navy-500">模拟涵盖SEM/TEM/FIB微观结构、XRD/XRF成分分析、力学热学测试、表面形貌表征五大方向</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src="/campus.jpg" alt="Suzhou City College" className="w-full h-auto object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-navy-100">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-econ-500" />
                  <div>
                    <p className="text-xs text-navy-400">项目性质</p>
                    <p className="text-sm font-bold text-navy-700">课程虚拟仿真</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-700 mb-3">发展历程</h2>
            <p className="text-navy-400">从立项到展示的完整项目时间线</p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-econ-400 to-navy-300" />
            {milestones.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} pl-12 lg:pl-0`}>
                  <div className={`inline-block bg-white rounded-xl p-5 shadow-sm border border-navy-100 hover:border-econ-300 transition-colors ${i % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-econ-500" />
                      <span className="text-sm font-bold text-econ-500">{item.year}</span>
                    </div>
                    <h3 className="font-semibold text-navy-700 mb-1">{item.title}</h3>
                    <p className="text-sm text-navy-400">{item.desc}</p>
                  </div>
                </div>
                <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-econ-400 z-10 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-econ-400" />
                </div>
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-700 mb-3">项目团队</h2>
            <p className="text-navy-400">第二组全体成员 · 分工明确 · 协作高效</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
          >
            {teamMembers.map((member, i) => {
              const colorMap: Record<string, string> = {
                pre: 'from-econ-400 to-econ-500',
                tech: 'from-navy-500 to-navy-600',
                content: 'from-navy-400 to-navy-500',
              }
              const badgeMap: Record<string, string> = {
                pre: 'bg-econ-50 text-econ-600 border-econ-200',
                tech: 'bg-navy-50 text-navy-600 border-navy-200',
                content: 'bg-slate-50 text-slate-600 border-slate-200',
              }
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group rounded-xl bg-white border border-navy-100 p-5 text-center hover:border-econ-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorMap[member.type]} mx-auto mb-3 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <UserCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-navy-700 text-sm mb-1">{member.name}</h3>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${badgeMap[member.type]}`}>
                    {member.role}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Weekly Task Assignments */}
      <WeeklyTaskGallery />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   WEEKLY TASK GALLERY COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
const taskImages = [
  { src: '/task-assignments/1193b7cee44e6288ee2c0987f6481bc0.png', week: '第5周', date: '2026/4/9', reviewer: '赵焕棋', topic: 'Time Value / Simple Interest / Cash Flow' },
  { src: '/task-assignments/3431cb8bc7576b42a8e20bffe82e7fae.png', week: '第6周', date: '2026/4/20', reviewer: '仲雯茜', topic: 'Compound Interest / Power of Compounding / Equivalence' },
  { src: '/task-assignments/0eb49888c3c30a14454869f455b81e65.png', week: '第7周', date: '2026/4/21', reviewer: '张芳豪', topic: '等值关系 / Single Payment / 风险判定' },
  { src: '/task-assignments/24a1b9f022788a2e8f20db5d41cbdc30.png', week: '第7周', date: '2026/4/21', reviewer: '张芳豪', topic: 'Single Payment / 无风险利率 / 沉淀基金' },
  { src: '/task-assignments/85fc2db4153127a16c02500f25e1834f.png', week: '第10周', date: '2026/5/7', reviewer: '张芳豪', topic: 'Nominal vs Effective / PW+NPW / Capitalized Cost' },
  { src: '/task-assignments/a2b8ca77dec3219f4261b0dc5308d768.png', week: '第11周', date: '2026/5/11', reviewer: '张芳豪', topic: 'Foundation+Criteria / EUAC / Loan Amortization' },
  { src: '/task-assignments/223ddf4792a7fd1d9f6d7a721ac1b4e6.png', week: '第12周', date: '2026/5/18', reviewer: '陈雨欣', topic: 'IRR基础概念 / IRR Calculation / Incremental Analysis' },
]

function WeeklyTaskGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = taskImages[currentIndex]

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? taskImages.length - 1 : i - 1))
  const goNext = () => setCurrentIndex((i) => (i === taskImages.length - 1 ? 0 : i + 1))

  return (
    <section className="py-16 bg-navy-50">
      <div className="max-w-5xl mx-auto section-padding">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-econ-100 text-econ-600 text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            课内任务分配记录
          </div>
          <h2 className="text-3xl font-bold text-navy-700 mb-3">每周内容任务分配</h2>
          <p className="text-navy-400">课程进行期间的团队协作与任务分工记录</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden"
        >
          {/* Image display */}
          <div className="relative bg-navy-50 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={goPrev} className="w-10 h-10 rounded-full bg-white border border-navy-200 flex items-center justify-center hover:bg-navy-50 transition-colors shrink-0">
                <ChevronLeft className="w-5 h-5 text-navy-600" />
              </button>
              <div className="text-center px-4">
                <span className="inline-block px-3 py-1 rounded-full bg-econ-50 text-econ-600 text-xs font-bold mb-1">{current.week}</span>
                <p className="text-sm text-navy-500">{current.date} · 审核人: {current.reviewer}</p>
                <p className="text-xs text-navy-400 mt-0.5">{current.topic}</p>
              </div>
              <button onClick={goNext} className="w-10 h-10 rounded-full bg-white border border-navy-200 flex items-center justify-center hover:bg-navy-50 transition-colors shrink-0">
                <ChevronRight className="w-5 h-5 text-navy-600" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-navy-100 bg-white">
              <img
                src={current.src}
                alt={`${current.week}任务分配`}
                className="w-full h-auto object-contain max-h-[500px] mx-auto"
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="p-4 border-t border-navy-100">
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
              {taskImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentIndex ? 'border-econ-400 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={img.week} className="w-20 h-14 object-cover" />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-navy-400 mt-2">点击缩略图切换周次 · 共 {taskImages.length} 周</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
