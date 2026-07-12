import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowUpRight, ArrowDownRight, Package, Wrench, Clock, FileWarning } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Using state to hold real KPI data

const KPICard = ({ title, value, icon, trend, trendValue, color, isWarning }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
      <div>
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</h4>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: isWarning ? 'var(--danger)' : 'var(--text-primary)' }}>
          {value}
        </div>
      </div>
      <div style={{ padding: '0.75rem', background: `color-mix(in srgb, ${color} 15%, transparent)`, borderRadius: '12px', color: color }}>
        {icon}
      </div>
    </div>
    {trend && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: trend === 'up' ? 'var(--success)' : 'var(--danger)' }}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{trendValue} from last month</span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState({
    assetsAvailable: 0,
    assetsAllocated: 0,
    maintenanceToday: 0,
    activeBookings: 0,
    overdueReturns: 0
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await fetch('/api/dashboard/kpi');
        const data = await res.json();
        setKpiData(data);
      } catch (err) {
        console.error('Failed to fetch KPIs', err);
      }
    };
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/dashboard/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch Logs', err);
      }
    };
    fetchKPIs();
    fetchLogs();
  }, [token]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Activity size={32} color="var(--primary-color)" />
        <h1 className="heading" style={{ fontSize: '2rem' }}>Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <KPICard 
          title="Assets Available" 
          value={kpiData.assetsAvailable} 
          icon={<Package size={24} />} 
          color="var(--success)"
        />
        <KPICard 
          title="Assets Allocated" 
          value={kpiData.assetsAllocated} 
          icon={<Package size={24} />} 
          color="var(--primary-color)"
        />
        <KPICard 
          title="Active Bookings" 
          value={kpiData.activeBookings} 
          icon={<Clock size={24} />} 
          color="var(--accent-color)"
        />
        <KPICard 
          title="Maintenance Today" 
          value={kpiData.maintenanceToday} 
          icon={<Wrench size={24} />} 
          color="var(--warning)"
        />
        <KPICard 
          title="Overdue Returns" 
          value={kpiData.overdueReturns} 
          icon={<FileWarning size={24} />} 
          color="var(--danger)"
          isWarning={true}
          trend="down"
          trendValue="-2%"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Quick Actions / Activity Feed Placeholder */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Welcome, {user?.fullName}</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You are logged in as an <strong>{user?.role}</strong>.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {logs.length === 0 ? (
              <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)', marginTop: '6px' }} />
                <div>
                  <p style={{ margin: 0 }}>System Initialized successfully.</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Just now</span>
                </div>
              </div>
            ) : (
              logs.map(log => (
                <div key={log._id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)', marginTop: '6px' }} />
                  <div>
                    <p style={{ margin: 0 }}><strong>{log.user.fullName}</strong> {log.action} {log.targetType}</p>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{log.details}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => navigate('/assets')} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>Register New Asset</button>
            <button onClick={() => navigate('/operations')} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>Book Resource</button>
            <button onClick={() => navigate('/operations')} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>Raise Maintenance Request</button>
            <button onClick={() => navigate('/audits')} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--warning)' }}>Start Audit Cycle</button>
          </div>
        </div>
      </div>
    </div>
  );
}
