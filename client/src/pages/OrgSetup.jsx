import { useState, useEffect, useContext } from 'react';
import { Users, Building, Tag, Check, X, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function OrgSetup() {
  const { token, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ fullName: '', email: '', password: '', role: 'Employee', department: '' });

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });
  const [editingDeptId, setEditingDeptId] = useState(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const depRes = await fetch('/api/org/departments');
        setDepartments(await depRes.json());
        
        const catRes = await fetch('/api/org/categories');
        setCategories(await catRes.json());
        
        const empRes = await fetch('/api/org/employees');
        setEmployees(await empRes.json());
      } catch (err) {
        console.error('Failed to fetch org data', err);
      }
    };
    fetchOrgData();
  }, [token]);

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    try {
      const url = editingDeptId ? `/api/org/departments/${editingDeptId}` : '/api/org/departments';
      const method = editingDeptId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
      if (res.ok) {
        fetchOrgData();
        setShowDeptModal(false);
        setNewDept({ name: '', description: '' });
        setEditingDeptId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      const res = await fetch(`/api/org/departments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchOrgData();
    } catch (err) {
      console.error(err);
    }
  };

  const promoteToRole = async (empId, newRole) => {
    try {
      const res = await fetch(`/api/org/employees/${empId}/role`, {
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

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/org/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
      if (res.ok) {
        const added = await res.json();
        setEmployees([...employees, added]);
        setShowAddEmpModal(false);
        setNewEmp({ fullName: '', email: '', password: '', role: 'Employee', department: '' });
      } else {
        const errorData = await res.json();
        alert('Error: ' + errorData.message);
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
                <button onClick={() => { setEditingDeptId(null); setNewDept({ name: '', description: '' }); setShowDeptModal(true); }} className="btn btn-primary">+ New Department</button>
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setEditingDeptId(dept._id); setNewDept({ name: dept.name, description: dept.description }); setShowDeptModal(true); }} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Edit</button>
                          <button onClick={() => handleDeleteDepartment(dept._id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', color: 'var(--danger)' }}>Delete</button>
                        </div>
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
                <button onClick={() => alert('Categories are dynamically gathered from your registered assets. Register a new asset with a new category name to add one!')} className="btn btn-primary">+ New Category</button>
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Category Name</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={tdStyle}>{cat}</td>
                      <td style={tdStyle}>Auto-generated from Asset Directory</td>
                      <td style={tdStyle}>
                        <span style={badgeStyle('var(--success)')}>Active</span>
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
                <button onClick={() => setShowAddEmpModal(true)} className="btn btn-primary">+ Add Employee</button>
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

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowAddEmpModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 className="heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add New Employee</h2>
            <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                <input type="text" className="input-field" value={newEmp.fullName} onChange={e => setNewEmp({...newEmp, fullName: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                <input type="email" className="input-field" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Temporary Password</label>
                <input type="password" className="input-field" value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
                <select className="input-field" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                  <option>Employee</option>
                  <option>Department Head</option>
                  <option>Asset Manager</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Account</button>
            </form>
          </div>
        </div>
      )}
      {/* Department Modal */}
      {showDeptModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowDeptModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 className="heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{editingDeptId ? 'Edit Department' : 'New Department'}</h2>
            <form onSubmit={handleSaveDepartment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Department Name</label>
                <input type="text" className="input-field" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <input type="text" className="input-field" value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save</button>
            </form>
          </div>
        </div>
      )}
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
