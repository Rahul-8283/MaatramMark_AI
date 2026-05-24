type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md bg-[#c5a880] hover:bg-[#ebdcb9] text-black font-semibold shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)] ${className}`}
    >
      {children}
    </button>
  )
}
