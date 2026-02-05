import React from 'react';
import './Sidebar.css';

const Sidebar = ({
  activeSection,
  setActiveSection,
  pendingSurveyCount,
  activePollCount,
  gotoProfile,
  navigate,
  collapsed,
  onToggle,
  showMobileMenu
}) => {
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      badge: pendingSurveyCount + activePollCount,
      action: () => setActiveSection('overview'),
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      )
    },
    {
      id: 'surveys',
      label: 'My Surveys',
      badge: pendingSurveyCount,
      action: () => setActiveSection('surveys'),
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      )
    },
    {
      id: 'polls',
      label: 'Active Polls',
      badge: activePollCount,
      action: () => setActiveSection('polls'),
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    {
      id: 'history',
      label: 'History',
      badge: 0,
      action: () => setActiveSection('history'),
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      )
    }
  ];

  const accountItems = [
    { 
      id: 'profile', 
      label: 'Profile', 
      action: gotoProfile, 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    { 
      id: 'logout', 
      label: 'Sign Out', 
      action: () => navigate('/'), 
      isLogout: true, 
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      )
    }
  ];

  return (
    <aside className={`modern-sidebar ${collapsed ? 'collapsed' : ''} ${showMobileMenu ? 'mobile-open' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className={`logo-container ${collapsed ? 'centered' : ''}`}>
          <div className="logo-icon">
            <img
              src={process.env.PUBLIC_URL + '/vp-pic.png'}
              alt="Virtual Pay"
              className="logo-image"
            />
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="nav-section">
          <nav className="nav-list">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="nav-item-content">
                  {item.icon}
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </div>
                {item.badge > 0 && !collapsed && (
                  <span className="nav-badge">{item.badge}</span>
                )}
                {item.badge > 0 && collapsed && (
                  <span className="nav-badge-dot"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          {accountItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`nav-item ${item.isLogout ? 'logout' : ''} ${activeSection === item.id ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div className="nav-item-content">
                {item.icon}
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </div>
            </button>
          ))}

          <button
            onClick={onToggle}
            className="collapse-btn"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            ) : (
              <>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="15,18 9,12 15,6"/>
                </svg>
                <span className="nav-label">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
