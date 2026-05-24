type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white font-medium ${className}`}
    >
      {children}
    </button>
  )
}
