import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Video, Clapperboard, Music, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api.ts';
import useStore from '../store/useStore.ts';

interface ReelHistoryItem {
  id: string;
  created_at: string;
  reel_ideas?: {
    idea: string;
    script: string;
    camera: string;
    music: string;
    hook: string;
  }[];
  captions?: string[];
  hashtags?: string[];
  response_data?: any;
}

export default function ReelsHistory() {
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId');
  const [items, setItems] = useState<ReelHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/reels/${userId}`);
        const data = response.data;
        
        // Ensure data is properly structured as an array
        if (Array.isArray(data)) {
          // Sort by newest first
          const sorted = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setItems(sorted);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch reels history:", err);
        setError('Failed to load reels history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 lg:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/app" className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-4xl font-bold text-white">Reels History</h1>
            </div>
            <p className="text-slate-400 pl-12">Your past generated AI reel concepts and scripts.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
            <p className="text-slate-400">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center text-red-400">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#121212]/40 backdrop-blur-md rounded-2xl border border-slate-800/60 p-12 text-center shadow-xl">
            <Video className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Reels Generated Yet</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">You haven't generated any short-form video concepts yet. Head over to the Reels Generator to start creating!</p>
            <Link 
              to="/app/generate-reels"
              className="inline-flex px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors shadow-lg"
            >
              Generate Reels
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {items.map((session, index) => {
              const rawData = session.response_data || session;
              let ideas = [];
              try {
                if (session.reel_ideas) {
                  ideas = typeof session.reel_ideas === 'string' ? JSON.parse(session.reel_ideas) : session.reel_ideas;
                } else if (rawData.reel_ideas) {
                  ideas = typeof rawData.reel_ideas === 'string' ? JSON.parse(rawData.reel_ideas) : rawData.reel_ideas;
                } else if (rawData.response_data?.reel_ideas) {
                  ideas = typeof rawData.response_data.reel_ideas === 'string' ? JSON.parse(rawData.response_data.reel_ideas) : rawData.response_data.reel_ideas;
                } else if (typeof rawData === 'string') {
                  const parsed = JSON.parse(rawData);
                  ideas = parsed.reel_ideas || parsed.response_data?.reel_ideas || [];
                }
              } catch (e) {
                console.error("Error parsing reel ideas:", e);
              }

              if (!Array.isArray(ideas)) {
                ideas = [];
              }

              if (ideas.length === 0) return null;

              return (
                <div key={session.id || index} className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-slate-300 bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50">
                      Generated on {formatDate(session.created_at)}
                    </h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 pl-4 border-l-2 border-slate-800">
                    {ideas.map((reel: any, rIdx: number) => (
                      <div key={rIdx} className="bg-[#121212]/60 backdrop-blur-md rounded-xl border border-slate-800/60 overflow-hidden hover:border-blue-500/30 transition-all shadow-lg group">
                        
                        {/* Header */}
                        <div className="bg-blue-950/20 px-5 py-4 border-b border-blue-900/30 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center shrink-0 border border-blue-500/30">
                            {rIdx + 1}
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{reel.idea}</h3>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
                            <div className="flex items-center gap-2 mb-2 text-blue-400">
                              <Clapperboard className="w-4 h-4" />
                              <h4 className="font-semibold text-sm">The Hook (First 3s)</h4>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{reel.hook}</p>
                          </div>

                          <div className="bg-[#1a1a1a]/50 rounded-lg p-4 border border-slate-700/50 shadow-inner">
                            <div className="flex items-center gap-2 mb-2 text-white">
                              <Video className="w-4 h-4" />
                              <h4 className="font-bold text-sm">Action Script</h4>
                            </div>
                            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                              {reel.script}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                             <div className="flex items-center gap-2 text-slate-500 text-xs">
                               <Camera className="w-3 h-3" /> Visuals specified
                             </div>
                             <div className="flex items-center gap-2 text-slate-500 text-xs">
                               <Music className="w-3 h-3" /> Audio suggested
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
