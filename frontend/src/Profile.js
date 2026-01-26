import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import './StaffDashboard.css';

const Profile = () => {
    // Hardcoded user info for demo
    const user = {
        name: 'Crystal',
        email: 'crystal@example.com',
        department: 'HR'
    };
    const [photo, setPhoto] = useState(null);
    const navigate = useNavigate();
    const gotoStaffDashboard = () => {navigate ('/dashboard')}

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

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Add nav item style logic for orange highlight and white text
    const navItems = [
        { key: 'overview', label: 'Overview', path: '/dashboard' },
        { key: 'surveys', label: 'My Surveys', path: '/dashboard' },
        { key: 'polls', label: 'Active Polls', path: '/dashboard' },
        { key: 'history', label: 'History', path: '/dashboard' },
        { key: 'profile', label: 'Profile', path: '/profile' },
    ];
    const [activeSection, setActiveSection] = useState('profile');
    const getNavItemStyle = (section) => ({
        cursor: 'pointer',
        padding: '12px 15px',
        color: activeSection === section ? '#F7941E' : '#fff',
        fontWeight: activeSection === section ? '700' : '500',
        background: activeSection === section ? '#fff0f7' : 'transparent',
        borderLeft: activeSection === section ? '4px solid #F7941E' : '4px solid transparent',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    return (
        <div className="profile-page-bg" style={{ position: 'relative' }}>
            {/* Sidebar from StaffDashboard */}
            <aside className="sidebar-nav">
                <div className="sidebar-logo">
                    <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoStaffDashboard} alt="Virtual Pay Logo" className="dashboard-logo" />
                </div>
                <nav className="sidebar-nav-menu">
                    <ul className="sidebar-nav-list">
                        <li tabIndex="0" role="button" className="sidebar-nav-item overview" onClick={() => { setActiveSection('overview'); navigate('/dashboard'); }}>Overview</li>
                        <li tabIndex="0" role="button" className="sidebar-nav-item surveys" onClick={() => { setActiveSection('surveys'); navigate('/dashboard'); }}>My Surveys</li>
                        <li tabIndex="0" role="button" className="sidebar-nav-item polls" onClick={() => { setActiveSection('polls'); navigate('/dashboard'); }}>Active Polls</li>
                        <li tabIndex="0" role="button" className="sidebar-nav-item history" onClick={() => { setActiveSection('history'); navigate('/dashboard'); }}>History</li>
                        <li tabIndex="0" role="button" className="sidebar-nav-item profile" onClick={() => { setActiveSection('profile'); navigate('/profile'); }}>Profile</li>
                        <li tabIndex="0" role="button" className="sidebar-nav-item logout" onClick={() => navigate('/')}>Log Out</li>
                    </ul>
                </nav>
            </aside>
            <div className="dashboard-topbar" style={{ position: 'relative' }}>
                <div className="dashboard-icons">
                    <span className="dashboard-icon notification-icon" title="Notifications">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    </span>
                    <span className="dashboard-icon profile-icon" title="Profile" tabIndex={0} onClick={() => setShowProfileMenu(v => !v)}>
                                                {/* Red circle block icon SVG */}
                                                <svg width="32" height="32" viewBox="0 0 32 32" className="profile-photo-thumb" aria-label="Profile" style={{ display: 'block' }}>
                                                    <circle cx="16" cy="16" r="14" fill="#e53935" />
                                                    <rect x="9" y="15" width="14" height="2.5" rx="1.25" fill="#fff" />
                                                </svg>
                    </span>
                </div>
                {showProfileMenu && (
                    <div className="profile-menu-overlay" onClick={() => setShowProfileMenu(false)}>
                        <div className="profile-menu" onClick={e => e.stopPropagation()}>
                            <div className="profile-menu-header">
                                <img src={process.env.PUBLIC_URL + '/profile-photo.png'} alt="Profile" className="profile-photo-large" />
                                <div className="profile-menu-name">Crystal</div>
                                <div className="profile-menu-role">Staff Member</div>
                            </div>
                            <ul className="profile-menu-list">
                                <li>Email: crystal@example.com</li>
                                <li>Department: HR</li>
                                <li>Location: Nairobi</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <div className="profile-card-center">
                <div className="profile-card">
                    <form className="profile-form">
                        <h1 className="profile-title">Edit Profile</h1>
                        <img
                            src={photo || process.env.PUBLIC_URL + "/profile-photo.png"}
                            alt="Profile Preview"
                            className="pfp-preview"
                        />
                        <input
                            type="file"
                            className="pfp-input"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                        <input type="text" className="name-input" placeholder={user.name} />
                        <input type="email" className="email-input" placeholder={user.email} value={user.email} readOnly />
                        <input type="text" className="department-input" placeholder={user.department} value={user.department} readOnly />
                        <button type="submit" className="save-button">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;