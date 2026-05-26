import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c5a880]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#121212]/50 border border-slate-800/60 shadow-2xl backdrop-blur-md relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a880]/20 to-transparent rounded-full animate-pulse" />
          <Compass className="w-12 h-12 text-[#c5a880]" />
        </div>
        
        <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-white mb-4">
          Lost in the Digital Void
        </h2>
        
        <p className="text-slate-400 mb-10 leading-relaxed">
          It looks like the page you are looking for has drifted off into cyberspace. Let's get you back to familiar territory.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-200 text-black font-bold rounded-xl transition-all shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Dashboard
        </Link>
      </div>

    </div>
  );
}
