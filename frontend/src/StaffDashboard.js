import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import Sidebar from './Sidebar';
import Header from './Header';
import ReplyModal from './ReplyModal';
import SuccessToast from './SuccessToast';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

const StaffDashboard = () => {
  // Survey form state for local draft and active survey
  const [activeSurveyId, setActiveSurveyId] = useState(null);
  const [drafts, setDrafts] = useState({}); // { [surveyId]: { q1, q2, ... } }

  // Save draft locally (in-memory, can be extended to localStorage)
  const handleSaveDraft = (surveyId) => {
    setToastMessage('Draft saved locally!');
    setShowSuccessToast(true);
    // Optionally persist to localStorage here
  };

  // Complete survey: mark as completed, clear active, and show toast
  const handleCompleteSurvey = (surveyId) => {
    setSurveys(surveys => surveys.map(s => s.id === surveyId ? { ...s, status: 'Completed' } : s));
    setActiveSurveyId(null);
    setToastMessage('Survey submitted!');
    setShowSuccessToast(true);
    // Optionally send to backend here
  };
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [historyTab, setHistoryTab] = useState('surveys');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('all'); // 'all', 'surveys', 'polls'
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'surveys', 'polls'
  const [surveyFilter, setSurveyFilter] = useState('all'); // 'all', 'pending', 'started', 'high', 'medium', 'low'
  const [surveySearchTerm, setSurveySearchTerm] = useState('');
  const [staffName, setStaffName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user name from backend using Firebase Auth email
  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const { data } = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data.user);
        setStaffName(data.user.name || currentUser.email);
        if (data.user.photo) {
          setProfilePhoto(data.user.photo.startsWith('http') ? data.user.photo : `http://localhost:5000${data.user.photo}`);
        } else {
          setProfilePhoto(null);
        }
      } catch (err) {
        setStaffName(currentUser.email);
      }
    };
    fetchUserProfile();
  }, []);
  
  const gotoProfile = () => { 
    setActiveSection('profile');
  }
  const gotoStaffDashboard = () => { navigate ('/dashboard')}

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Handle mobile sidebar overlay
  const handleMobileOverlayClick = () => {
    setShowMobileMenu(false);
  };

  // Activity timeline data
  const activityItems = [
    {
      id: 1,
      type: 'survey',
      title: 'Q1 Employee Satisfaction Survey',
      description: 'New survey available - Help us improve your work experience',
      time: '2 hours ago',
      action: () => setActiveSection('surveys'),
      actionLabel: 'Take Survey'
    },
    {
      id: 2,
      type: 'poll',
      title: 'Office Layout Preferences',
      description: 'Quick poll - Share your workspace preferences',
      time: '1 day ago',
      action: () => setActiveSection('polls'),
      actionLabel: 'Vote Now'
    },
    {
      id: 3,
      type: 'survey',
      title: 'Remote Work Check-in',
      description: 'Completed - Thank you for your feedback!',
      time: '3 days ago',
      completed: true
    },
    {
      id: 4,
      type: 'poll',
      title: 'Team Building Activity Preferences',
      description: 'Help us plan the next team event',
      time: '5 days ago',
      action: () => setActiveSection('polls'),
      actionLabel: 'Vote Now'
    },
    {
      id: 5,
      type: 'survey',
      title: 'IT Security Training Feedback',
      description: 'Share your thoughts on the recent training session',
      time: '1 week ago',
      completed: true
    }
  ];

  // Filter activity items based on selected filter
  const getFilteredActivityItems = () => {
    if (activityFilter === 'all') {
      return activityItems;
    }
    return activityItems.filter(item => 
      activityFilter === 'surveys' ? item.type === 'survey' : item.type === 'poll'
    );
  };

  // Filter surveys based on selected filters and search term
  const getFilteredSurveys = () => {
    let filtered = surveys.filter(s => ['Pending', 'Started'].includes(s.status));
    
    // Apply status/urgency filter
    if (surveyFilter !== 'all') {
      if (['pending', 'started'].includes(surveyFilter)) {
        filtered = filtered.filter(s => s.status.toLowerCase() === surveyFilter);
      } else if (['high', 'medium', 'low'].includes(surveyFilter)) {
        filtered = filtered.filter(s => s.urgency === surveyFilter);
      }
    }
    
    // Apply search filter
    if (surveySearchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(surveySearchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(surveySearchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(surveySearchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  
  const [surveys, setSurveys] = useState([]);

  // Fetch surveys from backend for this user
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        // Use the same auth token logic as user profile fetch
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const token = await currentUser.getIdToken();
        const { data } = await axios.get('http://localhost:5000/api/survey/my', {
          headers: { 'x-auth-token': token }
        });
        setSurveys(data || []);
      } catch (err) {
        setSurveys([]);
      }
    };
    fetchSurveys();
  }, []);

  const [polls, setPolls] = useState([]);

  // Fetch polls sent to this user from backend
  useEffect(() => {
    axios.get('/api/survey/received-polls')
      .then(res => {
        setPolls(res.data.polls || []);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch polls');
        setIsLoading(false);
      });
  }, []);
  // Track local selection for each poll
  const [pollSelections, setPollSelections] = useState({});
  // Confirmation dialog state
  const [confirmVote, setConfirmVote] = useState({ open: false, pollId: null, option: null });
  const [pollHistory, setPollHistory] = useState([]);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [processingAction, setProcessingAction] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate real-time incoming poll
  useEffect(() => {
    const timer = setTimeout(() => {
      const newPoll = { 
        id: 999, 
        question: "Friday Theme Idea?", 
        options: ["Casual", "Hawaiian", "Sports"], 
        voted: null, 
        from: "Social Committee", 
        anonymous: false, 
        totalVotes: 12 
      };
      setPolls(prev => [newPoll, ...prev]);
      setIsLoading(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Warn about unsaved changes (e.g. unposted comments)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasUnsavedComments = Object.values(commentInputs).some(input => input && input.trim().length > 0);
      if (hasUnsavedComments) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [commentInputs]);

  // When user clicks 'Submit Vote', show confirmation dialog
  const handleVoteSubmit = (pollId) => {
    const option = pollSelections[pollId];
    if (option) {
      setConfirmVote({ open: true, pollId, option });
    }
  };

  const handleShare = (question) => {
    navigator.clipboard.writeText(`Vote on: "${question}" - Shared from VirtualPay`);
    setToastMessage("Poll link copied to clipboard!");
    setShowSuccessToast(true);
  };

  // Filter and search history items
  const getFilteredHistoryItems = () => {
    let allItems = [];
    
    // Add completed surveys
    const completedSurveys = surveys.filter(s => s.status === 'Completed').map(survey => ({
      ...survey,
      type: 'survey',
      completedDate: '2024-01-15', // Mock date
      description: survey.description || 'Survey completed successfully'
    }));
    
    // Add poll history
    const pollHistoryItems = pollHistory.map(poll => ({
      ...poll,
      type: 'poll',
      completedDate: '2024-01-10', // Mock date
      title: poll.question,
      description: `You voted for: ${poll.voted}`
    }));
    
    allItems = [...completedSurveys, ...pollHistoryItems];
    
    // Apply type filter
    if (historyTypeFilter !== 'all') {
      allItems = allItems.filter(item => 
        historyTypeFilter === 'surveys' ? item.type === 'survey' : item.type === 'poll'
      );
    }
    
    // Apply search filter
    if (historySearchTerm) {
      allItems = allItems.filter(item =>
        item.title.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(historySearchTerm.toLowerCase()))
      );
    }
    
    // Apply date filters
    if (historyDateFrom) {
      allItems = allItems.filter(item => item.completedDate >= historyDateFrom);
    }
    if (historyDateTo) {
      allItems = allItems.filter(item => item.completedDate <= historyDateTo);
    }
    
    // Sort by completion date (newest first)
    return allItems.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));
  };

  const clearHistoryFilters = () => {
    setHistorySearchTerm('');
    setHistoryDateFrom('');
    setHistoryDateTo('');
    setHistoryTypeFilter('all');
  };

  // When user confirms vote
  const handleVoteConfirm = () => {
    const { pollId, option } = confirmVote;
    setProcessingAction('vote-confirm');
    setError(null);
    
    setTimeout(() => {
      // Show visual success state for 1s before removing poll
      setPolls(prevPolls => prevPolls.map(p => p.id === pollId ? { ...p, voted: option, justVoted: true } : p));
      setTimeout(() => {
        setPolls(prevPolls => {
          const updatedPolls = prevPolls.map(p => p.id === pollId ? { ...p, voted: option } : p);
          const answeredPoll = updatedPolls.find(p => p.id === pollId);
          if (answeredPoll) {
            // Generate mock results for display
            const mockResults = answeredPoll.options.map(opt => {
                const isSelected = opt === option;
                // Random count between 5 and 50, plus 1 if selected by user
                const count = Math.floor(Math.random() * 45) + 5 + (isSelected ? 1 : 0);
                return { option: opt, count };
            });
            const total = mockResults.reduce((sum, item) => sum + item.count, 0);
            const resultsWithPercent = mockResults.map(item => ({
                ...item,
                percent: Math.round((item.count / total) * 100)
            }));
            setPollHistory(prevHistory => [...prevHistory, { 
              ...answeredPoll, 
              voted: option, 
              results: resultsWithPercent, 
              totalVotes: total,
              comments: [
                { user: "Alex", text: "Great initiative!", time: "2m ago" },
                { user: "Sarah", text: "I prefer the other option.", time: "5m ago" }
              ] 
            }]);
          }
          // Remove poll from active list after voting
          return updatedPolls.filter(p => p.id !== pollId);
        });
        setToastMessage("Vote recorded! Thanks for participating.");
        setShowSuccessToast(true);
        setConfirmVote({ open: false, pollId: null, option: null });
        setPollSelections(prev => {
          const copy = { ...prev };
          delete copy[pollId];
          return copy;
        });
        setProcessingAction(null);
      }, 1000);
    }, 800);
  };

  // When user cancels confirmation
  const handleVoteCancel = () => {
    setConfirmVote({ open: false, pollId: null, option: null });
  };

  const handleStartSurvey = (title) => {
    setProcessingAction(`start-${title}`);
    setError(null);
    setTimeout(() => {
      setSurveys(surveys => surveys.map(s => s.title === title ? { ...s, status: 'Started' } : s));
      setToastMessage(`Started survey: ${title}`);
      setShowSuccessToast(true);
      setProcessingAction(null);
    }, 1000);
  };

  const submitComment = (pollId) => {
    if (!commentInputs[pollId]) return;
    setPollHistory(prev => prev.map(p => {
      if (p.id === pollId) {
        return { ...p, comments: [...(p.comments || []), { user: "You", text: commentInputs[pollId], time: "Just now" }] };
      }
      return p;
    }));
    setCommentInputs(prev => ({ ...prev, [pollId]: "" }));
    setToastMessage("Comment posted successfully");
    setShowSuccessToast(true);
  };

  // Survey and poll counts for badges
  const pendingSurveyCount = surveys.filter(s => s.status === 'Pending').length;
  const activePollCount = polls.length;

  const EmptyState = ({ title, message, icon }) => (
    <div style={{ 
      textAlign: 'center', 
      padding: '3rem 2rem', 
      background: '#fff', 
      borderRadius: '16px', 
      border: '2px dashed #e0e0e0',
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.8 }}>{icon}</div>
      <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700 }}>{title}</h3>
      <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6', fontSize: '1.05rem' }}>{message}</p>
    </div>
  );

  return (
    <div className="staff-dashboard">
      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="mobile-overlay"
          onClick={handleMobileOverlayClick}
        />
      )}

      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        pendingSurveyCount={pendingSurveyCount}
        activePollCount={activePollCount}
        gotoProfile={gotoProfile}
        navigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        showMobileMenu={showMobileMenu}
      />
      
      <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          staffName={staffName}
          profilePhoto={profilePhoto}
        />
        
        <button className="hamburger-menu" aria-label="Open navigation" onClick={toggleSidebar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        {showMobileMenu && (
          <div className="mobile-sidebar-dropdown">
            <div className="sidebar-logo">
              <img src={process.env.PUBLIC_URL + '/vp-pic.png'} alt="Virtual Pay Logo" className="dashboard-logo" />
            </div>
            <nav>
              <ul>
                <li tabIndex="0" role="button" onClick={() => { setActiveSection('overview'); setShowMobileMenu(false); }}>
                  <span>Overview</span>
                  {(pendingSurveyCount + activePollCount) > 0 && <span className="nav-badge">{pendingSurveyCount + activePollCount}</span>}
                </li>
                <li tabIndex="0" role="button" onClick={() => { setActiveSection('surveys'); setShowMobileMenu(false); }}>
                  <span>My Surveys</span>
                  {pendingSurveyCount > 0 && <span className="nav-badge">{pendingSurveyCount}</span>}
                </li>
                <li tabIndex="0" role="button" onClick={() => { setActiveSection('polls'); setShowMobileMenu(false); }}>
                  <span>Active Polls</span>
                  {activePollCount > 0 && <span className="nav-badge">{activePollCount}</span>}
                </li>
                <li tabIndex="0" role="button" onClick={() => { setActiveSection('history'); setShowMobileMenu(false); }}>
                  <span>History</span>
                </li>
                <li tabIndex="0" role="button" onClick={() => { gotoProfile(); setShowMobileMenu(false); }}>
                  <span>Profile</span>
                </li>
                <li tabIndex="0" role="button" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <span>Log Out</span>
                </li>
              </ul>
            </nav>
            
            {/* Mobile User Profile Section */}
            <div className="sidebar-footer">
              <div className="sidebar-user-info" onClick={() => { gotoProfile(); setShowMobileMenu(false); }}>
                <img 
                  src={profilePhoto || process.env.PUBLIC_URL + '/vp-pic.png'} 
                  alt="User Avatar" 
                  className="sidebar-user-avatar" 
                />
                <div className="sidebar-user-details">
                  <div className="sidebar-user-name">{staffName || 'User'}</div>
                  <div className="sidebar-user-status">
                    <div className="status-indicator">
                      <div className="status-dot"></div>
                      <span>Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
            
        <main className="dashboard-content">

        {activeSection === 'overview' && (
          <section className="welcome-section fade-in" aria-label="Overview Section">
            {/* Interactive Stats Grid */}
            <div className="stats-grid">
              <Card className="stat-card" onClick={() => setActiveSection('surveys')}>
                <CardContent>
                  <div className="stat-number">{pendingSurveyCount}</div>
                  <div className="stat-label">Pending Surveys</div>
                  <div className="stat-description">Complete to help improve your workplace</div>
                  <div className="stat-arrow">→</div>
                </CardContent>
              </Card>
              
              <Card className="stat-card" onClick={() => setActiveSection('polls')}>
                <CardContent>
                  <div className="stat-number">{activePollCount}</div>
                  <div className="stat-label">Active Polls</div>
                  <div className="stat-description">Your opinion matters - vote now</div>
                  <div className="stat-arrow">→</div>
                </CardContent>
              </Card>
              
              <Card className="stat-card" onClick={() => setActiveSection('history')}>
                <CardContent>
                  <div className="stat-number">{surveys.filter(s => s.status === 'Completed').length + pollHistory.length}</div>
                  <div className="stat-label">Completed</div>
                  <div className="stat-description">Great job on your participation!</div>
                  <div className="stat-arrow">→</div>
                </CardContent>
              </Card>
              
              <Card className="achievement-card stat-card">
                <CardContent>
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Participation Rate</div>
                  <div className="stat-description">You're an active contributor!</div>
                  <div className="achievement-sparkle">✨</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Table */}
            <Card>
              <CardHeader>
                <div className="activity-header">
                  <CardTitle>Recent Activity</CardTitle>
                  <div className="activity-filter">
                    <button 
                      className={`filter-btn ${activityFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setActivityFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-btn ${activityFilter === 'surveys' ? 'active' : ''}`}
                      onClick={() => setActivityFilter('surveys')}
                    >
                      Surveys
                    </button>
                    <button 
                      className={`filter-btn ${activityFilter === 'polls' ? 'active' : ''}`}
                      onClick={() => setActivityFilter('polls')}
                    >
                      Polls
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getFilteredActivityItems().length > 0 ? (
                  <div className="activity-table-container">
                    <table className="activity-table">
                      <thead>
                        <tr className="table-header-row">
                          <th className="table-header">Activity</th>
                          <th className="table-header">Type</th>
                          <th className="table-header">Status</th>
                          <th className="table-header">Time</th>
                          <th className="table-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredActivityItems().map((item) => (
                          <tr key={item.id} className="table-row">
                            <td className="table-cell">
                              <div className="activity-info">
                                <div className="activity-icon">
                                  {item.type === 'survey' ? (
                                    <svg className="activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                      <polyline points="14,2 14,8 20,8"/>
                                      <line x1="16" y1="13" x2="8" y2="13"/>
                                      <line x1="16" y1="17" x2="8" y2="17"/>
                                    </svg>
                                  ) : (
                                    <svg className="activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <line x1="18" y1="20" x2="18" y2="10"/>
                                      <line x1="12" y1="20" x2="12" y2="4"/>
                                      <line x1="6" y1="20" x2="6" y2="14"/>
                                    </svg>
                                  )}
                                </div>
                                <div className="activity-details">
                                  <div className="activity-title">{item.title}</div>
                                  <div className="activity-description">{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="table-cell">
                              <span className={`type-badge ${item.type}`}>
                                {item.type === 'survey' ? 'Survey' : 'Poll'}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className={`status-badge ${item.completed ? 'completed' : 'pending'}`}>
                                {item.completed ? (
                                  <>
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <polyline points="20,6 9,17 4,12"/>
                                    </svg>
                                    Completed
                                  </>
                                ) : (
                                  <>
                                    <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <circle cx="12" cy="12" r="10"/>
                                      <polyline points="12,6 12,12 16,14"/>
                                    </svg>
                                    Pending
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="table-cell">
                              <span className="activity-time">{item.time}</span>
                            </td>
                            <td className="table-cell">
                              {item.action && !item.completed && (
                                <button className="activity-action-btn" onClick={item.action}>
                                  {item.actionLabel}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="activity-empty-state">
                    <div className="empty-state-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                    </div>
                    <h4 className="empty-state-title">No Recent Activity</h4>
                    <p className="empty-state-message">Your activity will appear here as you interact with surveys and polls.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </section>
        )}

        {activeSection === 'surveys' && (
          <section className="fade-in surveys-section" aria-label="My Surveys Section">
            <Card>
              <CardHeader>
                <div className="activity-header">
                  <CardTitle>My Surveys</CardTitle>
                  <div className="activity-filter">
                    <button 
                      className={`filter-btn ${surveyFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSurveyFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-btn ${surveyFilter === 'pending' ? 'active' : ''}`}
                      onClick={() => setSurveyFilter('pending')}
                    >
                      Pending
                    </button>
                    <button 
                      className={`filter-btn ${surveyFilter === 'started' ? 'active' : ''}`}
                      onClick={() => setSurveyFilter('started')}
                    >
                      In Progress
                    </button>
                    <button 
                      className={`filter-btn ${surveyFilter === 'high' ? 'active' : ''}`}
                      onClick={() => setSurveyFilter('high')}
                    >
                      High Priority
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const filteredSurveys = getFilteredSurveys();
                  
                  if (filteredSurveys.length === 0) {
                    return (
                      <div className="activity-empty-state">
                        <div className="empty-state-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        </div>
                        <h4 className="empty-state-title">
                          {surveySearchTerm || surveyFilter !== 'all' 
                            ? 'No Surveys Match Your Criteria' 
                            : 'No Pending Surveys'
                          }
                        </h4>
                        <p className="empty-state-message">
                          {surveySearchTerm || surveyFilter !== 'all'
                            ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                            : 'You have no new surveys to complete at the moment. Check back later for new opportunities to share your feedback!'
                          }
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="activity-table-container">
                      <table className="activity-table">
                        <thead>
                          <tr className="table-header-row">
                            <th className="table-header">Survey</th>
                            <th className="table-header">Type</th>
                            <th className="table-header">Status</th>
                            <th className="table-header">Due Date</th>
                            <th className="table-header">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSurveys.map((survey) => (
                            <React.Fragment key={survey.id}>
                              <tr className="table-row">
                                <td className="table-cell">
                                  <div className="activity-info">
                                    <div className="activity-icon">
                                      <svg className="activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                      </svg>
                                    </div>
                                    <div className="activity-details">
                                      <div className="activity-title">{survey.title}</div>
                                      <div className="activity-description">{survey.description}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="table-cell">
                                  <span className={`type-badge priority-${survey.urgency}`}>
                                    {survey.category}
                                    {survey.required && <span className="required-indicator">*</span>}
                                  </span>
                                </td>
                                <td className="table-cell">
                                  <span className={`status-badge ${survey.status.toLowerCase()}`}>
                                    {survey.status === 'Pending' && (
                                      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12,6 12,12 16,14"/>
                                      </svg>
                                    )}
                                    {survey.status === 'Started' && (
                                      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 6v6l4 2"/>
                                      </svg>
                                    )}
                                    {survey.status === 'Completed' && (
                                      <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <polyline points="20,6 9,17 4,12"/>
                                      </svg>
                                    )}
                                    {survey.status}
                                    {survey.status === 'Started' && (
                                      <span className="progress-text">({survey.progress}%)</span>
                                    )}
                                  </span>
                                </td>
                                <td className="table-cell">
                                  <span className={`activity-time ${survey.due === 'Required' ? 'urgent' : ''}`}>
                                    {survey.due}
                                  </span>
                                </td>
                                <td className="table-cell">
                                  {survey.status === 'Pending' && (
                                    <button 
                                      onClick={() => handleStartSurvey(survey.title)} 
                                      className="activity-action-btn"
                                      disabled={processingAction === `start-${survey.title}`}
                                    >
                                      {processingAction === `start-${survey.title}` ? 'Starting...' : 'Start'}
                                    </button>
                                  )}
                                  {survey.status === 'Started' && (
                                    <button className="activity-action-btn" onClick={() => setActiveSurveyId(survey.id)}>
                                      Continue Survey
                                    </button>
                                  )}
                                  {survey.status === 'Completed' && (
                                    <button className="activity-action-btn secondary">
                                      View
                                    </button>
                                  )}
                                </td>
                              </tr>
                              {/* Survey Form Section for Started Survey */}
                              {activeSurveyId === survey.id && survey.status === 'Started' && (
                                <tr>
                                  <td colSpan={5}>
                                    <div className="survey-form-section" style={{ background: '#fff', borderRadius: 12, padding: 24, margin: '24px 0', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                                      <h3 style={{ marginBottom: 16, color: '#B24592' }}>{survey.title}</h3>
                                      <form onSubmit={e => { e.preventDefault(); handleCompleteSurvey(survey.id); }}>
                                        <div style={{ marginBottom: 18 }}>
                                          <label style={{ fontWeight: 600 }}>How satisfied are you with your work environment?</label>
                                          <select
                                            value={drafts[survey.id]?.q1 || ''}
                                            onChange={e => setDrafts(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], q1: e.target.value } }))}
                                            style={{ marginLeft: 12 }}
                                          >
                                            <option value="">Select</option>
                                            <option value="Very Satisfied">Very Satisfied</option>
                                            <option value="Satisfied">Satisfied</option>
                                            <option value="Neutral">Neutral</option>
                                            <option value="Dissatisfied">Dissatisfied</option>
                                            <option value="Very Dissatisfied">Very Dissatisfied</option>
                                          </select>
                                        </div>
                                        <div style={{ marginBottom: 18 }}>
                                          <label style={{ fontWeight: 600 }}>Any suggestions for improvement?</label>
                                          <input
                                            type="text"
                                            value={drafts[survey.id]?.q2 || ''}
                                            onChange={e => setDrafts(prev => ({ ...prev, [survey.id]: { ...prev[survey.id], q2: e.target.value } }))}
                                            style={{ marginLeft: 12, width: '60%' }}
                                          />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: 24 }}>
                                          <button type="button" className="activity-action-btn" style={{ background: '#B24592', color: '#fff' }} onClick={() => handleSaveDraft(survey.id)}>
                                            Save Draft
                                          </button>
                                          <button type="submit" className="activity-action-btn" style={{ background: '#4BCB6B', color: '#fff' }}>
                                            Complete Survey
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'history' && (
          <section className="fade-in" aria-label="History Section">
            <Card>
              <CardHeader>
                <div className="activity-header">
                  <CardTitle>History</CardTitle>
                  <div className="activity-filter">
                    <button 
                      className={`filter-btn ${historyTypeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setHistoryTypeFilter('all')}
                    >
                      All
                    </button>
                    <button 
                      className={`filter-btn ${historyTypeFilter === 'surveys' ? 'active' : ''}`}
                      onClick={() => setHistoryTypeFilter('surveys')}
                    >
                      Surveys
                    </button>
                    <button 
                      className={`filter-btn ${historyTypeFilter === 'polls' ? 'active' : ''}`}
                      onClick={() => setHistoryTypeFilter('polls')}
                    >
                      Polls
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(() => {
                  const filteredItems = getFilteredHistoryItems();
                  
                  if (filteredItems.length === 0) {
                    return (
                      <div className="activity-empty-state">
                        <div className="empty-state-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                          </svg>
                        </div>
                        <h4 className="empty-state-title">
                          {historySearchTerm || historyDateFrom || historyDateTo || historyTypeFilter !== 'all' 
                            ? 'No Results Found' 
                            : 'No History Yet'
                          }
                        </h4>
                        <p className="empty-state-message">
                          {historySearchTerm || historyDateFrom || historyDateTo || historyTypeFilter !== 'all'
                            ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
                            : 'You haven\'t completed any surveys or polls yet. Start participating to build your history!'
                          }
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="activity-table-container">
                      <table className="activity-table">
                        <thead>
                          <tr className="table-header-row">
                            <th className="table-header">Activity</th>
                            <th className="table-header">Type</th>
                            <th className="table-header">Status</th>
                            <th className="table-header">Completed</th>
                            <th className="table-header">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, index) => (
                            <tr key={`${item.type}-${item.id}-${index}`} className="table-row">
                              <td className="table-cell">
                                <div className="activity-info">
                                  <div className="activity-icon">
                                    {item.type === 'survey' ? (
                                      <svg className="activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                      </svg>
                                    ) : (
                                      <svg className="activity-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <line x1="18" y1="20" x2="18" y2="10"/>
                                        <line x1="12" y1="20" x2="12" y2="4"/>
                                        <line x1="6" y1="20" x2="6" y2="14"/>
                                      </svg>
                                    )}
                                  </div>
                                  <div className="activity-details">
                                    <div className="activity-title">{item.title}</div>
                                    <div className="activity-description">{item.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="table-cell">
                                <span className={`type-badge ${item.type}`}>
                                  {item.type === 'survey' ? 'Survey' : 'Poll'}
                                </span>
                              </td>
                              <td className="table-cell">
                                <span className="status-badge completed">
                                  <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polyline points="20,6 9,17 4,12"/>
                                  </svg>
                                  Completed
                                </span>
                              </td>
                              <td className="table-cell">
                                <span className="activity-time">
                                  {new Date(item.completedDate).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </span>
                              </td>
                              <td className="table-cell">
                                <button 
                                  className="activity-action-btn secondary"
                                  onClick={() => handleShare(item.title)}
                                >
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </section>
        )}

        {activeSection === 'polls' && (
          <section className="fade-in" aria-label="Active Polls Section">
            <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontWeight: 700, fontSize: '2rem', textShadow: '0 0 20px rgba(247, 148, 30, 0.3)' }}>Active Polls</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {polls.length === 0 ? (
                <EmptyState 
                  title="No Active Polls" 
                  message="There are no polls requiring your vote right now. Stay tuned for upcoming community questions!" 
                  icon="📊" 
                />
              ) : (
                polls.map(poll => {
                  const selected = pollSelections[poll.id] || '';
                  return (
                    <div key={poll.id} className="poll-card">
                      <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem', color: '#fff' }}>{poll.question}</div>
                      <div style={{ fontSize: '0.85rem', color: poll.anonymous ? '#4BCB6B' : '#F7941E', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {poll.anonymous ? <><span>🔒</span> Identity Hidden</> : <><span>👁️</span> Identity Visible</>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}>
                        {poll.totalVotes} votes so far
                      </div>
                      {poll.justVoted ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 120, padding: 24 }}>
                          <div style={{ fontSize: 48, color: '#4BCB6B', marginBottom: 8 }}>✔️</div>
                          <div style={{ color: '#4BCB6B', fontWeight: 700, fontSize: '1.1rem' }}>Vote recorded!</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {poll.options.map(option => (
                              <label key={option} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', border: selected === option ? '2px solid #B24592' : '1px solid rgba(255, 255, 255, 0.2)', cursor: 'pointer', background: selected === option ? 'rgba(178, 69, 146, 0.15)' : 'rgba(255, 255, 255, 0.05)', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}>
                                <input
                                  type="radio"
                                  name={`poll-${poll.id}`}
                                  checked={selected === option}
                                  onChange={() => setPollSelections(prev => ({ ...prev, [poll.id]: option }))}
                                  style={{ marginRight: '12px', accentColor: '#B24592', width: '18px', height: '18px' }}
                                />
                                <span style={{ color: selected === option ? '#fff' : 'rgba(255, 255, 255, 0.8)', fontWeight: selected === option ? 700 : 500 }}>{option}</span>
                              </label>
                            ))}
                          </div>
                          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setConfirmVote({ open: true, pollId: poll.id, option: selected })} style={{ background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', opacity: !selected ? 0.6 : 1 }}>
                                Submit Vote
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
                  {/* Confirmation Dialog */}
                  {confirmVote.open && (
                    <div style={{
                      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 1300,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ background: '#fff', borderRadius: 14, padding: '2rem', minWidth: 320, boxShadow: '0 4px 24px rgba(178,69,146,0.13)', position: 'relative' }}>
                        <h3 style={{ color: '#B24592', marginBottom: 18 }}>Confirm Your Vote</h3>
                        <div style={{ color: '#333', marginBottom: 24 }}>
                          Are you sure you want to vote for <span style={{ color: '#F7941E', fontWeight: 700 }}>{confirmVote.option}</span>?
                          <br />You won't be able to change your vote after submitting.
                        </div>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                          <button onClick={handleVoteCancel} disabled={processingAction === 'vote-confirm'} style={{ background: 'none', border: '1px solid #B24592', color: '#B24592', borderRadius: 20, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', opacity: processingAction ? 0.5 : 1 }}>Cancel</button>
                          <button onClick={handleVoteConfirm} disabled={processingAction === 'vote-confirm'} style={{ background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', opacity: processingAction ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {processingAction === 'vote-confirm' && <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>}
                            {processingAction === 'vote-confirm' ? 'Submitting...' : 'Confirm Vote'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
            </div>
          </section>
        )}

        {activeSection === 'profile' && (
          <section className="fade-in profile-section" aria-label="Profile Section">
            <div className="profile-desktop-layout">
              {/* Profile Info Card */}
              <Card className="profile-info-card">
                <CardContent>
                  <div className="profile-info-content">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar-container">
                        <img 
                          src={profilePhoto || process.env.PUBLIC_URL + '/vp-pic.png'} 
                          alt="Profile" 
                          className="profile-avatar" 
                        />
                        <button
                          type="button"
                          className="profile-avatar-edit-btn"
                          onClick={() => document.getElementById('staff-photo-upload').click()}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="staff-photo-upload"
                          onChange={async e => {
                            const file = e.target.files[0];
                            if (file && auth.currentUser) {
                              setProfilePhoto(URL.createObjectURL(file));
                              const formData = new FormData();
                              formData.append('photo', file);
                              const token = await auth.currentUser.getIdToken();
                              await axios.put('http://localhost:5000/api/auth/me', formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data',
                                  Authorization: `Bearer ${token}`
                                }
                              });
                              const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              setUser(data.user);
                              setProfilePhoto(data.user.photo ? `http://localhost:5000${data.user.photo}` : null);
                            }
                          }}
                        />
                      </div>
                      <div className="profile-user-info">
                        <h3 className="profile-user-name">{user?.name || staffName || 'User'}</h3>
                        <p className="profile-user-email">{user?.email || 'user@company.com'}</p>
                        <p className="profile-user-department">{user?.department || 'Staff Member'}</p>
                      </div>
                    </div>
                    
                    <div className="profile-stats">
                      <div className="profile-stat-item">
                        <div className="profile-stat-number">{surveys.filter(s => s.status === 'Completed').length}</div>
                        <div className="profile-stat-label">Surveys Completed</div>
                      </div>
                      <div className="profile-stat-item">
                        <div className="profile-stat-number">{pollHistory.length}</div>
                        <div className="profile-stat-label">Polls Participated</div>
                      </div>
                      <div className="profile-stat-item">
                        <div className="profile-stat-number">95%</div>
                        <div className="profile-stat-label">Participation Rate</div>
                      </div>
                    </div>
                    
                    <div className="profile-member-info">
                      <div className="profile-member-item">
                        <span className="profile-member-label">Member Since</span>
                        <span className="profile-member-value">
                          {new Date().toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="profile-member-item">
                        <span className="profile-member-label">Last Active</span>
                        <span className="profile-member-value">Today</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Edit Form */}
              <Card className="profile-edit-form">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="profile-form-grid">
                    <div className="profile-form-section">
                      <h4 className="profile-section-title">Personal Information</h4>
                      
                      <div className="profile-form-row">
                        <div className="profile-form-group">
                          <label className="profile-form-label">Full Name</label>
                          <div className="profile-input-container">
                            <input 
                              type="text" 
                              value={user?.name || ''} 
                              className="profile-form-input"
                              placeholder="Enter your full name"
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-form-group">
                          <label className="profile-form-label">Username</label>
                          <div className="profile-input-container">
                            <input 
                              type="text" 
                              value={(user?.name || staffName || 'user').toLowerCase().replace(/\s+/g, '')} 
                              className="profile-form-input"
                              placeholder="Username"
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="profile-form-row">
                        <div className="profile-form-group">
                          <label className="profile-form-label">Email Address</label>
                          <div className="profile-input-container">
                            <input 
                              type="email" 
                              value={user?.email || ''} 
                              className="profile-form-input"
                              placeholder="your.email@company.com"
                              disabled
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-form-group">
                          <label className="profile-form-label">Department</label>
                          <div className="profile-input-container">
                            <input 
                              type="text" 
                              value={user?.department || ''} 
                              className="profile-form-input"
                              placeholder="Your department"
                              disabled
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 21h18"/>
                                <path d="M5 21V7l8-4v18"/>
                                <path d="M19 21V11l-6-4"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-form-section">
                      <h4 className="profile-section-title">Security</h4>
                      
                      <div className="profile-form-row">
                        <div className="profile-form-group">
                          <label className="profile-form-label">Current Password</label>
                          <div className="profile-input-container">
                            <input 
                              type="password" 
                              className="profile-form-input"
                              placeholder="Enter current password"
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <circle cx="12" cy="16" r="1"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="profile-form-group">
                          <label className="profile-form-label">New Password</label>
                          <div className="profile-input-container">
                            <input 
                              type="password" 
                              className="profile-form-input"
                              placeholder="Enter new password"
                            />
                            <div className="profile-input-icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <circle cx="12" cy="16" r="1"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="profile-form-actions">
                      <button className="profile-save-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17,21 17,13 7,13 7,21"/>
                          <polyline points="7,3 7,8 15,8"/>
                        </svg>
                        Save Changes
                      </button>
                      <button className="profile-cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

      </main>
      </div>

      {showSuccessToast && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
};
export default StaffDashboard;
