import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import ReplyModal from './ReplyModal';
import SuccessToast from './SuccessToast';

 const StaffDashboard = () => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const staffName = "Crystal";
  
  const gotoProfile = () => { navigate ('/profile')}
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
      from: "HR Department"
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
      from: "IT Department"
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
      from: "Operations"
    }
  ]);

  const [polls, setPolls] = useState([
    { id: 1, question: "Holiday Party Preferences", options: ["Bowling", "Karaoke", "Hiking"], voted: null, from: "HR Department", anonymous: true },
    { id: 2, question: "New Office Layout", options: ["Open Plan", "Cubicles", "Hybrid"], voted: null, from: "Admin", anonymous: false }
  ]);
  const [pollHistory, setPollHistory] = useState([]);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleVote = (pollId, option) => {
    setPolls(prevPolls => {
      const updatedPolls = prevPolls.map(p => p.id === pollId ? { ...p, voted: option } : p);
      const answeredPoll = updatedPolls.find(p => p.id === pollId);
      if (answeredPoll) {
        setPollHistory(prevHistory => [...prevHistory, { ...answeredPoll, voted: option }]);
      }
      return updatedPolls.filter(p => p.id !== pollId);
    });
    setToastMessage("Vote recorded! Thanks for participating.");
    setShowSuccessToast(true);
  };

  const handleStartSurvey = (title) => {
    setSurveys(surveys => surveys.map(s => s.title === title ? { ...s, status: 'Started' } : s));
    setToastMessage(`Starting ${title}...`);
    setShowSuccessToast(true);
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

  // Update getNavItemStyle to support orange highlight for active nav item
  const getNavItemStyle = (section) => ({
    cursor: 'pointer',
    padding: '12px 15px',
    color: activeSection === section ? '#F7941E' : '#fff',
    fontWeight: activeSection === section ? '700' : '500',
    background: activeSection === section ? '#F7941E' : 'transparent',
    borderLeft: activeSection === section ? '4px solid #F7941E' : '4px solid transparent',
    transition: 'color 0.38s cubic-bezier(0.4,0,0.2,1), background 0.38s cubic-bezier(0.4,0,0.2,1), border-left 0.38s cubic-bezier(0.4,0,0.2,1), box-shadow 0.38s cubic-bezier(0.4,0,0.2,1), transform 0.38s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: activeSection === section ? '0 2px 12px rgba(247,148,30,0.10)' : 'none',
    transform: activeSection === section ? 'scale(1.04)' : 'scale(1)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  });

  // Notification/message counts
  const pendingSurveyCount = surveys.filter(s => s.status === 'Pending').length;
  const activePollCount = polls.length;

  return (
    <div className="staff-dashboard bg-f8f9fa">
      <aside className="sidebar-nav">
        <div className="sidebar-logo">
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoStaffDashboard} alt="Virtual Pay Logo" className="dashboard-logo" />
        </div>
        <nav className="sidebar-nav-menu">
          <ul className="sidebar-nav-list">
            <li tabIndex="0" role="button" className="sidebar-nav-item overview" onClick={() => setActiveSection('overview')}>Overview</li>
            <li tabIndex="0" role="button" className="sidebar-nav-item surveys" onClick={() => setActiveSection('surveys')}>My Surveys</li>
            <li tabIndex="0" role="button" className="sidebar-nav-item polls" onClick={() => setActiveSection('polls')}>Active Polls</li>
            <li tabIndex="0" role="button" className="sidebar-nav-item history" onClick={() => setActiveSection('history')}>History</li>
            <li tabIndex="0" role="button" className="sidebar-nav-item profile" onClick={gotoProfile}>Profile</li>
            <li tabIndex="0" role="button" className="sidebar-nav-item logout" onClick={() => navigate('/')}>Log Out</li>
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
          
      <div className="dashboard-topbar">
      </div>
      <main className="dashboard-content with-sidebar">
        
        {activeSection === 'overview' && (
          <section className="welcome-section fade-in">
            <h1 className="welcome-title">Good Morning, {staffName}</h1>
            <p className="summary-text">You have <span className="highlight">{surveys.filter(s => s.status === 'Pending').length} pending tasks</span> today.</p>
            <div className="staff-profile-overview">
              <div className="staff-profile-details">
                <div className="staff-profile-name">Crystal</div>
                <div className="staff-profile-role">Staff Member</div>
                <div className="staff-profile-email">crystal@example.com</div>
              </div>
            </div>
            <div className="staff-overview-cards">
              <div className="staff-overview-card">
                <h3>Pending Surveys</h3>
                <div className="staff-overview-card-value">{surveys.filter(s => s.status === 'Pending').length}</div>
                <div className="staff-overview-card-label">Pending</div>
              </div>
              <div className="staff-overview-card">
                <h3>Polls Voted</h3>
                <div className="staff-overview-card-value">{polls.filter(p => p.voted).length}</div>
                <div className="staff-overview-card-label">Voted</div>
              </div>
              <div className="staff-overview-card">
                <h3>Groups</h3>
                <div className="staff-overview-card-value">2</div>
                <div className="staff-overview-card-label">Your Groups</div>
              </div>
              <div className="staff-overview-card">
                <h3>Department</h3>
                <div className="staff-overview-card-value">HR</div>
                <div className="staff-overview-card-label">Your Department</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50', fontWeight: 700 }}>Action Required</h3>
              </div>
              {(() => {
                const pendingSurveys = surveys.filter(s => s.status === 'Pending');
                if (pendingSurveys.length === 0) {
                  return <div style={{ color: '#666', fontStyle: 'italic', gridColumn: '1 / -1' }}>All caught up! </div>;
                }
    
                const cards = [...pendingSurveys];
                if (cards.length % 2 !== 0) cards.push(null);
                return cards.map((survey, idx) =>
                  survey ? (
                    <div key={survey.id} className="action-required-card dashboard-card action-required-flex survey-form-outline">
                      <div className="survey-title">{survey.title}</div>
                      <div className="survey-description">{survey.description}</div>
                      <div className="survey-meta">
                        <span className="survey-from">From: <span>{survey.from}</span></span>
                        <span className="survey-deadline">Deadline: <span>{survey.due}</span></span>
                      </div>
                      <button className="survey-start-btn" onClick={() => handleStartSurvey(survey.title)}>Start</button>
                    </div>
                  ) : (
                    <div key={idx} style={{ visibility: 'hidden' }} />
                ));
              })()}


            </div>
          </section>
        )}

        {(activeSection === 'surveys' || activeSection === 'history') && (
          <section style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>{activeSection === 'surveys' ? 'My Surveys' : 'History'}</h2>
            <div style={cardStyle}>
              {surveys.filter(s => activeSection === 'surveys' ? s.status === 'Pending' || s.status === 'Started' : s.status === 'Completed').map(survey => (
                <div key={survey.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{survey.title}</div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>{survey.category} • {survey.time} • <span style={{ color: survey.status === 'Pending' || survey.status === 'Started' ? '#F7941E' : '#F7941E' }}>{survey.status}</span></div>
                  </div>
                  {survey.status === 'Pending' && (
                    <button onClick={() => handleStartSurvey(survey.title)} style={{ color: '#B24592', background: 'none', border: '1px solid #B24592', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>Start Survey</button>
                  )}
                  {survey.status === 'Started' && (
                    <button disabled style={{ color: '#fff', background: 'linear-gradient(90deg, #F7941E 0%, #FFB347 100%)', border: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'not-allowed', fontWeight: 600, boxShadow: '0 2px 8px rgba(247,148,30,0.13)' }}>Feedback</button>
                  )}
                </div>
              ))}
              {surveys.filter(s => activeSection === 'surveys' ? s.status === 'Pending' : s.status === 'Completed').length === 0 && <div style={{ padding: '1rem', color: '#666' }}>No items found.</div>}
            </div>
          </section>
        )}

        {activeSection === 'polls' && (
          <section style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Active Polls</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {polls.length === 0 && <div style={{ color: '#888', fontStyle: 'italic' }}>No active polls.</div>}
              {polls.map(poll => (
                <div key={poll.id} className="dashboard-card poll-form-outline">
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem', color: '#333' }}>{poll.question}</div>
                  <div style={{ fontSize: '0.95rem', color: '#B24592', marginBottom: '0.3rem' }}>From: <span style={{ color: '#7D1F4B', fontWeight: 600 }}>{poll.from}</span></div>
                  <div style={{ fontSize: '0.85rem', color: poll.anonymous ? '#F7941E' : '#888', marginBottom: '0.7rem', fontWeight: 600 }}>
                    {poll.anonymous ? 'Anonymous' : 'Not Anonymous'}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {poll.options.map(option => (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', border: poll.voted === option ? '2px solid #B24592' : '1px solid #eee', cursor: 'pointer', background: poll.voted === option ? '#fff0f7' : 'white', transition: 'all 0.2s' }}>
                        <input type="radio" name={`poll-${poll.id}`} checked={poll.voted === option} onChange={() => handleVote(poll.id, option)} style={{ marginRight: '12px', accentColor: '#B24592', width: '18px', height: '18px' }} />
                        <span style={{ color: poll.voted === option ? '#B24592' : '#444', fontWeight: poll.voted === option ? 700 : 500 }}>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {activeSection === 'history' && pollHistory.length > 0 && (
          <section style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Poll History</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {pollHistory.map(poll => (
                <div key={poll.id} style={cardStyle}>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem', color: '#333' }}>{poll.question}</div>
                  <div style={{ fontSize: '0.95rem', color: '#B24592', marginBottom: '0.3rem' }}>From: <span style={{ color: '#7D1F4B', fontWeight: 600 }}>{poll.from}</span></div>
                  <div style={{ fontSize: '0.85rem', color: poll.anonymous ? '#F7941E' : '#888', marginBottom: '0.7rem', fontWeight: 600 }}>
                    {poll.anonymous ? 'Anonymous' : 'Not Anonymous'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#444', marginBottom: '0.5rem' }}>Your answer: <span style={{ color: '#B24592', fontWeight: 600 }}>{poll.voted}</span></div>
                </div>
              ))}
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
