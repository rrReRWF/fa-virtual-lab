import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, BookOpen, ChevronDown, ChevronUp, Eye, Download } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

// 7 assignments: all uploaded
const assignments = [
  {
    id: 1,
    week: '第一周',
    title: '工程经济学课程导论作业',
    description: '课程概述与工程经济学基本概念，包含货币时间价值基础理论。',
    pdfUrl: '/pdfs/Week01.pdf',
  },
  {
    id: 2,
    week: '第二周',
    title: '利率与复利计算',
    description: '单利与复利的比较分析，六大系数（F/P、P/F、F/A、A/F、P/A、A/P）推导与应用。',
    pdfUrl: '/pdfs/Week02.pdf',
  },
  {
    id: 3,
    week: '第三周',
    title: '现金流量图与等额序列',
    description: '现金流量图的绘制方法，等额年金序列的现值与终值计算。',
    pdfUrl: '/pdfs/Week03.pdf',
  },
  {
    id: 4,
    week: '第四周',
    title: '贷款方案比较分析',
    description: '四种贷款还款方案（等额本金、只付利息、等额还款、到期一次）对比与最优方案选择。',
    pdfUrl: '/pdfs/Week04.pdf',
  },
  {
    id: 5,
    week: '第五周',
    title: '投资回收期与净现值',
    description: '静态投资回收期与动态投资回收期的计算，净现值（NPV）法在设备采购中的应用。',
    pdfUrl: '/pdfs/Week05.pdf',
  },
  {
    id: 6,
    week: '第六周',
    title: '内部收益率（IRR）分析',
    description: '内部收益率的定义与试算法求解，IRR与NPV结论一致性分析。',
    pdfUrl: '/pdfs/Week06.pdf',
  },
  {
    id: 7,
    week: '第七周',
    title: '盈亏平衡分析',
    description: '固定成本、可变成本与盈亏平衡点的计算，实验室设备使用率优化分析。',
    pdfUrl: '/pdfs/Week07.pdf',
  },
]

function PdfViewer({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-xl overflow-hidden border border-navy-100">
      <iframe
        src={pdfUrl}
        title={title}
        className="w-full"
        style={{ height: '600px', border: 'none' }}
      />
    </div>
  )
}

function AssignmentCard({ assignment }: { assignment: typeof assignments[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-2xl overflow-hidden border shadow-sm transition-all duration-300 bg-white border-navy-100 hover:border-econ-300 hover:shadow-md"
    >
      {/* Card Header */}
      <div className="p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-econ-400 to-econ-500"
          >
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-econ-50 text-econ-600 border border-econ-200">
                {assignment.week}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                已上传
              </span>
            </div>
            <h3 className="font-bold text-navy-700 text-base leading-snug mb-1">
              {assignment.title}
            </h3>
            <p className="text-sm text-navy-400 leading-relaxed">{assignment.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-700 text-white text-sm font-medium hover:bg-navy-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {expanded ? '收起预览' : '在线预览'}
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <a
            href={assignment.pdfUrl!}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-econ-50 text-econ-600 border border-econ-200 text-sm font-medium hover:bg-econ-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            下载PDF
          </a>
        </div>
      </div>

      {/* PDF Inline Viewer */}
      {expanded && assignment.pdfUrl && (
        <div className="border-t border-navy-100 p-5 pt-4 bg-gray-50">
          <PdfViewer pdfUrl={assignment.pdfUrl} title={assignment.title} />
        </div>
      )}
    </motion.div>
  )
}

export default function Publications() {
  const uploadedCount = assignments.length

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-navy-200 text-sm font-medium mb-4 border border-white/20">
              <BookOpen className="w-4 h-4" />
              苏州城市学院 · 工程经济学 · 2026春季学期
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">本学期作业</h1>
            <p className="text-navy-200 max-w-3xl leading-relaxed">
              工程经济学课程本学期全部作业汇总，包含每周课程练习与综合案例分析，
              共计 <span className="text-econ-300 font-semibold">{uploadedCount} 份</span> 作业，均已上传，支持在线预览与下载。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-navy-100">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '作业总数', value: `${uploadedCount} 份` },
              { label: '已上传', value: `${uploadedCount} 份`, accent: true },
            ].map((stat, i) => (
              <div
                key={i}
                className={`text-center py-4 rounded-xl ${
                  stat.accent
                    ? 'bg-econ-50 border border-econ-200'
                    : 'bg-navy-50 border border-navy-100'
                }`}
              >
                <p
                  className={`text-2xl font-bold ${
                    stat.accent ? 'text-econ-600' : 'text-navy-700'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-navy-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assignments List */}
      <section className="py-12 bg-navy-50">
        <div className="max-w-4xl mx-auto section-padding">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-4"
          >
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
