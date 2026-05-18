import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, LogOut, Users, PlusCircle, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity color="var(--primary)" size={28} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }}>PerformIQ</span>
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/"><Users size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Directory</Link>
              <Link to="/add"><PlusCircle size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> Add Employee</Link>
              <Link to="/ai-insights"><Sparkles size={18} style={{ marginRight: '5px', verticalAlign: 'middle' }}/> AI Insights</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', fontWeight: '500' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
