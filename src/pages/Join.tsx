import { motion } from 'framer-motion'
import { Users, Mail, MapPin, Phone, GraduationCap, Send } from 'lucide-react'
import PdfPlaceholder from '../components/PdfPlaceholder'

export default function Join() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-navy-200 text-sm font-medium mb-4 border border-white/20">
              <Users className="w-4 h-4" />
              开放合作 · 持续招募 · 欢迎加入
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">加入我们</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              FA实验室欢迎对失效分析与工程经济学感兴趣的本科生、研究生加入。
              我们提供设备操作培训、经济分析工具实战、科研项目参与等多元化成长机会。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Recruitment Info */}
      <section className="py-16 bg-navy-50">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Open Positions */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-navy-700 mb-6">开放岗位</h2>

              {[
                {
                  title: '实验室助研',
                  type: '本科生/研究生',
                  desc: '参与失效分析实验操作，协助设备日常维护，收集整理检测数据。',
                  requirements: ['材料/机械/电子相关专业', '每周可投入8小时以上', '责任心强，细心认真'],
                },
                {
                  title: '经济分析助理',
                  type: '经济学/工程管理专业',
                  desc: '协助完成设备投资决策的经济分析，维护经济分析工具网页，编写案例报告。',
                  requirements: ['熟悉Excel或编程基础', '对工程经济学有学习兴趣', '具备数据分析思维'],
                },
                {
                  title: '网站维护志愿者',
                  type: '计算机/设计专业',
                  desc: '协助维护实验室展示网站，更新内容、优化页面、修复问题。',
                  requirements: ['了解HTML/CSS/JavaScript基础', '有React/Vue经验优先', '审美在线，注重细节'],
                },
              ].map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-navy-700">{job.title}</h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-econ-50 text-econ-600 text-xs font-medium border border-econ-100">
                        {job.type}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium border border-green-200">
                      招募中
                    </span>
                  </div>
                  <p className="text-sm text-navy-500 mb-4">{job.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, ri) => (
                      <span key={ri} className="px-3 py-1 rounded-md bg-navy-50 text-navy-600 text-xs border border-navy-100">
                        {req}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Application Note */}
              <div className="bg-gradient-to-r from-econ-50 to-white rounded-2xl p-6 border border-econ-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-econ-100 flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-econ-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-700 mb-2">申请方式</h3>
                    <p className="text-sm text-navy-600 leading-relaxed">
                      请将个人简历及申请意向发送至 <span className="text-econ-600 font-medium">fa-lab@szcu.edu.cn</span>，
                      邮件标题注明"FA实验室申请-岗位名称-姓名"。我们将在5个工作日内回复。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-navy-100 shadow-sm sticky top-24">
                <h3 className="font-bold text-navy-700 mb-4">联系信息</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-navy-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-700">地址</p>
                      <p className="text-xs text-navy-400">苏州城市学院 · 工程楼</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-navy-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-700">邮箱</p>
                      <p className="text-xs text-navy-400">fa-lab@szcu.edu.cn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-navy-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-700">电话</p>
                      <p className="text-xs text-navy-400">0512-XXXX-XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4 text-navy-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-700">指导老师</p>
                      <p className="text-xs text-navy-400">工程经济学教研室</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-navy-100">
                  <p className="text-xs text-navy-400 mb-2">当前团队</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-400 to-navy-500 border-2 border-white flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-navy-600 font-medium">10人 · 第二组</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Placeholders */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-navy-700 mb-2">申请与表格文档</h2>
            <p className="text-navy-400 text-sm">申请表、安全培训材料、设备操作手册等PDF占位区域</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PdfPlaceholder title="实验室加入申请表" description="个人信息与研究意向登记表" filename="Application_Form.pdf" />
            <PdfPlaceholder title="安全培训手册" description="实验室安全规范与应急预案" filename="Safety_Manual.pdf" />
            <PdfPlaceholder title="设备操作承诺书" description="精密设备使用责任承诺书模板" filename="Equipment_Pledge.pdf" />
            <PdfPlaceholder title="助研工作手册" description="助研岗位职责与考核标准" filename="RA_Handbook.pdf" />
          </div>
        </div>
      </section>
    </div>
  )
}
