import { Link } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import { motion, type Variants } from 'framer-motion'
// import { Sparkles, ArrowRight } from 'lucide-react'
import { Sparkles, BrainCircuit, Image as ImageIcon, LineChart, ArrowRight, Zap, RefreshCw, BarChart, Compass, Film, Cpu, Target } from 'lucide-react'
import Footer from '../components/Footer.tsx'

export default function Home() {
  const userId = useStore((s) => s.userId)
  const storedUserId = localStorage.getItem('userId')
  const isLoggedIn = userId || storedUserId

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-slate-200 overflow-hidden relative selection:bg-amber-500/20">
      <div className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-screen -mt-20 flex flex-col items-center justify-center px-6 pt-20 pb-20 overflow-hidden bg-[#0d0d0d]">
          {/* Stripe Background Layer (exact pattern from photo, at 135deg angle) */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #333333 0%, #333333 31.2%, #000000 31.2%, #000000 40.2%, #1a1a1a 40.2%, #1a1a1a 49.2%, #000000 49.2%, #000000 49.7%, #333333 49.7%, #333333 58.8%, #4d4d4d 58.8%, #4d4d4d 67.8%, #000000 67.8%, #000000 68.3%, #333333 68.3%, #333333 100%)',
            }}
          />
          {/* Soft Spotlight Radial Overlay to give depth and rich texture */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(13, 13, 13, 0.15) 0%, rgba(13, 13, 13, 0.85) 100%)',
            }}
          />
          {/* Subtle Glow Effects inside Hero */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c5a880]/5 rounded-full blur-[120px] pointer-events-none z-0" />

          {/* Fade out transition at the bottom to blend with the rest of the dark page */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-48 z-0 pointer-events-none bg-gradient-to-t from-[#0d0d0d] to-transparent"
          />

          <motion.div 
            className="max-w-4xl w-full text-center relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black/40 text-[#c5a880] text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation of AI Marketing</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Elevate Your Brand with <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e]">
                MaatramMARK
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your autonomous AI-powered content generator. We analyze local trends, strategize campaigns, and generate stunning visual assets tailored specifically for your local business.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to={isLoggedIn ? '/app' : '/login'} 
                className="px-8 py-3 bg-white hover:bg-slate-200 text-black rounded-md font-bold text-base flex items-center gap-2 transition-colors"
              >
                <span>{isLoggedIn ? 'Open Workspace' : 'Start Creating for Free'}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a 
                href="https://github.com/Rahul-8283/MaatramMark_AI" 
                target="_blank" 
                rel="noreferrer" 
                className="px-8 py-3 rounded-md font-semibold text-slate-300 border border-amber-900/40 hover:border-[#c5a880]/60 hover:bg-[#c5a880]/5 backdrop-blur-sm transition-all text-base"
              >
                View Repository
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-500 z-10"
          >
            <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
          </motion.div>
        </section>

        {/* --- WHAT IS MAATRAM MARK SECTION --- */}
        <section id="about" className="py-24 px-6 relative overflow-hidden bg-[#0a0a0a] border-t border-slate-900/30">
          {/* Decorative glow overlays */}
          <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-[#c5a880]/3 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-amber-900/5 rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Title and Concept Card */}
            <div className="text-center mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#c5a880]/10 text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-4 border border-[#c5a880]/20"
              >
                <span>Discover Maatram Mark</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-white mb-6"
              >
                What is{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e]">
                  Maatram Mark
                </span>
                ?
              </motion.h2>
            </div>

            {/* Introductory Big Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-slate-800/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group"
            >
              {/* Card internal glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#c5a880]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="grid md:grid-cols-3 gap-8 items-center relative z-10">
                <div className="md:col-span-2">
                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium">
                    Maatram Mark is an <span className="text-[#c5a880] font-semibold">AI-powered social media marketing assistant</span> designed to help small businesses create smarter, faster, and more engaging digital content. 
                  </p>
                  <p className="text-base text-slate-400 mt-4 leading-relaxed font-normal font-sans font-sans">
                    Built for the <strong className="text-slate-200">DevNetwork AI + ML Hackathon 2026</strong>, the system combines artificial intelligence, personalized branding, and feedback-driven learning to automate the daily marketing workflow of businesses. From generating posters and Instagram reel ideas to creating captions, hashtags, and marketing strategies, Maatram Mark acts as a complete AI marketing companion.
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    {/* Animated glowing orbit */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-2 border-dashed border-[#c5a880]/20 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-3 border border-dashed border-[#ebdcb9]/15 rounded-full"
                    />
                    {/* Pulsing Central Icon */}
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-28 h-28 rounded-full bg-[#181818] border border-slate-800 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)] z-10 p-3"
                    >
                      <img 
                        src="/favicon.png" 
                        alt="Maatram Mark Logo"
                        className="w-16 h-16 object-contain"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Standalone Large Name Derivation Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-[#161616] via-[#0d0d0d] to-[#161616] border-2 border-[#c5a880]/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group"
            >
              {/* Extra intense background glow matching the gold color theme */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#c5a880]/5 rounded-full blur-[100px] pointer-events-none z-0" />
              
              <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                <span className="text-[#c5a880] text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-md bg-[#c5a880]/10 border border-[#c5a880]/20">
                  The Story Behind the Name
                </span>
                
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-8 tracking-wide">
                  Understanding{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#c5a880] to-[#ebdcb9]">
                    Maatram Mark
                  </span>
                </h3>

                <div className="grid md:grid-cols-2 gap-8 w-full items-stretch mb-8">
                  {/* Left Side: Maatram */}
                  <motion.div 
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
                    className="p-6 md:p-8 rounded-xl bg-black/40 border border-slate-800 hover:border-[#c5a880]/40 transition-colors duration-500 flex flex-col items-center justify-center text-center relative overflow-hidden group/card shadow-lg"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#c5a880]/5 rounded-bl-full pointer-events-none transition-transform duration-700 ease-out group-hover/card:scale-110" />
                    
                    {/* Big Tamil word */}
                    <div className="text-4xl md:text-5xl font-black text-[#c5a880]/30 mb-2 font-sans select-none transition-colors duration-500 group-hover/card:text-[#c5a880]/50">
                      மாற்றம்
                    </div>
                    <div className="text-2xl md:text-3xl font-extrabold text-[#c5a880] tracking-wider mb-2 font-mono">
                      MAATRAM
                    </div>
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      [Tamil]
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed font-normal">
                      Translates directly to <strong className="text-white font-semibold">"Change"</strong> or <strong className="text-white font-semibold">"Transformation"</strong>. It signifies our goal to bring positive, AI-driven evolution to local business marketing.
                    </p>
                  </motion.div>

                  {/* Right Side: Mark */}
                  <motion.div 
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ type: "tween", duration: 0.4, ease: "easeOut" }}
                    className="p-6 md:p-8 rounded-xl bg-black/40 border border-slate-800 hover:border-[#ebdcb9]/40 transition-colors duration-500 flex flex-col items-center justify-center text-center relative overflow-hidden group/card shadow-lg"
                  >
                    <div className="absolute top-0 left-0 w-24 h-24 bg-[#ebdcb9]/5 rounded-br-full pointer-events-none transition-transform duration-700 ease-out group-hover/card:scale-110" />
                    
                    {/* Visual icon representation */}
                    <div className="text-4xl md:text-5xl font-black text-white/20 mb-2 font-mono select-none">
                      MARK
                    </div>
                    <div className="text-2xl md:text-3xl font-extrabold text-white tracking-wider mb-2 font-mono">
                      MARK
                    </div>
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                      [English]
                    </div>
                    <p className="text-base text-slate-300 leading-relaxed font-normal">
                      Represents <strong className="text-white font-semibold">"Marketing"</strong> and our platform's mission to help small brands <strong className="text-white font-semibold">"Make a Mark"</strong> (leave a lasting, successful impact on their target audience).
                    </p>
                  </motion.div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-4" />

                <p className="text-lg text-slate-400 max-w-3xl leading-relaxed font-normal font-sans">
                  Together, <span className="text-[#c5a880] font-semibold">Maatram Mark</span> stands as a powerful symbol of <span className="text-white font-medium">Transformative Marketing</span> - combining autonomous artificial intelligence, customized brand guidelines, and performance metrics to help any business reach its full digital potential.
                </p>
              </div>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              
              {/* Card 1: Intelligent Onboarding */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(197,168,128,0.4)' }}
                className="lg:col-span-3 p-8 rounded-xl bg-[#121212]/40 backdrop-blur-md border border-slate-800/80 hover:bg-[#141414]/60 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-[#c5a880]/10 transition-colors">
                      <Compass className="w-6 h-6 text-[#c5a880]" />
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono">Phase 01: Onboarding</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Intelligent Onboarding</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    The platform begins by understanding the business through intelligent onboarding agents. These AI agents analyze the business category, branding style, audience preferences, and market trends to create a personalized marketing identity. Based on this information, the system generates daily content ideas tailored specifically for the brand. Users receive AI-generated poster concepts, captions, hashtags, and reel suggestions aligned with overall brand tone.
                  </p>
                </div>
              </motion.div>

              {/* Card 2: AI Content Generation */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5, borderColor: 'rgba(197,168,128,0.4)' }}
                className="lg:col-span-3 p-8 rounded-xl bg-[#121212]/40 backdrop-blur-md border border-slate-800/80 hover:bg-[#141414]/60 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-[#c5a880]/10 transition-colors">
                      <Film className="w-6 h-6 text-[#c5a880]" />
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono">Creative Engine</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Autonomous Creative Engine</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    One of the core features of Maatram Mark is its AI-powered content generation system. The platform can generate visually appealing poster prompts and engaging Instagram reel ideas automatically. Users can refine and customize the generated prompts before creating the final output, giving them both AI assistance and creative control. The system also provides reel scripts, camera angle suggestions, music recommendations, and attention-grabbing hooks.
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Smart Feedback Loop */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -5, borderColor: 'rgba(197,168,128,0.4)' }}
                className="lg:col-span-2 p-8 rounded-xl bg-[#121212]/40 backdrop-blur-md border border-slate-800/80 hover:bg-[#141414]/60 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-[#c5a880]/10 transition-colors">
                      <RefreshCw className="w-6 h-6 text-[#c5a880]" />
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono">Optimization</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Adaptive Learning</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal mb-6">
                    Maatram Mark is not just a content generator — it is a learning system. After publishing content, users can submit engagement data (likes, comments, reach). The feedback agent analyzes this performance data, stores insights, and reuses them for future content generation.
                  </p>
                </div>
                
                {/* Mini-graphic simulation */}
                <div className="h-16 w-full bg-slate-900/60 rounded-lg p-3 border border-slate-800/60 flex items-end justify-between gap-2 overflow-hidden">
                  <div className="text-[10px] font-mono text-[#c5a880] self-center">Reach Boost</div>
                  <div className="flex items-end gap-1.5 h-full flex-1 justify-end">
                    <motion.div 
                      initial={{ height: "20%" }}
                      whileInView={{ height: "35%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="w-3 bg-slate-800 rounded-t"
                      style={{ backgroundColor: '#2d2d2d' }}
                    />
                    <motion.div 
                      initial={{ height: "20%" }}
                      whileInView={{ height: "55%" }}
                      transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                      className="w-3 bg-slate-700 rounded-t"
                      style={{ backgroundColor: '#4a4a4a' }}
                    />
                    <motion.div 
                      initial={{ height: "20%" }}
                      whileInView={{ height: "85%" }}
                      transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                      className="w-3 rounded-t shadow-[0_0_10px_rgba(197,168,128,0.5)]"
                      style={{ backgroundColor: '#c5a880' }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Card 4: Modern Tech Architecture */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -5, borderColor: 'rgba(197,168,128,0.4)' }}
                className="lg:col-span-4 p-8 rounded-xl bg-[#121212]/40 backdrop-blur-md border border-slate-800/80 hover:bg-[#141414]/60 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-[#c5a880]/10 transition-colors">
                      <Cpu className="w-6 h-6 text-[#c5a880]" />
                    </div>
                    <span className="text-[10px] tracking-wider text-slate-500 uppercase font-mono">Infrastructure</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Modern AI-Powered Architecture</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-normal mb-6">
                    The platform's frontend is developed using React for an interactive user experience, while the backend is powered by FastAPI for efficient AI orchestration and API handling. Supabase is used for database management, authentication, and cloud storage of generated assets. OpenRouter powers the intelligent AI agents, and Clipdrop APIs drive visual content generation.
                  </p>
                </div>

                {/* Interactive Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'React', desc: 'Frontend UI', color: 'border-cyan-500/30 hover:border-cyan-400 text-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]' },
                    { name: 'FastAPI', desc: 'AI Orchestration', color: 'border-emerald-500/30 hover:border-emerald-400 text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]' },
                    { name: 'Supabase', desc: 'Database & Auth', color: 'border-amber-500/30 hover:border-amber-400 text-amber-400 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' },
                    { name: 'OpenRouter', desc: 'LLM Agents', color: 'border-purple-500/30 hover:border-purple-400 text-purple-400 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.05)]' },
                    { name: 'Clipdrop', desc: 'Image Diffusion', color: 'border-yellow-500/30 hover:border-yellow-400 text-yellow-400 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]' }
                  ].map((tech, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 rounded-md border text-xs font-semibold cursor-default transition-all flex flex-col items-start ${tech.color}`}
                    >
                      <span>{tech.name}</span>
                      <span className="text-[8px] opacity-70 font-normal mt-0.5">{tech.desc}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 5: The Mission (Solving Real-world Problem) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -5, borderColor: 'rgba(197,168,128,0.4)' }}
                className="lg:col-span-6 p-8 md:p-10 rounded-xl bg-[#121212]/40 backdrop-blur-md border border-slate-800/80 hover:bg-[#141414]/60 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg overflow-hidden relative group"
              >
                <div className="flex-1 max-w-3xl relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#c5a880]" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Our Core Mission</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Empowering Small Businesses & Creators</h3>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed font-normal">
                    Maatram Mark aims to solve a real-world problem faced by many small businesses and creators — the difficulty of consistently producing engaging social media content. By combining automation, personalization, and feedback learning, the system transforms marketing into a smarter, AI-driven experience. The project demonstrates how artificial intelligence can simplify digital branding, improve content quality, and help businesses grow their online presence more effectively.
                  </p>
                </div>
                
                <div className="relative z-10 flex-shrink-0">
                  <Link 
                    to={isLoggedIn ? '/app' : '/signup'} 
                    className="px-6 py-3 rounded-lg font-semibold text-[#c5a880] border border-[#c5a880]/30 bg-[#121212]/80 hover:bg-[#c5a880]/10 hover:border-[#c5a880]/60 transition-colors duration-300 flex items-center gap-2 text-sm backdrop-blur-sm"
                  >
                    <span>Get Started Today</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24 px-6 relative overflow-hidden bg-[#0d0d0d] border-t border-slate-900/30">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#c5a880]/3 rounded-full blur-[150px] pointer-events-none z-0" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">Intelligent Capabilities</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to automate your social media presence, powered by advanced LLMs and image generation models.</p>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {[
                { icon: <LineChart className="w-8 h-8 text-[#c5a880]" />, title: 'Trend Detection', desc: 'Auto-detects local events, festivals, and trending topics to keep your content highly relevant.' },
                { icon: <BrainCircuit className="w-8 h-8 text-[#c5a880]" />, title: 'LLM Strategy Agents', desc: 'Autonomous agents research your niche and construct a cohesive brand strategy and voice.' },
                { icon: <ImageIcon className="w-8 h-8 text-[#c5a880]" />, title: 'Visuals & Reels', desc: 'Instantly generate posters, logos, and detailed short-form reels scripts complete with hooks and camera cues.' },
                { icon: <RefreshCw className="w-8 h-8 text-[#c5a880]" />, title: 'AI Feedback Loop', desc: 'Submit post performance metrics (likes, shares, reach) to train the AI and optimize future outputs.' }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="bg-[#121212]/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-lg hover:bg-[#161616]/60 hover:border-slate-700 transition-all group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
                >
                  <div className="w-14 h-14 rounded-md bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* --- HOW IT WORKS SECTION --- */}
        <section id="how-it-works" className="py-24 px-6 relative overflow-hidden bg-[#090909] border-t border-slate-900/50">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#c5a880]/3 rounded-full blur-[150px] pointer-events-none z-0" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-4xl font-semibold text-white mb-4">How It Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">A seamless workflow from setup to deployment.</p>
            </div>

            <div className="space-y-12">
              {[
                { step: '01', title: 'Business Profiling', desc: 'Tell us about your business. We set up your unique brand context, location, and target audience.', icon: <Zap className="w-6 h-6" /> },
                { step: '02', title: 'Contextual Analysis', desc: 'Our AI scans daily trends and local events, formulating content ideas specifically tailored to your profile.', icon: <BarChart className="w-6 h-6" /> },
                { step: '03', title: 'Creative Generation', desc: 'Review AI-generated concepts, then watch as the system creates beautiful posters, logos, and reels in seconds.', icon: <ImageIcon className="w-6 h-6" /> },
                { step: '04', title: 'Analytics & Feedback Loop', desc: 'Log post metrics. The AI analyzes reach, likes, and shares to continuously adapt and improve your schedules and content style.', icon: <LineChart className="w-6 h-6" /> },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 bg-[#121212]/30 p-6 md:p-8 rounded-lg border border-slate-800/40 hover:border-slate-700 transition-all hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-[#181818] border border-slate-800 flex items-center justify-center text-2xl font-black text-slate-600 shadow-inner">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                      {item.title}
                      <span className="text-[#c5a880]">{item.icon}</span>
                    </h3>
                    <p className="text-slate-400 text-lg">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <Footer />

      </div>
    </div>
  )
}
