import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
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

const BarChart = ({ data, color, onBarClick }) => {
  const maxVal = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', height: '280px', gap: '12px', padding: '20px 10px 80px 10px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa', marginTop: '1rem', overflowX: 'auto' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', minWidth: '40px', cursor: onBarClick ? 'pointer' : 'default' }} onClick={() => onBarClick && onBarClick(d)}>
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
            }} title={`${d.label}: ${d.value}`}>
               <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', fontWeight: 'bold', color: '#555' }}>
                {d.value}
               </span>
            </div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.8rem', textAlign: 'right', color: '#666', lineHeight: '1.2', fontWeight: '500', transform: 'rotate(-45deg)', transformOrigin: 'top right', whiteSpace: 'nowrap', width: '100%', marginRight: '-10px' }}>
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
                        <circle cx={x} cy={y} r="5" fill="#fff" stroke={color} strokeWidth="2">
                          <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                        <text x={x} y={height + 15} textAnchor="middle" fontSize="12" fill="#888">{d.label}</text>
                        <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">{d.value}</text>
                    </g>
                );
            })}
        </svg>
    </div>
  );
};

const PieChart = ({ data, colors, onSliceClick }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativeAngle = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '2rem' }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
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

          const midAngle = startAngle + angle / 2;
          const textX = 100 + 55 * Math.cos((midAngle * Math.PI) / 180);
          const textY = 100 + 55 * Math.sin((midAngle * Math.PI) / 180);
          const percentage = Math.round((d.value / total) * 100);

          return (
            <g key={i} onClick={() => onSliceClick && onSliceClick(d)} style={{ cursor: onSliceClick ? 'pointer' : 'default' }}>
              <path d={pathData} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2">
                <title>{`${d.label}: ${d.value} (${percentage}%)`}</title>
              </path>
              {percentage > 5 && (
                <text x={textX} y={textY} textAnchor="middle" dy=".3em" fill="#fff" fontSize="10" fontWeight="bold" pointerEvents="none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {percentage}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: onSliceClick ? 'pointer' : 'default' }} onClick={() => onSliceClick && onSliceClick(d)}>
            <div style={{ width: '12px', height: '12px', backgroundColor: colors[i % colors.length], borderRadius: '2px' }}></div>
            <span style={{ fontSize: '0.9rem', color: '#555' }}>{d.label}: {d.value} ({Math.round((d.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const responsiveStyles = `
  @media (max-width: 900px) {
    .sidebar-nav {
      display: none !important;
    }
    .admin-main-wrapper {
      margin-left: 0 !important;
    }
    .hamburger-menu {
      display: flex !important;
    }
    .mobile-sidebar-dropdown {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      height: 100vh;
      background: #fff;
      box-shadow: 2px 0 16px rgba(0,0,0,0.1);
      z-index: 1200;
      animation: slideInLeft 0.2s;
      overflow-y: auto;
    }
    .mobile-sidebar-overlay {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.5);
      z-index: 1100;
    }
  }
  .hamburger-menu {
    display: none;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1201;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
  }
  .hamburger-menu .bar {
    width: 20px;
    height: 2px;
    background: #B24592;
    margin: 2px 0;
    border-radius: 2px;
  }
  @keyframes slideInLeft {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  .dashboard-logo-img {
    max-width: 140px;
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: inline-block;
  }
  .dashboard-logo-img:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(178, 69, 146, 0.2);
  }
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  .skeleton-loader {
    height: 70px;
    background: #f0f0f0;
    border-radius: 10px;
    margin-bottom: 1rem;
    animation: pulse 1.5s infinite ease-in-out;
  }
  .toast-notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 2000;
    animation: slideInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .toast-undo-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.3);
    color: #F7941E;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }
  .filter-chip {
    display: inline-flex;
    align-items: center;
    background: #fff0f7;
    color: #B24592;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-right: 8px;
    border: 1px solid #B24592;
    animation: fadeIn 0.3s ease;
  }
  .trend-indicator {
    font-size: 0.85rem;
    margin-left: 8px;
    font-weight: 600;
  }
  .trend-up { color: #4BCB6B; }
  .trend-down { color: #F7941E; }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .list-item-hover {
    background-color: #fff;
    transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .list-item-hover:hover {
    background-color: #f9f9f9;
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  button {
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  button:active {
    transform: scale(0.96);
  }
`;

const AdminDashboard = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [pollsDropdownOpen, setPollsDropdownOpen] = useState(false);
    const [surveysDropdownOpen, setSurveysDropdownOpen] = useState(false);
    // ...existing AdminDashboard code...
    const [isLoading, setIsLoading] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', action: null });
    const [savedFilters, setSavedFilters] = useState([]);
    const [showFilterSave, setShowFilterSave] = useState(false);
    const [filterName, setFilterName] = useState('');
    // Recipient selection state for survey settings
    const [recipientType, setRecipientType] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [deptMembers, setDeptMembers] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    // ...all other useState declarations...

    // ...existing code...

    const checkSearchMatch = (item, term, type) => {
      if (!term) return true;
      const t = term.toLowerCase();
      if (type === 'poll') {
          return item.question.toLowerCase().includes(t) || 
                 (item.options && item.options.some(o => o.text.toLowerCase().includes(t)));
      }
      if (type === 'survey') {
          return item.title.toLowerCase().includes(t) ||
                 (item.summary && item.summary.toLowerCase().includes(t)) ||
                 (item.questions && item.questions.some(q => (q.text && q.text.toLowerCase().includes(t))));
      }
      return false;
    };

    const exportToCSV = (filename, rows) => {
      const csvContent = "data:text/csv;charset=utf-8," 
          + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const renderActiveFilters = () => {
      const filters = [];
      if (searchTerm) filters.push({ label: `Search: "${searchTerm}"`, clear: () => setSearchTerm('') });
      if (surveyDepartmentFilter && surveyDepartmentFilter !== 'all') filters.push({ label: `Dept: ${surveyDepartmentFilter}`, clear: () => setSurveyDepartmentFilter('all') });
      if (startDate || endDate) filters.push({ label: `Date: ${startDate} - ${endDate}`, clear: () => { setStartDate(''); setEndDate(''); } });
  
      if (filters.length === 0) return null;
  
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#666', marginRight: '4px' }}>Active Filters:</span>
          {filters.map((f, i) => (
            <div key={i} className="filter-chip">
              {f.label}
              <span onClick={f.clear} style={{ marginLeft: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', lineHeight: 0.5 }}>&times;</span>
            </div>
          ))}
          <button onClick={() => { setSearchTerm(''); setSurveyDepartmentFilter('all'); setStartDate(''); setEndDate(''); }} style={{ background: 'none', border: 'none', color: '#B24592', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Clear All</button>
        </div>
      );
    };

    const getTrendIcon = (val) => {
      return val >= 0 ? <span className="trend-indicator trend-up">↑ {val}%</span> : <span className="trend-indicator trend-down">↓ {Math.abs(val)}%</span>;
    };

    const DateRangePicker = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{ ...inputStyle, width: 'auto', marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fff' }}
          >
            <span style={{ fontSize: '1.1rem' }}>📅</span> 
            {startDate && endDate ? `${startDate} - ${endDate}` : 'Select Date Range'}
          </button>
          {isOpen && (
            <>
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9 }} onClick={() => setIsOpen(false)} />
              <div style={{
                position: 'absolute', top: '110%', left: 0, zIndex: 10, background: 'white', 
                padding: '1rem', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: '1px solid #eee', width: '280px', animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
                    <button onClick={() => {
                          const d = new Date(); d.setDate(d.getDate() - 7); 
                          setStartDate(d.toISOString().split('T')[0]); 
                          setEndDate(new Date().toISOString().split('T')[0]);
                          setIsOpen(false);
                    }} style={{ padding: '6px', fontSize: '0.8rem', cursor: 'pointer', background: '#f0f0f0', border: 'none', borderRadius: '6px' }}>Last 7 Days</button>
                    <button onClick={() => {
                          const d = new Date(); d.setDate(d.getDate() - 30); 
                          setStartDate(d.toISOString().split('T')[0]); 
                          setEndDate(new Date().toISOString().split('T')[0]);
                          setIsOpen(false);
                    }} style={{ padding: '6px', fontSize: '0.8rem', cursor: 'pointer', background: '#f0f0f0', border: 'none', borderRadius: '6px' }}>Last 30 Days</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Start Date</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inputStyle, marginBottom: 0, padding: '6px' }} />
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>End Date</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inputStyle, marginBottom: 0, padding: '6px' }} />
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <button onClick={() => setIsOpen(false)} style={{ background: '#B24592', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 600 }}>Done</button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    };

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
              <button onClick={() => exportToCSV('poll_results.csv', [['Option', 'Votes'], ...selectedAnalyticsItem.options.map(o => [o.text, o.votes])])} style={{ ...chartToggleBtnStyle(false), marginLeft: 'auto' }}>Export CSV</button>
              <button onClick={() => window.print()} style={{ ...chartToggleBtnStyle(false), borderColor: '#7D1F4B', color: '#7D1F4B' }}>Export PDF</button>
            </div>
            {chartType === 'bar' ? (
              <BarChart 
                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))} 
                color="#B24592" 
                onBarClick={(item) => setToast({ show: true, message: `Filtered by: ${item.label}` })}
              />
            ) : (
              <PieChart
                data={selectedAnalyticsItem.options.map(opt => ({ label: opt.text, value: opt.votes }))}
                colors={chartColors}
                onSliceClick={(item) => setToast({ show: true, message: `Filtered by: ${item.label}` })}
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

  // Simulate loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchTerm, startDate, endDate, surveyDepartmentFilter]);

  const handleDelete = (id, list, setList, typeName, nameField = 'title') => {
    const itemToDelete = list.find(item => item.id === id);
    const originalList = [...list];
    
    // Optimistic delete
    setList(list.filter(item => item.id !== id));
    
    setToast({
      show: true,
      message: `${typeName} deleted`,
      action: () => {
        setList(originalList); // Undo
        setToast({ show: false, message: '', action: null });
      }
    });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

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

  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@virtual.com',
    role: 'Administrator',
    phone: '',
    photo: process.env.PUBLIC_URL + '/profile-photo.png',
  });

  const handleProfileChange = (e) => {
    setAdminProfile({ ...adminProfile, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAdminProfile(prev => ({ ...prev, photo: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated!');
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

  const getNavItemStyle = (section, isMobile = false) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: activeSection === section ? '#fff0f7' : 'transparent',
    color: activeSection === section ? '#B24592' : (isMobile ? '#555' : '#fff'),
    fontWeight: activeSection === section ? '700' : '500',
    fontSize: '1.05rem',
    borderLeft: activeSection === section ? '4px solid #B24592' : '4px solid transparent',
    transition: 'all 0.2s ease'
  });

  const chartColors = ['#B24592', '#C05688', '#CE677E', '#DC7874', '#EA896A', '#F7941E'];

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

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = (e) => {
    const copyListItems = [...pollOptions];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setPollOptions(copyListItems);
  };

  const renderMultiSelect = (selectedItems, setSelectedItems, placeholder = "Search staff...") => (
    <div style={{
      border: '1.5px solid #e1e1e1',
      borderRadius: '8px',
      background: '#fff',
      padding: '12px',
      width: '100%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginTop: 8
    }}>
      <input
        type="text"
        placeholder={placeholder}
        value={staffSearch || ''}
        onChange={e => setStaffSearch(e.target.value)}
        style={{ ...inputStyle, marginBottom: 10, borderRadius: '6px' }}
      />
      <div style={{ maxHeight: 180, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
        {staffList.filter(staff =>
          !staffSearch || staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(staffSearch.toLowerCase())
        ).map(staff => (
          <label key={staff.id} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: '6px',
            background: selectedItems.includes(staff.email) ? '#fff0f7' : '#f8f9fa',
            border: selectedItems.includes(staff.email) ? '1px solid #B24592' : '1px solid transparent',
            cursor: 'pointer', transition: 'all 0.2s'
          }}>
            <input type="checkbox" checked={selectedItems.includes(staff.email)} onChange={e => { if (e.target.checked) { setSelectedItems([...selectedItems, staff.email]); } else { setSelectedItems(selectedItems.filter(email => email !== staff.email)); } }} style={{ accentColor: '#B24592', width: 16, height: 16, cursor: 'pointer' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#333', fontSize: '0.95rem', fontWeight: 500 }}>{staff.name}</span>
                <span style={{ color: '#888', fontSize: '0.8rem' }}>{staff.email}</span>
            </div>
          </label>
        ))}
        {staffList.filter(staff => !staffSearch || staff.name.toLowerCase().includes(staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(staffSearch.toLowerCase())).length === 0 && <div style={{ color: '#888', fontStyle: 'italic', padding: 8, gridColumn: '1/-1' }}>No staff found.</div>}
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div>
      <div className="skeleton-loader" style={{ width: '100%' }}></div>
      <div className="skeleton-loader" style={{ width: '100%' }}></div>
      <div className="skeleton-loader" style={{ width: '100%' }}></div>
    </div>
  );

  const EmptyState = ({ message, icon = "📭" }) => (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#888', background: '#fff', borderRadius: '12px', border: '1px dashed #ddd' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>{icon}</div>
      <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{message}</p>
      <button onClick={() => {setSearchTerm(''); setStartDate(''); setEndDate(''); setSurveyDepartmentFilter('all');}} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#B24592', textDecoration: 'underline', cursor: 'pointer' }}>
        Clear Filters
      </button>
    </div>
  );

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
      <style>{responsiveStyles}</style>
      <button className="hamburger-menu" onClick={() => setShowMobileMenu(true)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      {showMobileMenu && (
        <>
          <div className="mobile-sidebar-overlay" onClick={() => setShowMobileMenu(false)}></div>
          <div className="mobile-sidebar-dropdown">
            <div className="sidebar-logo" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={() => {gotoAdminDashboard(); setShowMobileMenu(false);}} alt="Virtual Pay Logo" className="dashboard-logo dashboard-logo-img" style={{ cursor: 'pointer' }} />
            </div>
            <nav style={{ marginTop: '1rem' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                  <div 
                    role="button" 
                    tabIndex="0"
                    style={{
                      ...getNavItemStyle('polls', true),
                      backgroundColor: ['create-poll', 'view-polls'].includes(activeSection) ? '#fff0f7' : 'transparent',
                      color: ['create-poll', 'view-polls'].includes(activeSection) ? '#B24592' : '#555',
                      borderLeft: ['create-poll', 'view-polls'].includes(activeSection) ? '4px solid #B24592' : '4px solid transparent',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}
                    onClick={() => setPollsDropdownOpen(!pollsDropdownOpen)}
                  >
                    Polls
                    <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: pollsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                  {pollsDropdownOpen && (
                    <ul style={{ listStyle: 'none', padding: 0, background: '#f9f9f9' }}>
                      <li tabIndex="0" role="button" style={{...getNavItemStyle('create-poll', true), paddingLeft: '40px'}} onClick={() => { setActiveSection('create-poll'); setShowMobileMenu(false); }}>Create Poll</li>
                      <li tabIndex="0" role="button" style={{...getNavItemStyle('view-polls', true), paddingLeft: '40px'}} onClick={() => { setActiveSection('view-polls'); setShowMobileMenu(false); }}>All Polls</li>
                    </ul>
                  )}
                </li>
                <li>
                  <div 
                    role="button" 
                    tabIndex="0"
                    style={{
                      ...getNavItemStyle('surveys', true),
                      backgroundColor: ['create-survey', 'view-surveys'].includes(activeSection) ? '#fff0f7' : 'transparent',
                      color: ['create-survey', 'view-surveys'].includes(activeSection) ? '#B24592' : '#555',
                      borderLeft: ['create-survey', 'view-surveys'].includes(activeSection) ? '4px solid #B24592' : '4px solid transparent',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}
                    onClick={() => setSurveysDropdownOpen(!surveysDropdownOpen)}
                  >
                    Surveys
                    <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: surveysDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                  {surveysDropdownOpen && (
                    <ul style={{ listStyle: 'none', padding: 0, background: '#f9f9f9' }}>
                      <li tabIndex="0" role="button" style={{...getNavItemStyle('create-survey', true), paddingLeft: '40px'}} onClick={() => { setActiveSection('create-survey'); setShowMobileMenu(false); }}>Create Survey</li>
                      <li tabIndex="0" role="button" style={{...getNavItemStyle('view-surveys', true), paddingLeft: '40px'}} onClick={() => { setActiveSection('view-surveys'); setShowMobileMenu(false); }}>All Surveys</li>
                    </ul>
                  )}
                </li>
                <li tabIndex="0" role="button" style={getNavItemStyle('create-department', true)} onClick={() => { setActiveSection('create-department'); setShowMobileMenu(false); }}>Create Department</li>
                <li tabIndex="0" role="button" style={getNavItemStyle('create-group', true)} onClick={() => { setActiveSection('create-group'); setShowMobileMenu(false); }}>Create Group</li>
                <li tabIndex="0" role="button" style={getNavItemStyle('profile', true)} onClick={() => { setActiveSection('profile'); setShowMobileMenu(false); }}>Profile</li>
                <li tabIndex="0" role="button" style={getNavItemStyle('logout', true)} onClick={() => navigate('/')}>Log Out</li>
              </ul>
            </nav>
          </div>
        </>
      )}
      <aside className="sidebar-nav" style={{ boxShadow: '2px 0 16px rgba(0,0,0,0.08)', zIndex: 100, background: 'linear-gradient(135deg, #7D1F4B 0%, #B24592 100%)' }}>
        <div className="sidebar-logo" style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} onClick={gotoAdminDashboard} alt="Virtual Pay Logo" className="dashboard-logo dashboard-logo-img" style={{ cursor: 'pointer' }} />
        </div>
        <nav style={{ marginTop: '0.3rem' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li onMouseEnter={() => setPollsDropdownOpen(true)} onMouseLeave={() => setPollsDropdownOpen(false)}>
              <div 
                role="button" 
                tabIndex="0"
                style={{
                  ...getNavItemStyle('polls'),
                  backgroundColor: ['create-poll', 'view-polls'].includes(activeSection) ? '#fff0f7' : 'transparent',
                  color: ['create-poll', 'view-polls'].includes(activeSection) ? '#B24592' : '#fff',
                  borderLeft: ['create-poll', 'view-polls'].includes(activeSection) ? '4px solid #B24592' : '4px solid transparent',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}
                onClick={() => setPollsDropdownOpen(!pollsDropdownOpen)}
              >
                Polls
                <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: pollsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                display: pollsDropdownOpen ? 'block' : 'none',
                backgroundColor: 'rgba(0,0,0,0.1)' 
              }}>
                <li tabIndex="0" role="button" style={{...getNavItemStyle('create-poll'), paddingLeft: '40px', fontSize: '0.95rem'}} onClick={() => setActiveSection('create-poll')}>Create Poll</li>
                <li tabIndex="0" role="button" style={{...getNavItemStyle('view-polls'), paddingLeft: '40px', fontSize: '0.95rem'}} onClick={() => setActiveSection('view-polls')}>All Polls</li>
              </ul>
            </li>
            <li onMouseEnter={() => setSurveysDropdownOpen(true)} onMouseLeave={() => setSurveysDropdownOpen(false)}>
              <div 
                role="button" 
                tabIndex="0"
                style={{
                  ...getNavItemStyle('surveys'),
                  backgroundColor: ['create-survey', 'view-surveys'].includes(activeSection) ? '#fff0f7' : 'transparent',
                  color: ['create-survey', 'view-surveys'].includes(activeSection) ? '#B24592' : '#fff',
                  borderLeft: ['create-survey', 'view-surveys'].includes(activeSection) ? '4px solid #B24592' : '4px solid transparent',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}
                onClick={() => setSurveysDropdownOpen(!surveysDropdownOpen)}
              >
                Surveys
                <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: surveysDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                display: surveysDropdownOpen ? 'block' : 'none',
                backgroundColor: 'rgba(0,0,0,0.1)' 
              }}>
                <li tabIndex="0" role="button" style={{...getNavItemStyle('create-survey'), paddingLeft: '40px', fontSize: '0.95rem'}} onClick={() => setActiveSection('create-survey')}>Create Survey</li>
                <li tabIndex="0" role="button" style={{...getNavItemStyle('view-surveys'), paddingLeft: '40px', fontSize: '0.95rem'}} onClick={() => setActiveSection('view-surveys')}>All Surveys</li>
              </ul>
            </li>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-department')} onClick={() => setActiveSection('create-department')}>Create Department</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('create-group')} onClick={() => setActiveSection('create-group')}>Create Group</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('profile')} onClick={() => setActiveSection('profile')}>Profile</li>
            <li tabIndex="0" role="button" style={getNavItemStyle('logout')} onClick={() => navigate('/')}>Log Out</li>
          </ul>
        </nav>
      </aside>
      {toast.show && (
        <div className="toast-notification">
          <span>{toast.message}</span>
          {toast.action && (
            <button className="toast-undo-btn" onClick={toast.action}>UNDO</button>
          )}
        </div>
      )}
      <div className="admin-main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '180px' }}>
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
              <Formik
                initialValues={{
                  question: '',
                  options: ['', ''],
                }}
                validationSchema={Yup.object({
                  question: Yup.string().required('Poll question is required'),
                  options: Yup.array()
                    .of(Yup.string().required('Option cannot be empty'))
                    .min(2, 'At least two options are required'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    setSubmitting(false);
                    setActiveSection('poll-settings');
                  }, 800);
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Poll Question</span>
                      <Field type="text" name="question" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., What should our next team event be?" />
                      <ErrorMessage name="question" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#444', marginBottom: 8 }}>Options</div>
                      <FieldArray name="options">
                        {({ remove, push }) => (
                          <>
                            {values.options.map((opt, idx) => (
                              <div key={idx} style={{ background: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10, border: '1px solid #eee', display: 'flex', alignItems: 'center', cursor: 'grab' }}>
                                <span style={{ marginRight: 12, color: '#ccc', fontSize: '1.2rem', cursor: 'grab' }}>☰</span>
                                <Field
                                  type="text"
                                  name={`options[${idx}]`}
                                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                                  placeholder={`Option ${idx + 1}`}
                                />
                                <ErrorMessage name={`options[${idx}]`} component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                                {values.options.length > 2 && (
                                  <button type="button" onClick={() => remove(idx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 20, cursor: 'pointer' }} title="Remove Option">&times;</button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => push('')} style={{ background: 'transparent', border: '2px dashed #B24592', color: '#B24592', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, width: '100%' }}>+ Add Option</button>
                          </>
                        )}
                      </FieldArray>
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
                      disabled={isSubmitting}
                    >
                      Create Poll
                    </button>
                  </Form>
                )}
              </Formik>
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
              <Formik
                initialValues={{
                  recipientType: 'all',
                  selectedDepartment: '',
                  selectedGroup: '',
                  selectedStaff: [],
                  staffSearch: '',
                  anonymous: false
                }}
                validationSchema={Yup.object({
                  recipientType: Yup.string().required('Recipient type is required'),
                  selectedDepartment: Yup.string().when('recipientType', {
                    is: 'department',
                    then: Yup.string().required('Department is required'),
                  }),
                  selectedGroup: Yup.string().when('recipientType', {
                    is: 'group',
                    then: Yup.string().required('Group is required'),
                  }),
                  selectedStaff: Yup.array().when('recipientType', {
                    is: 'individual',
                    then: Yup.array().min(1, 'Select at least one staff member'),
                  })
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let recipients = [];
                  if (values.recipientType === 'all') {
                    recipients = staffList.map(s => s.email);
                  } else if (values.recipientType === 'department' && values.selectedDepartment) {
                    recipients = staffList.filter(s => s.department === values.selectedDepartment).map(s => s.email);
                  } else if (values.recipientType === 'group' && values.selectedGroup) {
                    const group = groupList.find(g => g.name === values.selectedGroup);
                    if (group) {
                      const memberNames = group.members && Array.isArray(group.members) ? group.members : (typeof group.members === 'string' ? group.members.split(',').map(m => m.trim()) : []);
                      recipients = staffList.filter(s => memberNames.includes(s.name)).map(s => s.email);
                    }
                  } else if (values.recipientType === 'individual' && values.selectedStaff.length > 0) {
                    recipients = values.selectedStaff;
                  }
                  alert('Poll will be sent to: ' + recipients.join(', '));
                  setSubmitting(false);
                }}
              >
                {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                  <Form style={{ ...cardStyle, boxShadow: '0 4px 24px rgba(178,69,146,0.18)' }}>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                      <Field type="checkbox" name="anonymous" style={{ marginRight: 8 }} />
                      Anonymous responses (hide respondent identity)
                    </label>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Send to:</span>
                      <Field as="select" name="recipientType" style={{ ...inputStyle, width: 200, display: 'inline-block' }}>
                        <option value="all">All Staff</option>
                        <option value="department">Department</option>
                        <option value="group">Group</option>
                        <option value="individual">Select Staff</option>
                      </Field>
                      <ErrorMessage name="recipientType" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    {values.recipientType === 'department' && (
                      <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Department:</span>
                        <Field as="select" name="selectedDepartment" style={{ ...inputStyle, width: 200, display: 'inline-block' }}>
                          <option value="">Select Department</option>
                          {departmentList.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="selectedDepartment" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                      </label>
                    )}
                    {values.recipientType === 'group' && (
                      <label style={{ display: 'block', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Group:</span>
                        <Field as="select" name="selectedGroup" style={{ ...inputStyle, width: 200, display: 'inline-block' }}>
                          <option value="">Select Group</option>
                          {groupList.map(g => (
                            <option key={g.id} value={g.name}>{g.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="selectedGroup" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                      </label>
                    )}
                    {values.recipientType === 'individual' && (
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
                            value={values.staffSearch || ''}
                            onChange={e => setFieldValue('staffSearch', e.target.value)}
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
                              !values.staffSearch || staff.name.toLowerCase().includes(values.staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(values.staffSearch.toLowerCase())
                            ).map(staff => (
                              <label key={staff.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '6px 8px',
                                borderRadius: 20,
                                background: values.selectedStaff.includes(staff.email) ? '#F7941E22' : 'transparent',
                                marginBottom: 4,
                                cursor: 'pointer',
                                fontWeight: 500
                              }}>
                                <input
                                  type="checkbox"
                                  checked={values.selectedStaff.includes(staff.email)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setFieldValue('selectedStaff', [...values.selectedStaff, staff.email]);
                                    } else {
                                      setFieldValue('selectedStaff', values.selectedStaff.filter(email => email !== staff.email));
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
                              !values.staffSearch || staff.name.toLowerCase().includes(values.staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(values.staffSearch.toLowerCase())
                            ).length === 0 && (
                              <div style={{ color: '#888', fontStyle: 'italic', padding: 8 }}>No staff found.</div>
                            )}
                          </div>
                          <ErrorMessage name="selectedStaff" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
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
                      disabled={isSubmitting}
                    >
                      Send Poll
                    </button>
                  </Form>
                )}
              </Formik>
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
              <Formik
                initialValues={{
                  title: '',
                  description: '',
                  deadline: '',
                  questions: [
                    { text: '', required: false, options: ['', ''] }
                  ]
                }}
                validationSchema={Yup.object({
                  title: Yup.string().required('Survey title is required'),
                  description: Yup.string().required('Description is required'),
                  deadline: Yup.string().required('Deadline is required'),
                  questions: Yup.array().of(
                    Yup.object({
                      text: Yup.string().required('Question text is required'),
                      required: Yup.boolean(),
                      options: Yup.array().of(Yup.string().required('Option cannot be empty')).min(1, 'At least one option is required')
                    })
                  ).min(1, 'At least one question is required')
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                  setActiveSection('survey-settings');
                }}
              >
                {({ values, isSubmitting }) => (
                  <Form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Survey Title</span>
                      <Field type="text" name="title" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Q1 Employee Satisfaction" />
                      <ErrorMessage name="title" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Description</span>
                      <Field as="textarea" name="description" style={{ ...inputStyle, height: '100px', resize: 'vertical', maxWidth: '95%', flex: 1 }} placeholder="Briefly describe the purpose of this survey..." />
                      <ErrorMessage name="description" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label style={{ display: 'block', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 600, color: '#444' }}>Deadline</span>
                      <Field type="date" name="deadline" style={{ ...inputStyle, maxWidth: '350px' }} />
                      <ErrorMessage name="deadline" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#444', marginBottom: 8 }}>Questions</div>
                      <FieldArray name="questions">
                        {({ remove, push }) => (
                          <>
                            {values.questions.map((q, qIdx) => (
                              <div key={qIdx} style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 16, border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                  <Field
                                    type="text"
                                    name={`questions[${qIdx}].text`}
                                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                                    placeholder={`Question ${qIdx + 1}`}
                                  />
                                  <label style={{ marginLeft: 12, display: 'flex', alignItems: 'center', fontSize: '0.98rem', color: '#7D1F4B', fontWeight: 600 }}>
                                    <Field
                                      type="checkbox"
                                      name={`questions[${qIdx}].required`}
                                      style={{ marginRight: 6 }}
                                    />
                                    Required
                                  </label>
                                  {values.questions.length > 1 && (
                                    <button type="button" onClick={() => remove(qIdx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 20, cursor: 'pointer' }} title="Remove Question">&times;</button>
                                  )}
                                </div>
                                <ErrorMessage name={`questions[${qIdx}].text`} component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                                <div style={{ marginLeft: 8, marginBottom: 8, fontWeight: 500, color: '#888' }}>Answer Options</div>
                                <FieldArray name={`questions[${qIdx}].options`}>
                                  {({ remove: removeOpt, push: pushOpt }) => (
                                    <>
                                      {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                                          <Field
                                            type="text"
                                            name={`questions[${qIdx}].options[${oIdx}]`}
                                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                                            placeholder={`Option ${oIdx + 1}`}
                                          />
                                          {q.options.length > 1 && (
                                            <button type="button" onClick={() => removeOpt(oIdx)} style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#B24592', fontWeight: 700, fontSize: 18, cursor: 'pointer' }} title="Remove Option">&times;</button>
                                          )}
                                          <ErrorMessage name={`questions[${qIdx}].options[${oIdx}]`} component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                                        </div>
                                      ))}
                                      <button type="button" onClick={() => pushOpt('')} style={{ background: 'transparent', border: '1px dashed #B24592', color: '#B24592', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginTop: 6 }}>+ Add Option</button>
                                    </>
                                  )}
                                </FieldArray>
                              </div>
                            ))}
                            <button type="button" onClick={() => push({ text: '', required: false, options: ['', ''] })} style={{ background: 'transparent', border: '2px dashed #B24592', color: '#B24592', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, width: '100%' }}>+ Add Question</button>
                          </>
                        )}
                      </FieldArray>
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
                      disabled={isSubmitting}
                    >
                      Create Survey
                    </button>
                  </Form>
                )}
              </Formik>
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
              <Formik
                initialValues={{
                  departmentName: '',
                  headOfDepartment: '',
                  members: []
                }}
                validationSchema={Yup.object({
                  departmentName: Yup.string().required('Department name is required'),
                  headOfDepartment: Yup.string().required('Head of Department is required'),
                  members: Yup.array().min(1, 'Select at least one member')
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                  // handle department creation logic here
                }}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form style={{ ...cardStyle, border: '1px solid #B24592', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Department Name</span>
                      <Field type="text" name="departmentName" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Research & Development" />
                      <ErrorMessage name="departmentName" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Head of Department</span>
                      <Field type="text" name="headOfDepartment" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Jane Doe" />
                      <ErrorMessage name="headOfDepartment" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Members</span>
                      {/* Custom multi-select using renderMultiSelect, but controlled by Formik */}
                      {renderMultiSelect(values.members, members => setFieldValue('members', members))}
                      <ErrorMessage name="members" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
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
                      disabled={isSubmitting}
                    >
                      Create Department
                    </button>
                  </Form>
                )}
              </Formik>
            </section>
          )}
          {activeSection === 'create-group' && (
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Create Group</h2>
              <Formik
                initialValues={{
                  groupName: '',
                  headOfGroup: '',
                  members: []
                }}
                validationSchema={Yup.object({
                  groupName: Yup.string().required('Group name is required'),
                  headOfGroup: Yup.string().required('Head of Group is required'),
                  members: Yup.array().min(1, 'Select at least one member')
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(false);
                  // handle group creation logic here
                }}
              >
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form style={{ ...cardStyle, border: '1px solid #F7941E', boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }}>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Group Name</span>
                      <Field type="text" name="groupName" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Project Phoenix" />
                      <ErrorMessage name="groupName" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Head of Group</span>
                      <Field type="text" name="headOfGroup" style={{ ...inputStyle, maxWidth: '95%', flex: 1 }} placeholder="e.g., Jane Doe" />
                      <ErrorMessage name="headOfGroup" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </label>
                    <label>
                      <span style={{ fontWeight: 600, color: '#444' }}>Members</span>
                      {/* Custom multi-select using renderMultiSelect, but controlled by Formik */}
                      {renderMultiSelect(values.members, members => setFieldValue('members', members))}
                      <ErrorMessage name="members" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
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
                      disabled={isSubmitting}
                    >
                      Create Group
                    </button>
                  </Form>
                )}
              </Formik>
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
                <DateRangePicker />
                <div style={{ position: 'relative', marginLeft: 'auto' }}>
                  <button onClick={() => setShowFilterSave(!showFilterSave)} style={{ background: 'none', border: '1px solid #B24592', color: '#B24592', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    💾 Save Filter
                  </button>
                  {showFilterSave && (
                    <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10, width: '200px', border: '1px solid #eee' }}>
                      <input 
                        type="text" 
                        placeholder="Filter Name" 
                        value={filterName} 
                        onChange={e => setFilterName(e.target.value)} 
                        style={{ ...inputStyle, marginBottom: '8px', padding: '6px' }} 
                      />
                      <button onClick={() => {
                        if(filterName) {
                          setSavedFilters([...savedFilters, { name: filterName, config: { searchTerm, startDate, endDate } }]);
                          setFilterName('');
                          setShowFilterSave(false);
                          setToast({ show: true, message: 'Filter preset saved!' });
                        }
                      }} style={{ width: '100%', background: '#B24592', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                    </div>
                  )}
                </div>
                {savedFilters.length > 0 && (
                  <select onChange={(e) => {
                    const filter = savedFilters.find(f => f.name === e.target.value);
                    if (filter) { setSearchTerm(filter.config.searchTerm); setStartDate(filter.config.startDate); setEndDate(filter.config.endDate); }
                  }} style={{ ...inputStyle, width: 'auto', marginBottom: 0, padding: '8px' }}>
                    <option value="">Load Preset...</option>
                    {savedFilters.map((f, i) => <option key={i} value={f.name}>{f.name}</option>)}
                  </select>
                )}
              </div>
              {renderActiveFilters()}
              <div style={{
                ...cardStyle,
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                {isLoading ? (
                  <SkeletonLoader />
                ) : activePollsList.filter(poll => {
                  const matchesSearch = checkSearchMatch(poll, searchTerm, 'poll');
                  let matchesDate = true;
                  if (startDate && endDate && poll.createdDate) {
                    matchesDate = (new Date(poll.createdDate) >= new Date(startDate)) && (new Date(poll.createdDate) <= new Date(endDate));
                  }
                  return matchesSearch && matchesDate;
                }).length === 0 ? (
                  <EmptyState message="No polls found matching your criteria." icon="📊" />
                ) : (
                  <>
                    {activePollsList.filter(poll => {
                      const matchesSearch = checkSearchMatch(poll, searchTerm, 'poll');
                      let matchesDate = true;
                      if (startDate && endDate && poll.createdDate) {
                        matchesDate = (new Date(poll.createdDate) >= new Date(startDate)) && (new Date(poll.createdDate) <= new Date(endDate));
                      }
                      return matchesSearch && matchesDate;
                    }).map(poll => (
                      <div key={"poll-" + poll.id} className="list-item-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', borderRadius: '10px', marginBottom: '1rem', borderLeft: '5px solid #B24592' }} onClick={() => { setSelectedAnalyticsItem(poll); setActiveSection('poll-details'); }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{poll.question}</div>
                          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>Created {poll.created} • {poll.votes} votes</div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); handleDelete(poll.id, activePollsList, setActivePollsList, 'Poll', 'question'); }} style={{ color: '#ff4b4b', background: 'none', border: '1px solid #ff4b4b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '1rem' }}>Delete</button>
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
                <DateRangePicker />
                <div style={{ position: 'relative', marginLeft: 'auto' }}>
                  <button onClick={() => setShowFilterSave(!showFilterSave)} style={{ background: 'none', border: '1px solid #B24592', color: '#B24592', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    💾 Save Filter
                  </button>
                  {showFilterSave && (
                    <div style={{ position: 'absolute', top: '110%', right: 0, background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', zIndex: 10, width: '200px', border: '1px solid #eee' }}>
                      <input 
                        type="text" 
                        placeholder="Filter Name" 
                        value={filterName} 
                        onChange={e => setFilterName(e.target.value)} 
                        style={{ ...inputStyle, marginBottom: '8px', padding: '6px' }} 
                      />
                      <button onClick={() => {
                        if(filterName) {
                          setSavedFilters([...savedFilters, { name: filterName, config: { searchTerm, startDate, endDate, surveyDepartmentFilter } }]);
                          setFilterName('');
                          setShowFilterSave(false);
                          setToast({ show: true, message: 'Filter preset saved!' });
                        }
                      }} style={{ width: '100%', background: '#B24592', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                    </div>
                  )}
                </div>
                {savedFilters.length > 0 && (
                  <select onChange={(e) => {
                    const filter = savedFilters.find(f => f.name === e.target.value);
                    if (filter) { setSearchTerm(filter.config.searchTerm); setStartDate(filter.config.startDate); setEndDate(filter.config.endDate); setSurveyDepartmentFilter(filter.config.surveyDepartmentFilter || 'all'); }
                  }} style={{ ...inputStyle, width: 'auto', marginBottom: 0, padding: '8px' }}>
                    <option value="">Load Preset...</option>
                    {savedFilters.map((f, i) => <option key={i} value={f.name}>{f.name}</option>)}
                  </select>
                )}
              </div>
              {renderActiveFilters()}
              <div style={{
                ...cardStyle,
                border: '1px solid #B24592',
                boxShadow: '0 4px 24px 0 rgba(247,148,30,0.18)'
              }}>
                {isLoading ? (
                  <SkeletonLoader />
                ) : surveyList.filter(survey => {
                  const matchesSearch = checkSearchMatch(survey, searchTerm, 'survey');
                  const matchesDept = surveyDepartmentFilter === 'all' || (survey.department && survey.department === surveyDepartmentFilter);
                  let matchesDate = true;
                  if (startDate && endDate && survey.createdDate) {
                    matchesDate = (new Date(survey.createdDate) >= new Date(startDate)) && (new Date(survey.createdDate) <= new Date(endDate));
                  }
                  return matchesSearch && matchesDept && matchesDate;
                }).length === 0 ? (
                  <EmptyState message="No surveys found." icon="📝" />
                ) : (
                  <>
                    {surveyList.filter(survey => {
                      const matchesSearch = checkSearchMatch(survey, searchTerm, 'survey');
                      const matchesDept = surveyDepartmentFilter === 'all' || (survey.department && survey.department === surveyDepartmentFilter);
                      let matchesDate = true;
                      if (startDate && endDate && survey.createdDate) {
                        matchesDate = (new Date(survey.createdDate) >= new Date(startDate)) && (new Date(survey.createdDate) <= new Date(endDate));
                      }
                      return matchesSearch && matchesDept && matchesDate;
                    }).map(survey => (
                      <div key={"survey-" + survey.id} className="list-item-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', borderLeft: '5px solid #F7941E', borderRadius: '10px', marginBottom: '1rem' }}
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
                        }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{survey.title}</div>
                          <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '4px' }}>Created {survey.created} • {survey.responses} responses • <span style={{ color: survey.status === 'Active' ? '#4BCB6B' : '#F7941E' }}>{survey.status}</span></div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); handleDelete(survey.id, surveyList, setSurveyList, 'Survey'); }} style={{ color: '#ff4b4b', background: 'none', border: '1px solid #ff4b4b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '1rem' }}>Delete</button>
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

              <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{fontWeight: 600, color: '#555'}}>View:</span>
                  <button onClick={() => setChartType('bar')} style={chartToggleBtnStyle(chartType === 'bar')}>Bar</button>
                  <button onClick={() => setChartType('pie')} style={chartToggleBtnStyle(chartType === 'pie')}>Pie</button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95rem', color: '#555', fontWeight: 500 }}>
                    <input type="checkbox" checked={showComparison} onChange={e => setShowComparison(e.target.checked)} style={{ marginRight: '6px', accentColor: '#B24592' }} />
                    Compare Previous Period
                  </label>
                </div>
                <button onClick={() => exportToCSV('survey_results.csv', [['Question', 'Option', 'Count'], ...displayedSurvey.questions.flatMap(q => q.options ? q.options.map(o => [q.text, o.label, o.count]) : [])])} style={{ ...chartToggleBtnStyle(false), marginLeft: 'auto' }}>Export CSV</button>
                <button onClick={() => exportToCSV('survey_results.xls', [['Question', 'Option', 'Count'], ...displayedSurvey.questions.flatMap(q => q.options ? q.options.map(o => [q.text, o.label, o.count]) : [])])} style={{ ...chartToggleBtnStyle(false) }}>Export Excel</button>
                <button onClick={() => window.print()} style={{ ...chartToggleBtnStyle(false), borderColor: '#7D1F4B', color: '#7D1F4B' }}>Export PDF</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {displayedSurvey.questions && displayedSurvey.questions.map((q, index) => (
                  <div key={index} style={cardStyle}>
                    <h4 style={{ marginBottom: '1rem', color: '#444' }}>{index + 1}. {q.text}</h4>
                    {q.type === 'text' ? (
                      <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                          <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>Recent text responses:</div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['Work-Life Balance', 'Facilities', 'Management'].map((tag, tIdx) => (
                              <span key={tIdx} style={{ fontSize: '0.75rem', background: '#e0e0e0', color: '#555', padding: '2px 8px', borderRadius: '12px' }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                          {q.textResponses && q.textResponses.map((resp, i) => (
                            <li key={i} style={{ marginBottom: '0.8rem', color: '#333' }}>
                              &quot;{resp}&quot;
                              <div style={{ marginTop: '4px' }}>
                                {resp.toLowerCase().includes('hours') && <span style={{ fontSize: '0.7rem', background: '#E3F2FD', color: '#1565C0', padding: '2px 6px', borderRadius: '4px', marginRight: '4px' }}>Schedule</span>}
                                {resp.toLowerCase().includes('coffee') && <span style={{ fontSize: '0.7rem', background: '#E8F5E9', color: '#2E7D32', padding: '2px 6px', borderRadius: '4px', marginRight: '4px' }}>Facilities</span>}
                                {resp.toLowerCase().includes('promotion') && <span style={{ fontSize: '0.7rem', background: '#FFF3E0', color: '#EF6C00', padding: '2px 6px', borderRadius: '4px', marginRight: '4px' }}>Career</span>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      chartType === 'bar' ? (
                        <BarChart 
                          data={q.options.map(opt => ({ label: opt.label, value: opt.count }))} 
                          color="#7D1F4B" 
                          onBarClick={(item) => setToast({ show: true, message: `Filtered by: ${item.label}` })}
                        />
                      ) : (
                        <PieChart
                          data={q.options.map(opt => ({ label: opt.label, value: opt.count }))}
                          colors={chartColors}
                          onSliceClick={(item) => setToast({ show: true, message: `Filtered by: ${item.label}` })}
                        />
                      )
                    )}
                    {showComparison && q.type !== 'text' && (
                      <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-around' }}>
                        <span><strong>vs. Last Period:</strong></span>
                        <span>Participation: {getTrendIcon(5)}</span>
                        <span>Satisfaction: {getTrendIcon(-2)}</span>
                        <span>Completion Rate: {getTrendIcon(12)}</span>
                      </div>
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
                          <button onClick={() => handleDelete(dept.id, departmentList, setDepartmentList, 'Department', 'name')} style={{ color: '#ff4b4b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
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
                          <button onClick={() => handleDelete(group.id, groupList, setGroupList, 'Group', 'name')} style={{ color: '#ff4b4b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
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

          {activeSection === 'profile' && (
            <section style={{ animation: 'fadeIn 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Admin Profile</h2>
              <form style={{ ...cardStyle, textAlign: 'center' }} onSubmit={handleProfileSubmit}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '2rem' }}>
                  <img
                    src={adminProfile.photo}
                    alt="Profile"
                    style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #B24592', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                  />
                  <label htmlFor="pfp-upload" style={{
                    position: 'absolute', bottom: '10px', right: '10px', background: '#B24592', color: 'white',
                    borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ fontSize: '1.5rem', marginTop: '-2px', fontWeight: 'bold' }}>+</span>
                  </label>
                  <input id="pfp-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </div>

                <div style={{ textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem', display: 'block' }}>Full Name</span>
                    <input type="text" name="name" value={adminProfile.name} onChange={handleProfileChange} style={inputStyle} />
                  </label>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem', display: 'block' }}>Email Address</span>
                    <input type="email" name="email" value={adminProfile.email} readOnly disabled style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} />
                  </label>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem', display: 'block' }}>Role</span>
                    <input type="text" name="role" value={adminProfile.role} readOnly disabled style={{ ...inputStyle, background: '#f5f5f5', color: '#888' }} />
                  </label>
                  <label style={{ display: 'block' }}>
                    <span style={{ fontWeight: 600, color: '#444', marginBottom: '0.5rem', display: 'block' }}>Phone Number</span>
                    <input type="tel" name="phone" value={adminProfile.phone} onChange={handleProfileChange} placeholder="+1 234 567 890" style={inputStyle} />
                  </label>
                </div>

                <button type="submit" style={{
                  background: 'linear-gradient(90deg, #F7941E 0%, #B24592 100%)',
                  color: 'white',
                  padding: '14px 40px',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginTop: '2rem',
                  boxShadow: '0 4px 15px rgba(178, 69, 146, 0.3)',
                  transition: 'transform 0.2s'
                }}>
                  Save Changes
                </button>
              </form>
            </section>
          )}
          {renderPollDetailsSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
