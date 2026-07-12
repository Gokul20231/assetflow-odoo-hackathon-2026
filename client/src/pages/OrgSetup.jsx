import { useState, useEffect, useContext } from 'react';
import { Users, Building, Tag, Check, X, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function OrgSetup() {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const depRes = await fetch('http://localhost:5000/api/org/departments');
        setDepartments(await depRes.json());
        
        const catRes = await fetch('http://localhost:5000/api/org/categories');
        setCategories(await catRes.json());
        
        const empRes = await fetch('http://localhost:5000/api/org/employees');
        setEmployees(await empRes.json());
      } catch (err) {
        console.error('Failed to fetch org data', err);
      }
    };
    fetchOrgData();
  }, [token]);

  const promoteToRole = async (empId, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/org/employees/${empId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        const updated = await res.json();
        setEmployees(employees.map(e => e._id === updated._id ? updated : e));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShieldAlert size={32} color="var(--warning)" />
        <h1 className="heading" style={{ fontSize: '2rem' }}>Organization Setup</h1>
        <span style={{ 
          background: 'var(--surface-hover)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '99px', 
          fontSize: '0.875rem',
          marginLeft: 'auto'
        }}>Admin Only</span>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <button 
            className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
            style={tabStyle(activeTab === 'departments')}
          >
            <Building size={18} /> Departments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
            style={tabStyle(activeTab === 'categories')}
          >
            <Tag size={18} /> Asset Categories
          </button>
          <button 
            className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
            style={tabStyle(activeTab === 'directory')}
          >
            <Users size={18} /> Employee Directory
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '2rem' }}>
          {activeTab === 'departments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Department Management</h3>
                <button className="btn btn-primary">+ New Department</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Head</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}>{dept.name}</td>
                      <td style={tdStyle}>{dept.description}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle('var(--success)')}>Active</span>
                      </td>
                      <td style={tdStyle}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Asset Categories</h3>
                <button className="btn btn-primary">+ New Category</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Category Name</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}>{cat}</td>
                      <td style={tdStyle}>Auto-generated category</td>
                      <td style={tdStyle}>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'directory' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Employee Directory</h3>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Department</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}>{emp.fullName}</td>
                      <td style={tdStyle}>{emp.email}</td>
                      <td style={tdStyle}>{emp.department || 'Unassigned'}</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle(emp.role === 'Employee' ? 'var(--text-secondary)' : 'var(--accent-color)')}>
                          {emp.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => promoteToRole(emp._id, 'Asset Manager')} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Make Asset Manager</button>
                          <button onClick={() => promoteToRole(emp._id, 'Department Head')} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Make Dept Head</button>
                        </div>
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

// Inline styles for quick setup
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
