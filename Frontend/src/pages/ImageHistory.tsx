import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, RefreshCw, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api.ts';
import useStore from '../store/useStore.ts';

interface HistoryItem {
  id: string;
  image_url: string;
  prompt: string;
  created_at: string;
}

import { useNavigate } from 'react-router-dom';

export default function ImageHistory() {
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId');
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/images/history/${userId}`);
      
      const history: HistoryItem[] = (response.data || []).map((item: any) => ({
        id: item.id || `history-${item.created_at}`,
        image_url: item.image_url,
        prompt: item.prompt || 'Generated Concept',
        created_at: item.created_at,
      }));

      // Sort by newest first if not already sorted
      const sorted = history.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setItems(sorted);
    } catch (err: any) {
      console.error("Failed to fetch history:", err);
      setError('Failed to load your generation history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e] bg-clip-text text-transparent mb-2">
              Generation History
            </h1>
            <p className="text-slate-400">A gallery of all your previously generated image concepts.</p>
          </div>
          <div className="sm:pt-2">
            <Link to="/app/assets" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Assets</span>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#121212]/40 backdrop-blur-xl rounded-lg p-8 border border-slate-800/60 shadow-2xl">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> All Generated Images
            </h2>
            <button 
              onClick={fetchHistory}
              disabled={loading}
              className="text-sm text-slate-400 hover:text-[#c5a880] flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 text-red-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full" />
              <p className="text-slate-400">Loading your history...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No history found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                You haven't generated any images yet. Your past generations will appear here.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link to="/app/generate-images" className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                  Generate Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((asset) => (
                <button 
                  key={asset.id} 
                  onClick={() => navigate(`/app/assets/history/${asset.id}`, { state: { asset } })}
                  className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-slate-800 hover:border-[#c5a880]/50 transition-all hover:shadow-[0_10px_30px_-10px_rgba(197,168,128,0.2)] text-left focus:outline-none focus:ring-2 focus:ring-[#c5a880]/50 block w-full cursor-pointer"
                >
                  <div className="aspect-square w-full relative overflow-hidden bg-slate-900">
                    <img 
                      src={asset.image_url} 
                      alt={asset.prompt} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium border border-white/10 shadow-xl flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#c5a880]" />
                        Enhance & View
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-400 mb-2 line-clamp-3" title={asset.prompt}>
                      {asset.prompt}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {new Date(asset.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
