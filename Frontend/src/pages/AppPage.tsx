import { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import api from '../lib/api.ts'
import supabase from '../lib/supabaseClient.ts'
import { ArrowLeft, FileText, Lightbulb, Sparkles, Save, LogOut, Zap, RefreshCw, Video, Image, Briefcase } from 'lucide-react'
import AgentResults from '../components/AgentResults.tsx'

export default function AppPage() {
	return (
		<div className="min-h-screen bg-[#0d0d0d] text-slate-200 relative overflow-hidden selection:bg-amber-500/20">
			{/* Background Glows */}
			<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c5a880]/3 rounded-full blur-[150px] pointer-events-none" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#c5a880]/3 rounded-full blur-[150px] pointer-events-none" />
			<div className="relative z-10">
				<Outlet />
			</div>
		</div>
	)
}

export function AppHome() {
	const business = useStore((s) => s.business)
	const setBusiness = useStore((s) => s.setBusiness)
	const daily = useStore((s) => s.daily)
	const setDaily = useStore((s) => s.setDaily)
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadInitialData = async () => {
			const activeId = userId || storedUserId
			if (!activeId) return

			// 1. Fetch Business Profile
			if (!business) {
				const { data } = await supabase
					.from('business_info')
					.select('*')
					.eq('user_id', activeId)
				
				if (!data || data.length === 0) {
					navigate('/onboarding')
					return
				} else {
					setBusiness(data[0])
				}
			}

			// 2. Fetch Latest Content (so they don't have to regenerate on refresh)
			if (!daily) {
				const { data: dailyData } = await supabase
					.from('daily_content')
					.select('*')
					.eq('user_id', activeId)
					.order('created_at', { ascending: false })
					.limit(1)
				
				if (dailyData && dailyData.length > 0) {
					setDaily(dailyData[0])
				}
			}
		}
		loadInitialData()
	}, [userId, storedUserId, business, daily, navigate, setBusiness, setDaily])

	const handleUpdateDaily = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/update-today', {
				user_id: userId || storedUserId,
			})
			setDaily(response.data)
			navigate('/app/todays-content')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to generate content')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-5xl mx-auto mb-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e] bg-clip-text text-transparent mb-4">
						Welcome, {business?.business_name || 'Creator'}
					</h1>
					<p className="text-xl text-slate-300 max-w-2xl mx-auto">
						Elevate your {business?.business_type || 'business'} presence with AI-powered content tailored for {business?.location || 'your location'}
					</p>
				</div>

				{/* Daily Update Card */}
				<div className="bg-[#121212]/50 backdrop-blur-xl rounded-lg p-8 border border-[#c5a880]/30 shadow-2xl hover:shadow-[#c5a880]/10 hover:border-[#c5a880]/50 transition-all mb-8">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-xl font-semibold text-white mb-2">Daily Content Generation</h2>
							<p className="text-slate-400">Generate fresh ideas, captions & hashtags for today</p>
						</div>
						<div className="text-[#c5a880] bg-amber-950/20 p-3 rounded-lg border border-amber-900/30 shadow-inner">
							<FileText className="w-6 h-6" />
						</div>
					</div>

					{error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200">
							{error}
						</div>
					)}

					{daily ? (
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={() => navigate('/app/todays-content')}
								className="flex-[2] px-8 py-4 bg-gradient-to-r from-white to-slate-200 hover:from-white hover:to-white text-black rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_-5px_rgba(197,168,128,0.4)] flex items-center justify-center gap-3 group"
							>
								<Sparkles className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
								View Today's Strategy
							</button>
							<button
								onClick={handleUpdateDaily}
								disabled={loading}
								className="flex-1 px-8 py-4 bg-[#1a1a1a]/80 hover:bg-[#222222] text-slate-300 hover:text-white border border-slate-800 hover:border-[#c5a880]/50 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
							>
								{loading ? (
									<div className="flex items-center justify-center gap-2">
										<div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full" />
										Wait...
									</div>
								) : (
									<span className="flex items-center gap-2">
										<RefreshCw className="w-4 h-4 text-slate-500 group-hover:text-[#c5a880] group-hover:rotate-180 transition-all duration-500" />
										Regenerate
									</span>
								)}
							</button>
						</div>
					) : (
						<button
							onClick={handleUpdateDaily}
							disabled={loading}
							className="w-full px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
									Generating...
								</div>
							) : (
								<span className="flex items-center gap-2 justify-center">
									<Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
									Update for Today
								</span>
							)}
						</button>
					)}
				</div>

				{/* Quick Actions Grid */}
				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-[#121212]/40 backdrop-blur-md rounded-lg p-6 border border-slate-800/60 hover:border-[#c5a880]/40 hover:bg-[#161616]/60 transition-all hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]">
						<div className="w-10 h-10 rounded-md bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-[#c5a880] mb-3">
							<Lightbulb className="w-5 h-5" />
						</div>
						<h3 className="text-lg font-semibold text-white mb-1">Ideas Ready</h3>
						<p className="text-3xl font-bold text-[#c5a880]">{daily?.ideas?.length || 0}</p>
						<p className="text-sm text-slate-400 mt-2">Unique concepts</p>
					</div>

					<button 
						onClick={() => navigate('/app/assets')}
						className="text-left bg-[#121212]/40 backdrop-blur-md rounded-lg p-6 border border-[#c5a880]/30 hover:border-[#c5a880] hover:bg-[#161616]/80 transition-all hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.5)] group block w-full"
					>
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 rounded-md bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#c5a880] group-hover:scale-110 transition-transform">
								<Briefcase className="w-5 h-5" />
							</div>
							<div className="px-3 py-1 bg-[#c5a880]/20 text-[#c5a880] text-xs font-bold rounded-md border border-[#c5a880]/30">
								Gallery
							</div>
						</div>
						<h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#c5a880] transition-colors">Brand Assets</h3>
						<p className="text-sm text-slate-400 mt-2">View & download your generated logos and posters.</p>
					</button>

					<button 
						onClick={() => navigate('/app/reels-history')}
						className="text-left bg-[#121212]/40 backdrop-blur-md rounded-lg p-6 border border-[#c5a880]/30 hover:border-[#c5a880] hover:bg-[#161616]/80 transition-all hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.5)] group block w-full"
					>
						<div className="flex items-center justify-between mb-3">
							<div className="w-10 h-10 rounded-md bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#c5a880] group-hover:scale-110 transition-transform">
								<Video className="w-5 h-5" />
							</div>
							<div className="px-3 py-1 bg-[#c5a880]/20 text-[#c5a880] text-xs font-bold rounded-md border border-[#c5a880]/30">
								History
							</div>
						</div>
						<h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#c5a880] transition-colors">Reels Scripts</h3>
						<p className="text-sm text-slate-400 mt-2">View your past generated reels & scripts.</p>
					</button>
				</div>

				{/* Agent Results Brand Blueprint */}
				<div className="mt-12">
					<AgentResults />
				</div>

				{/* Action Hub */}
				<div className="mt-12 grid md:grid-cols-2 gap-6">
					
					{/* Image Generation Box */}
					<div className="bg-[#121212]/30 backdrop-blur-md rounded-xl p-8 border border-slate-800/40 hover:border-[#c5a880]/40 transition-all flex flex-col h-full group hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.2)]">
						<div className="w-12 h-12 rounded-full bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#c5a880] mb-5 group-hover:scale-110 transition-transform shadow-inner">
							<Image className="w-6 h-6" />
						</div>
						<h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c5a880] transition-colors">Image & Logo Generation</h3>
						<p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
							Create stunning, brand-aligned visual assets instantly. From promotional posters to elegant logos, let our AI handle your daily design needs seamlessly.
						</p>
						<button
							onClick={() => navigate('/app/generate-images')}
							className="w-full px-6 py-4 bg-[#c5a880] hover:bg-[#ebdcb9] text-black rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)] flex items-center justify-center gap-2"
						>
							<Sparkles className="w-4 h-4" /> Create Visuals & Logos
						</button>
					</div>

					{/* Reels Generation Box */}
					<div className="bg-[#121212]/30 backdrop-blur-md rounded-xl p-8 border border-slate-800/40 hover:border-[#c5a880]/40 transition-all flex flex-col h-full group hover:shadow-[0_10px_30px_-15px_rgba(197,168,128,0.2)]">
						<div className="w-12 h-12 rounded-full bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#c5a880] mb-5 group-hover:scale-110 transition-transform shadow-inner">
							<Video className="w-6 h-6" />
						</div>
						<h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c5a880] transition-colors">Reels Generation</h3>
						<p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
							Produce captivating short-form videos tailored to your audience. Keep your social feeds consistently active with highly engaging AI-generated reels.
						</p>
						<button
							onClick={() => navigate('/app/generate-reels')}
							className="w-full px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
						>
							<Video className="w-4 h-4 text-[#c5a880]" /> Create Reels
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}



