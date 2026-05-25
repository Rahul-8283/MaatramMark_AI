import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.tsx'
import Card from '../components/Card.tsx'
import Loading from '../components/Loading.tsx'
import api from '../lib/api.ts'
import useStore from '../store/useStore.ts'

export default function Onboarding() {
  const navigate = useNavigate()
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId')
  const setBusiness = useStore((s) => s.setBusiness)
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: business info, 2: running agents

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName || !businessType || !location) {
      setError('All fields are required')
      return
    }
    if (!userId) {
      setError('Session lost. Please go back and sign up again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Call /onboard-business endpoint
      await api.post('/onboard-business', {
        user_id: userId,
        business_name: businessName,
        business_type: businessType,
        location,
      })

      setBusiness({
        business_name: businessName,
        business_type: businessType,
        location,
      })

      setStep(2)
      await runInitialAgents()
    } catch (err: any) {
      setError(err?.message || 'Onboarding failed')
      setLoading(false)
    }
  }

  const runInitialAgents = async () => {
    try {
      // Call /run-initial-agents endpoint
      await api.post('/run-initial-agents', {
        user_id: userId,
      })

      // Redirect to dashboard after agents run
      navigate('/app')
    } catch (err: any) {
      setError(err?.message || 'Failed to run agents')
      setStep(1)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-200 flex items-center justify-center relative overflow-hidden selection:bg-amber-500/20">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none" />

      <Card className="max-w-md w-full mx-4 relative z-10">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Setup Your Business</h1>
        <p className="text-slate-400 text-center mb-6">Step {step} of 2</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleContinue} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                placeholder="e.g., Sweet Crumbs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                placeholder="e.g., Bakery"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300 ml-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
                placeholder="e.g., Chennai, India"
              />
            </div>

            <Button className="w-full py-3.5 bg-white hover:bg-slate-200 text-black rounded-lg font-bold shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? 'Setting up...' : 'Continue'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <Loading />
            <p className="text-slate-300 font-medium mt-4">AI is analyzing your business...</p>
            <p className="text-slate-400 text-sm mt-2">Running strategy, research & branding agents</p>
          </div>
        )}
      </Card>
    </div>
  )
}
