import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const adminNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'create-poll', label: 'Create Poll' },
    { id: 'view-polls', label: 'All Polls' },
    { id: 'create-survey', label: 'Create Survey' },
    { id: 'view-surveys', label: 'All Surveys' },
    { id: 'create-department', label: 'Create Department' },
    { id: 'create-group', label: 'Create Group' },
    { id: 'profile', label: 'Profile', path: '/admin-profile' },
];

const staffNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'surveys', label: 'My Surveys' },
    { id: 'polls', label: 'Active Polls' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile', path: '/profile' },
];

const Sidebar = ({ role, activeSection, setActiveSection }) => {
    const navigate = useNavigate();
    const navItems = role === 'admin' ? adminNavItems : staffNavItems;

    const getNavItemStyle = (sectionId) => ({
        padding: '12px 20px',
        cursor: 'pointer',
        backgroundColor: activeSection === sectionId ? '#fff0f7' : 'transparent',
        color: activeSection === sectionId ? (role === 'admin' ? '#B24592' : '#F7941E') : '#fff',
        fontWeight: activeSection === sectionId ? '700' : '500',
        fontSize: '1.05rem',
        borderLeft: activeSection === sectionId ? `4px solid ${role === 'admin' ? '#B24592' : '#F7941E'}` : '4px solid transparent',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    const handleNavClick = (item) => {
        if (item.path) {
            navigate(item.path);
        } else {
            if (role === 'staff' && ['overview', 'surveys', 'polls', 'history'].includes(item.id)) {
                navigate('/dashboard');
            }
            setActiveSection(item.id);
        }
    };

    const gotoDashboard = () => {
        setActiveSection('overview');
        if (role === 'admin') {
            // Stays on the same page, just changes section
        } else {
            navigate('/dashboard');
        }
    }

    return (
        <aside className="sidebar-nav">
            <div className="sidebar-logo">
                <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoDashboard} alt="Virtual Pay Logo" className="dashboard-logo" />
            </div>
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {navItems.map((item) => (
                        <li key={item.id} tabIndex="0" role="button" style={getNavItemStyle(item.id)} onClick={() => handleNavClick(item)}>
                            {item.label}
                        </li>
                    ))}
                    <li tabIndex="0" role="button" style={{ ...getNavItemStyle('logout'), color: '#fde2e2' }} onClick={() => navigate('/')}>
                        Log Out
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;