export function AppSettings() {
	const business = useStore((s) => s.business)
	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem('userId')
		localStorage.removeItem('business')
		navigate('/login')
	}

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-2xl mx-auto">
				{/* Header with Top-Right Back Link */}
				<div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Settings</h1>
						<p className="text-slate-400">Manage your account and business information</p>
					</div>
					<div className="sm:pt-2">
						<Link to="/app" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
							<span>Back to Workspace</span>
						</Link>
					</div>
				</div>

				{/* Business Info Section */}
				<div className="bg-[#121212]/40 backdrop-blur-xl rounded-lg p-8 border border-slate-800/60 mb-8">
					<h2 className="text-xl font-semibold text-white mb-6">Business Information</h2>
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Business Name</label>
							<input
								type="text"
								defaultValue={business?.business_name || ''}
								className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
								placeholder="Your business name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
							<input
								type="text"
								defaultValue={business?.business_type || ''}
								className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
								placeholder="e.g., Bakery, Technology, Retail"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
							<input
								type="text"
								defaultValue={business?.location || ''}
								className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 transition-all"
								placeholder="City / Region"
							/>
						</div>

						<button className="w-full px-6 py-3 bg-white hover:bg-slate-200 text-black rounded-lg font-bold transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] flex items-center justify-center gap-2">
							<Save className="w-4 h-4" /> Save Changes
						</button>
					</div>
				</div>

				{/* Account Section */}
				<div className="bg-[#121212]/40 backdrop-blur-xl rounded-lg p-8 border border-red-500/20">
					<h2 className="text-xl font-semibold text-white mb-6">Account</h2>
					<div className="space-y-4">
						<p className="text-slate-400 text-sm">
							Logging out will clear your session. You'll need to log in again to access your dashboard.
						</p>
						<button
							onClick={handleLogout}
							className="w-full px-6 py-3 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/40 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
						>
							<LogOut className="w-4 h-4" /> Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
