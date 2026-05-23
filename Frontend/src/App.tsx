import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Main Content Section */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          {/* Hero Images */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <img src={reactLogo} alt="React logo" className="w-24 h-24 hover:scale-110 transition-transform" />
            <img src={viteLogo} alt="Vite logo" className="w-24 h-24 hover:scale-110 transition-transform" />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-white mb-4">Welcome to React + Vite</h1>
          
          {/* Description */}
          <p className="text-lg text-slate-300 mb-8">
            Testing <code className="bg-slate-700 px-2 py-1 rounded text-cyan-400">Tailwind CSS</code> setup
          </p>

          {/* Counter Button */}
          <button
            type="button"
            onClick={() => setCount((count) => count + 1)}
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors mb-12 text-lg"
          >
            Count is {count}
          </button>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Docs Card */}
            <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">Documentation</h2>
              <p className="text-slate-300 mb-4">Your questions, answered</p>
              <div className="space-y-2">
                <a 
                  href="https://vite.dev/" 
                  target="_blank"
                  className="block text-cyan-300 hover:text-cyan-100 underline"
                >
                  → Explore Vite
                </a>
                <a 
                  href="https://react.dev/" 
                  target="_blank"
                  className="block text-cyan-300 hover:text-cyan-100 underline"
                >
                  → Learn React
                </a>
              </div>
            </div>

            {/* Social Card */}
            <div className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors">
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">Connect</h2>
              <p className="text-slate-300 mb-4">Join the community</p>
              <div className="space-y-2">
                <a 
                  href="https://github.com/vitejs/vite" 
                  target="_blank"
                  className="block text-cyan-300 hover:text-cyan-100 underline"
                >
                  → GitHub
                </a>
                <a 
                  href="https://chat.vite.dev/" 
                  target="_blank"
                  className="block text-cyan-300 hover:text-cyan-100 underline"
                >
                  → Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
