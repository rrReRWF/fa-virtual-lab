import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Microscope, FlaskConical, BookOpen, Calculator, FileText, TrendingUp, BarChart3, Search } from 'lucide-react'

const navItems = [
  { path: '/', label: '首页', icon: null },
  { path: '/about', label: '关于我们', icon: BookOpen },
  { path: '/equipment', label: '设备资产', icon: Microscope },
  { path: '/research', label: '研究方向', icon: FlaskConical },
  { path: '/vendor-financials', label: '厂商财务', icon: BarChart3 },
  { path: '/econ-tools', label: '经济分析工具', icon: Calculator },
  { path: '/factor-lookup', label: '系数查表', icon: Search },
  { path: '/sam-investment', label: '设备投资分析', icon: TrendingUp },
  { path: '/publications', label: '学术成果', icon: FileText },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-700/95 backdrop-blur-lg shadow-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-econ-400 to-econ-300 flex items-center justify-center shadow-glow-orange group-hover:scale-105 transition-transform">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-bold text-sm lg:text-base leading-tight">
                FA虚拟实验室
              </h1>
              <p className="text-navy-200 text-[10px] lg:text-xs leading-tight">
                Virtual Failure Analysis Lab
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-navy-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-econ-400 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-navy-700/98 backdrop-blur-xl border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-econ-400/20 border border-econ-400/30'
                      : 'text-navy-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
