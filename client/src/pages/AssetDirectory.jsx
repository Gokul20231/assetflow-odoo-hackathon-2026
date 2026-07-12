import { useState, useEffect, useContext } from 'react';
import { Package, Search, Filter, Plus, ArrowRightLeft, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function AssetDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', assetTag: '', category: 'Electronics', location: '' });
  
  const { token } = useContext(AuthContext);

  const fetchAssets = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/assets');
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      });
      if (res.ok) {
        setShowRegisterModal(false);
        fetchAssets();
        setNewAsset({ name: '', assetTag: '', category: 'Electronics', location: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAssets = assets.filter(a => 
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.assetTag || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package size={32} color="var(--primary-color)" />
          <h1 className="heading" style={{ fontSize: '2rem' }}>Asset Directory</h1>
        </div>
        <button onClick={() => setShowRegisterModal(true)} className="btn btn-primary"><Plus size={18} style={{ marginRight: '0.5rem' }}/> Register Asset</button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search by Asset Tag, Name, or Serial..." 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary"><Filter size={18} style={{ marginRight: '0.5rem' }}/> Filters</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={thStyle}>Asset Tag</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map(asset => (
              <tr key={asset._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ ...tdStyle, fontWeight: '600', color: 'var(--accent-color)' }}>{asset.assetTag}</td>
                <td style={tdStyle}>{asset.name}</td>
                <td style={tdStyle}>{asset.category}</td>
                <td style={tdStyle}>{asset.location}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(getStatusColor(asset.status))}>
                    {asset.status}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>View</button>
                    {asset.status === 'Available' ? (
                      <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', background: 'var(--success)' }}>Allocate</button>
                    ) : asset.status === 'Allocated' ? (
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}><ArrowRightLeft size={14}/> Transfer</button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRegisterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowRegisterModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 className="heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Register New Asset</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Asset Name</label>
                <input type="text" className="input-field" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Asset Tag (Auto-generated or Manual)</label>
                <input type="text" className="input-field" value={newAsset.assetTag} onChange={e => setNewAsset({...newAsset, assetTag: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                <select className="input-field" value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})}>
                  <option>Electronics</option>
                  <option>Furniture</option>
                  <option>Vehicles</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                <input type="text" className="input-field" value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Asset</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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

const getStatusColor = (status) => {
  switch(status) {
    case 'Available': return 'var(--success)';
    case 'Allocated': return 'var(--primary-color)';
    case 'Under Maintenance': return 'var(--warning)';
    case 'Lost': 
    case 'Disposed': return 'var(--danger)';
    default: return 'var(--text-secondary)';
  }
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
