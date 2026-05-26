import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import { supabase } from '../lib/supabaseClient.ts'
import { LogOut, LayoutDashboard, Settings, UserPlus, LogIn, Briefcase, Menu, X } from 'lucide-react'

export default function Navbar() {
  const business = useStore((s) => s.business)
  const userId = useStore((s) => s.userId)
  const storedUserId = localStorage.getItem('userId')
  const isLoggedIn = userId || storedUserId
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close menu when navigation happens
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  // Don't show nav on auth pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return null
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Error logging out of Supabase', e)
    }
    localStorage.removeItem('userId')
    localStorage.clear()
    // Force reload to completely reset global Zustand state and redirect to home
    window.location.href = '/'
  }

  return (
    <header ref={navRef} className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
            Maatram<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c5a880] to-[#ebdcb9]">MARK</span>
          </Link>
          {business?.business_name && (
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-700">
              <span className="text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700/50">
                {business.business_name}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation & Auth */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <nav className="flex items-center gap-4">
              <Link 
                to="/app" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Workspace</span>
              </Link>
              <Link 
                to="/app/assets" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#c5a880] hover:text-[#ebdcb9] hover:bg-[#c5a880]/10 rounded-lg transition-all"
              >
                <Briefcase className="w-4 h-4" />
                <span>Assets</span>
              </Link>
              <Link 
                to="/app/settings" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <div className="w-px h-6 bg-slate-700 mx-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          ) : (
            <nav className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-black bg-white hover:bg-slate-200 rounded-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </Link>
            </nav>
          )}
        </div>

        {/* Mobile Menu Button (3 Bars Hamburger Menu) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#c5a880] hover:text-[#ebdcb9] hover:bg-[#c5a880]/10 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-slate-800/80 px-6 py-4 flex flex-col gap-3 transition-all">
          {business?.business_name && (
            <div className="mb-2 pb-2 border-b border-slate-800">
              <span className="text-slate-400 text-xs bg-slate-800/50 px-3 py-1 rounded-md border border-slate-700/50">
                {business.business_name}
              </span>
            </div>
          )}
          {isLoggedIn ? (
            <>
              <Link 
                to="/app" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Workspace</span>
              </Link>
              <Link 
                to="/app/assets" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-[#c5a880] hover:text-[#ebdcb9] hover:bg-[#c5a880]/10 rounded-lg transition-all"
              >
                <Briefcase className="w-5 h-5" />
                <span>Assets</span>
              </Link>
              <Link 
                to="/app/settings" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <div className="h-px bg-slate-800 my-1"></div>
              <button 
                onClick={() => {
                  handleLogout()
                  handleLinkClick()
                }}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50 rounded-lg transition-all w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
              <Link 
                to="/signup" 
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-black bg-white hover:bg-slate-200 rounded-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)]"
              >
                <UserPlus className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
