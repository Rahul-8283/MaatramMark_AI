import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw, AlertCircle, Sparkles, Clock, Calendar, CheckCircle2, Hash } from 'lucide-react'
import api from '../lib/api.ts'
import useStore from '../store/useStore.ts'

interface FeedbackItem {
  user_id: string
  best_content_type: string
  best_time: string
  top_hashtags: string[]
  last_updated: string
}

export default function ViewFeedback() {
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId')
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFeedback = async () => {
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/feedback/${userId}`)
      // Ensure it is mapped as an array
      const data = Array.isArray(response.data) ? response.data : response.data ? [response.data] : []
      setFeedbacks(data)
    } catch (err: any) {
      console.error('Failed to fetch feedback:', err)
      setError('Failed to fetch AI feedback memory. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [userId])

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e] bg-clip-text text-transparent mb-2">
              AI Strategy Feedbacks
            </h1>
            <p className="text-slate-400">View real-time optimization feedbacks analyzed by your AI models.</p>
          </div>
          <div className="sm:pt-2">
            <Link to="/app" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Workspace</span>
            </Link>
          </div>
        </div>

        {/* Outer Box */}
        <div className="bg-[#121212]/40 backdrop-blur-xl rounded-lg p-8 border border-slate-800/60 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c5a880] animate-pulse" /> AI Learning History
            </h2>
            <button 
              onClick={fetchFeedback}
              disabled={loading}
              className="text-sm text-slate-400 hover:text-[#c5a880] flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Feed
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full" />
              <p className="text-slate-400">Querying feedback database...</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 rounded-xl border border-slate-850 border-dashed">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No feedbacks recorded yet</h3>
              <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                Feedbacks are automatically generated when you submit post performance analytics (Likes, Comments, Shares, Reach) from the Assets Gallery.
              </p>
              <div className="mt-6 flex justify-center">
                <Link to="/app/assets" className="px-6 py-2.5 bg-[#c5a880] text-black font-semibold rounded-lg hover:bg-[#ebdcb9] transition-colors text-sm shadow-md">
                  Go to Assets Gallery
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-900/40 border border-[#c5a880]/20 hover:border-[#c5a880]/50 rounded-xl p-6 transition-all hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.25)] flex flex-col gap-5"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-850 pb-3 gap-2">
                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-900/30">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Optimization Blueprint Active
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Last Updated: {new Date(item.last_updated).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Best Content Type</span>
                      <p className="text-slate-200 text-sm leading-relaxed font-medium">
                        {item.best_content_type || 'N/A'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Ideal Posting Time</span>
                      <p className="text-slate-200 text-sm leading-relaxed font-medium">
                        {item.best_time || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {item.top_hashtags && item.top_hashtags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Top Performing Hashtags</span>
                      <div className="flex flex-wrap gap-2">
                        {item.top_hashtags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-2.5 py-1 bg-amber-950/15 border border-amber-900/20 text-[#c5a880] rounded-md text-xs font-semibold flex items-center gap-1 hover:border-[#c5a880]/40 transition-colors"
                          >
                            <Hash className="w-3 h-3 text-[#c5a880]/70" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
