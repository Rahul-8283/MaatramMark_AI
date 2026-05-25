import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, Loader2, UserPlus } from 'lucide-react'
import supabase from '../lib/supabaseClient.ts'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      // If Supabase gave us a session immediately, they are logged in.
      if (data.session) {
        navigate('/app')
      } else {
        // If there's no session, it means email confirmation is required.
        setIsSubmitted(true)
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err?.message || 'Google Auth failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-200 flex flex-col relative overflow-hidden selection:bg-amber-500/20">
      {/* Background Effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="p-6 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-white mb-2">Create an Account</h1>
            <p className="text-slate-400">Join MaatramMARK and elevate your brand.</p>
          </div>

          {/* Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-xl p-8 shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Check your email</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  We've sent a verification link to <span className="text-white font-medium">{email}</span>. Please click the link to activate your account.
                </p>
                <Link 
                  to="/login"
                  className="inline-flex w-full py-3.5 bg-[#c5a880] hover:bg-[#ebdcb9] text-black rounded-lg font-bold shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] transition-all items-center justify-center"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        passwordRef.current?.focus()
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        confirmPasswordRef.current?.focus()
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    ref={confirmPasswordRef}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-slate-200 text-black rounded-lg font-bold shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin text-slate-600" /> Processing...</> : <><UserPlus className="w-5 h-5" /> Create Account</>}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="h-px bg-slate-800 w-full" />
              <span className="text-slate-500 text-sm">or</span>
              <div className="h-px bg-slate-800 w-full" />
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="mt-6 w-full py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#c5a880] hover:text-[#ebdcb9] font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
