import { useState, useEffect } from 'react';
import { useGetProjectsQuery } from '../store/api/projectApi';
import { fetchAndParseM3U, type Playlist } from '../utils/m3u-parser';


export default function Channels() {
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsQuery();
  const projects = projectsData?.data || [];

  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; url: string } | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadChannels() {
      if (!selectedProject) return;
      setIsLoadingChannels(true);
      setError(null);
      setPlaylist(null);
      
      try {
        const data = await fetchAndParseM3U(selectedProject.url, selectedProject.name);
        if (mounted) {
          setPlaylist(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to fetch or parse the playlist.');
        }
      } finally {
        if (mounted) {
          setIsLoadingChannels(false);
        }
      }
    }

    loadChannels();

    return () => {
      mounted = false;
    };
  }, [selectedProject]);

  const filteredChannels = playlist?.channels.filter(channel => 
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.group.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div style={{ display: 'flex', height: '100%', gap: '20px' }}>
      {/* Left Sidebar: Projects List */}
      <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Playlists</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {isLoadingProjects ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>Loading playlists...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px' }}>No playlists found.</p>
          ) : (
            projects.map(project => (
              <div 
                key={project.id}
                onClick={() => setSelectedProject({ id: project.id, name: project.title, url: project.tvurl })}
                style={{
                  padding: '12px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedProject?.id === project.id ? 'var(--accent-color)' : 'transparent',
                  marginBottom: '5px',
                  transition: 'background 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontWeight: 500, color: 'white' }}>{project.title}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/*------- Right Side: Channel List-------- */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
        {selectedProject ? (
          <>
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedProject.name}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                  {isLoadingChannels ? 'Loading channels...' : `${playlist?.channels.length || 0} channels loaded`}
                </p>
              </div>
            </div>

            {/* Toolbar */}
            {!isLoadingChannels && !error && playlist && (
              <div style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {isLoadingChannels ? (
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
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <span style={{ fontSize: '48px', opacity: 0.5 }}>📺</span>
            <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>No Playlist Selected</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a playlist from the left sidebar to view its channels.</p>
          </div>
        )}
      </div>

     
    </div>
  );
}
