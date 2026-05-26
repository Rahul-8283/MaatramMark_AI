import { useState, useEffect } from 'react'
import api from '../lib/api.ts'
import useStore from '../store/useStore.ts'
import { Sparkles, Palette, Search, Target, Tag, TrendingUp, Users, Award, Copy, Check, ShieldAlert } from 'lucide-react'

interface StrategyData {
	target_audience: string
	tone: string
	content_style: string
}

interface ResearchData {
	hashtags: string[]
	trends: string[]
	competitors: string[]
}

interface BrandingData {
	colors: {
		primary?: string
		secondary?: string
		accent?: string
		[key: string]: string | undefined
	}
	tagline: string
	personality: string
}

interface AgentResultsResponse {
	strategy: StrategyData | null
	research: ResearchData | null
	branding: BrandingData | null
}

export default function AgentResults() {
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')
	const activeUserId = userId || storedUserId

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [data, setData] = useState<AgentResultsResponse | null>(null)
	const [activeTab, setActiveTab] = useState<'strategy' | 'branding' | 'research'>('strategy')
	const [copiedColor, setCopiedColor] = useState<string | null>(null)

	useEffect(() => {
		const fetchResults = async () => {
			if (!activeUserId) return
			setLoading(true)
			setError('')
			try {
				const response = await api.get(`/agents-results/${activeUserId}`)
				setData(response.data)
			} catch (err: any) {
				console.error('Error fetching agent results:', err)
				setError('Failed to load brand assets. Please ensure initial setup is complete.')
			} finally {
				setLoading(false)
			}
		}

		fetchResults()
	}, [activeUserId])

	const handleCopyColor = (hex: string) => {
		navigator.clipboard.writeText(hex)
		setCopiedColor(hex)
		setTimeout(() => setCopiedColor(null), 2000)
	}

	if (loading) {
		return (
			<div className="bg-[#121212]/30 backdrop-blur-md border border-slate-800/40 rounded-xl p-8 animate-pulse space-y-6">
				<div className="h-8 bg-slate-800/80 rounded w-1/3"></div>
				<div className="grid grid-cols-3 gap-4">
					<div className="h-10 bg-slate-800/50 rounded"></div>
					<div className="h-10 bg-slate-800/50 rounded"></div>
					<div className="h-10 bg-slate-800/50 rounded"></div>
				</div>
				<div className="space-y-4">
					<div className="h-24 bg-slate-800/40 rounded"></div>
					<div className="h-24 bg-slate-800/40 rounded"></div>
				</div>
			</div>
		)
	}

	if (error || !data || (!data.strategy && !data.branding && !data.research)) {
		return (
			<div className="bg-[#121212]/30 backdrop-blur-md border border-amber-900/20 rounded-xl p-8 text-center">
				<ShieldAlert className="w-10 h-10 text-amber-500/80 mx-auto mb-4" />
				<h3 className="text-lg font-bold text-white mb-2">No Brand Blueprint Found</h3>
				<p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
					We haven't generated your AI brand blueprint yet. Run the initial onboarding agents to establish your custom strategy, research, and branding.
				</p>
			</div>
		)
	}

	const hasStrategy = !!data.strategy
	const hasBranding = !!data.branding
	const hasResearch = !!data.research

	return (
		<div className="bg-[#121212]/40 backdrop-blur-xl border border-slate-800/60 rounded-xl overflow-hidden hover:border-[#c5a880]/30 transition-all duration-300 shadow-2xl">
			{/* Header */}
			<div className="bg-amber-950/10 px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-[#c5a880]/10 border border-[#c5a880]/20 flex items-center justify-center text-[#c5a880]">
						<Sparkles className="w-5 h-5 animate-pulse" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-white tracking-wide">Brand Blueprint</h2>
						<p className="text-xs text-slate-400">AI-generated strategy and assets</p>
					</div>
				</div>
			</div>

			{/* Tabs Navigation */}
			<div className="flex border-b border-slate-800/80 bg-black/20">
				{hasStrategy && (
					<button
						onClick={() => setActiveTab('strategy')}
						className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
							activeTab === 'strategy'
								? 'border-[#c5a880] text-white bg-slate-900/30'
								: 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/10'
						}`}
					>
						<Target className="w-4 h-4" />
						Strategy
					</button>
				)}
				{hasBranding && (
					<button
						onClick={() => setActiveTab('branding')}
						className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
							activeTab === 'branding'
								? 'border-[#c5a880] text-white bg-slate-900/30'
								: 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/10'
						}`}
					>
						<Palette className="w-4 h-4" />
						Branding
					</button>
				)}
				{hasResearch && (
					<button
						onClick={() => setActiveTab('research')}
						className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
							activeTab === 'research'
								? 'border-[#c5a880] text-white bg-slate-900/30'
								: 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/10'
						}`}
					>
						<Search className="w-4 h-4" />
						Research
					</button>
				)}
			</div>

			{/* Tab Content */}
			<div className="p-6 md:p-8">
				
				{/* 1. STRATEGY TAB */}
				{activeTab === 'strategy' && data.strategy && (
					<div className="space-y-6 animate-in fade-in duration-300">
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 hover:border-[#c5a880]/20 transition-colors">
								<div className="flex items-center gap-2 mb-3 text-[#c5a880]">
									<Users className="w-5 h-5" />
									<h3 className="font-bold text-white">Target Audience</h3>
								</div>
								<p className="text-slate-300 text-sm leading-relaxed">{data.strategy.target_audience}</p>
							</div>

							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5 hover:border-[#c5a880]/20 transition-colors">
								<div className="flex items-center gap-2 mb-3 text-[#c5a880]">
									<Award className="w-5 h-5" />
									<h3 className="font-bold text-white">Brand Tone</h3>
								</div>
								<p className="text-slate-300 text-sm leading-relaxed">{data.strategy.tone}</p>
							</div>
						</div>

						<div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-6">
							<h3 className="font-bold text-white mb-2 flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-[#c5a880]" />
								Content Style Blueprint
							</h3>
							<p className="text-slate-300 text-sm leading-relaxed">{data.strategy.content_style}</p>
						</div>
					</div>
				)}

				{/* 2. BRANDING TAB */}
				{activeTab === 'branding' && data.branding && (
					<div className="space-y-6 animate-in fade-in duration-300">
						<div className="bg-gradient-to-r from-amber-950/20 to-transparent border border-amber-900/20 rounded-xl p-6 relative overflow-hidden">
							<div className="absolute right-4 top-4 text-[#c5a880]/10 shrink-0 pointer-events-none">
								<Award className="w-24 h-24" />
							</div>
							<h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Tagline</h4>
							<p className="text-2xl font-serif font-medium text-white italic leading-relaxed">
								"{data.branding.tagline}"
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							{/* Personality */}
							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5">
								<h3 className="font-bold text-white mb-3 flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-[#c5a880]" />
									Brand Personality
								</h3>
								<p className="text-slate-300 text-sm leading-relaxed">{data.branding.personality}</p>
							</div>

							{/* Color Swatches */}
							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5">
								<h3 className="font-bold text-white mb-3 flex items-center gap-2">
									<Palette className="w-4 h-4 text-[#c5a880]" />
									Brand Colors
								</h3>
								<div className="grid grid-cols-3 gap-3">
									{Object.entries(data.branding.colors || {}).map(([key, val]) => {
										if (!val) return null
										const hex = val.toUpperCase()
										return (
											<div 
												key={key} 
												onClick={() => handleCopyColor(hex)}
												className="flex flex-col items-center p-2.5 bg-black/35 rounded-lg border border-slate-850 cursor-pointer hover:border-slate-700 transition-colors group relative"
											>
												<div 
													className="w-10 h-10 rounded-full border border-white/10 shadow-inner mb-2 transition-transform group-hover:scale-105"
													style={{ backgroundColor: val }}
												/>
												<span className="text-[10px] text-slate-400 capitalize font-medium mb-0.5">{key}</span>
												<span className="text-xs text-white font-mono flex items-center gap-1 font-bold">
													{hex}
													{copiedColor === hex ? (
														<Check className="w-3 h-3 text-emerald-500 shrink-0" />
													) : (
														<Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
													)}
												</span>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* 3. RESEARCH TAB */}
				{activeTab === 'research' && data.research && (
					<div className="space-y-6 animate-in fade-in duration-300">
						{/* Competitors & Trends Row */}
						<div className="grid md:grid-cols-2 gap-6">
							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5">
								<h3 className="font-bold text-white mb-3 flex items-center gap-2">
									<Users className="w-4 h-4 text-[#c5a880]" />
									Competitors Evaluated
								</h3>
								{data.research.competitors && data.research.competitors.length > 0 ? (
									<ul className="space-y-2">
										{data.research.competitors.map((comp, idx) => (
											<li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
												<span className="text-[#c5a880] mt-1 shrink-0">•</span>
												<span>{comp}</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-slate-500 text-sm italic">No competitors data saved.</p>
								)}
							</div>

							<div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5">
								<h3 className="font-bold text-white mb-3 flex items-center gap-2">
									<TrendingUp className="w-4 h-4 text-[#c5a880]" />
									Marketing Trends
								</h3>
								{data.research.trends && data.research.trends.length > 0 ? (
									<ul className="space-y-2">
										{data.research.trends.map((trend, idx) => (
											<li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
												<span className="text-amber-500 mt-1 shrink-0">→</span>
												<span>{trend}</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-slate-500 text-sm italic">No trends data saved.</p>
								)}
							</div>
						</div>

						{/* Hashtags */}
						<div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-5">
							<h3 className="font-bold text-white mb-3 flex items-center gap-2">
								<Tag className="w-4 h-4 text-[#c5a880]" />
								High-Value Hashtags
							</h3>
							{data.research.hashtags && data.research.hashtags.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{data.research.hashtags.map((tag, idx) => (
										<span 
											key={idx}
											className="px-3 py-1 bg-amber-950/15 border border-amber-900/20 text-[#c5a880] rounded-md text-xs font-semibold hover:border-[#c5a880]/40 transition-colors"
										>
											{tag}
										</span>
									))}
								</div>
							) : (
								<p className="text-slate-500 text-sm italic">No hashtags data saved.</p>
							)}
						</div>
					</div>
				)}

			</div>
		</div>
	)
}
