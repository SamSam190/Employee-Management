import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Save, User } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      await api.post('/employees', payload);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding employee');
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Add New Employee</h1>
      </div>

      <div className="card">
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Smith" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@company.com" />
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="" disabled>Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" placeholder="e.g. 3" />
            </div>
          </div>

          <div className="form-group">
            <label>Skills (Comma separated)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="React, Node.js, MongoDB" />
          </div>

          <div className="form-group">
            <label>Performance Score (0-100)</label>
            <input type="number" name="performanceScore" value={formData.performanceScore} onChange={handleChange} required min="0" max="100" placeholder="e.g. 85" />
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }} onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
