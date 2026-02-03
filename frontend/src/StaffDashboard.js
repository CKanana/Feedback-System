import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import ReplyModal from './ReplyModal';
import SuccessToast from './SuccessToast';

 const StaffDashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [historyTab, setHistoryTab] = useState('surveys');
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

  
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: "Q1 Employee Satisfaction",
      description: "Help us improve by sharing your thoughts on your work experience this quarter.",
      category: "HR",
      due: "2 days left",
      time: "5 mins",
      status: "Pending",
      urgency: "high",
      from: "HR Department",
      required: true
    },
    {
      id: 2,
      title: "New IT Security Policy",
      description: "Review and acknowledge the updated IT security guidelines for all staff.",
      category: "IT",
      due: "Required",
      time: "10 mins",
      status: "Pending",
      urgency: "medium",
      from: "IT Department",
      required: true
    },
    {
      id: 3,
      title: "Remote Work Check-in",
      description: "Let us know how remote work is going for you and any challenges faced.",
      category: "Ops",
      due: "Completed",
      time: "2 mins",
      status: "Completed",
      urgency: "low",
      from: "Operations",
      required: false
    }
  ]);

  const [polls, setPolls] = useState([
    { id: 1, question: "Holiday Party Preferences", options: ["Bowling", "Karaoke", "Hiking"], voted: null, from: "HR Department", anonymous: true, totalVotes: 42 },
    { id: 2, question: "New Office Layout", options: ["Open Plan", "Cubicles", "Hybrid"], voted: null, from: "Admin", anonymous: false, totalVotes: 18 }
  ]);
  // Track local selection for each poll
  const [pollSelections, setPollSelections] = useState({});
  // Confirmation dialog state
  const [confirmVote, setConfirmVote] = useState({ open: false, pollId: null, option: null });
  const [pollHistory, setPollHistory] = useState([]);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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
      addNotification("New poll arrived: Friday Theme Idea?");
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
    } else {
      addNotification("Please select an option before submitting.");
    }
  };

  const addNotification = (message) => {
    const newNotif = { id: Date.now(), message, time: new Date().toLocaleTimeString() };
    setNotifications(prev => [newNotif, ...prev]);
    setToastMessage(message);
    setShowSuccessToast(true);
  };

  const handleShare = (question) => {
    navigator.clipboard.writeText(`Vote on: "${question}" - Shared from VirtualPay`);
    addNotification("Poll link copied to clipboard!");
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
        addNotification("Vote recorded! Thanks for participating.");
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
      addNotification(`Started survey: ${title}`);
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
    addNotification("Comment posted successfully");
  };

  // Styles to match Admin "Cute" look
  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.04)',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s ease',
  };

  // Notification/message counts
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

  const SkeletonCard = () => (
    <div className="dashboard-card skeleton-card" aria-hidden="true">
      <div className="skeleton-line title"></div>
      <div className="skeleton-line text"></div>
      <div className="skeleton-line text short"></div>
    </div>
  );

  const getNavItemStyle = (section) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeSection === section ? '#fff0f7' : 'transparent',
    color: activeSection === section ? '#B24592' : '#fff',
    fontWeight: activeSection === section ? '700' : '500',
    fontSize: '1.05rem',
    borderLeft: activeSection === section ? '4px solid #B24592' : '4px solid transparent',
    transition: 'all 0.2s ease',
    listStyle: 'none'
  });

  return (
    <div className="staff-dashboard">
      <aside className="sidebar-nav" style={{ background: 'linear-gradient(135deg, #7D1F4B 0%, #B24592 100%)' }}>
        <div className="sidebar-logo">
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoStaffDashboard} alt="Virtual Pay Logo" className="dashboard-logo" />
        </div>
        <nav className="sidebar-nav-menu">
          <ul className="sidebar-nav-list" style={{ padding: 0 }}>
            <li tabIndex="0" role="button" style={getNavItemStyle('overview')} onKeyDown={(e) => e.key === 'Enter' && setActiveSection('overview')} className={`sidebar-nav-item overview`} onClick={() => setActiveSection('overview')}>Overview</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('surveys')} onKeyDown={(e) => e.key === 'Enter' && setActiveSection('surveys')} className={`sidebar-nav-item surveys`} onClick={() => setActiveSection('surveys')}>My Surveys</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('polls')} onKeyDown={(e) => e.key === 'Enter' && setActiveSection('polls')} className={`sidebar-nav-item polls`} onClick={() => setActiveSection('polls')}>Active Polls</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('history')} onKeyDown={(e) => e.key === 'Enter' && setActiveSection('history')} className={`sidebar-nav-item history`} onClick={() => setActiveSection('history')}>History</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('profile')} onKeyDown={(e) => e.key === 'Enter' && gotoProfile()} className={`sidebar-nav-item profile`} onClick={gotoProfile}>Profile</li>
            <li tabIndex="0" role="button" style={{...getNavItemStyle('logout'), color: '#fde2e2'}} onKeyDown={(e) => e.key === 'Enter' && navigate('/')} className="sidebar-nav-item logout" onClick={() => navigate('/')}>Log Out</li>
          </ul>
        </nav>
      </aside>
      
      <button className="hamburger-menu" aria-label="Open navigation" onClick={() => setShowMobileMenu(v => !v)}>
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
              <li tabIndex="0" role="button" onClick={() => { setActiveSection('overview'); setShowMobileMenu(false); }}>Overview</li>
              <li tabIndex="0" role="button" onClick={() => { setActiveSection('surveys'); setShowMobileMenu(false); }}>My Surveys</li>
              <li tabIndex="0" role="button" onClick={() => { setActiveSection('polls'); setShowMobileMenu(false); }}>Active Polls</li>
              <li tabIndex="0" role="button" onClick={() => { gotoProfile(); setShowMobileMenu(false); }}>Profile</li>
              <li tabIndex="0" role="button" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Log Out</li>
            </ul>
          </nav>
        </div>
      )}
          
      <main className="dashboard-content with-sidebar">
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
          <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            {notifications.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#F7941E', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #f8f9fa' }}>{notifications.length}</span>}
          </button>
          {showNotifications && (
            <div style={{ position: 'absolute', top: '50px', right: '0', width: '320px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', padding: '1rem', maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, color: '#2c3e50' }}>Notifications</h4>
                <span style={{ fontSize: '0.8rem', color: '#B24592', cursor: 'pointer' }} onClick={() => setNotifications([])}>Clear all</span>
              </div>
              {notifications.length === 0 ? <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No new notifications</p> : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {notifications.map(n => (
                    <li key={n.id} style={{ padding: '0.8rem', borderBottom: '1px solid #f5f5f5', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '4px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ color: '#333', fontWeight: 500 }}>{n.message}</div>
                      <div style={{ color: '#aaa', fontSize: '0.75rem' }}>{n.time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {activeSection === 'overview' && (
          <section className="welcome-section fade-in" aria-label="Overview Section">
            <div className="overview-hero-card">
              <img src={profilePhoto || process.env.PUBLIC_URL + '/profile-photo.png'} alt="Profile" className="overview-hero-avatar" />
              <div className="overview-hero-content">
                <div className="overview-hero-title">Good Morning, {staffName}</div>
                <div className="overview-hero-summary">You have <span className="highlight">{pendingSurveyCount + activePollCount} pending tasks</span> today.</div>
                <div className="overview-hero-tasks">
                  <div className="overview-hero-task" onClick={() => setActiveSection('surveys')} style={{cursor:'pointer'}}>
                    <div className="overview-hero-task-label">Pending Surveys</div>
                    <div className="overview-hero-task-value">{pendingSurveyCount}</div>
                  </div>
                  <div className="overview-hero-task" onClick={() => setActiveSection('polls')} style={{cursor:'pointer'}}>
                    <div className="overview-hero-task-label">Active Polls</div>
                    <div className="overview-hero-task-value polls">{activePollCount}</div>
                  </div>
                  <div className="overview-hero-task" onClick={() => setActiveSection('history')} style={{cursor:'pointer'}}>
                    <div className="overview-hero-task-label">Completed Tasks</div>
                    <div className="overview-hero-task-value completed">{surveys.filter(s => s.status === 'Completed').length + pollHistory.length}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontWeight: 800, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>Action Required</h3>
              </div>
              {(() => {
                const pendingSurveys = surveys.filter(s => s.status === 'Pending');
                
                if (isLoading) {
                  return (
                    <>
                      <SkeletonCard /><SkeletonCard />
                    </>
                  );
                }

                if (pendingSurveys.length === 0) {
                  return (
                    <EmptyState 
                      title="You're All Caught Up!" 
                      message="Great job! You've completed all your pending surveys and tasks. Enjoy your day!" 
                      icon="🎉" 
                    />
                  );
                }
    
                return pendingSurveys.map((survey) => (
                    <div key={survey.id} className="action-required-card">
                      <div className="survey-title">
                        {survey.title}
                        {survey.required && <span className="required-badge">Required</span>}
                      </div>
                      <div className="survey-description">{survey.description}</div>
                      <div className="survey-meta">
                        <span className="survey-deadline">Deadline: <span>{survey.due}</span></span>
                      </div>
                      <button 
                        className="survey-start-btn" 
                        onClick={() => handleStartSurvey(survey.title)}
                        disabled={processingAction === `start-${survey.title}`}
                        style={{ background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 8px rgba(178, 69, 146, 0.2)' }}
                      >
                        {processingAction === `start-${survey.title}` ? 'Starting...' : 'Start'}
                      </button>
                    </div>
                ));
              })()}


            </div>
          </section>
        )}

        {activeSection === 'surveys' && (
          <section className="fade-in" aria-label="My Surveys Section">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#2c3e50', margin: 0, fontWeight: 700 }}>My Surveys</h2>
            </div>
            
            {(() => {
              const filteredSurveys = surveys.filter(s => ['Pending', 'Started'].includes(s.status));
              
              if (filteredSurveys.length === 0) {
                return (
                  <EmptyState 
                    title="No Pending Surveys" 
                    message="You have no new surveys to complete at the moment. Check back later!" 
                    icon="📝" 
                  />
                );
              }

              return (
                <div style={{...cardStyle, padding: '1.5rem', border: '1px solid #F7941E', boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'}}>
                  {filteredSurveys.map(survey => (
                    <div key={survey.id} className="survey-list-item">
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                          {survey.title}
                          {survey.required && <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#FF4B4B', color: 'white', padding: '2px 8px', borderRadius: '10px', verticalAlign: 'middle', fontWeight: '600' }}>Required</span>}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>
                          {survey.category} • {survey.time} • <span style={{ color: '#F7941E', fontWeight: '600' }}>{survey.status}</span>
                        </div>
                      </div>
                      {survey.status === 'Pending' && (
                        <button 
                          onClick={() => handleStartSurvey(survey.title)} 
                          className="survey-action-btn start"
                          disabled={processingAction === `start-${survey.title}`}
                          style={{ background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          {processingAction === `start-${survey.title}` ? 'Starting...' : 'Start Survey'}
                        </button>
                      )}
                      {survey.status === 'Started' && (
                        <button className="survey-action-btn continue">Continue</button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </section>
        )}

        {activeSection === 'history' && (
          <section className="fade-in" aria-label="History Section">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
              <h2 style={{ color: '#2c3e50', margin: 0, fontWeight: 700 }}>History</h2>
              <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '4px', borderRadius: '8px', border: '1px solid #eee' }}>
                  <button onClick={() => setHistoryTab('surveys')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: historyTab === 'surveys' ? '#B24592' : 'transparent', color: historyTab === 'surveys' ? '#fff' : '#555', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Surveys</button>
                  <button onClick={() => setHistoryTab('polls')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: historyTab === 'polls' ? '#B24592' : 'transparent', color: historyTab === 'polls' ? '#fff' : '#555', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Polls</button>
              </div>
            </div>

            {historyTab === 'surveys' ? (
                (() => {
                    const completedSurveys = surveys.filter(s => s.status === 'Completed');
                    if (completedSurveys.length === 0) {
                        return (
                          <EmptyState 
                            title="No Completed Surveys" 
                            message="You haven't completed any surveys yet." 
                            icon="📂" 
                          />
                        );
                    }
                    return (
                        <div style={{...cardStyle, padding: '1.5rem'}}>
                          {completedSurveys.map(survey => (
                            <div key={survey.id} className="survey-list-item">
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{survey.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>
                                  {survey.category} • {survey.time} • <span style={{ color: '#4BCB6B', fontWeight: '600' }}>{survey.status}</span>
                                </div>
                              </div>
                              <button className="survey-action-btn view-results">View Results</button>
                            </div>
                          ))}
                        </div>
                    );
                })()
            ) : (
                pollHistory.length === 0 ? (
                    <EmptyState 
                        title="No Poll History" 
                        message="You haven't voted in any polls yet." 
                        icon="📊" 
                    />
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                      {pollHistory.map(poll => (
                        <div key={poll.id} className="dashboard-card card-border-green">
                           <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem', color: '#333' }}>{poll.question}</div>
                           <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.2rem' }}>
                             Total votes: {poll.totalVotes} • You voted: <span style={{ color: '#B24592', fontWeight: 600 }}>{poll.voted}</span>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {poll.results && poll.results.map((res, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px', color: '#444' }}>
                                        <span style={{ fontWeight: res.option === poll.voted ? 700 : 400 }}>
                                            {res.option} {res.option === poll.voted && '(You)'}
                                        </span>
                                        <span style={{ fontWeight: 600 }}>{res.percent}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${res.percent}%`, 
                                            height: '100%', 
                                            background: res.option === poll.voted ? '#B24592' : '#ccc',
                                            borderRadius: '4px',
                                            transition: 'width 1s ease-out'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                          </div>
                          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                              <button onClick={() => setExpandedComments(prev => ({ ...prev, [poll.id]: !prev[poll.id] }))} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                💬 Comments ({poll.comments ? poll.comments.length : 0})
                              </button>
                            </div>
                            
                            {expandedComments[poll.id] && (
                              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
                                  {poll.comments && poll.comments.map((c, i) => (
                                    <div key={i} style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: '8px', marginBottom: '8px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, color: '#7D1F4B' }}>{c.user}</span>
                                        <span style={{ color: '#999' }}>{c.time}</span>
                                      </div>
                                      <div style={{ color: '#444', fontSize: '0.9rem' }}>{c.text}</div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input type="text" placeholder="Write a comment..." value={commentInputs[poll.id] || ''} onChange={e => setCommentInputs(prev => ({ ...prev, [poll.id]: e.target.value }))} style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }} />
                                  <button onClick={() => submitComment(poll.id)} style={{ background: '#B24592', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}>Post</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                )
            )}
          </section>
        )}

        {activeSection === 'polls' && (
          <section className="fade-in" aria-label="Active Polls Section">
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontWeight: 700 }}>Active Polls</h2>
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
                      <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem', color: '#333' }}>{poll.question}</div>
                      <div style={{ fontSize: '0.85rem', color: poll.anonymous ? '#4BCB6B' : '#F7941E', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {poll.anonymous ? <><span>🔒</span> Identity Hidden</> : <><span>👁️</span> Identity Visible</>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>
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
                              <label key={option} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', border: selected === option ? '2px solid #B24592' : '1px solid #eee', cursor: 'pointer', background: selected === option ? '#fff0f7' : 'white', transition: 'all 0.2s' }}>
                                <input
                                  type="radio"
                                  name={`poll-${poll.id}`}
                                  checked={selected === option}
                                  onChange={() => setPollSelections(prev => ({ ...prev, [poll.id]: option }))}
                                  style={{ marginRight: '12px', accentColor: '#B24592', width: '18px', height: '18px' }}
                                />
                                <span style={{ color: selected === option ? '#B24592' : '#444', fontWeight: selected === option ? 700 : 500 }}>{option}</span>
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
            <section className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }} aria-label="Profile Section">
                <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontWeight: 700 }}>My Profile</h2>
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                      <img src={profilePhoto || process.env.PUBLIC_URL + '/profile-photo.png'} alt="Profile" className="staff-profile-photo" />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="staff-photo-upload"
                        onChange={async e => {
                          const file = e.target.files[0];
                          if (file && auth.currentUser) {
                            setProfilePhoto(URL.createObjectURL(file));
                            // Upload to backend
                            const formData = new FormData();
                            formData.append('photo', file);
                            const token = await auth.currentUser.getIdToken();
                            await axios.put('http://localhost:5000/api/auth/me', formData, {
                              headers: {
                                'Content-Type': 'multipart/form-data',
                                Authorization: `Bearer ${token}`
                              }
                            });
                            // Refetch user to get new photo URL
                            const { data } = await axios.get('http://localhost:5000/api/auth/me', {
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            setUser(data.user);
                            setProfilePhoto(data.user.photo ? `http://localhost:5000${data.user.photo}` : null);
                          }
                        }}
                      />
                      <button
                        type="button"
                        style={{ position: 'absolute', bottom: '0', right: '0', background: '#B24592', color: 'white', border: '3px solid white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => document.getElementById('staff-photo-upload').click()}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ textAlign: 'left', display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#555' }}>Full Name</label>
                            <input type="text" value={user?.name || ''} readOnly style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#555' }}>Email</label>
                            <input type="email" value={user?.email || ''} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#888' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#555' }}>Department</label>
                            <input type="text" value={user?.department || ''} disabled style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#888' }} />
                        </div>
                        <button style={{ marginTop: '1rem', background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)', color: 'white', border: 'none', padding: '12px', borderRadius: '24px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                    </div>
                </div>
            </section>
        )}

      </main>

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
