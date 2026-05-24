import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-slate-800/50 pt-16 pb-8 px-6 mt-12 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c5a880] to-[#ebdcb9]">
              MaatramMARK
            </span>
          </h2>
          <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
            Autonomous AI-powered content generator for local businesses. Strategize, create, and optimize your brand presence seamlessly.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/Rahul-8283/MaatramMark_AI" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ebdcb9] hover:border-[#c5a880]/50 hover:bg-slate-800 transition-all shadow-lg hover:shadow-[#c5a880]/20">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ebdcb9] hover:border-[#c5a880]/50 hover:bg-slate-800 transition-all shadow-lg hover:shadow-[#c5a880]/20">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#ebdcb9] hover:border-[#c5a880]/50 hover:bg-slate-800 transition-all shadow-lg hover:shadow-[#c5a880]/20">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
          <ul className="space-y-3 text-slate-400">
            <li><a href="#features" className="hover:text-[#ebdcb9] transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-[#ebdcb9] transition-colors">How it Works</a></li>
            <li><Link to="/app" className="hover:text-[#ebdcb9] transition-colors">Workspace</Link></li>
            <li><Link to="/login" className="hover:text-[#ebdcb9] transition-colors">Login / Signup</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-3 text-slate-400">
            <li><a href="#" className="hover:text-[#ebdcb9] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#ebdcb9] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[#ebdcb9] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#ebdcb9] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} MaatramMARK. All rights reserved.</p>
        <p className="flex items-center gap-1">Crafted with <span className="text-[#ebdcb9] font-semibold">precision</span> by <span className="bg-gradient-to-r from-[#c5a880] to-[#ebdcb9] bg-clip-text text-transparent font-bold">Team MaatramMARK</span></p>
      </div>
    </footer>
  )
}
