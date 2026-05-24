type Props = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-[#121212]/40 backdrop-blur-xl border border-slate-800/60 rounded-xl p-8 shadow-2xl ${className}`}>
      {children}
    </div>
  )
}
