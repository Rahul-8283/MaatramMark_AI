import { useState, useEffect } from 'react';
import { ArrowLeft, Download, Image as ImageIcon, Briefcase, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api.ts';
import useStore from '../store/useStore.ts';

interface AssetItem {
  id: string;
  image_url: string;
  prompt?: string;
  created_at: string;
  type: 'poster' | 'logo';
}

export default function BrandAssets() {
  const userId = useStore((s) => s.userId) || localStorage.getItem('userId');
  const [items, setItems] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch both logos and posters in parallel
      const [logosRes, postersRes] = await Promise.all([
        api.get(`/logos/${userId}`).catch(() => ({ data: [] })),
        api.get(`/posters/${userId}`).catch(() => ({ data: [] }))
      ]);

      const logos: AssetItem[] = (logosRes.data || []).map((item: any) => ({
        id: item.id || `logo-${item.created_at}`,
        image_url: item.logo_url || item.image_url,
        prompt: item.prompt || 'Logo',
        created_at: item.created_at,
        type: 'logo'
      }));

      const posters: AssetItem[] = (postersRes.data || []).map((item: any) => ({
        id: item.id || `poster-${item.created_at}`,
        image_url: item.image_url,
        prompt: item.prompt || 'Poster',
        created_at: item.created_at,
        type: 'poster'
      }));

      // Combine and sort by newest first
      const combined = [...logos, ...posters].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setItems(combined);
    } catch (err: any) {
      console.error("Failed to fetch assets:", err);
      setError('Failed to load your gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAssets();
    }
  }, [userId]);

  const handleDownload = async (asset: AssetItem) => {
    try {
      setDownloadingId(asset.id);
      
      // Fetch the image as a blob
      const response = await fetch(asset.image_url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      
      // Create a blob URL
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Generate a filename based on type and timestamp
      const dateStr = new Date(asset.created_at).toISOString().split('T')[0];
      const ext = asset.image_url.split('.').pop()?.split('?')[0] || 'png';
      a.download = `maatram-${asset.type}-${dateStr}.${ext}`;
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image. It might be blocked by CORS or the URL is invalid.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[#c5a880] via-[#ebdcb9] to-[#9e825e] bg-clip-text text-transparent mb-2">
              Brand Assets Gallery
            </h1>
            <p className="text-slate-400">View and download your generated logos and posters.</p>
          </div>
          <div className="sm:pt-2">
            <Link to="/app" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Workspace</span>
            </Link>
          </div>
        </div>

        {/* History Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#1a1a1a] to-[#111111] rounded-xl p-6 md:p-8 border border-[#c5a880]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group hover:border-[#c5a880]/40 transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a880]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#c5a880]/10 transition-colors" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/30 border border-amber-900/50 flex items-center justify-center text-[#c5a880]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Image Generation History</h2>
              <p className="text-slate-400 text-sm">
                Explore all your past image concepts, including unconfirmed designs.
              </p>
            </div>
          </div>
          <Link 
            to="/app/assets/history"
            className="relative z-10 w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 hover:border-[#c5a880]/50 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            Explore History
          </Link>
        </div>

        {/* Content */}
        <div className="bg-[#121212]/40 backdrop-blur-xl rounded-lg p-8 border border-slate-800/60 shadow-2xl">
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-500" /> Your Collection
            </h2>
            <button 
              onClick={fetchAssets}
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
              <p className="text-slate-400">Loading your assets...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No assets found</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                You haven't confirmed any logos or posters yet. Generate and save some images to see them here!
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
                <div key={asset.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-slate-800 hover:border-[#c5a880]/50 transition-all hover:shadow-[0_10px_30px_-10px_rgba(197,168,128,0.2)]">
                  <div className="aspect-square w-full relative overflow-hidden bg-slate-900">
                    <img 
                      src={asset.image_url} 
                      alt={asset.type} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-medium text-white border border-white/10 uppercase tracking-wider">
                      {asset.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-400 mb-3 truncate" title={asset.prompt}>
                      {asset.prompt}
                    </p>
                    <button
                      onClick={() => handleDownload(asset)}
                      disabled={downloadingId === asset.id}
                      className="w-full py-2.5 bg-slate-800 hover:bg-[#c5a880] text-slate-300 hover:text-black font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {downloadingId === asset.id ? (
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      {downloadingId === asset.id ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
