import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import './StaffDashboard.css';
import axios from 'axios';
import { auth } from './firebase';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState(null); // This will hold the file object for upload
    const [photoPreview, setPhotoPreview] = useState(process.env.PUBLIC_URL + "/profile-photo.png"); // For display
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    navigate('/auth');
                    return;
                }
                const token = await currentUser.getIdToken();
                const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(data.user);
                if (data.user.photo) {
                    setPhotoPreview(`http://localhost:5000${data.user.photo}`);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                navigate('/auth');
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                fetchProfile();
            } else {
                navigate('/auth');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file); // Store the file object for upload
            setPhotoPreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        }
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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
        padding: '12px 20px',
        color: activeSection === section ? '#B24592' : '#fff',
        fontWeight: activeSection === section ? '700' : '500',
        background: activeSection === section ? '#fff0f7' : 'transparent',
        borderLeft: activeSection === section ? '4px solid #B24592' : '4px solid transparent',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    // Yup schema for profile form
    const profileSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        if (!auth.currentUser) return;

        try {
            const formData = new FormData();
            formData.append('name', values.name);
            if (photo) {
                formData.append('photo', photo);
            }

            const token = await auth.currentUser.getIdToken();
            await axios.put('http://localhost:5000/api/auth/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Profile updated successfully!');
            // Refresh profile info after update
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(data.user);
            if (data.user.photo) {
                setPhotoPreview(`http://localhost:5000${data.user.photo}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="profile-page-bg" style={{ position: 'relative' }}>
            {/* Sidebar from StaffDashboard */}
            <aside className="sidebar-nav" style={{ background: 'linear-gradient(135deg, #7D1F4B 0%, #B24592 100%)' }}>
                <div className="sidebar-logo">
                    <img src={process.env.PUBLIC_URL + '/vp-pic.png'} alt="Virtual Pay Logo" className="dashboard-logo" />
                </div>
                <nav className="sidebar-nav-menu">
                    <ul className="sidebar-nav-list" style={{ padding: 0, listStyle: 'none' }}>
                        <li tabIndex="0" role="button" style={getNavItemStyle('overview')} onClick={() => { setActiveSection('overview'); navigate('/dashboard'); }}>Overview</li>
                        <li tabIndex="0" role="button" style={getNavItemStyle('surveys')} onClick={() => { setActiveSection('surveys'); navigate('/dashboard'); }}>My Surveys</li>
                        <li tabIndex="0" role="button" style={getNavItemStyle('polls')} onClick={() => { setActiveSection('polls'); navigate('/dashboard'); }}>Active Polls</li>
                        <li tabIndex="0" role="button" style={getNavItemStyle('history')} onClick={() => { setActiveSection('history'); navigate('/dashboard'); }}>History</li>
                        <li tabIndex="0" role="button" style={getNavItemStyle('profile')} onClick={() => { setActiveSection('profile'); navigate('/profile'); }}>Profile</li>
                        <li tabIndex="0" role="button" style={{...getNavItemStyle('logout'), color: '#fde2e2'}} onClick={() => navigate('/')}>Log Out</li>
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
                                <img src={photoPreview} alt="Profile" className="profile-photo-large" />
                                <div className="profile-menu-name">{user?.name || '...'}</div>
                                <div className="profile-menu-role">{user?.role || '...'}</div>
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
            <div className="profile-card-center" style={{ marginLeft: '180px' }}>
                {loading ? (
                    <div className="profile-card">Loading...</div>
                ) : (
                    <div className="profile-card">
                        <Formik
                            initialValues={{ name: user?.name || '' }}
                            validationSchema={profileSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <Form className="profile-form">
                                    <h1 className="profile-title">Edit Profile</h1>
                                    <div className="pfp-preview-wrapper" onClick={handlePhotoClick} style={{ cursor: 'pointer' }}>
                                        <img
                                            src={photoPreview}
                                            alt="Profile Preview"
                                            className="pfp-preview"
                                        />
                                        <div className="pfp-upload-overlay">Click to change</div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        id="photo-upload"
                                        type="file"
                                        className="pfp-input"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Field
                                        type="text"
                                        name="name"
                                        className="name-input"
                                        placeholder="Your Name"
                                    />
                                    <ErrorMessage name="name" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                                    <input type="email" className="email-input" value={user?.email || ''} readOnly />
                                    <input type="text" className="department-input" value={user?.department || ''} readOnly />
                                    <button type="submit" className="save-button" disabled={isSubmitting}>Save Changes</button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;