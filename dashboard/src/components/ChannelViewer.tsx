import { useState, useEffect } from 'react';
import { fetchAndParseM3U, type Playlist } from '../utils/m3u-parser';


interface ChannelViewerProps {
  tvurl: string;
  projectName: string;
  onClose: () => void;
}

export default function ChannelViewer({ tvurl, projectName, onClose }: ChannelViewerProps) {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadChannels() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAndParseM3U(tvurl, projectName);
        if (mounted) {
          setPlaylist(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch or parse the playlist.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (tvurl) {
      loadChannels();
    }

    return () => {
      mounted = false;
    };
  }, [tvurl, projectName]);

  const filteredChannels = playlist?.channels.filter(channel => 
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.group.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '1000px', width: '90%', height: '90vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Channels: {projectName}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
              {isLoading ? 'Loading channels...' : `${playlist?.channels.length || 0} channels loaded`}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>

        {/* Toolbar */}
        {!isLoading && !error && playlist && (
          <div style={{ padding: '15px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <input 
              type="text" 
              placeholder="Search channels by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="styled-input"
            />
          </div>
        )}

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Downloading and parsing M3U file...</p>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '15px' }}>
              <p style={{ color: 'var(--accent-red)' }}>Error: {error}</p>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '400px' }}>
                Note: Ensure the TV URL is accessible from your browser. Cross-Origin Resource Sharing (CORS) policies may prevent direct downloads of some external M3U links.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {filteredChannels.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>No channels found matching your search.</p>
              ) : (
                filteredChannels.map((channel, idx) => (
                  <div 
                    key={channel.id || idx} 
                    className="glass-panel" 
                    style={{ 
                      padding: '15px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px', 
                      alignItems: 'center', 
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {channel.logo ? (
                      <img src={channel.logo} alt={channel.name} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', opacity: 0.5 }}>📺</span>
                      </div>
                    )}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{channel.name}</strong>
                      <span className="status-badge" style={{ alignSelf: 'center', background: 'rgba(255,255,255,0.1)' }}>{channel.group}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

 
    </div>
  );
}
