import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import api from '../lib/api.ts'

export default function AppPage() {
	return (
		<div className="min-h-screen bg-[#0d0d0d] text-slate-200 relative overflow-hidden selection:bg-cyan-500/30">
			{/* Background Glows */}
			<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none" />
			<div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
			<div className="relative z-10">
				<Outlet />
			</div>
		</div>
	)
}

export function AppHome() {
	const business = useStore((s) => s.business)
	const daily = useStore((s) => s.daily)
	const setDaily = useStore((s) => s.setDaily)
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [showContent, setShowContent] = useState(false)

	const handleUpdateDaily = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/update-today', {
				user_id: userId || storedUserId,
			})
			setDaily(response.data)
			setShowContent(true)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to generate content')
		} finally {
			setLoading(false)
		}
	}

	if (showContent && daily) {
		return <DailyContentView daily={daily} onBack={() => setShowContent(false)} />
	}

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-5xl mx-auto mb-12">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
						Welcome, {business?.business_name || 'Creator'}
					</h1>
					<p className="text-xl text-slate-300 max-w-2xl mx-auto">
						Elevate your {business?.business_type || 'business'} presence with AI-powered content tailored for {business?.location || 'your location'}
					</p>
				</div>

				{/* Daily Update Card */}
				<div className="bg-[#121212]/50 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30 shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all mb-8">
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold text-white mb-2">Daily Content Generation</h2>
							<p className="text-slate-400">Generate fresh ideas, captions & hashtags for today</p>
						</div>
						<div className="text-4xl">📝</div>
					</div>

					{error && (
						<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-200">
							{error}
						</div>
					)}

					<button
						onClick={handleUpdateDaily}
						disabled={loading}
						className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
								Generating...
							</div>
						) : (
							'🚀 Update for Today'
						)}
					</button>
				</div>

				{/* Quick Actions Grid */}
				<div className="grid md:grid-cols-3 gap-6">
					<div className="bg-[#121212]/40 backdrop-blur-md rounded-xl p-6 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-[#161616]/60 transition-all hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]">
						<div className="text-3xl mb-3">📊</div>
						<h3 className="text-lg font-semibold text-white mb-1">Content Posts</h3>
						<p className="text-3xl font-bold text-cyan-400">{daily?.ideas?.length || 0}</p>
						<p className="text-sm text-slate-400 mt-2">This month</p>
					</div>

					<div className="bg-[#121212]/40 backdrop-blur-md rounded-xl p-6 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-[#161616]/60 transition-all hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]">
						<div className="text-3xl mb-3">💡</div>
						<h3 className="text-lg font-semibold text-white mb-1">Ideas Ready</h3>
						<p className="text-3xl font-bold text-blue-400">{daily?.ideas?.length || 0}</p>
						<p className="text-sm text-slate-400 mt-2">Unique concepts</p>
					</div>

					<div className="bg-[#121212]/40 backdrop-blur-md rounded-xl p-6 border border-slate-800/60 hover:border-cyan-500/40 hover:bg-[#161616]/60 transition-all hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)]">
						<div className="text-3xl mb-3">🎯</div>
						<h3 className="text-lg font-semibold text-white mb-1">Ready to Post</h3>
						<p className="text-3xl font-bold text-purple-400">0</p>
						<p className="text-sm text-slate-400 mt-2">Images generated</p>
					</div>
				</div>

				{/* Features Section */}
				<div className="mt-12 grid md:grid-cols-2 gap-6">
					<div className="bg-[#121212]/30 backdrop-blur-md rounded-xl p-6 border border-slate-800/40">
						<h3 className="text-lg font-semibold text-white mb-3">✨ Next Steps</h3>
						<ul className="space-y-2 text-slate-300 text-sm mb-4">
							<li>✓ Generate today's content ideas</li>
							<li>✓ Review & refine captions</li>
							<li>✓ Create stunning visuals</li>
							<li>✓ Post to social media</li>
						</ul>
						<button
							onClick={() => navigate('/app/generate-images')}
							className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg"
						>
							🎨 Generate Visuals
						</button>
					</div>

					<div className="bg-[#121212]/30 backdrop-blur-md rounded-xl p-6 border border-slate-800/40">
						<h3 className="text-lg font-semibold text-white mb-3">🔥 Pro Tip</h3>
						<p className="text-slate-300 text-sm">
							Generate content daily to maintain consistency and boost your engagement. Our AI learns from your business to create better content over time.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

interface DailyContent {
	date?: string
	context?: string
	ideas?: string[]
	captions?: string[]
	hashtags?: string[]
}

