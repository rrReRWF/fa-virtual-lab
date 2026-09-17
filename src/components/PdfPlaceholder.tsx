import { FileText, AlertCircle } from 'lucide-react'

interface PdfPlaceholderProps {
  title: string
  description?: string
  filename?: string
  className?: string
}

export default function PdfPlaceholder({ title, description, filename, className = '' }: PdfPlaceholderProps) {
  return (
    <div className={`group relative rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/50 hover:bg-navy-50 hover:border-econ-300 transition-all duration-300 p-6 flex flex-col items-center text-center ${className}`}>
      <div className="w-14 h-14 rounded-full bg-navy-100 group-hover:bg-econ-100 flex items-center justify-center mb-3 transition-colors">
        <FileText className="w-7 h-7 text-navy-500 group-hover:text-econ-500 transition-colors" />
      </div>
      <h4 className="text-navy-700 font-semibold text-sm mb-1">{title}</h4>
      {description && (
        <p className="text-navy-400 text-xs mb-3">{description}</p>
      )}
      {filename && (
        <p className="text-navy-300 text-xs mb-3 font-mono bg-navy-100 px-2 py-1 rounded">
          {filename}
        </p>
      )}
      <div className="flex items-center gap-1.5 text-econ-500 text-xs font-medium">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>PDF文档占位 · 待上传</span>
      </div>
      <div className="mt-3 w-full h-1 bg-navy-200 rounded-full overflow-hidden">
        <div className="h-full w-0 bg-econ-400 rounded-full group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  )
}
