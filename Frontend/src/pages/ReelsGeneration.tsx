import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import api from '../lib/api.ts'
import { Video, Music, Camera, PenTool, Hash, Copy, Check, Sparkles, ArrowLeft, Clapperboard } from 'lucide-react'

// Interfaces mapping to the backend JSON
interface ReelIdea {
	idea: string
	script: string
	camera: string
	music: string
	hook: string
}

interface ReelsResponse {
	reel_ideas: ReelIdea[]
	captions: string[]
	hashtags: string[]
}

// ---------------------------------------------------------
// Sub-Components for Clean Code Architecture
// ---------------------------------------------------------

function ReelCard({ reel, index }: { reel: ReelIdea; index: number }) {
	return (
		<div className="bg-[#121212]/40 backdrop-blur-md rounded-xl border border-slate-800/60 overflow-hidden hover:border-[#c5a880]/50 transition-all shadow-lg mb-8">
			{/* Card Header */}
			<div className="bg-amber-950/20 px-6 py-4 border-b border-amber-900/30 flex items-center gap-3">
				<div className="w-8 h-8 rounded-full bg-[#c5a880] text-black font-bold flex items-center justify-center shrink-0">
					{index + 1}
				</div>
				<h3 className="text-xl font-bold text-white">{reel.idea}</h3>
			</div>

			{/* Card Body */}
			<div className="p-6 space-y-6">
				{/* Hook & Music Row */}
				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
						<div className="flex items-center gap-2 mb-2 text-[#c5a880]">
							<Clapperboard className="w-5 h-5" />
							<h4 className="font-semibold">The Hook (First 3s)</h4>
						</div>
						<p className="text-slate-300 text-sm leading-relaxed">{reel.hook}</p>
					</div>

					<div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
						<div className="flex items-center gap-2 mb-2 text-[#c5a880]">
							<Music className="w-5 h-5" />
							<h4 className="font-semibold">Suggested Audio</h4>
						</div>
						<p className="text-slate-300 text-sm leading-relaxed">{reel.music}</p>
					</div>
				</div>

				{/* Camera Angles */}
				<div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
					<div className="flex items-center gap-2 mb-2 text-[#c5a880]">
						<Camera className="w-5 h-5" />
						<h4 className="font-semibold">Visuals & Angles</h4>
					</div>
					<p className="text-slate-300 text-sm leading-relaxed">{reel.camera}</p>
				</div>

				{/* Main Script */}
				<div className="bg-[#1a1a1a]/50 rounded-lg p-5 border border-slate-700/50 shadow-inner">
					<div className="flex items-center gap-2 mb-3 text-white">
						<Video className="w-5 h-5" />
						<h4 className="font-bold text-lg">Action Script</h4>
					</div>
					<div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
						{reel.script}
					</div>
				</div>
			</div>
		</div>
	)
}

function CopyableBlock({ title, items, icon: Icon }: { title: string; items: string[]; icon: any }) {
	const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

	const handleCopy = (text: string, index: number) => {
		navigator.clipboard.writeText(text)
		setCopiedIndex(index)
		setTimeout(() => setCopiedIndex(null), 2000)
	}

	return (
		<div className="bg-[#121212]/40 backdrop-blur-md rounded-xl p-6 border border-slate-800/60 mb-8">
			<div className="flex items-center gap-2 mb-4">
				<Icon className="w-6 h-6 text-[#c5a880]" />
				<h3 className="text-xl font-bold text-white">{title}</h3>
			</div>
			<div className="space-y-3">
				{!items || items.length === 0 ? (
					<p className="text-slate-500 text-sm italic">No items generated.</p>
				) : (
					items.map((item, idx) => (
						<div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
							<p className="text-slate-300 text-sm">{item}</p>
							<button
								onClick={() => handleCopy(item, idx)}
								className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1a1a1a] hover:bg-[#222222] border border-slate-700 hover:border-[#c5a880]/50 text-slate-300 transition-all text-xs font-semibold"
							>
								{copiedIndex === idx ? (
									<><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</>
								) : (
									<><Copy className="w-3.5 h-3.5" /> Copy</>
								)}
							</button>
						</div>
					))
				)}
			</div>
		</div>
	)
}


// ---------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------

export default function ReelsGeneration() {
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [reelsData, setReelsData] = useState<ReelsResponse | null>(null)

	const handleGenerateReels = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/generate-reels', {
				user_id: userId || storedUserId,
			})
			setReelsData(response.data)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to generate reels. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
			<div className="max-w-4xl mx-auto">
				
				{/* Navigation Header */}
				<button 
					onClick={() => navigate('/app')}
					className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
				>
					<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
					Back to Dashboard
				</button>

				{/* Title Section */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-3">Storyboard Studio</h1>
					<p className="text-slate-400 max-w-2xl mx-auto">
						AI-generated scripts, hooks, and directing notes for your next viral Instagram Reels.
					</p>
				</div>

				{/* Error State */}
				{error && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-200">
						{error}
					</div>
				)}

				{/* Initial State / Generation Button */}
				{!reelsData && (
					<div className="bg-[#121212]/30 backdrop-blur-md rounded-xl p-8 border border-slate-800/40 text-center shadow-lg">
						<div className="w-16 h-16 rounded-full bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-[#c5a880] mx-auto mb-6">
							<Video className="w-8 h-8" />
						</div>
						<h2 className="text-2xl font-bold text-white mb-4">Ready to Action?</h2>
						<p className="text-slate-300 mb-8 max-w-lg mx-auto">
							We will instantly draft 3 highly-engaging reel concepts tailored to your brand, including scene-by-scene scripts, camera angles, and trending audio suggestions.
						</p>
						
						<button
							onClick={handleGenerateReels}
							disabled={loading}
							className="w-full md:w-auto px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
						>
							{loading ? (
								<>
									<div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
									Brainstorming Scripts...
								</>
							) : (
								<>
									<Sparkles className="w-5 h-5" /> Draft Reel Storyboards
								</>
							)}
						</button>
					</div>
				)}

				{/* Results State */}
				{reelsData && (
					<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
						
						{/* Top Actions */}
						<div className="flex justify-end">
							<button
								onClick={handleGenerateReels}
								disabled={loading}
								className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm font-semibold transition-all flex items-center gap-2"
							>
								{loading ? (
									<div className="animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full" />
								) : (
									<Sparkles className="w-4 h-4 text-[#c5a880]" />
								)}
								Generate New Ideas
							</button>
						</div>

						{/* Reel Ideas Cards */}
						<div className="space-y-8">
							<h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">
								🎬 Suggested Storyboards
							</h2>
							{reelsData.reel_ideas.map((reel, index) => (
								<ReelCard key={index} reel={reel} index={index} />
							))}
						</div>

						{/* Captions and Hashtags */}
						<div className="grid md:grid-cols-2 gap-8">
							<CopyableBlock 
								title="Suggested Captions" 
								items={reelsData.captions} 
								icon={PenTool} 
							/>
							<CopyableBlock 
								title="Hashtag Clusters" 
								items={reelsData.hashtags} 
								icon={Hash} 
							/>
						</div>
					</div>
				)}

			</div>
		</div>
	)
}
