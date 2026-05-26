import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import api from '../lib/api.ts';
import useStore from '../store/useStore.ts';

interface HistoryItem {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
}

export default function ImageHistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId');

  const [asset, setAsset] = useState<HistoryItem | null>(location.state?.asset || null);
  const [loading, setLoading] = useState(!location.state?.asset);
  
  const [currentImage, setCurrentImage] = useState(location.state?.asset?.image_url || '');
  const [currentGenerationId, setCurrentGenerationId] = useState(location.state?.asset?.id || '');
  const [currentPrompt, setCurrentPrompt] = useState(location.state?.asset?.prompt || '');
  
  const [feedback, setFeedback] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchAssetIfNeeded = async () => {
      if (!asset && userId) {
        try {
          const response = await api.get(`/images/history/${userId}`);
          const historyList = response.data || [];
          const found = historyList.find((item: any) => item.id === id);
          if (found) {
            setAsset(found);
            setCurrentImage(found.image_url);
            setCurrentGenerationId(found.id);
            setCurrentPrompt(found.prompt || 'Generated Concept');
          }
        } catch (err) {
          console.error("Failed to fetch asset details:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAssetIfNeeded();
  }, [id, userId, asset]);

  const handleRegenerate = async () => {
    if (!feedback.trim()) return;
    setIsRegenerating(true);
    try {
      const isRealGenerationId = currentGenerationId && !currentGenerationId.startsWith('history-');
      const endpoint = isRealGenerationId ? '/refine-image' : '/generate-image';
      const payload = isRealGenerationId 
        ? { generation_id: currentGenerationId, refinement: feedback }
        : { user_id: userId, prompt: `Original: ${currentPrompt}. Refinement: ${feedback}`, type: 'poster' };
      
      const response = await api.post(endpoint, payload);
      
      setCurrentImage(response.data.image_url || response.data.image_data);
      if (response.data.generation_id) {
        setCurrentGenerationId(response.data.generation_id);
      }
      setCurrentPrompt(feedback ? `Refined: ${feedback}` : currentPrompt);
      setFeedback('');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.detail || "Failed to regenerate image.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleConfirm = async (type: 'poster' | 'logo') => {
    setIsConfirming(true);
    try {
      const endpoint = type === 'poster' ? '/confirm-poster' : '/confirm-logo';
      await api.post(endpoint, {
        generation_id: currentGenerationId,
        caption: currentPrompt,
      });
      alert(`Successfully saved to your ${type === 'poster' ? 'Posters' : 'Logos'}!`);
      navigate('/app/assets');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.detail || "Failed to confirm image.");
    } finally {
      setIsConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-[#c5a880] border-t-transparent rounded-full mb-4" />
        <p className="text-slate-400">Loading image details...</p>
      </div>
    );
  }

  if (!asset && !currentImage) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Image Not Found</h2>
        <p className="text-slate-400 mb-6">We couldn't find the requested image in your history.</p>
        <Link to="/app/assets/history" className="px-6 py-3 bg-[#c5a880] text-black font-bold rounded-lg hover:bg-white transition-colors">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/app/assets/history')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to History
        </button>
      </div>

      <div className="bg-[#121212]/40 backdrop-blur-xl rounded-2xl border border-slate-800/60 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Column: Image */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-800/60">
          <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
            <img 
              src={currentImage} 
              alt="Detailed Concept" 
              className="w-full h-full object-cover rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50"
            />
            {isRegenerating && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md rounded-xl flex flex-col items-center justify-center z-10 border border-[#c5a880]/30">
                <div className="animate-spin w-16 h-16 border-4 border-[#c5a880] border-t-transparent rounded-full mb-6 shadow-[0_0_20px_rgba(197,168,128,0.5)]" />
                <p className="text-[#c5a880] font-bold tracking-[0.2em] text-lg animate-pulse">REGENERATING</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col bg-gradient-to-b from-[#161616] to-[#111]">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">Enhance Image</h1>
          
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Original Prompt</p>
            <div className="bg-[#1a1a1a] border border-slate-800 rounded-xl p-5 text-slate-300 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
              {currentPrompt}
            </div>
          </div>

          <div className="mb-10 flex-grow">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Tweak & Regenerate</p>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. Make it warmer, add more lighting, change background to a beach..."
              className="w-full px-5 py-4 bg-[#1a1a1a] border border-slate-700 hover:border-slate-600 focus:border-[#c5a880] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c5a880] transition-all resize-none h-32 md:h-40"
            />
            <button 
              onClick={handleRegenerate}
              disabled={isRegenerating || !feedback.trim()}
              className="w-full mt-4 px-6 py-4 bg-[#c5a880] hover:bg-[#ebdcb9] disabled:bg-[#c5a880]/30 text-black disabled:text-slate-500 font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(197,168,128,0.4)] flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              {isRegenerating ? 'Generating...' : 'Regenerate Image'}
            </button>
          </div>

          <div className="pt-8 border-t border-slate-800 mt-auto">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Love it? Make it Final!</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleConfirm('poster')}
                disabled={isRegenerating || isConfirming}
                className="flex-1 px-4 py-3 bg-slate-800/80 hover:bg-emerald-600/20 text-slate-200 hover:text-emerald-400 border border-slate-700/80 hover:border-emerald-500/50 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Check className="w-4 h-4" /> Save as Poster
              </button>
              <button 
                onClick={() => handleConfirm('logo')}
                disabled={isRegenerating || isConfirming}
                className="flex-1 px-4 py-3 bg-slate-800/80 hover:bg-blue-600/20 text-slate-200 hover:text-blue-400 border border-slate-700/80 hover:border-blue-500/50 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Check className="w-4 h-4" /> Save as Logo
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
