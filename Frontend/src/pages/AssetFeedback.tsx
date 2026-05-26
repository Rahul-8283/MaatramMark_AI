import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, Loader2, Check, AlertCircle } from 'lucide-react'
import supabase from '../lib/supabaseClient.ts'
import api from '../lib/api.ts'

export default function AssetFeedback() {
  const [searchParams] = useSearchParams()
  const postId = searchParams.get('post_id')
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [postData, setPostData] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Analytics states
  const [likes, setLikes] = useState<number | ''>('')
  const [comments, setComments] = useState<number | ''>('')
  const [shares, setShares] = useState<number | ''>('')
  const [reach, setReach] = useState<number | ''>('')

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postId) {
        setError('No post selected.')
        setFetching(false)
        return
      }
      try {
        const { data, error: sbError } = await supabase
          .from('posts')
          .select('*')
          .eq('post_id', postId)
          .single()

        if (sbError) throw sbError
        setPostData(data)
      } catch (err: any) {
        console.error('Error fetching post:', err)
        setError('Failed to load post details. Please verify the URL.')
      } finally {
        setFetching(false)
      }
    }

    fetchPostDetails()
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postId) return

    setLoading(true)
    setError('')
    try {
      await api.post('/submit-feedback', {
        post_id: String(postId),
        likes: Number(likes) || 0,
        comments: Number(comments) || 0,
        shares: Number(shares) || 0,
        reach: Number(reach) || 0
      })
      setSuccess(true)
      setTimeout(() => {
        navigate('/app/assets')
      }, 2000)
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to submit analytics feedback.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-[#c5a880]" />
        <p className="text-slate-400 font-medium">Loading post details...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-12 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link 
          to="/app/assets" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Gallery</span>
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e] bg-clip-text text-transparent mb-2">
            Post Analytics Feedback
          </h1>
          <p className="text-slate-400">
            Submit social media metrics to train your AI brand strategy model
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 text-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8 text-emerald-200 flex items-center gap-3">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p>Analytics feedback submitted successfully! Redirecting to gallery...</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Post Preview Box */}
          <div className="bg-[#121212]/40 backdrop-blur-xl border border-slate-800/60 rounded-xl p-6 flex flex-col gap-4 shadow-xl">
            <h2 className="text-lg font-semibold text-white">Poster Selected</h2>
            {postData?.image_url && (
              <img 
                src={postData.image_url} 
                alt="Selected post" 
                className="w-full h-80 object-cover rounded-lg border border-slate-700 shadow-md"
              />
            )}
            {postData?.caption && (
              <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block mb-1">Caption</span>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-4" title={postData.caption}>
                  {postData.caption}
                </p>
              </div>
            )}
          </div>

          {/* Metrics Form Box */}
          <div className="bg-[#121212]/40 backdrop-blur-xl border border-[#c5a880]/30 hover:border-[#c5a880]/60 transition-colors rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-6">Enter Performance Metrics</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 ml-1">Likes</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={likes}
                      onChange={(e) => setLikes(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 ml-1">Comments</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={comments}
                      onChange={(e) => setComments(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 ml-1">Shares</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={shares}
                      onChange={(e) => setShares(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 ml-1">Reach</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={reach}
                      onChange={(e) => setReach(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full mt-6 px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-base transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit to AI Model
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By submitting, the AI marketing analyst processes this poster's design parameters, caption keywords, and metrics to optimize future blueprint templates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
