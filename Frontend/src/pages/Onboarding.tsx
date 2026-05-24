import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.tsx'
import Card from '../components/Card.tsx'
import Loading from '../components/Loading.tsx'
import api from '../lib/api.ts'
import useStore from '../store/useStore.ts'

export default function Onboarding() {
  const navigate = useNavigate()
  const userId = useStore((s) => s.userId)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Setup Your Business</h1>
        <p className="text-slate-400 text-center mb-6">Step {step} of 2</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Sweet Crumbs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Bakery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Chennai, India"
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Setting up...' : 'Continue'}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <Loading />
            <p className="text-slate-300">AI is analyzing your business...</p>
            <p className="text-slate-400 text-sm mt-2">Running strategy, research & branding agents</p>
          </div>
        )}
      </Card>
    </div>
  )
}
