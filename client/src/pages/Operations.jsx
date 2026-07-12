import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Wrench, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Operations() {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  const fetchData = async () => {
    try {
      const bookRes = await fetch('http://localhost:5000/api/operations/bookings');
      if (bookRes.ok) setBookings(await bookRes.json());
      
      const maintRes = await fetch('http://localhost:5000/api/operations/maintenance');
      if (maintRes.ok) setMaintenance(await maintRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const updateMaintenanceStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/operations/maintenance/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: status === 'Approved' ? 'approve' : 'reject' }) // simplified for MVP
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Calendar size={32} color="var(--primary-color)" />
        <h1 className="heading" style={{ fontSize: '2rem' }}>Operations Hub</h1>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
            style={tabStyle(activeTab === 'bookings')}
          >
            <Clock size={18} /> Resource Bookings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
            style={tabStyle(activeTab === 'maintenance')}
          >
            <Wrench size={18} /> Maintenance Requests
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Shared Resource Bookings</h3>
                <button className="btn btn-primary">+ Book Resource</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Resource</th>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>Booked By</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}><strong>{b.resourceId}</strong></td>
                      <td style={tdStyle}>{new Date(b.startTime).toLocaleString()} <br/><span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>to {new Date(b.endTime).toLocaleString()}</span></td>
                      <td style={tdStyle}>{b.bookedBy}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(b.status === 'Upcoming' ? 'var(--accent-color)' : 'var(--success)')}>
                          {b.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', color: 'var(--danger)' }}>Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Maintenance Workflows</h3>
                <button className="btn btn-primary">+ Raise Request</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Asset</th>
                    <th style={thStyle}>Issue Description</th>
                    <th style={thStyle}>Priority</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions (Manager)</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map(m => (
                    <tr key={m._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}><strong>{m.asset}</strong></td>
                      <td style={tdStyle}>{m.issueDescription}</td>
                      <td style={tdStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: m.priority === 'High' ? 'var(--danger)' : 'var(--warning)' }}>
                          <AlertTriangle size={14} /> {m.priority}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(m.status === 'Pending' ? 'var(--warning)' : 'var(--accent-color)')}>
                          {m.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {m.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => updateMaintenanceStatus(m._id, 'Approved')} className="btn btn-secondary" style={{ padding: '0.25rem', color: 'var(--success)' }} title="Approve"><CheckCircle size={18}/></button>
                            <button onClick={() => updateMaintenanceStatus(m._id, 'Rejected')} className="btn btn-secondary" style={{ padding: '0.25rem', color: 'var(--danger)' }} title="Reject"><XCircle size={18}/></button>
                          </div>
                        ) : m.status === 'In Progress' ? (
                           <button onClick={() => updateMaintenanceStatus(m._id, 'Resolved')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', background: 'var(--success)' }}>Resolve</button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline styles
const tabStyle = (isActive) => ({
  flex: 1,
  padding: '1rem',
  background: 'none',
  border: 'none',
  borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontWeight: '600',
  transition: 'all 0.2s',
  outline: 'none'
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

const thStyle = {
  padding: '1rem',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  borderBottom: '2px solid var(--border-color)'
};

const tdStyle = {
  padding: '1rem',
  color: 'var(--text-primary)'
};

const badgeStyle = (color) => ({
  display: 'inline-block',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  background: `color-mix(in srgb, ${color} 15%, transparent)`,
  color: color,
  fontSize: '0.75rem',
  fontWeight: '600'
});
