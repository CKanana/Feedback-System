import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ staffName, profilePhoto, onMobileMenuToggle, showMobileMenuButton }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificationCount] = useState(3);

  const handleLogout = () => {
    navigate('/');
  };

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Mobile Menu Button */}
        {showMobileMenuButton && (
          <button
            className="mobile-menu-btn"
            onClick={onMobileMenuToggle}
            title="Toggle Menu"
          >
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        
        {/* Spacer to push notifications to the right */}
        <div style={{ flex: 1 }}></div>
        
        <div className="header-actions">
          {/* Notifications */}
          <div className="header-action-item">
            <button
              className="header-action-btn"
              onClick={handleNotifications}
              title="Notifications"
            >
              <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                  <button 
                    className="clear-all-btn"
                    onClick={() => setShowNotifications(false)}
                  >
                    Clear all
                  </button>
                </div>
                <div className="notifications-list">
                  <div className="notification-item">
                    <div className="notification-content">
                      <div className="notification-title">New Survey Available</div>
                      <div className="notification-time">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <div className="notification-title">Poll Reminder</div>
                      <div className="notification-time">1 hour ago</div>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <div className="notification-title">Survey Completed</div>
                      <div className="notification-time">3 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;