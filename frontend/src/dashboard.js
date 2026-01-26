import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const staff = {
    name: 'Crystal',
    role: 'HR Specialist',
    department: 'Human Resources',
    photo: process.env.PUBLIC_URL + '/profile-photo.png'
  };

  const [polls, setPolls] = useState([
    { id: 1, question: "Where should we have the holiday party?", options: ["Office", "Restaurant", "Event Hall"], voted: null },
    { id: 2, question: "Preferred day for team meetings?", options: ["Monday", "Wednesday", "Friday"], voted: "Monday" }
  ]);

  const [surveys, setSurveys] = useState([
    { id: 1, title: "Q1 Employee Satisfaction", due: "2 days left", time: "5 mins", status: "Pending" },
    { id: 2, title: "New IT Policy Feedback", due: "1 week left", time: "2 mins", status: "Pending" }
  ]);

  const handleVote = (pollId, option) => {
    setPolls(polls.map(p => p.id === pollId ? { ...p, voted: option } : p));
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.04)',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s ease',
  };

  const btnStyle = {
    background: '#B24592',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s',
    boxShadow: '0 4px 10px rgba(178, 69, 146, 0.2)'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 10 }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
           <img src={process.env.PUBLIC_URL + '/vp-pic.png'} alt="Logo" style={{ maxWidth: '140px', cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>
        <nav style={{ flex: 1, padding: '1rem 1.5rem' }}>
          {['Overview', 'My Surveys', 'History', 'Profile'].map(item => (
            <div 
              key={item}
              onClick={() => setActiveTab(item.toLowerCase())}
              style={{
                padding: '14px 16px',
                marginBottom: '8px',
                borderRadius: '12px',
                cursor: 'pointer',
                color: activeTab === item.toLowerCase() ? '#B24592' : '#555',
                background: activeTab === item.toLowerCase() ? '#fff0f7' : 'transparent',
                fontWeight: activeTab === item.toLowerCase() ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              {item}
            </div>
          ))}
        </nav>
        <div style={{ padding: '2rem' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #eee', borderRadius: '12px', color: '#666', cursor: 'pointer', fontWeight: 600 }}>Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '260px', flex: 1, padding: '2.5rem 3rem' }}>
        {/* Top Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#2c3e50', marginBottom: '0.5rem', fontWeight: 700 }}>Good Morning, {staff.name}</h1>
            <p style={{ color: '#888', fontSize: '1.05rem' }}>You have <span style={{ color: '#F7941E', fontWeight: 600 }}>{surveys.filter(s => s.status === 'Pending').length} pending tasks</span> today.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#333', fontSize: '0.95rem' }}>{staff.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#B24592', fontWeight: 600 }}>{staff.role}</div>
            </div>
            <img src={staff.photo} alt="Profile" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f0f0f0' }} />
          </div>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ ...cardStyle, borderLeft: '5px solid #F7941E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending Surveys</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2c3e50' }}>{surveys.filter(s => s.status === 'Pending').length}</div>
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>📝</div>
          </div>
          <div style={{ ...cardStyle, borderLeft: '5px solid #B24592', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Polls Voted</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2c3e50' }}>12</div>
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>📊</div>
          </div>
          <div style={{ ...cardStyle, borderLeft: '5px solid #4BCB6B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Participation</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#2c3e50' }}>95%</div>
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>🏆</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column */}
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50', fontWeight: 700 }}>Action Required</h3>
            {surveys.map(survey => (
              <div key={survey.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #F7941E' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>{survey.title}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#fff4e6', color: '#F7941E', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Due: {survey.due}</span>
                    <span>⏱️ {survey.time}</span>
                  </div>
                </div>
                <button style={btnStyle}>Start Survey</button>
              </div>
            ))}

            <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50', marginTop: '2.5rem', fontWeight: 700 }}>Community Pulse</h3>
            {polls.map(poll => (
              <div key={poll.id} style={cardStyle}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1.2rem', color: '#333' }}>{poll.question}</div>
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
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;