import { Link } from 'react-router-dom'
import reactLogo from '../assets/react.svg'
import useStore from '../store/useStore.ts'

export default function Home() {
  const userId = useStore((s) => s.userId)
  const storedUserId = localStorage.getItem('userId')
  const isLoggedIn = userId || storedUserId

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-3xl text-center px-6">
        <img src={reactLogo} alt="logo" className="mx-auto w-24 h-24 mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">MaatramMark AI</h1>
        <p className="text-slate-300 mb-8">AI-powered content generator for local businesses — strategy, creative, images, and feedback learning.</p>

        <div className="flex justify-center gap-4">
          <Link 
            to={isLoggedIn ? '/app' : '/login'} 
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
          >
            {isLoggedIn ? 'Open App' : 'Get Started'}
          </Link>
          <a href="https://github.com/Rahul-8283/MaatramMark_AI" target="_blank" rel="noreferrer" className="px-6 py-3 border border-slate-600 text-slate-200 rounded-lg hover:border-slate-400">
            Repository
          </a>
        </div>

        <div className="mt-8 text-slate-400">
          <h3 className="font-semibold text-white mb-2">What we do</h3>
          <ul className="list-disc list-inside text-left max-w-xl mx-auto space-y-1">
            <li>Auto-detects local trends & festival context</li>
            <li>Runs LLM agents to produce strategy, research and branding</li>
            <li>Generates & refines social media posters & logos</li>
            <li>Stores content & analytics in Supabase for continual learning</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
