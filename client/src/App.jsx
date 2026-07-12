import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Box, Lock, Mail, Activity, Users, LogIn, Settings, Package, Calendar, ClipboardCheck } from 'lucide-react';
import OrgSetup from './pages/OrgSetup';
import AssetDirectory from './pages/AssetDirectory';
import Operations from './pages/Operations';
import Dashboard from './pages/Dashboard';
import AuditsReports from './pages/AuditsReports';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

// Minimal inline styles for layout
const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  }
};

function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(fullName, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Box size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
        <h2 className="heading" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {isLogin ? 'Welcome back to AssetFlow' : 'Create an Account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {isLogin ? 'Enter your credentials to access your dashboard' : 'Register to manage enterprise assets'}
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!isLogin && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" className="input-field" placeholder="John Doe" style={{ paddingLeft: '2.5rem' }} value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
          </div>
        )}
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="email" className="input-field" placeholder="you@company.com" style={{ paddingLeft: '2.5rem' }} value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="password" className="input-field" placeholder="••••••••" style={{ paddingLeft: '2.5rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', fontSize: '1rem' }}>
          {isLogin ? (
            <>
              <LogIn size={18} style={{ marginRight: '0.5rem' }} />
              Sign In
            </>
          ) : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button 
          onClick={() => setIsLogin(!isLogin)}
          style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: '500' }}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </div>
    </div>
  );
}

// Replaced DashboardPlaceholder

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
};

function AppContent() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div style={styles.appContainer}>
        <nav style={styles.navbar}>
          <div style={styles.logo}>
            <Box color="var(--accent-color)" />
            <span>AssetFlow</span>
          </div>
          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} /> Dashboard
            </Link>
            <Link to="/operations" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} /> Operations
            </Link>
            <Link to="/assets" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} /> Assets
            </Link>
            <Link to="/audits" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardCheck size={18} /> Audits
            </Link>
            <Link to="/org-setup" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Setup
            </Link>
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </div>
          ) : (
            <div>
              <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Login</Link>
            </div>
          )}
        </nav>
        
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/org-setup" element={<ProtectedRoute><OrgSetup /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><AssetDirectory /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />
            <Route path="/audits" element={<ProtectedRoute><AuditsReports /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
