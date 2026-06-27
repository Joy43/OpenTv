import './App.css';

function App() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">TV</div>
          <span className="gradient-text">OpenTV Admin</span>
        </div>
        
        <nav className="nav-links">
          <div className="nav-item active">
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <span>Projects</span>
          </div>
          <div className="nav-item">
            <span>Channels</span>
          </div>
          <div className="nav-item">
            <span>Analytics</span>
          </div>
          <div className="nav-item">
            <span>Settings</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Overview</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Welcome back to your OpenTV dashboard.
            </p>
          </div>
          <div className="user-profile">
            <span style={{ fontWeight: 500 }}>Admin User</span>
            <div className="avatar"></div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-title">Total Users</span>
            <span className="stat-value">24,592</span>
            <span className="stat-change positive">↑ 12.5% this month</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-title">Active Streams</span>
            <span className="stat-value">1,204</span>
            <span className="stat-change positive">↑ 4.2% today</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-title">Server Load</span>
            <span className="stat-value">42%</span>
            <span className="stat-change negative">↓ 2.1% this hour</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-title">Revenue</span>
            <span className="stat-value">$12,450</span>
            <span className="stat-change positive">↑ 8.4% this month</span>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="glass-panel recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-name">New project "Live Sports Hub" created</span>
                <span className="activity-time">2 minutes ago</span>
              </div>
              <span className="status-badge active">Active</span>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-name">User @john_doe upgraded to Premium</span>
                <span className="activity-time">1 hour ago</span>
              </div>
              <span className="status-badge active">Completed</span>
            </div>
            <div className="activity-item">
              <div className="activity-info">
                <span className="activity-name">Server maintenance scheduled for US-East</span>
                <span className="activity-time">5 hours ago</span>
              </div>
              <span className="status-badge pending">Pending</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
