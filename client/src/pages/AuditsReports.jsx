import { useState } from 'react';
import { ClipboardCheck, FileText, AlertOctagon, FileSpreadsheet, Sparkles, X } from 'lucide-react';

const mockAudits = [
  { id: 1, name: 'Q2 Engineering Audit', date: '2026-07-01', status: 'Closed', discrepancies: 2 },
  { id: 2, name: 'Q3 HQ Inventory Check', date: '2026-07-15', status: 'In Progress', discrepancies: 0 },
];

export default function AuditsReports() {
  const [activeTab, setActiveTab] = useState('audits');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  const generateAIInsights = async () => {
    setIsGeneratingAI(true);
    setShowAiModal(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/ai/analyze');
      const data = await res.json();
      if (res.ok) {
        setAiAnalysis(data.analysis);
      } else {
        setAiAnalysis('Error: ' + data.message);
      }
    } catch (err) {
      setAiAnalysis('Failed to connect to AI service. Ensure GEMINI_API_KEY is set in backend .env');
    }
    setIsGeneratingAI(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ClipboardCheck size={32} color="var(--primary-color)" />
        <h1 className="heading" style={{ fontSize: '2rem' }}>Audits & Reports</h1>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button 
            className={`tab-btn ${activeTab === 'audits' ? 'active' : ''}`}
            onClick={() => setActiveTab('audits')}
            style={tabStyle(activeTab === 'audits')}
          >
            <AlertOctagon size={18} /> Audit Cycles
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
            style={tabStyle(activeTab === 'reports')}
          >
            <FileSpreadsheet size={18} /> Analytics & Exports
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'audits' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Asset Verification Cycles</h3>
                <button className="btn btn-primary">+ New Audit Cycle</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Audit Name</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Discrepancies</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAudits.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}><strong>{a.name}</strong></td>
                      <td style={tdStyle}>{a.date}</td>
                      <td style={tdStyle}>
                        <span style={{ color: a.discrepancies > 0 ? 'var(--danger)' : 'var(--text-secondary)' }}>
                          {a.discrepancies} Flagged
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(a.status === 'In Progress' ? 'var(--warning)' : 'var(--success)')}>
                          {a.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>
                          {a.status === 'In Progress' ? 'Continue' : 'View Report'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem' }}>System Reports</h3>
                <button 
                  onClick={generateAIInsights}
                  className="btn btn-primary" 
                  style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none' }}
                >
                  <Sparkles size={18} style={{ marginRight: '0.5rem' }} />
                  Generate AI Insights
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                      <FileText size={24} color="var(--primary-color)"/>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Asset Utilization Report</h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Most used vs idle assets</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary">Export CSV</button>
                </div>
                
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                      <FileText size={24} color="var(--accent-color)"/>
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Maintenance Frequency</h4>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Costs and repair history by category</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary">Export CSV</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAiModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowAiModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Sparkles size={32} color="#a855f7" />
              <h2 className="heading" style={{ fontSize: '1.75rem', margin: 0 }}>Gemini AI Analysis</h2>
            </div>
            
            {isGeneratingAI ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <div style={{ animation: 'spin 2s linear infinite', display: 'inline-block', marginBottom: '1rem' }}>
                  <Sparkles size={48} color="#a855f7" />
                </div>
                <p>Analyzing operational data and generating insights...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <div style={{ lineHeight: '1.6', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                {aiAnalysis}
              </div>
            )}
          </div>
        </div>
      )}
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
