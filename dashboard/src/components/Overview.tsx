import { useGetProjectsQuery } from '../store/api/projectApi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 7500 },
  { name: 'Jul', revenue: 6800 },
];

export default function Overview() {
  const { data: projectsData, isLoading } = useGetProjectsQuery();
  const projects = projectsData?.data || [];

  return (
    <div>
      <header className="header">
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            A high-level view of your OpenTV analytics.
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-grid">
        <div className="glass-panel stat-card">
          <span className="stat-title">Total Projects</span>
          <span className="stat-value">{isLoading ? '...' : projects.length}</span>
          <span className="stat-change positive">Live now</span>
        </div>
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
      </section>

      {/* Analytics Chart Placeholder */}
      <section className="glass-panel recent-activity" style={{ marginTop: '20px' }}>
        <h2>Revenue Analytics</h2>
        <div style={{ height: '300px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--text-secondary)" 
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 15, 20, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
                itemStyle={{ color: 'var(--accent-color)' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--accent-color)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
