import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store';
import { setCredentials, logout } from './store/slices/authSlice';
import { useLoginMutation } from './store/api/authApi';
import Overview from './components/Overview';
import Projects from './components/Projects';
import Channels from './components/Channels';
import dashboardIcon from './assets/icon.png';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();

  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('superadmin12345');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'channels'>('dashboard');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      if (result.success && result.data.accessToken) {
        dispatch(setCredentials({ 
          user: { id: '1', email, role: 'ADMIN', status: 'ACTIVE' }, 
          token: result.data.accessToken 
        }));
      }
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!token) {
    return (
      <div className="dashboard-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel" style={{ width: 400, padding: 30, textAlign: 'center' }}>
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 20 }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="styled-input"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="styled-input"
            />
            {loginError && <p style={{ color: 'var(--accent-red)' }}>Login failed. Please check credentials.</p>}
            <button type="submit" className="btn btn-primary" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={dashboardIcon} alt="OpenTV Icon" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>OpenTV Admin</span>
        </div>
        
        <nav className="nav-links">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>Dashboard</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span>Projects</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            <span>Channels</span>
          </div>
         
          
          <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer', marginTop: 'auto' }}>
            <span style={{ color: 'var(--accent-red)' }}>Logout</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="user-profile" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <span style={{ fontWeight: 500, marginRight: '15px' }}>{user?.email || 'Admin'}</span>
          <div className="avatar"></div>
        </div>

        {activeTab === 'dashboard' && <Overview />}
        {activeTab === 'projects' && <Projects />}
        {activeTab === 'channels' && <Channels />}

      </main>
    </div>
  );
}

export default App;
