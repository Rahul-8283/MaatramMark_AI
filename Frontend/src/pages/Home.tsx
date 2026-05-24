import { Link } from 'react-router-dom'
import useStore from '../store/useStore.ts'
import { motion, type Variants } from 'framer-motion'
import { Sparkles, BrainCircuit, Image as ImageIcon, LineChart, ArrowRight, Zap, RefreshCw, BarChart } from 'lucide-react'
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
    <div className="min-h-screen bg-[#111] text-slate-200 overflow-hidden relative selection:bg-cyan-500/30">
      {/* Background Diagonal Stripes (matching user reference) */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(45deg, #111 0px, #111 40px, #1a1a1a 40px, #1a1a1a 80px, #0a0a0a 80px, #0a0a0a 120px)'
        }}
      />
      
      {/* Subtle Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
          <motion.div 
            className="max-w-4xl w-full text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation of AI Marketing</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
              Elevate Your Brand with <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                MaatramMark AI
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Your autonomous AI-powered content generator. We analyze local trends, strategize campaigns, and generate stunning visual assets tailored specifically for your local business.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to={isLoggedIn ? '/app' : '/login'} 
                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoggedIn ? 'Open Workspace' : 'Start Creating for Free'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <a 
                href="https://github.com/Rahul-8283/MaatramMark_AI" 
                target="_blank" 
                rel="noreferrer" 
                className="px-8 py-4 rounded-full font-semibold text-slate-300 border border-slate-700 hover:border-slate-400 hover:bg-slate-800/50 backdrop-blur-sm transition-all"
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
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-500"
          >
            <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
          </motion.div>
        </section>


        {/* --- FEATURES SECTION --- */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Intelligent Capabilities</h2>
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
                { icon: <LineChart className="w-8 h-8 text-cyan-400" />, title: 'Trend Detection', desc: 'Auto-detects local events, festivals, and trending topics to keep your content highly relevant.' },
                { icon: <BrainCircuit className="w-8 h-8 text-purple-400" />, title: 'LLM Strategy Agents', desc: 'Autonomous agents research your niche and construct a cohesive brand strategy and voice.' },
                { icon: <ImageIcon className="w-8 h-8 text-blue-400" />, title: 'Visual Generation', desc: 'Instantly generate and refine stunning social media posters, promotional flyers, and business logos.' },
                { icon: <RefreshCw className="w-8 h-8 text-emerald-400" />, title: 'Feedback Learning', desc: 'Stores content and analytics, continuously learning from your preferences to improve future outputs.' }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-2xl hover:bg-slate-800/60 hover:border-slate-600 transition-all group"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* --- HOW IT WORKS SECTION --- */}
        <section className="py-24 px-6 bg-black/40 backdrop-blur-sm border-t border-slate-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">A seamless workflow from setup to deployment.</p>
            </div>

            <div className="space-y-12">
              {[
                { step: '01', title: 'Business Profiling', desc: 'Tell us about your business. We set up your unique brand context, location, and target audience.', icon: <Zap className="w-6 h-6" /> },
                { step: '02', title: 'Contextual Analysis', desc: 'Our AI scans daily trends and local events, formulating content ideas specifically tailored to your profile.', icon: <BarChart className="w-6 h-6" /> },
                { step: '03', title: 'Creative Generation', desc: 'Review AI-generated concepts, then watch as the system creates beautiful visual assets in seconds.', icon: <ImageIcon className="w-6 h-6" /> },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 bg-slate-900/30 p-6 md:p-8 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-colors"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-black text-slate-500 shadow-inner">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      {item.title}
                      <span className="text-cyan-500">{item.icon}</span>
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
