import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import api from '../lib/api.ts'
import { HelpCircle, Target, Smartphone, Award, Star, Palette, Check, Send, Sparkles } from 'lucide-react'

// Step Indicator
function StepIndicator({ steps, currentStep }: { steps: string[], currentStep: number }) {
	return (
		<div className="flex items-center justify-center gap-2 mb-12">
			{steps.map((_step, idx) => (
				<div key={idx} className="flex items-center">
					<div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
						idx < currentStep 
							? 'bg-[#c5a880] text-black shadow-lg shadow-[#c5a880]/20' 
							: idx === currentStep 
							? 'bg-[#c5a880] text-black ring-4 ring-[#c5a880]/20 shadow-lg shadow-[#c5a880]/30' 
							: 'bg-slate-700 text-slate-400'
					}`}>
						{idx + 1}
					</div>
					{idx < steps.length - 1 && (
						<div className={`w-12 h-1 mx-2 rounded-full transition-colors ${
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

	// Refine step
	const [refinementPrompt, setRefinementPrompt] = useState('')
	const [refinementHistory, setRefinementHistory] = useState<string[]>([])

	// Confirm step
	const [postType, setPostType] = useState<'poster' | 'logo'>('poster')

	// Feedback step
	const [rating, setRating] = useState(5)
	const [feedbackText, setFeedbackText] = useState('')

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
				user_id: userId || storedUserId,
				concept: concept,
				refinement: refinementPrompt,
			})
			setGeneratedImage(response.data.image_data || '')
			setImageUrl(response.data.image_url || '')
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
			await api.post(endpoint, {
				user_id: userId || storedUserId,
				image_url: imageUrl,
			})
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
			await api.post('/submit-feedback', {
				user_id: userId || storedUserId,
				rating: rating,
				feedback: feedbackText,
			})
			// Success - show completion
			setTimeout(() => navigate('/app'), 2000)
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Failed to submit feedback')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container mx-auto px-6 py-12">
			<div className="max-w-4xl mx-auto">
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

								<div className="flex gap-4">
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
					<div className="space-y-8">
						<div className="text-center mb-12">
							<h1 className="text-4xl font-bold text-white mb-3">Share Your Feedback</h1>
							<p className="text-slate-400">Help us improve our image generation</p>
						</div>

						<div className="bg-[#121212]/50 backdrop-blur-xl rounded-md p-8 border border-[#c5a880]/20 space-y-8">
							{/* Rating */}
							<div>
								<label className="block text-lg font-semibold text-white mb-4">How satisfied are you?</label>
								<div className="flex gap-3 justify-center md:justify-start mb-4">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											onClick={() => setRating(star)}
											className="transition-all hover:scale-125 focus:outline-none"
										>
											<Star 
												className={`w-8 h-8 transition-colors ${
													star <= rating 
														? 'fill-yellow-400 text-yellow-400' 
														: 'text-slate-600 hover:text-slate-500'
												}`} 
											/>
										</button>
									))}
								</div>
								<p className="text-sm text-slate-400">
									{rating === 5 && "Excellent! We're thrilled!"}
									{rating === 4 && "Great! Thanks for your feedback"}
									{rating === 3 && "Good! We'll improve"}
									{rating === 2 && "We can do better"}
									{rating === 1 && "We'll work hard to improve"}
								</p>
							</div>

							{/* Feedback Text */}
							<div>
								<label className="block text-lg font-semibold text-white mb-3">Tell us more (optional)</label>
								<textarea
									value={feedbackText}
									onChange={(e) => setFeedbackText(e.target.value)}
									placeholder="What could we improve? What did you love?"
									className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:border-[#c5a880] focus:outline-none focus:ring-2 focus:ring-[#c5a880]/20 transition-all resize-none h-24"
								/>
							</div>

							{/* Submit */}
							<button
								onClick={handleSubmitFeedback}
								disabled={loading}
								className="w-full px-8 py-4 bg-white hover:bg-slate-200 text-black rounded-lg font-bold text-lg transition-all shadow-[0_0_25px_-5px_rgba(197,168,128,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loading ? 'Submitting...' : (
									<span className="flex items-center justify-center gap-2">
										<Send className="w-5 h-5" /> Submit Feedback & Return
									</span>
								)}
							</button>
						</div>

						<div className="text-center">
							<p className="text-slate-400 text-sm">
								Your feedback helps us create better AI-generated content for your business
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
