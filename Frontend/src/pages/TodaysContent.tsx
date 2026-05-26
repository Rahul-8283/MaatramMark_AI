import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import supabase from '../lib/supabaseClient.ts'
import { ArrowLeft, Pin, Sparkles, Video, Image, Check, Copy } from 'lucide-react'

export default function TodaysContent() {
	const navigate = useNavigate()
	const daily = useStore((s) => s.daily)
	const setDaily = useStore((s) => s.setDaily)
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')

	const [loading, setLoading] = useState(!daily)
	const [copiedCaption, setCopiedCaption] = useState<number | null>(null)

	useEffect(() => {
		if (daily) {
			setLoading(false)
			return
		}

		const fetchDaily = async () => {
			const activeId = userId || storedUserId
			if (!activeId) {
				setLoading(false)
				return
			}

			try {
				const { data: dailyData } = await supabase
					.from('daily_content')
					.select('*')
					.eq('user_id', activeId)
					.order('created_at', { ascending: false })
					.limit(1)

				if (dailyData && dailyData.length > 0) {
					setDaily(dailyData[0])
				}
			} catch (err) {
				console.error('Error loading daily content:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchDaily()
	}, [userId, storedUserId, daily, setDaily])

	const handleCopyCaption = (text: string, index: number) => {
		navigator.clipboard.writeText(text)
		setCopiedCaption(index)
		setTimeout(() => setCopiedCaption(null), 2000)
	}

	if (loading) {
		return (
			<div className="container mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[60vh]">
				<div className="animate-spin w-10 h-10 border-4 border-[#c5a880] border-t-transparent rounded-full mb-4" />
				<p className="text-slate-400 text-sm">Retrieving your strategy for today...</p>
			</div>
		)
	}

	if (!daily) {
		return (
			<div className="container mx-auto px-6 py-24 text-center max-w-md">
				<div className="w-16 h-16 rounded-full bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-[#c5a880] mx-auto mb-6">
					<Sparkles className="w-8 h-8" />
				</div>
				<h2 className="text-2xl font-bold text-white mb-2">No Daily Content Ready</h2>
				<p className="text-slate-400 text-sm mb-6">
					You haven't generated daily marketing strategy ideas for today yet.
				</p>
				<button
					onClick={() => navigate('/app')}
					className="px-6 py-3 bg-white hover:bg-slate-200 text-black rounded-lg font-bold transition-all shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)] flex items-center justify-center gap-2 mx-auto"
				>
					<ArrowLeft className="w-4 h-4" /> Go to Dashboard to Generate
				</button>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
					<div>
						<h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Today's Content</h1>
						<p className="text-slate-400">AI-generated strategy for maximum impact</p>
					</div>
					<button
						onClick={() => navigate('/app')}
						className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
					>
						<ArrowLeft className="w-4 h-4" /> Back to Dashboard
					</button>
				</div>

				{/* Context Section */}
				{daily.context && (
					<div className="bg-[#121212]/50 backdrop-blur-md border border-[#c5a880]/30 rounded-lg p-6 mb-8">
						<h2 className="text-xl font-semibold text-[#c5a880] mb-3 flex items-center gap-2">
							<Pin className="w-5 h-5" /> Today's Context
						</h2>
						<p className="text-slate-200 leading-relaxed">{daily.context}</p>
					</div>
				)}

				{/* Ideas Section */}
				{daily.ideas && daily.ideas.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-white mb-4">💡 Content Ideas</h2>
						<div className="grid md:grid-cols-2 gap-4">
							{daily.ideas.map((idea, idx) => (
								<div
									key={idx}
									className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 hover:border-[#c5a880]/40 hover:bg-[#161616]/60 rounded-lg p-5 transition-all group cursor-pointer"
								>
									<div className="w-8 h-8 rounded-md bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-[#c5a880] mb-3">
										<Sparkles className="w-4 h-4" />
									</div>
									<p className="text-slate-200 group-hover:text-white transition-colors">{idea}</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Captions Section */}
				{daily.captions && daily.captions.length > 0 && (
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-white mb-4">📝 Ready-to-Use Captions</h2>
						<div className="space-y-4">
							{daily.captions.map((caption, idx) => (
								<div
									key={idx}
									className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 hover:border-[#c5a880]/40 hover:bg-[#161616]/60 rounded-lg p-5 transition-all group"
								>
									<div className="flex items-start justify-between">
										<p className="text-slate-200 group-hover:text-white transition-colors flex-1">{caption}</p>
										<button
											onClick={() => handleCopyCaption(caption, idx)}
											className={`ml-4 px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
												copiedCaption === idx 
												? 'bg-[#c5a880]/10 text-[#ebdcb9] border border-[#c5a880]/40' 
												: 'bg-amber-950/20 hover:bg-amber-900/30 text-[#c5a880] border border-transparent hover:border-[#c5a880]/30'
											}`}
										>
											{copiedCaption === idx ? 'Copied!' : 'Copy'}
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
						<h2 className="text-xl font-semibold text-white mb-4">🏷️ Recommended Hashtags</h2>
						<div className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 rounded-lg p-6">
							<div className="flex flex-wrap gap-3">
								{daily.hashtags.map((tag, idx) => (
									<button
										key={idx}
										onClick={() => navigator.clipboard.writeText(tag)}
										className="px-4 py-2 bg-amber-950/20 hover:bg-amber-900/30 text-[#c5a880] rounded-md text-sm font-medium transition-colors border border-amber-900/30 hover:border-[#c5a880]/50"
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
				<div className="bg-gradient-to-r from-amber-950/5 to-amber-900/5 backdrop-blur-md rounded-lg p-8 border border-[#c5a880]/20 text-center shadow-lg shadow-[#c5a880]/3">
					<h3 className="text-xl font-bold text-white mb-4">Ready to create content?</h3>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<button
							onClick={() => navigate('/app/generate-images')}
							className="px-8 py-3 bg-white hover:bg-slate-200 text-black rounded-lg font-bold transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] flex items-center justify-center gap-2"
						>
							<Image className="w-5 h-5" /> Generate Images
						</button>
						<button
							onClick={() => navigate('/app/generate-reels')}
							className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
						>
							<Video className="w-5 h-5 text-[#c5a880]" /> Generate Reels
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
