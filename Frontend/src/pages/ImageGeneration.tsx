import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import api from '../lib/api.ts'
import { HelpCircle, Target, Smartphone, Award, Palette, Check, Send, Sparkles, ArrowLeft } from 'lucide-react'

// Step Indicator
function StepIndicator({ steps, currentStep }: { steps: string[], currentStep: number }) {
	return (
		<div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 md:mb-12 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
			{steps.map((_step, idx) => (
				<div key={idx} className="flex items-center shrink-0">
					<div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-all ${
						idx < currentStep 
							? 'bg-[#c5a880] text-black shadow-lg shadow-[#c5a880]/20' 
							: idx === currentStep 
							? 'bg-[#c5a880] text-black ring-2 md:ring-4 ring-[#c5a880]/20 shadow-lg shadow-[#c5a880]/30' 
							: 'bg-slate-700 text-slate-400'
					}`}>
						{idx + 1}
					</div>
					{idx < steps.length - 1 && (
						<div className={`w-4 sm:w-8 md:w-12 h-1 mx-1 sm:mx-2 rounded-full transition-colors ${
							idx < currentStep ? 'bg-[#c5a880]' : 'bg-slate-700'
						}`} />
					)}
				</div>
			))}
		</div>
	)
}

const STEPS = ['Concept', 'Generate', 'Refine', 'Confirm', 'Feedback']

export default function ImageGeneration() {
	const userId = useStore((s) => s.userId)
	const storedUserId = localStorage.getItem('userId')
	const navigate = useNavigate()

	const [step, setStep] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	// Concept step
	const [concept, setConcept] = useState('')
	const [concepts, setConcepts] = useState<string[]>([])

	// Generate step
	const [_generatedImage, setGeneratedImage] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [generationId, setGenerationId] = useState('')

	// Refine step
	const [refinementPrompt, setRefinementPrompt] = useState('')
	const [refinementHistory, setRefinementHistory] = useState<string[]>([])

	// Confirm step
	const [postType, setPostType] = useState<'poster' | 'logo'>('poster')
	const [confirmedPostId, setConfirmedPostId] = useState('')

	// Feedback/Analytics step inputs
	const [likes, setLikes] = useState<number | ''>('')
	const [comments, setComments] = useState<number | ''>('')
	const [shares, setShares] = useState<number | ''>('')
	const [reach, setReach] = useState<number | ''>('')

	const handleGenerateConcept = async () => {
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/generate-image-concept', {
				user_id: userId || storedUserId,
				type: postType
			})
			setConcepts(response.data.concept ? [response.data.concept] : [])
			setStep(1)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to generate concepts')
		} finally {
			setLoading(false)
		}
	}

	const handleSelectConcept = async (selectedConcept: string) => {
		setConcept(selectedConcept)
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/generate-image', {
				user_id: userId || storedUserId,
				prompt: selectedConcept,
				type: postType
			})
			setGeneratedImage(response.data.image_data || '')
			setImageUrl(response.data.image_url || '')
			setGenerationId(response.data.generation_id || '')
			setStep(2)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to generate image')
		} finally {
			setLoading(false)
		}
	}

	const handleRefineImage = async () => {
		if (!refinementPrompt.trim()) {
			setError('Please enter a refinement prompt')
			return
		}
		setLoading(true)
		setError('')
		try {
			const response = await api.post('/refine-image', {
				generation_id: generationId,
				refinement: refinementPrompt,
			})
			setGeneratedImage(response.data.image_data || '')
			setImageUrl(response.data.image_url || '')
			setGenerationId(response.data.generation_id || '')
			setRefinementHistory([...refinementHistory, refinementPrompt])
			setRefinementPrompt('')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to refine image')
		} finally {
			setLoading(false)
		}
	}

	const handleProceedToConfirm = () => {
		if (!imageUrl) {
			setError('No image generated yet')
			return
		}
		setStep(3)
	}

	const handleConfirmPost = async () => {
		setLoading(true)
		setError('')
		try {
			const endpoint = postType === 'poster' ? '/confirm-poster' : '/confirm-logo'
			const response = await api.post(endpoint, {
				generation_id: generationId,
				caption: concept,
			})
			if (response.data && response.data.post_id) {
				setConfirmedPostId(response.data.post_id)
			}
			setStep(4)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to confirm post')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmitFeedback = async () => {
		setLoading(true)
		setError('')
		try {
			if (postType === 'poster' && confirmedPostId) {
				await api.post('/submit-feedback', {
					post_id: String(confirmedPostId),
					likes: Number(likes) || 0,
					comments: Number(comments) || 0,
					shares: Number(shares) || 0,
					reach: Number(reach) || 0
				})
			}
			navigate('/app')
		} catch (err: any) {
			setError(err?.response?.data?.detail || err?.message || 'Failed to submit feedback')
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

				<StepIndicator steps={STEPS} currentStep={step} />

				{error && (
					<div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 mb-8 text-red-200">
						{error}
					</div>
				)}

				{/* Step 0: Concept Selection */}
				{step === 0 && (
					<div className="space-y-8">
						<div className="text-center mb-12">
							<h1 className="text-4xl font-bold text-white mb-3">Create Visual Content</h1>
							<p className="text-slate-400 max-w-2xl mx-auto">
								Let AI generate stunning visuals tailored to your business
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6 mb-8">
							<button
								onClick={() => setPostType('poster')}
								className={`p-6 rounded-md border-2 transition-all ${
									postType === 'poster'
										? 'border-[#c5a880] bg-[#c5a880]/5 shadow-lg shadow-[#c5a880]/10'
										: 'border-slate-800 bg-[#121212]/40 backdrop-blur-md hover:border-slate-700'
								}`}
							>
								<div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 mx-auto">
									<Smartphone className="w-6 h-6" />
								</div>
								<h3 className="text-lg font-semibold text-white mb-1">Social Media Poster</h3>
								<p className="text-slate-400 text-sm">Share on Instagram, Facebook, etc.</p>
							</button>

							<button
								onClick={() => setPostType('logo')}
								className={`p-6 rounded-md border-2 transition-all ${
									postType === 'logo'
										? 'border-[#c5a880] bg-[#c5a880]/5 shadow-lg shadow-[#c5a880]/10'
										: 'border-slate-800 bg-[#121212]/40 backdrop-blur-md hover:border-slate-700'
								}`}
							>
								<div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white mb-4 mx-auto">
									<Award className="w-6 h-6" />
								</div>
								<h3 className="text-lg font-semibold text-white mb-1">Business Logo</h3>
								<p className="text-slate-400 text-sm">Use for branding & promotions</p>
							</button>
						</div>

						<button
							onClick={handleGenerateConcept}
							disabled={loading}
							className="w-full px-8 py-6 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="flex items-center justify-center gap-3">
									<div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full" />
									Generating Concepts...
								</div>
							) : (
								<span className="flex items-center justify-center gap-2">
									<Palette className="w-5 h-5" /> Generate Image Concepts
								</span>
							)}
						</button>

						<div className="bg-[#121212]/30 backdrop-blur-md rounded-lg p-6 border border-slate-800/40">
							<h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
								<HelpCircle className="w-5 h-5 text-[#c5a880]" />
								How it works
							</h3>
							<ul className="space-y-2 text-slate-300 text-sm">
								<li>✓ AI analyzes your business and daily content</li>
								<li>✓ Generates multiple visual concepts</li>
								<li>✓ Creates polished images ready to post</li>
								<li>✓ Refine until you love it</li>
							</ul>
						</div>
					</div>
				)}

				{/* Step 1: Concept Selection */}
				{step === 1 && concepts.length > 0 && (
					<div className="space-y-8">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-white mb-2">Choose Your Concept</h2>
							<p className="text-slate-400">Select a concept to bring to life</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							{concepts.map((c, idx) => (
								<button
									key={idx}
									onClick={() => handleSelectConcept(c)}
									disabled={loading}
									className="text-left p-6 bg-[#121212]/40 backdrop-blur-md rounded-lg border border-slate-800/60 hover:border-[#c5a880]/50 hover:bg-[#161616]/60 transition-all hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed group"
								>
									<div className="w-10 h-10 rounded-md bg-amber-950/20 border border-amber-900/30 flex items-center justify-center text-[#c5a880] mb-3">
										<Target className="w-5 h-5" />
									</div>
									<p className="text-slate-200 group-hover:text-white transition-colors leading-relaxed">
										{c}
									</p>
								</button>
							))}
						</div>
					</div>
				)}

				{/* Step 2: Image Generation & Refinement */}
				{step === 2 && (
					<div className="space-y-8">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-white mb-2">Refine Your Image</h2>
							<p className="text-slate-400">Describe what you'd like to change</p>
						</div>

						{/* Image Preview */}
						<div className="bg-[#121212]/50 backdrop-blur-xl rounded-lg p-8 border border-[#c5a880]/20">
							<div className="mb-6">
								<p className="text-sm text-slate-400 mb-3">Current Image</p>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt="Generated"
										className="w-full h-96 object-cover rounded-lg border border-slate-700 shadow-lg"
									/>
								) : (
									<div className="w-full h-96 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
										<div className="text-slate-500">Image will appear here</div>
									</div>
								)}
							</div>

							{/* Refinement History */}
							{refinementHistory.length > 0 && (
								<div className="mb-6">
									<p className="text-sm text-slate-400 mb-3">Refinements Applied</p>
									<div className="space-y-2">
										{refinementHistory.map((h, idx) => (
											<div key={idx} className="bg-slate-900/50 rounded-md p-3 text-slate-300 text-sm border border-slate-700/50">
												✓ {h}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Refinement Input */}
							<div className="space-y-4">
								<textarea
									value={refinementPrompt}
									onChange={(e) => setRefinementPrompt(e.target.value)}
									placeholder="e.g., Make it brighter, add more colors, change the background..."
									className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all resize-none h-20"
								/>

								<div className="flex flex-col sm:flex-row gap-4">
									<button
										onClick={handleRefineImage}
										disabled={loading || !refinementPrompt.trim()}
										className="flex-1 px-6 py-3 bg-white hover:bg-slate-200 text-black rounded-md font-bold transition-all shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{loading ? 'Refining...' : (
											<span className="flex items-center justify-center gap-2">
												<Sparkles className="w-4 h-4" /> Apply Refinement
											</span>
										)}
									</button>
									<button
										onClick={handleProceedToConfirm}
										disabled={loading}
										className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-md font-semibold transition-all"
									>
										→ Next
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Step 3: Post Confirmation */}
				{step === 3 && (
					<div className="space-y-8">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-white mb-2">Ready to Post?</h2>
							<p className="text-slate-400">Select what type of image this is</p>
						</div>

						{/* Image Preview */}
						<div className="bg-[#121212]/50 backdrop-blur-xl rounded-md p-8 border border-[#c5a880]/20 mb-8">
							{imageUrl && (
								<img
									src={imageUrl}
									alt="Final"
									className="w-full h-96 object-cover rounded-md border border-slate-700 shadow-lg"
								/>
							)}
						</div>

						<button
							onClick={handleConfirmPost}
							disabled={loading}
							className="w-full px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-md font-bold text-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loading ? 'Confirming...' : (
								<span className="flex items-center justify-center gap-2">
									<Check className="w-5 h-5 text-emerald-500" /> Confirm & Continue
								</span>
							)}
						</button>
					</div>
				)}

				{/* Step 4: Feedback */}
				{step === 4 && (
					<div className="space-y-8 animate-in fade-in duration-300">
						<div className="text-center mb-8">
							<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Post Performance Analytics</h1>
							<p className="text-slate-400 max-w-lg mx-auto">
								Enter your post's metrics to run AI analysis and automatically optimize future branding strategies
							</p>
						</div>

						<div className="bg-[#121212]/50 backdrop-blur-xl rounded-xl p-8 border border-[#c5a880]/30 space-y-6 shadow-2xl">
							{postType === 'logo' ? (
								<div className="text-center py-6">
									<p className="text-slate-300 mb-6">
										Since this is a business logo, social media performance tracking is not required. You can complete the process now.
									</p>
									<button
										onClick={() => navigate('/app')}
										className="w-full px-6 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold transition-all shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)]"
									>
										Finish & Return to Dashboard
									</button>
								</div>
							) : (
								<>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-semibold text-slate-300 mb-2 ml-1">Likes</label>
											<input
												type="number"
												min="0"
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
												value={reach}
												onChange={(e) => setReach(e.target.value === '' ? '' : Number(e.target.value))}
												placeholder="0"
												className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all text-sm"
											/>
										</div>
									</div>

									<div className="flex flex-col sm:flex-row gap-4 pt-4">
										<button
											onClick={handleSubmitFeedback}
											disabled={loading}
											className="flex-1 px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-base transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											{loading ? 'Submitting...' : (
												<span className="flex items-center justify-center gap-2">
													<Send className="w-5 h-5" /> Submit Analytics
												</span>
											)}
										</button>
										<button
											onClick={() => navigate('/app')}
											disabled={loading}
											className="flex-1 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg font-semibold text-base transition-all"
										>
											Skip
										</button>
									</div>
								</>
							)}
						</div>

						<div className="text-center">
							<p className="text-slate-400 text-sm">
								Your real-world metrics train the AI model to suggest even higher-converting content and ideal times
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