function DailyContentView({ daily, onBack }: { daily: DailyContent, onBack: () => void }) {
	const navigate = useNavigate()

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-4xl font-bold text-white mb-2">Today's Content</h1>
						<p className="text-slate-400">AI-generated strategy for maximum impact</p>
					</div>
					<button
						onClick={onBack}
						className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
					>
						← Back
					</button>
				</div>

				{/* Context Section */}
				{daily.context && (
					<div className="bg-[#121212]/50 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 mb-8">
						<h2 className="text-xl font-semibold text-cyan-400 mb-3">📌 Today's Context</h2>
						<p className="text-slate-200 leading-relaxed">{daily.context}</p>
					</div>
				)}

				{/* Ideas Section */}
				{daily.ideas && daily.ideas.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-white mb-4">💡 Content Ideas</h2>
						<div className="grid md:grid-cols-2 gap-4">
							{daily.ideas.map((idea, idx) => (
								<div
									key={idx}
									className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 hover:border-cyan-500/40 hover:bg-[#161616]/60 rounded-xl p-5 transition-all group cursor-pointer"
								>
									<div className="text-3xl mb-3">✨</div>
									<p className="text-slate-200 group-hover:text-white transition-colors">{idea}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Captions Section */}
				{daily.captions && daily.captions.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-white mb-4">📝 Ready-to-Use Captions</h2>
						<div className="space-y-4">
							{daily.captions.map((caption, idx) => (
								<div
									key={idx}
									className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 hover:border-blue-500/40 hover:bg-[#161616]/60 rounded-xl p-5 transition-all group"
								>
									<div className="flex items-start justify-between">
										<p className="text-slate-200 group-hover:text-white transition-colors flex-1">{caption}</p>
										<button
											onClick={() => navigator.clipboard.writeText(caption)}
											className="ml-4 px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 rounded text-xs font-medium transition-colors whitespace-nowrap"
										>
											Copy
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Hashtags Section */}
				{daily.hashtags && daily.hashtags.length > 0 && (
					<div className="mb-8">
						<h2 className="text-2xl font-bold text-white mb-4">🏷️ Recommended Hashtags</h2>
						<div className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 rounded-xl p-6">
							<div className="flex flex-wrap gap-3">
								{daily.hashtags.map((tag, idx) => (
									<button
										key={idx}
										onClick={() => navigator.clipboard.writeText(tag)}
										className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 text-purple-300 rounded-full text-sm font-medium transition-colors border border-purple-500/30 hover:border-purple-500/60"
									>
										{tag}
									</button>
								))}
							</div>
							<p className="text-sm text-slate-400 mt-4">Click any hashtag to copy</p>
						</div>
					</div>
				)}

				{/* CTA Section */}
				<div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md rounded-xl p-8 border border-cyan-500/30 text-center shadow-lg shadow-cyan-500/5">
					<h3 className="text-xl font-bold text-white mb-4">Ready to create visuals?</h3>
					<button
						onClick={() => navigate('/app/generate-images')}
						className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-cyan-500/50"
					>
						Generate Images →
					</button>
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
				{/* Header */}
				<div className="mb-12">
					<h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
					<p className="text-slate-400">Manage your account and business information</p>
				</div>

				{/* Business Info Section */}
				<div className="bg-[#121212]/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/60 mb-8">
					<h2 className="text-2xl font-semibold text-white mb-6">Business Information</h2>
					<div className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Business Name</label>
							<input
								type="text"
								defaultValue={business?.business_name || ''}
								className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
								placeholder="Your business name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
							<select className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all">
								<option>Select type</option>
								<option selected={business?.business_type === 'Retail'}>🏪 Retail</option>
								<option selected={business?.business_type === 'Food'}>🍽️ Food & Beverage</option>
								<option selected={business?.business_type === 'Services'}>💼 Services</option>
								<option selected={business?.business_type === 'Technology'}>💻 Technology</option>
								<option selected={business?.business_type === 'Health'}>⚕️ Health & Wellness</option>
								<option selected={business?.business_type === 'Entertainment'}>🎭 Entertainment</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
							<input
								type="text"
								defaultValue={business?.location || ''}
								className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
								placeholder="City / Region"
							/>
						</div>

						<button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-cyan-500/50">
							💾 Save Changes
						</button>
					</div>
				</div>

				{/* Account Section */}
				<div className="bg-[#121212]/40 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20">
					<h2 className="text-2xl font-semibold text-white mb-6">Account</h2>
					<div className="space-y-4">
						<p className="text-slate-400 text-sm">
							Logging out will clear your session. You'll need to log in again to access your dashboard.
						</p>
						<button
							onClick={handleLogout}
							className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-red-500/30"
						>
							🚪 Logout
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
