import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';


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

const BarChart = ({ data, color }) => {
  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '12px', padding: '20px 10px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa', marginTop: '1rem' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div style={{ 
              width: '60%', 
              height: `${(d.value / maxVal) * 100}%`, 
              backgroundColor: color, 
              borderRadius: '4px 4px 0 0',
              minHeight: '4px',
              position: 'relative',
              transition: 'height 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
               <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>
                {d.value}
               </span>
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'center', color: '#666', lineHeight: '1.2', fontWeight: '500' }}>
            {d.label}
          </div>
        </div>
      ))}
    </div>

  );

};

const LineChart = ({ data, color }) => {

  const maxVal = Math.max(...data.map(d => d.value)) || 1;

  const width = 400;

  const height = 200;

  const points = data.map((d, i) => {

    const x = (i / (data.length - 1 || 1)) * (width - 40) + 20;

    const y = height - ((d.value / maxVal) * (height - 40)) - 20;

    return `${x},${y}`;

  }).join(' ');

  return (
    <div style={{ width: '100%', padding: '10px 0', marginBottom: '2rem', background: '#fff', borderRadius: '12px', border: '1px solid #f0f0f0', padding: '20px' }}>
        <h4 style={{marginBottom: '1.5rem', color: '#555'}}>Response Trend (Last 7 Days)</h4>
        <svg viewBox={`0 0 ${width} ${height + 20}`} style={{ width: '100%', height: '100%', maxHeight: '250px', overflow: 'visible' }}>
            <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
            {data.map((d, i) => {
                const x = (i / (data.length - 1 || 1)) * (width - 40) + 20;
                const y = height - ((d.value / maxVal) * (height - 40)) - 20;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#fff" stroke={color} strokeWidth="2" />
                        <text x={x} y={height + 15} textAnchor="middle" fontSize="12" fill="#888">{d.label}</text>
                        <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">{d.value}</text>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};

const PieChart = ({ data, colors }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativeAngle = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '2rem' }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((d, i) => {
          const angle = (d.value / total) * 360;
          const startAngle = cumulativeAngle;
          cumulativeAngle += angle;
          const endAngle = cumulativeAngle;

          const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          return (
            <path key={i} d={pathData} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: colors[i % colors.length], borderRadius: '2px' }}></div>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>{d.label}: {d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
    // ...existing AdminDashboard code...
    // Recipient selection state for survey settings
    const [recipientType, setRecipientType] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    // ...all other useState declarations...

    // ...existing code...

    function renderPollDetailsSection() {
      if (activeSection === 'poll-details' && selectedAnalyticsItem) {
        return (
          <section style={{ animation: 'fadeIn 0.5s ease', border: '2.5px solid', borderImage: 'linear-gradient(90deg, #B24592 0%, #F7941E 100%) 1', borderRadius: '14px', padding: '2rem', background: '#fff' }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{selectedAnalyticsItem.question}</h2>
            <div style={{ color: '#666', marginBottom: '1rem' }}>
              {selectedAnalyticsItem.votes} Votes • Created {selectedAnalyticsItem.created} • <span style={{ color: selectedAnalyticsItem.status === 'Active' ? '#4BCB6B' : '#F7941E' }}>{selectedAnalyticsItem.status}</span>
            </div>
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{fontWeight: 600, color: '#555'}}>Chart Type:</span>
              <button onClick={() => setChartType('bar')} style={chartToggleBtnStyle(chartType === 'bar')}>Bar Chart</button>
              <button onClick={() => setChartType('pie')} style={chartToggleBtnStyle(chartType === 'pie')}>Pie Chart</button>
              <button onClick={() => window.print()} style={{ ...chartToggleBtnStyle(false), marginLeft: 'auto', borderColor: '#7D1F4B', color: '#7D1F4B' }}>Export to PDF</button>
            </div>
            {chartType === 'bar' ? (
              <BarChart 
                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))} 
                color="#B24592" 
              />
            ) : (
              <PieChart
                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))}
                colors={chartColors}
              />
            )}
          </section>
        );
      }
      return null;
    }
  
    const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  // const [showProfileMenu, setShowProfileMenu] = useState(false); // unused
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsType, setAnalyticsType] = useState(null); 
  const [surveyDepartmentFilter, setSurveyDepartmentFilter] = useState('all');
  const [displayedSurvey, setDisplayedSurvey] = useState(null);
  const [selectedAnalyticsItem, setSelectedAnalyticsItem] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const [chartType, setChartType] = useState('bar');
  const [surveyQuestions, setSurveyQuestions] = useState([{ text: '', options: ['', ''], required: false }]);

  const handleSurveyQuestionChange = (qIdx, value) => {
    setSurveyQuestions(questions => questions.map((q, i) => i === qIdx ? { ...q, text: value } : q));
  };

  const addSurveyQuestion = () => {
    setSurveyQuestions(questions => [...questions, { text: '', options: ['', ''], required: false }]);
  };

  const removeSurveyQuestion = (qIdx) => {
    setSurveyQuestions(questions => questions.length > 1 ? questions.filter((_, i) => i !== qIdx) : questions);
  };

  const handleSurveyOptionChange = (qIdx, oIdx, value) => {
    setSurveyQuestions(questions => questions.map((q, i) => i === qIdx ? { ...q, options: q.options.map((opt, j) => j === oIdx ? value : opt) } : q));
  };
  const handleSurveyRequiredChange = (qIdx, value) => {
    setSurveyQuestions(questions => questions.map((q, i) => i === qIdx ? { ...q, required: value } : q));
  };

  const addSurveyOption = (qIdx) => {
    setSurveyQuestions(questions => questions.map((q, i) => i === qIdx ? { ...q, options: [...q.options, ''] } : q));
  };

  const removeSurveyOption = (qIdx, oIdx) => {
    setSurveyQuestions(questions => questions.map((q, i) => i === qIdx ? { ...q, options: q.options.length > 1 ? q.options.filter((_, j) => j !== oIdx) : q.options } : q));
  };
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };
  const [staffList] = useState([
    { id: 1, name: 'Crystal', role: 'Staff', department: 'HR', email: 'crystal@example.com' },
    { id: 2, name: 'John Doe', role: 'Staff', department: 'IT', email: 'john@example.com' },
    { id: 3, name: 'Jane Smith', role: 'Manager', department: 'Marketing', email: 'jane@example.com' },
    { id: 4, name: 'Alex Johnson', role: 'Staff', department: 'Engineering', email: 'alex@example.com' },
  ]);
  const [staffSearch, setStaffSearch] = useState('');

  const [departmentList, setDepartmentList] = useState([
    { id: 1, name: 'Human Resources', head: 'Crystal', members: 5 },
    { id: 2, name: 'IT', head: 'John Doe', members: 8 },
    { id: 3, name: 'Marketing', head: 'Jane Smith', members: 6 },
    { id: 4, name: 'Engineering', head: 'Alex Johnson', members: 12 },
  ]);

  const [groupList, setGroupList] = useState([
    { id: 1, name: 'Project Alpha', members: 8 },
    { id: 2, name: 'Social Committee', members: 12 },
    { id: 3, name: 'Management', members: 4 },
  ]);

  const [surveyList, setSurveyList] = useState([
    { 
      id: 1, 
      title: 'Q1 Employee Satisfaction', 
      responses: 18, 
      status: 'Active', 
      created: '1 day ago', 
      summary: 'Most employees are satisfied with their work environment.',
      dailyResponses: [
        { label: 'Mon', value: 2 }, { label: 'Tue', value: 5 }, { label: 'Wed', value: 8 }, { label: 'Thu', value: 3 }
      ],
      questions: [
        { type: 'choice', text: "How would you rate your overall satisfaction?", options: [{ label: "Very Satisfied", count: 10 }, { label: "Satisfied", count: 5 }, { label: "Neutral", count: 2 }, { label: "Dissatisfied", count: 1 }] },
        { type: 'choice', text: "Do you feel your feedback is valued?", options: [{ label: "Yes", count: 12 }, { label: "No", count: 6 }] },
        { type: 'choice', text: "How likely are you to recommend us?", options: [{ label: "Likely", count: 15 }, { label: "Unlikely", count: 3 }] },
        { 
          type: 'text', 
          text: "What improvements would you suggest?", 
          textResponses: [
            "More flexible hours would be great.",
            "Better coffee in the breakroom!",
            "I'd love more team building events.",
            "Clearer promotion paths needed."
          ]
        }
      ]
    },
    { id: 2, title: 'New IT Policy Feedback', responses: 5, status: 'Draft', created: '5 hours ago', summary: 'Pending more responses.', questions: [
        { type: 'choice', text: "Is the new policy clear?", options: [{ label: "Yes", count: 3 }, { label: "No", count: 2 }] }
    ],
    dailyResponses: [] 
    },
  ]);

  const [activePollsList, setActivePollsList] = useState([
    { 
      id: 1, 
      question: 'Holiday Party Preferences', 
      votes: 25, 
      status: 'Active', 
      created: '2 days ago',
      options: [
        { text: "Bowling", votes: 12 },
        { text: "Karaoke", votes: 8 },
        { text: "Hiking", votes: 5 }
      ]
    },
    { 
      id: 2, 
      question: 'New Office Layout', 
      votes: 42, 
      status: 'Active', 
      created: '1 week ago',
      options: [
        { text: "Open Plan", votes: 20 },
        { text: "Cubicles", votes: 15 },
        { text: "Hybrid", votes: 7 }
      ]
    },
    { 
      id: 3, 
      question: 'Team Building Activity', 
      votes: 15, 
      status: 'Active', 
      created: '3 days ago',
      options: [
        { text: "Escape Room", votes: 8 },
        { text: "Dinner", votes: 7 }
      ]
    },
  ]);

  const admin = {
    name: 'Admin User',
    email: 'admin@virtual.com',
    role: 'Administrator',
    photo: process.env.PUBLIC_URL + '/profile-photo.png',
  };

  const stats = [
    { label: 'Total Staff', value: staffList.length, color: '#B24592', onClick: () => setActiveSection('view-staff') },
    { label: 'Active Polls', value: activePollsList.length, color: '#F7941E',  onClick: () => setActiveSection('view-polls') },
    { label: 'Departments', value: departmentList.length, color: '#7D1F4B',onClick: () => setActiveSection('view-departments') },
    { label: 'Groups', value: groupList.length, color: '#4BCB6B', onClick: () => setActiveSection('view-groups') },
  ];

  const gotoAdminDashboard = () => { setActiveSection('overview'); };

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

  const getNavItemStyle = (section) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeSection === section ? '#fff0f7' : 'transparent',
    color: activeSection === section ? '#B24592' : '#fff0f7',
    fontWeight: activeSection === section ? '700' : '500',
    fontSize: '1.05rem',
    borderLeft: activeSection === section ? '4px solid #B24592' : '4px solid transparent',
    transition: 'all 0.2s ease'
  });

  const chartColors = ['#B24592', '#F7941E', '#7D1F4B', '#4BCB6B', '#3498db', '#9b59b6'];

  const chartToggleBtnStyle = (isActive) => ({
    padding: '6px 12px',
    border: `1px solid ${isActive ? '#B24592' : '#ccc'}`,
    borderRadius: '6px',
    background: isActive ? '#fff0f7' : '#f9f9f9',
    color: isActive ? '#B24592' : '#555',
    fontWeight: isActive ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });


  useEffect(() => {
    if (activeSection === 'survey-details' && selectedAnalyticsItem) {
        let surveyData = JSON.parse(JSON.stringify(selectedAnalyticsItem));
        
        const isDepartmentFiltered = surveyDepartmentFilter !== 'all';
        const isDateFiltered = startDate && endDate;

        if (isDepartmentFiltered || isDateFiltered) {
            const randomFactor = 0.5; // Simulate filtering by reducing counts

            surveyData.questions.forEach(q => {
                if (q.options) {
                    q.options.forEach(opt => {
                        opt.count = Math.floor(opt.count * randomFactor);
                    });
                }
                if (q.textResponses) {
                    q.textResponses = q.textResponses.slice(0, Math.ceil(q.textResponses.length * randomFactor));
                }
            });
            surveyData.responses = Math.floor(surveyData.responses * randomFactor);
            
            if (surveyData.dailyResponses) {
                surveyData.dailyResponses.forEach(dr => {
                    dr.value = Math.floor(dr.value * randomFactor);
                });
            }
        }
        
        setDisplayedSurvey(surveyData);
    }
  }, [activeSection, selectedAnalyticsItem, surveyDepartmentFilter, startDate, endDate]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem'
  };
  const thStyle = {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #eee',
    color: '#444'
  };
  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee',
    color: '#666'
  };

  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <aside className="sidebar-nav">
        <div className="sidebar-logo">
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoAdminDashboard} alt="Virtual Pay Logo" className="dashboard-logo" style={{ cursor: 'pointer' }} />
        </div>
        <nav style={{ marginTop: '1rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-poll')} onClick={() => setActiveSection('create-poll')}>Create Poll</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('view-polls')} onClick={() => setActiveSection('view-polls')}>All Polls</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-survey')} onClick={() => setActiveSection('create-survey')}>Create Survey</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('view-surveys')} onClick={() => setActiveSection('view-surveys')}>All Surveys</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-department')} onClick={() => setActiveSection('create-department')}>Create Department</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-group')} onClick={() => setActiveSection('create-group')}>Create Group</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('profile')} onClick={() => navigate('/admin-profile')}>Profile</li>
            <li tabIndex="0" role="button" style={{ ...getNavItemStyle('logout'), color: '#333' }} onClick={() => navigate('/')}>Log Out</li>
          </ul>
        </nav>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '180px' }}>
        <main className="admin-main-content" style={{ flex: 1, padding: '2.5rem 1rem 2.5rem 0.5rem', overflowY: 'auto' }}>
          {activeSection !== 'overview' && (
            <button
              onClick={() => setActiveSection('overview')}
              style={{
                background: 'none',
                border: 'none',
                color: '#B24592',
                fontSize: '1.6rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              aria-label="Back to Overview"
            >
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>&larr;</span>
              <span style={{
                background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700
              }}>Back to Overview</span>
            </button>
          )}

          {activeSection === 'create-poll' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Create a Poll</h2>
              <form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }} onSubmit={e => { e.preventDefault(); setActiveSection('poll-settings'); }}>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Poll Question</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., What should our next team event be?" />
                </label>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 600, color: '#444', marginBottom: 8 }}>Options</div>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} style={{ background: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10, border: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={e => handlePollOptionChange(idx, e.target.value)}
                      />
                      {pollOptions.length > 2 && (
                        <button type="button" onClick={() => removePollOption(idx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 20, cursor: 'pointer' }} title="Remove Option">&times;</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addPollOption} style={{ background: 'transparent', border: '2px dashed #B24592', color: '#B24592', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, width: '100%' }}>+ Add Option</button>
                </div>
                <button
                  type="submit"
                  className="create-poll-btn"
                  style={{
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
                  }}
                >
                  Create Poll
                </button>
              </form>
            </section>
          )}

          {activeSection === 'poll-settings' && (
            <section style={{ animation: 'fadeIn 0.5s ease', position: 'relative' }}>
              <button
                onClick={() => setActiveSection('create-poll')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  background: 'none',
                  border: 'none',
                  color: '#B24592',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  padding: '0.2rem 0.7rem 0.2rem 0.2rem',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Back to Edit Poll"
              >
                <span style={{ fontSize: '1.7rem', lineHeight: 1, marginRight: '0.3rem' }}>&larr;</span>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Back to Edit</span>
              </button>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem', marginLeft: '2.5rem' }}>Poll Settings</h2>
              <form style={{ ...cardStyle, boxShadow: '0 4px 24px rgba(178,69,146,0.18)' }} onSubmit={e => {
                e.preventDefault();
                // Here you would send the poll to the selected recipients
                let recipients = [];
                if (recipientType === 'all') {
                  recipients = staffList.map(s => s.email);
                } else if (recipientType === 'department' && selectedDepartment) {
                  recipients = staffList.filter(s => s.department === selectedDepartment).map(s => s.email);
                } else if (recipientType === 'group' && selectedGroup) {
                  const group = groupList.find(g => g.name === selectedGroup);
                  if (group) {
                    const memberNames = group.members && Array.isArray(group.members) ? group.members : (typeof group.members === 'string' ? group.members.split(',').map(m => m.trim()) : []);
                    recipients = staffList.filter(s => memberNames.includes(s.name)).map(s => s.email);
                  }
                } else if (recipientType === 'individual' && selectedStaff.length > 0) {
                  recipients = selectedStaff;
                }
                alert('Poll will be sent to: ' + recipients.join(', '));
              }}>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <input type="checkbox" style={{ marginRight: 8 }} />
                  Anonymous responses (hide respondent identity)
                </label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Send to:</span>
                  <select
                    value={recipientType}
                    onChange={e => setRecipientType(e.target.value)}
                    style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                  >
                    <option value="all">All Staff</option>
                    <option value="department">Department</option>
                    <option value="group">Group</option>
                    <option value="individual">Select Staff</option>
                  </select>
                </label>
                {recipientType === 'department' && (
                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Department:</span>
                    <select
                      value={selectedDepartment}
                      onChange={e => setSelectedDepartment(e.target.value)}
                      style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                    >
                      <option value="">Select Department</option>
                      {departmentList.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </label>
                )}
                {recipientType === 'group' && (
                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Group:</span>
                    <select
                      value={selectedGroup}
                      onChange={e => setSelectedGroup(e.target.value)}
                      style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                    >
                      <option value="">Select Group</option>
                      {groupList.map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </label>
                )}
                {recipientType === 'individual' && (
                  <label style={{ display: 'block', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Staff:</span>
                    <div style={{
                      border: '1.5px solid #B24592',
                      borderRadius: '8px',
                      background: '#fff0f7',
                      padding: '12px',
                      width: 340,
                      boxShadow: '0 2px 8px rgba(178,69,146,0.07)',
                      display: 'inline-block',
                      marginTop: 8
                    }}>
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={staffSearch || ''}
                        onChange={e => setStaffSearch(e.target.value)}
                        style={{
                          width: '100%',
                          marginBottom: 10,
                          padding: '8px 12px',
                          borderRadius: 20,
                          border: '1px solid #e1e1e1',
                          fontSize: '0.98rem',
                          outline: 'none'
                        }}
                      />
                      <div style={{ maxHeight: 140, overflowY: 'auto' }}>
                        {staffList.filter(staff =>
                          !staffSearch || staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(staffSearch.toLowerCase())
                        ).map(staff => (
                          <label key={staff.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '6px 8px',
                            borderRadius: 20,
                            background: selectedStaff.includes(staff.email) ? '#F7941E22' : 'transparent',
                            marginBottom: 4,
                            cursor: 'pointer',
                            fontWeight: 500
                          }}>
                            <input
                              type="checkbox"
                              checked={selectedStaff.includes(staff.email)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedStaff([...selectedStaff, staff.email]);
                                } else {
                                  setSelectedStaff(selectedStaff.filter(email => email !== staff.email));
                                }
                              }}
                              style={{
                                accentColor: '#B24592',
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                marginRight: 6
                              }}
                            />
                            <span style={{ color: '#7D1F4B', fontSize: '1rem' }}>{staff.name} <span style={{ color: '#888', fontSize: '0.95em' }}>({staff.email})</span></span>
                          </label>
                        ))}
                        {staffList.filter(staff =>
                          !staffSearch || staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(staffSearch.toLowerCase())
                        ).length === 0 && (
                          <div style={{ color: '#888', fontStyle: 'italic', padding: 8 }}>No staff found.</div>
                        )}
                      </div>
                    </div>
                  </label>
                )}
                <button
                  type="submit"
                  className="send-poll-btn"
                  style={{
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
                  }}
                >
                  Send Poll
                </button>
              </form>
            </section>
          )}
          {activeSection === 'overview' && (
            <section className="admin-overview-section" style={{ animation: 'fadeIn 0.5s ease' }}>
              <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Dashboard Overview</h1>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      ...cardStyle,
                      padding: '1.5rem',
                      marginBottom: 0,
                      cursor: stat.onClick ? 'pointer' : 'default',
                      border: '2.5px solid',
                      borderImage: 'linear-gradient(90deg, #B24592 0%, #F7941E 100%) 1',
                    }}
                    onClick={stat.onClick}
                  >
                    <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div style={{
                ...cardStyle,
                border: '1.5px solid #eee',
                background: '#fff',
                boxShadow: 'none',
                marginTop: '2rem',
                padding: '2rem 1.5rem',
              }}>
                <h3 style={{
                  marginBottom: '1.2rem',
                  color: '#333',
                  fontWeight: 700,
                  letterSpacing: '0.2px',
                  fontSize: '1.15rem',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '0.5rem',
                }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div
                    style={{
                      padding: '1.1rem 1.2rem',
                      background: '#fafbfc',
                      borderRadius: '8px',
                      borderLeft: '4px solid #B24592',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '60px',
                      justifyContent: 'center',
                    }}
                    title="View Poll Analytics"
                    onClick={() => { setSelectedAnalyticsItem(activePollsList[0]); setAnalyticsType('poll'); setShowAnalytics(true); }}
                  >
                    <span style={{ fontWeight: 600, color: '#B24592', fontSize: '1.01rem', marginBottom: 2 }}>New Poll Created</span>
                    <span style={{ color: '#222', fontWeight: 500, fontSize: '1.01rem', margin: '2px 0 0 0' }}>&quot;Holiday Party Preferences&quot;</span>
                    <span style={{ fontSize: '0.88rem', color: '#888', marginTop: '4px' }}>2 hours ago by Admin</span>
                  </div>
                  <div
                    style={{
                      padding: '1.1rem 1.2rem',
                      background: '#fafbfc',
                      borderRadius: '8px',
                      borderLeft: '4px solid #F7941E',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '60px',
                      justifyContent: 'center',
                    }}
                    title="View Survey Analytics"
                    onClick={() => { setSelectedAnalyticsItem(surveyList[0]); setActiveSection('survey-details'); setSurveyDepartmentFilter('all'); }}
                  >
                    <span style={{ fontWeight: 600, color: '#F7941E', fontSize: '1.01rem', marginBottom: 2 }}>New Survey Created</span>
                    <span style={{ color: '#222', fontWeight: 500, fontSize: '1.01rem', margin: '2px 0 0 0' }}>&quot;Q1 Employee Satisfaction&quot;</span>
                    <span style={{ fontSize: '0.88rem', color: '#888', marginTop: '4px' }}>1 day ago by Admin</span>
                  </div>
                </div>
              </div>
                  
                  {showAnalytics && (
                    <div style={{
                      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ background: 'white', borderRadius: 12, padding: '2rem', minWidth: 340, minHeight: 200, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative' }}>
                        <button onClick={() => setShowAnalytics(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', fontSize: 22, color: '#B24592', cursor: 'pointer' }}>&times;</button>
                        <h2 style={{ color: '#7D1F4B', marginBottom: 16 }}>{analyticsType === 'poll' ? 'Poll Analytics' : 'Survey Analytics'}</h2>
                        {analyticsType === 'poll' && selectedAnalyticsItem && (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '1.1rem' }}>{selectedAnalyticsItem.question}</div>
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => setChartType('bar')} style={chartToggleBtnStyle(chartType === 'bar')}>Bar</button>
                              <button onClick={() => setChartType('pie')} style={chartToggleBtnStyle(chartType === 'pie')}>Pie</button>
                            </div>
                            {chartType === 'bar' ? (
                              <BarChart 
                                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))} 
                                color="#B24592" 
                              />
                            ) : (
                              <PieChart
                                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))}
                                colors={chartColors}
                              />
                            )}
                            <div style={{ marginTop: 16, color: '#666', borderTop: '1px solid #eee', paddingTop: 8 }}>Total responses: {selectedAnalyticsItem.votes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
            </section>
          )}
          
          {activeSection === 'create-survey' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Create a Survey</h2>
              <form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }} onSubmit={e => { e.preventDefault(); setActiveSection('survey-settings'); }}>
                {/* ...existing survey form fields... */}
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Survey Title</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Q1 Employee Satisfaction" />
                </label>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Description</span>
                  <textarea style={{ ...inputStyle, height: '100px', resize: 'vertical', maxWidth: '95%', flex: 1 }} placeholder="Briefly describe the purpose of this survey..." />
                </label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: '#444' }}>Deadline</span>
                  <input type="date" style={{ ...inputStyle, maxWidth: '350px' }} />
                </label>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 600, color: '#444', marginBottom: 8 }}>Questions</div>
                  {surveyQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 16, border: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                        <input
                          type="text"
                          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                          placeholder={`Question ${qIdx + 1}`}
                          value={q.text}
                          onChange={e => handleSurveyQuestionChange(qIdx, e.target.value)}
                        />
                        <label style={{ marginLeft: 12, display: 'flex', alignItems: 'center', fontSize: '0.98rem', color: '#7D1F4B', fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={e => handleSurveyRequiredChange(qIdx, e.target.checked)}
                            style={{ marginRight: 6 }}
                          />
                          Required
                        </label>
                        {surveyQuestions.length > 1 && (
                          <button type="button" onClick={() => removeSurveyQuestion(qIdx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 20, cursor: 'pointer' }} title="Remove Question">&times;</button>
                        )}
                      </div>
                      <div style={{ marginLeft: 8, marginBottom: 8, fontWeight: 500, color: '#888' }}>Answer Options</div>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                          <input
                            type="text"
                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={e => handleSurveyOptionChange(qIdx, oIdx, e.target.value)}
                          />
                          {q.options.length > 1 && (
                            <button type="button" onClick={() => removeSurveyOption(qIdx, oIdx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 18, cursor: 'pointer' }} title="Remove Option">&times;</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addSurveyOption(qIdx)} style={{ background: 'transparent', border: '1px dashed #B24592', color: '#B24592', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: 6 }}>+ Add Option</button>
                    </div>
                  ))}
                  <button type="button" onClick={addSurveyQuestion} style={{ background: 'transparent', border: '2px dashed #B24592', color: '#B24592', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, width: '100%' }}>+ Add Question</button>
                </div>
                <button
                  type="submit"
                  className="create-survey-btn"
                  style={{
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
                  }}
                >
                  Create Survey
                </button>
              </form>
            </section>
          )}

              {activeSection === 'survey-settings' && (
                <section style={{ animation: 'fadeIn 0.5s ease', position: 'relative' }}>
                  <button
                    onClick={() => setActiveSection('create-poll')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      background: 'none',
                      border: 'none',
                      color: '#B24592',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '1rem',
                      padding: '0.2rem 0.7rem 0.2rem 0.2rem',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label="Back to Edit Poll"
                  >
                    <span style={{ fontSize: '1.7rem', lineHeight: 1, marginRight: '0.3rem' }}>&larr;</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Back to Edit</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('create-survey')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      background: 'none',
                      border: 'none',
                      color: '#B24592',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '1rem',
                      padding: '0.2rem 0.7rem 0.2rem 0.2rem',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label="Back to Edit Survey"
                  >
                    <span style={{ fontSize: '1.7rem', lineHeight: 1, marginRight: '0.3rem' }}>&larr;</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Back to Edit</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('create-survey')}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      background: 'none',
                      border: 'none',
                      color: '#B24592',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginBottom: '1rem',
                      padding: '0.2rem 0.7rem 0.2rem 0.2rem',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label="Back to Edit Survey"
                  >
                    <span style={{ fontSize: '1.7rem', lineHeight: 1, marginRight: '0.3rem' }}>&larr;</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Back to Edit</span>
                  </button>
                  <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Survey Settings</h2>
                  <form style={{ ...cardStyle, boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }} onSubmit={e => {
                    e.preventDefault();
                    // Here you would send the survey to the selected recipients
                    let recipients = [];
                    if (recipientType === 'all') {
                      recipients = staffList.map(s => s.email);
                    } else if (recipientType === 'department' && selectedDepartment) {
                      recipients = staffList.filter(s => s.department === selectedDepartment).map(s => s.email);
                    } else if (recipientType === 'group' && selectedGroup) {
                      // For demo, assume group members are names, match by name
                      const group = groupList.find(g => g.name === selectedGroup);
                      if (group) {
                        const memberNames = group.members && Array.isArray(group.members) ? group.members : (typeof group.members === 'string' ? group.members.split(',').map(m => m.trim()) : []);
                        recipients = staffList.filter(s => memberNames.includes(s.name)).map(s => s.email);
                      }
                    } else if (recipientType === 'individual' && selectedStaff.length > 0) {
                      recipients = selectedStaff;
                    }
                    alert('Survey will be sent to: ' + recipients.join(', '));
                  }}>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                      <input type="checkbox" style={{ marginRight: 8 }} />
                      Anonymous responses (hide respondent identity)
                    </label>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Send to:</span>
                      <select
                        value={recipientType}
                        onChange={e => setRecipientType(e.target.value)}
                        style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                      >
                        <option value="all">All Staff</option>
                        <option value="department">Department</option>
                        <option value="group">Group</option>
                        <option value="individual">Select Staff</option>
                      </select>
                    </label>
                    {recipientType === 'department' && (
                      <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Department:</span>
                        <select
                          value={selectedDepartment}
                          onChange={e => setSelectedDepartment(e.target.value)}
                          style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                        >
                          <option value="">Select Department</option>
                          {departmentList.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    {recipientType === 'group' && (
                      <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Group:</span>
                        <select
                          value={selectedGroup}
                          onChange={e => setSelectedGroup(e.target.value)}
                          style={{ ...inputStyle, width: 200, display: 'inline-block' }}
                        >
                          <option value="">Select Group</option>
                          {groupList.map(g => (
                            <option key={g.id} value={g.name}>{g.name}</option>
                          ))}
                        </select>
                      </label>
                    )}
                    {recipientType === 'individual' && (
                      <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Staff:</span>
                        <select
                          multiple
                          value={selectedStaff}
                          onChange={e => {
                            const options = Array.from(e.target.selectedOptions, option => option.value);
                            setSelectedStaff(options);
                          }}
                          style={{ ...inputStyle, width: 300, display: 'inline-block', height: 120 }}
                        >
                          {staffList.map(staff => (
                            <option key={staff.id} value={staff.email}>{staff.name} ({staff.email})</option>
                          ))}
                        </select>
                      </label>
                    )}
                    <button
                      type="submit"
                      className="send-survey-btn"
                      style={{
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
                      }}
                    >
                      Send Survey
                    </button>
                  </form>
                </section>
          )}
          {activeSection === 'create-department' && (
                <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Create Department</h2>
              <form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Department Name</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Research & Development" />
                </label>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Head of Department</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Jane Doe" />
                </label>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Members</span>
                  <select multiple style={{ ...inputStyle, maxWidth: '95%', flex: 1, height: '110px' }}>
                    {staffList && staffList.length > 0 ? (
                      staffList.map(staff => (
                        <option key={staff.id} value={staff.name}>{staff.name} ({staff.email})</option>
                      ))
                    ) : (
                      <option disabled>No staff available</option>
                    )}
                  </select>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple members.</span>
                </label>
                <button
                  type="submit"
                  className="create-department-btn"
                  style={{
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
                  }}
                >
                  Create Department
                </button>
              </form>
            </section>
          )}
          {activeSection === 'create-group' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Create Group</h2>
              <form style={{ ...cardStyle, border: '1px solid #F7941E', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Group Name</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Project Phoenix" />
                </label>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Head of Group</span>
                  <input type="text" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Jane Doe" />
                </label>
                <label>
                  <span style={{ fontWeight: 600, color: '#444' }}>Members</span>
                  <select multiple style={{ ...inputStyle, maxWidth: '95%', flex: 1, height: '110px' }}>
                    {staffList && staffList.length > 0 ? (
                      staffList.map(staff => (
                        <option key={staff.id} value={staff.name}>{staff.name} ({staff.email})</option>
                      ))
                    ) : (
                      <option disabled>No staff available</option>
                    )}
                  </select>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Hold Ctrl (Windows) or Cmd (Mac) to select multiple members.</span>
                </label>
                <button
                  type="submit"
                  className="create-group-btn"
                  style={{
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
                  }}
                >
                  Create Group
                </button>
              </form>
            </section>
          )}

          {activeSection === 'view-polls' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>All Polls</h2>
              <div style={{
                ...cardStyle,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search polls..."
                  style={{ ...inputStyle, maxWidth: 250, marginBottom: 0 }}
                />
                <div>
                  <label style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Date Range</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          style={{ ...inputStyle, padding: '8px 12px', marginTop: 0, marginBottom: 0, width: '130px' }}
                      />
                      <span style={{ color: '#888' }}>to</span>
                      <input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          style={{ ...inputStyle, padding: '8px 12px', marginTop: 0, marginBottom: 0, width: '130px' }}
                      />
                  </div>
                </div>
              </div>
              <div style={{
                ...cardStyle,
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                {activePollsList.filter(poll => {
                  const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
                  let matchesDate = true;
                  if (startDate && endDate && poll.createdDate) {
                    matchesDate = (new Date(poll.createdDate) >= new Date(startDate)) && (new Date(poll.createdDate) <= new Date(endDate));
                  }
                  return matchesSearch && matchesDate;
                }).length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>No polls found.</div>
                ) : (
                  <>
                    {activePollsList.filter(poll => {
                      const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
                      let matchesDate = true;
                      if (startDate && endDate && poll.createdDate) {
                        matchesDate = (new Date(poll.createdDate) >= new Date(startDate)) && (new Date(poll.createdDate) <= new Date(endDate));
                      }
                      return matchesSearch && matchesDate;
                    }).map(poll => (
                      <div key={"poll-" + poll.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s', borderRadius: '10px', marginBottom: '1rem', background: '#fff', borderLeft: '5px solid #B24592' }} onClick={() => { setSelectedAnalyticsItem(poll); setActiveSection('poll-details'); }} onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{poll.question}</div>
                          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>Created {poll.created} • {poll.votes} votes</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setActivePollsList(activePollsList.filter(p => p.id !== poll.id)); }} style={{ color: '#ff4b4b', background: 'none', border: '1px solid #ff4b4b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '1rem' }}>End Poll</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {activeSection === 'view-surveys' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>All Surveys</h2>
              <div style={{
                ...cardStyle,
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search surveys..."
                  style={{ ...inputStyle, maxWidth: 250, marginBottom: 0 }}
                />
                <div>
                  <label style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Department</label>
                  <select
                      value={surveyDepartmentFilter}
                      onChange={e => setSurveyDepartmentFilter(e.target.value)}
                      style={{ ...inputStyle, padding: '8px 12px', marginTop: 0, marginBottom: 0, width: '180px' }}
                  >
                      <option value="all">All Departments</option>
                      {departmentList.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Date Range</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          style={{ ...inputStyle, padding: '8px 12px', marginTop: 0, marginBottom: 0, width: '130px' }}
                      />
                      <span style={{ color: '#888' }}>to</span>
                      <input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          style={{ ...inputStyle, padding: '8px 12px', marginTop: 0, marginBottom: 0, width: '130px' }}
                      />
                  </div>
                </div>
              </div>
              <div style={{
                ...cardStyle,
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                {surveyList.filter(survey => {
                  const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesDept = surveyDepartmentFilter === 'all' || (survey.department && survey.department === surveyDepartmentFilter);
                  let matchesDate = true;
                  if (startDate && endDate && survey.createdDate) {
                    matchesDate = (new Date(survey.createdDate) >= new Date(startDate)) && (new Date(survey.createdDate) <= new Date(endDate));
                  }
                  return matchesSearch && matchesDept && matchesDate;
                }).length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>No surveys found.</div>
                ) : (
                  <>
                    {surveyList.filter(survey => {
                      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesDept = surveyDepartmentFilter === 'all' || (survey.department && survey.department === surveyDepartmentFilter);
                      let matchesDate = true;
                      if (startDate && endDate && survey.createdDate) {
                        matchesDate = (new Date(survey.createdDate) >= new Date(startDate)) && (new Date(survey.createdDate) <= new Date(endDate));
                      }
                      return matchesSearch && matchesDept && matchesDate;
                    }).map(survey => (
                      <div key={"survey-" + survey.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background 0.2s', borderLeft: '5px solid #F7941E', borderRadius: '10px', marginBottom: '1rem', background: '#fff' }}
                        onClick={() => {
                          if (survey.status === 'Draft') {
                            setSurveyQuestions(survey.questions ? survey.questions.map(q => ({
                              text: q.text || '',
                              options: q.options ? q.options.map(opt => opt.label || opt) : ['', ''],
                              required: q.required || false
                            })) : [{ text: '', options: ['', ''], required: false }]);
                            setActiveSection('create-survey');
                          } else {
                            setSelectedAnalyticsItem(survey);
                            setActiveSection('survey-details');
                            setSurveyDepartmentFilter('all');
                          }
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{survey.title}</div>
                          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>Created {survey.created} • {survey.responses} responses • <span style={{ color: survey.status === 'Active' ? '#4BCB6B' : '#F7941E' }}>{survey.status}</span></div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setSurveyList(surveyList.filter(s => s.id !== survey.id)); }} style={{ color: '#ff4b4b', background: 'none', border: '1px solid #ff4b4b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '1rem' }}>Delete</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {activeSection === 'survey-details' && displayedSurvey && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              {displayedSurvey.dailyResponses && displayedSurvey.dailyResponses.length > 0 && (
                <LineChart data={displayedSurvey.dailyResponses} color="#B24592" />
              )}

              <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{fontWeight: 600, color: '#555'}}>Chart Type:</span>
                <button onClick={() => setChartType('bar')} style={chartToggleBtnStyle(chartType === 'bar')}>Bar Chart</button>
                <button onClick={() => setChartType('pie')} style={chartToggleBtnStyle(chartType === 'pie')}>Pie Chart</button>
                <button onClick={() => window.print()} style={{ ...chartToggleBtnStyle(false), marginLeft: 'auto', borderColor: '#7D1F4B', color: '#7D1F4B' }}>Export to PDF</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {displayedSurvey.questions && displayedSurvey.questions.map((q, index) => (
                  <div key={index} style={cardStyle}>
                    <h4 style={{ marginBottom: '1rem', color: '#444' }}>{index + 1}. {q.text}</h4>
                    {q.type === 'text' ? (
                      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', fontStyle: 'italic' }}>Recent text responses:</div>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                          {q.textResponses && q.textResponses.map((resp, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem', color: '#333' }}>&quot;{resp}&quot;</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      chartType === 'bar' ? (
                        <BarChart 
                          data={q.options.map(opt => ({ label: opt.label, value: opt.count }))} 
                          color="#7D1F4B" 
                        />
                      ) : (
                        <PieChart
                          data={q.options.map(opt => ({ label: opt.label, value: opt.count }))}
                          colors={chartColors}
                        />
                      )
                    )}
                  </div>
                ))}
                {(!displayedSurvey.questions || displayedSurvey.questions.length === 0) && (
                   <div style={cardStyle}>No detailed question data available for this survey.</div>
                )}
              </div>
            </section>
          )}

          {activeSection === 'view-departments' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Departments</h2>
              <div style={cardStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Department Name</th>
                      <th style={thStyle}>Head of Dept</th>
                      <th style={thStyle}>Members</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentList.map(dept => (
                      <tr key={dept.id}>
                        <td style={tdStyle}>{dept.name}</td>
                        <td style={tdStyle}>{dept.head}</td>
                        <td style={tdStyle}>{dept.members}</td>
                        <td style={tdStyle}>
                          <button onClick={() => setDepartmentList(departmentList.filter(d => d.id !== dept.id))} style={{ color: '#ff4b4b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === 'view-groups' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>User Groups</h2>
              <div style={cardStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Group Name</th>
                      <th style={thStyle}>Members</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupList.map(group => (
                      <tr key={group.id}>
                        <td style={tdStyle}>{group.name}</td>
                        <td style={tdStyle}>{group.members}</td>
                        <td style={tdStyle}>
                          <button onClick={() => setGroupList(groupList.filter(g => g.id !== group.id))} style={{ color: '#ff4b4b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === 'view-staff' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>All Staff</h2>
              <div style={cardStyle}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Department</th>
                      <th style={thStyle}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(staff => (
                      <tr key={staff.id}>
                        <td style={tdStyle}>{staff.name}</td>
                        <td style={tdStyle}>{staff.role}</td>
                        <td style={tdStyle}>{staff.department}</td>
                        <td style={tdStyle}>{staff.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {staffList.length === 0 && <div style={{ color: '#666', fontStyle: 'italic' }}>No staff found.</div>}
              </div>
            </section>
          )}


        {renderPollDetailsSection()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
