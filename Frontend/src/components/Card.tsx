type Props = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-slate-700 rounded-lg p-4 shadow-sm ${className}`}>{children}</div>
  )
}
