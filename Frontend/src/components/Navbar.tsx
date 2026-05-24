import { Link } from 'react-router-dom'
import useStore from '../store/useStore'

export default function Navbar() {
  const business = useStore((s) => s.business)

  return (
    <header className="w-full bg-slate-800/60 backdrop-blur sticky top-0 z-40">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold text-white">MaatramMark AI</Link>
          {business?.business_name && (
            <span className="text-slate-300 text-sm">— {business.business_name}</span>
          )}
        </div>

        <nav className="space-x-4">
          <Link to="/app" className="text-slate-200 hover:text-cyan-300">Dashboard</Link>
          <Link to="/app/history" className="text-slate-200 hover:text-cyan-300">History</Link>
        </nav>
      </div>
    </header>
  )
}
