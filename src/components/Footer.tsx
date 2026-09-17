import { Link } from 'react-router'
import { Microscope, ExternalLink } from 'lucide-react'

const footerLinks = [
  {
    title: '快速导航',
    links: [
      { label: '首页', path: '/' },
      { label: '关于我们', path: '/about' },
      { label: '设备资产', path: '/equipment' },
      { label: '研究方向', path: '/research' },
      { label: '经济分析工具', path: '/econ-tools' },
      { label: '设备投资分析', path: '/sam-investment' },
      { label: '学术成果', path: '/publications' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-navy-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto section-padding py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-econ-400 to-econ-300 flex items-center justify-center">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">FA虚拟实验室</h3>
                <p className="text-navy-300 text-xs">Virtual Failure Analysis Laboratory</p>
              </div>
            </div>
            <p className="text-sm text-navy-300 leading-relaxed">
              工程经济学 · 虚拟仿真课程项目
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-navy-300 hover:text-econ-300 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3 opacity-50" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-700">
        <div className="max-w-7xl mx-auto section-padding py-4 flex items-center justify-center">
          <p className="text-xs text-navy-400">
            © 2026 FA虚拟实验室 · 工程经济学课程项目
          </p>
        </div>
      </div>
    </footer>
  )
}
