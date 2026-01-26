
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
// Style objects from admin.js for consistency
const cardStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '2rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.05)',
  marginBottom: '2rem'
};
const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #e1e1e1',
  marginTop: '8px',
  marginBottom: '20px',
  fontSize: '0.95rem',
  transition: 'border-color 0.2s'
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [admin, setAdmin] = useState({
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Administrator',
    phone: '',
    organization: 'Virtual Pay',
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save admin profile logic here
    alert('Profile updated!');
  };

  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <aside className="sidebar-nav">
        <div className="sidebar-logo">
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={() => navigate('/admin')} alt="Virtual Pay Logo" className="dashboard-logo" />
        </div>
        <nav style={{ marginTop: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li tabIndex="0" role="button" style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: '#fff0f7', color: '#B24592', fontWeight: '700', fontSize: '1.05rem', borderLeft: '4px solid #B24592' }} onClick={() => navigate('/admin-profile')}>Profile</li>
            <li tabIndex="0" role="button" style={{ padding: '12px 20px', cursor: 'pointer', color: '#B24592', fontWeight: '500', fontSize: '1.05rem', borderLeft: '4px solid transparent' }} onClick={() => navigate('/admin')}>Dashboard</li>
            <li tabIndex="0" role="button" style={{ padding: '12px 20px', cursor: 'pointer', color: '#333', fontWeight: '500', fontSize: '1.05rem', borderLeft: '4px solid transparent' }} onClick={() => navigate('/')}>Log Out</li>
          </ul>
        </nav>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <main className="admin-main-content" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          <section style={{ animation: 'fadeIn 0.5s ease', ...cardStyle, maxWidth: 500, margin: '0 auto' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Admin Profile</h2>
            <form className="admin-profile-form" onSubmit={handleSubmit}>
              <img
                src={photo || process.env.PUBLIC_URL + '/profile-photo.png'}
                alt="Admin Preview"
                className="admin-pfp-preview"
                style={{ display: 'block', margin: '0 auto 1.5rem', width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #B24592' }}
              />
              <input
                type="file"
                className="admin-pfp-input"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ marginBottom: 20 }}
              />
              <input
                type="text"
                name="name"
                className="admin-name-input"
                placeholder="Name"
                value={admin.name}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                className="admin-email-input"
                placeholder="Email"
                value={admin.email}
                readOnly
                disabled
                style={inputStyle}
              />
              <input
                type="text"
                name="role"
                className="admin-role-input"
                placeholder="Role"
                value={admin.role}
                readOnly
                disabled
                style={inputStyle}
              />
              <button type="submit" className="admin-save-button" style={{
                background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)',
                color: 'white',
                padding: '14px 32px',
                border: 'none',
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 600,
                marginTop: '1.5rem',
                width: '100%'
              }}>Save Changes</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
