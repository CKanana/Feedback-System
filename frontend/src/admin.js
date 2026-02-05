
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AdminSidebar from './AdminSidebar';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
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
  // Survey creation state
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyQuestions, setSurveyQuestions] = useState([{ text: '', options: ['', ''], required: false }]);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [pollsDropdownOpen, setPollsDropdownOpen] = useState(false);
    // const [surveysDropdownOpen, setSurveysDropdownOpen] = useState(false); // unused
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    const [selectedStaff, setSelectedStaff] = useState([]);
    // const [deptMembers, setDeptMembers] = useState([]); // unused
    // const [groupMembers, setGroupMembers] = useState([]); // unused
    // ...all other useState declarations...

    // ...existing code...

    // Fetch staff users from backend
    const [staffList, setStaffList] = useState([]);
    useEffect(() => {
      const fetchStaff = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/all-users');
          // Only include users with role 'staff'
          setStaffList(res.data.users.filter(u => u.role === 'staff'));
        } catch (err) {
          setStaffList([]);
        }
      };
      fetchStaff();
    }, []);

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
            {/* Back Button */}
            <button
              onClick={() => setActiveSection('view-polls')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: '#B24592',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '1.5rem',
                padding: '0.5rem 0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#F7941E';
                e.target.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#B24592';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              Back to All Polls
            </button>

            <h2 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Poll Statistics: {selectedAnalyticsItem.question}</h2>
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
  // const [showAnalytics, setShowAnalytics] = useState(false); // unused
  // const [analyticsType, setAnalyticsType] = useState(null); // unused
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
    // const itemToDelete = list.find(item => item.id === id); // unused
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
  // const [surveyQuestions, setSurveyQuestions] = useState([{ text: '', options: ['', ''], required: false }]); // duplicate, defined at top

  // const handleSurveyQuestionChange = (qIdx, value) => {}; // unused
  // const addSurveyQuestion = () => {}; // unused
  // const removeSurveyQuestion = (qIdx) => {}; // unused
  // const handleSurveyOptionChange = (qIdx, oIdx, value) => {}; // unused
  // const handleSurveyRequiredChange = (qIdx, value) => {}; // unused
  // const addSurveyOption = (qIdx) => {}; // unused
  // const removeSurveyOption = (qIdx, oIdx) => {}; // unused
  // const [pollOptions, setPollOptions] = useState(['', '']); // unused

  // const handlePollOptionChange = (index, value) => {}; // unused
  // const addPollOption = () => {}; // unused
  // const removePollOption = (index) => {}; // unused
  // Removed duplicate staffList declaration
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

  const [surveyList, setSurveyList] = useState([]);

  // Fetch all surveys created by the admin from backend
  useEffect(() => {
    const fetchAdminSurveys = async () => {
      try {
        const res = await axios.get('/api/surveys/all');
        // Transform backend survey data to match frontend analytics structure if needed
        const surveys = (res.data || []).map(survey => {
          // Calculate number of responses
          const responsesCount = Array.isArray(survey.responses) ? survey.responses.length : 0;
          // Map questions and aggregate answers
          const questions = (survey.questions || []).map(q => {
            if (q.type === 'text') {
              // Collect all text answers for this question
              const textResponses = (survey.responses || []).map(r => {
                const ans = (r.answers || []).find(a => a.questionId === String(q._id));
                return ans ? ans.answer : null;
              }).filter(Boolean);
              return { ...q, textResponses };
            } else if (q.type === 'multiple-choice' || q.type === 'choice' || q.type === 'rating') {
              // Count answers for each option
              const optionCounts = (q.options || []).map(opt => {
                const count = (survey.responses || []).filter(r => {
                  const ans = (r.answers || []).find(a => a.questionId === String(q._id));
                  if (Array.isArray(ans?.answer)) {
                    return ans.answer.includes(opt);
                  }
                  return ans && ans.answer === opt;
                }).length;
                return { label: opt, count };
              });
              return { ...q, options: optionCounts };
            }
            return q;
          });
          return {
            id: survey._id,
            title: survey.title,
            responses: responsesCount,
            status: survey.status || 'Active',
            created: new Date(survey.createdAt).toLocaleDateString(),
            summary: survey.description,
            questions,
            dailyResponses: [], // Optionally, aggregate daily responses if needed
            raw: survey
          };
        });
        setSurveyList(surveys);
      } catch (err) {
        setSurveyList([]);
      }
    };
    fetchAdminSurveys();
  }, []);

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

  // const gotoAdminDashboard = () => { setActiveSection('overview'); }; // unused

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

  // const getNavItemStyle = (section, isMobile = false) => ({ ... }); // unused

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

  // const dragItem = useRef(); // unused
  // const dragOverItem = useRef(); // unused

  // const handleDragStart = (e, position) => {}; // unused
  // const handleDragEnter = (e, position) => {}; // unused
  // const handleDragEnd = (e) => {}; // unused

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


  // Fetch polls from backend on mount
  useEffect(() => {
    axios.get('/api/surveys/my-polls')
      .then(res => {
        setActivePollsList(res.data.polls || []);
      })
      .catch(err => {
        console.error('Failed to fetch polls:', err);
      });
  }, []);

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

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const gotoProfile = () => {
    setActiveSection('profile');
  };

  return (
    <div className="admin-dashboard" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <style>{responsiveStyles}</style>
      
      {/* Modern Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activePollCount={activePollsList.length}
        activeSurveyCount={surveyList.filter(s => s.status === 'Active').length}
        gotoProfile={gotoProfile}
        navigate={navigate}
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        showMobileMenu={showMobileMenu}
      />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="mobile-overlay" 
          onClick={() => setShowMobileMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Main Content Area */}
      <div 
        className="main-layout"
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? '64px' : '256px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {/* Modern Header */}
        <Header 
          staffName="Admin User"
          profilePhoto={adminProfile.photo}
          onMobileMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
          showMobileMenuButton={true}
        />

        {/* Main Content */}
        <main 
          className="main-content" 
          style={{ 
            flex: 1, 
            padding: '2rem',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          {/* Modern Dashboard Overview */}
          {activeSection === 'overview' && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 700, 
                  marginBottom: '0.5rem',
                  color: '#1e293b'
                }}>
                  Dashboard Overview
                </h1>
                <p style={{ 
                  color: '#64748b', 
                  fontSize: '1rem',
                  margin: 0 
                }}>
                  Overview of system performance and activity
                </p>
              </div>
              
              {/* Enhanced KPI Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                marginBottom: '3rem'
              }}
              className="kpi-cards-grid"
              >
                {stats.map((stat, index) => (
                  <Card 
                    key={index} 
                    onClick={stat.onClick}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      background: '#ffffff',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <CardContent style={{ padding: '1.5rem', position: 'relative' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            marginBottom: '0.5rem',
                            margin: 0,
                            fontWeight: 500
                          }}>
                            {stat.label}
                          </p>
                          <p style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: 0,
                            lineHeight: 1,
                            marginTop: '0.25rem'
                          }}>
                            {stat.value}
                          </p>
                        </div>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '12px',
                          background: `${stat.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {/* Icon based on stat type */}
                          <svg 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke={stat.color} 
                            strokeWidth="2"
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            {stat.label === 'Total Staff' && (
                              <>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                              </>
                            )}
                            {stat.label === 'Active Polls' && (
                              <>
                                <line x1="18" y1="20" x2="18" y2="10"/>
                                <line x1="12" y1="20" x2="12" y2="4"/>
                                <line x1="6" y1="20" x2="6" y2="14"/>
                              </>
                            )}
                            {stat.label === 'Departments' && (
                              <>
                                <path d="M3 21h18"/>
                                <path d="M5 21V7l8-4v18"/>
                                <path d="M19 21V11l-6-4"/>
                              </>
                            )}
                            {stat.label === 'Groups' && (
                              <>
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </>
                            )}
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity Table - Survey Template Style */}
              <Card>
                <CardHeader>
                  <CardTitle style={{
                    fontSize: '1.5rem',
                    color: '#0f172a',
                    margin: 0
                  }}>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {[
                    {
                      type: 'poll',
                      title: 'New poll created: "Team Building Activity"',
                      time: '2 minutes ago',
                      user: 'Admin',
                      color: '#F7941E',
                      icon: '📊'
                    },
                    {
                      type: 'survey',
                      title: 'Survey "Q1 Employee Satisfaction" completed',
                      time: '1 hour ago',
                      user: 'Crystal',
                      color: '#B24592',
                      icon: '📋'
                    },
                    {
                      type: 'staff',
                      title: 'New staff member added to HR department',
                      time: '3 hours ago',
                      user: 'Admin',
                      color: '#4BCB6B',
                      icon: '👥'
                    },
                    {
                      type: 'department',
                      title: 'Engineering department updated',
                      time: '1 day ago',
                      user: 'Alex Johnson',
                      color: '#7D1F4B',
                      icon: '🏢'
                    }
                  ].length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%' }}>
                        <thead>
                          <tr style={{ 
                            borderBottom: '1px solid #e2e8f0'
                          }}>
                            <th style={{
                              textAlign: 'left',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#0f172a'
                            }}>
                              Activity Name
                            </th>
                            <th style={{
                              textAlign: 'left',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#0f172a'
                            }}>
                              Staff Member
                            </th>
                            <th style={{
                              textAlign: 'left',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#0f172a'
                            }}>
                              Status
                            </th>
                            <th style={{
                              textAlign: 'left',
                              padding: '0.75rem 1rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#0f172a'
                            }}>
                              Timestamp
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              activityName: 'Team Building Activity Poll',
                              staffName: 'Admin',
                              status: 'Created',
                              timestamp: '2 minutes ago',
                              color: '#F7941E'
                            },
                            {
                              activityName: 'Q1 Employee Satisfaction',
                              staffName: 'Crystal',
                              status: 'Completed',
                              timestamp: '1 hour ago',
                              color: '#B24592'
                            },
                            {
                              activityName: 'HR Department Update',
                              staffName: 'Admin',
                              status: 'Added',
                              timestamp: '3 hours ago',
                              color: '#4BCB6B'
                            },
                            {
                              activityName: 'Engineering Department',
                              staffName: 'Alex Johnson',
                              status: 'Updated',
                              timestamp: '1 day ago',
                              color: '#7D1F4B'
                            }
                          ].map((activity, index) => (
                            <tr 
                              key={index}
                              style={{
                                borderBottom: '1px solid #e2e8f0',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <td style={{ padding: '1rem' }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <div style={{
                                    width: '1rem',
                                    height: '1rem',
                                    color: '#64748b'
                                  }}>
                                    📋
                                  </div>
                                  <span style={{
                                    fontWeight: 500,
                                    color: '#0f172a'
                                  }}>
                                    {activity.activityName}
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem'
                                }}>
                                  <div style={{
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #F7941E, #B24592)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <div style={{
                                      width: '1rem',
                                      height: '1rem',
                                      color: 'white'
                                    }}>
                                      👥
                                    </div>
                                  </div>
                                  <span style={{ color: '#0f172a' }}>
                                    {activity.staffName}
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '1rem' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  background: activity.status === 'Completed' ? '#dcfce7' : 
                                            activity.status === 'Created' ? '#fef3c7' : 
                                            activity.status === 'Added' ? '#dbeafe' : '#f3e8ff',
                                  color: activity.status === 'Completed' ? '#166534' : 
                                        activity.status === 'Created' ? '#92400e' : 
                                        activity.status === 'Added' ? '#1e40af' : '#7c3aed'
                                }}>
                                  {activity.status === 'Completed' && '✓'}
                                  {activity.status === 'Created' && '⏱️'}
                                  {activity.status === 'Added' && '➕'}
                                  {activity.status === 'Updated' && '✏️'}
                                  {activity.status}
                                </span>
                              </td>
                              <td style={{ 
                                padding: '1rem',
                                color: '#64748b'
                              }}>
                                {activity.timestamp}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem'
                    }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        color: '#64748b',
                        margin: '0 auto 1rem'
                      }}>
                        📋
                      </div>
                      <p style={{
                        color: '#64748b',
                        margin: 0
                      }}>
                        No recent activity
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
            <section style={{ animation: 'fadeIn 0.5s ease' }}>
              {/* Back Button */}
              <button
                onClick={() => setActiveSection('create-poll')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#B24592',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                  padding: '0.5rem 0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#F7941E';
                  e.target.style.transform = 'translateX(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#B24592';
                  e.target.style.transform = 'translateX(0)';
                }}
                aria-label="Back to Edit Poll"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M19 12H5"/>
                  <path d="M12 19l-7-7 7-7"/>
                </svg>
                Back to Edit Poll
              </button>

              <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Poll Settings</h2>
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
                  selectedDepartment: Yup.string().when('recipientType', (value, schema) => {
                    if (value === 'department') {
                      return schema.required('Department is required');
                    }
                    return schema;
                  }),
                  selectedGroup: Yup.string().when('recipientType', (value, schema) => {
                    if (value === 'group') {
                      return schema.required('Group is required');
                    }
                    return schema;
                  }),
                  selectedStaff: Yup.array().when('recipientType', (value, schema) => {
                    if (value === 'individual') {
                      return schema.min(1, 'Select at least one staff member');
                    }
                    return schema;
                  })
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  let recipientUserIds = [];
                  if (values.recipientType === 'all') {
                    recipientUserIds = staffList.map(s => s._id);
                  } else if (values.recipientType === 'department' && values.selectedDepartment) {
                    recipientUserIds = staffList.filter(s => s.department === values.selectedDepartment).map(s => s._id);
                  } else if (values.recipientType === 'group' && values.selectedGroup) {
                    const group = groupList.find(g => g.name === values.selectedGroup);
                    if (group) {
                      const memberNames = group.members && Array.isArray(group.members) ? group.members : (typeof group.members === 'string' ? group.members.split(',').map(m => m.trim()) : []);
                      recipientUserIds = staffList.filter(s => memberNames.includes(s.name)).map(s => s._id);
                    }
                  } else if (values.recipientType === 'individual' && values.selectedStaff.length > 0) {
                    recipientUserIds = staffList.filter(s => values.selectedStaff.includes(s.email)).map(s => s._id);
                  }
                  // Send poll to backend (correct endpoint and payload)
                  axios.post('/api/polls/', {
                    question: values.question,
                    options: values.options,
                    anonymous: values.anonymous,
                    recipients: { users: recipientUserIds },
                  })
                  .then(res => {
                    alert('Poll sent successfully!');
                    resetForm();
                    // Refresh poll list
                    axios.get('/api/polls/all')
                      .then(res => {
                        setActivePollsList(res.data || []);
                      });
                    // Navigate to overview/dashboard
                    if (typeof window !== 'undefined') {
                      setTimeout(() => { window.location.hash = '#/admin/overview'; }, 500);
                    }
                  })
                  .catch(err => {
                    alert('Failed to send poll: ' + (err.response?.data?.message || err.message));
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
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
                          <div style={{ maxHeight: 180, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                            {staffList.filter(staff =>
                              !values.staffSearch || staff.name.toLowerCase().includes(values.staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(values.staffSearch.toLowerCase())
                            ).map(staff => (
                              <label key={staff._id || staff.id} style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: '6px',
                                background: values.selectedStaff.includes(staff.email) ? '#fff0f7' : '#f8f9fa',
                                border: values.selectedStaff.includes(staff.email) ? '1px solid #B24592' : '1px solid transparent',
                                cursor: 'pointer', transition: 'all 0.2s'
                              }}>
                                <input type="checkbox" checked={values.selectedStaff.includes(staff.email)} onChange={e => { if (e.target.checked) { setFieldValue('selectedStaff', [...values.selectedStaff, staff.email]); } else { setFieldValue('selectedStaff', values.selectedStaff.filter(email => email !== staff.email)); } }} style={{ accentColor: '#B24592', width: 16, height: 16, cursor: 'pointer' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#333', fontSize: '0.95rem', fontWeight: 500 }}>{staff.name}</span>
                                    <span style={{ color: '#888', fontSize: '0.8rem' }}>{staff.email}</span>
                                </div>
                              </label>
                            ))}
                            {staffList.filter(staff => !values.staffSearch || staff.name.toLowerCase().includes(values.staffSearch.toLowerCase()) || staff.email.toLowerCase().includes(values.staffSearch.toLowerCase())).length === 0 && <div style={{ color: '#888', fontStyle: 'italic', padding: 8, gridColumn: '1/-1' }}>No staff found.</div>}
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
                  setSurveyTitle(values.title);
                  setSurveyDescription(values.description);
                  setSurveyQuestions(values.questions);
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
                <section style={{ animation: 'fadeIn 0.5s ease' }}>
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection('create-survey')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: '#B24592',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginBottom: '1.5rem',
                      padding: '0.5rem 0',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#F7941E';
                      e.target.style.transform = 'translateX(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#B24592';
                      e.target.style.transform = 'translateX(0)';
                    }}
                    aria-label="Back to Edit Survey"
                  >
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M19 12H5"/>
                      <path d="M12 19l-7-7 7-7"/>
                    </svg>
                    Back to Edit Survey
                  </button>

                  <h2 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Survey Settings</h2>
                  <form style={{ ...cardStyle, boxShadow: '0 4px 24px rgba(247,148,30,0.18)' }} onSubmit={async e => {
                    e.preventDefault();
                    // Build recipients object for backend (user IDs)
                    let recipientUserIds = [];
                    if (recipientType === 'all') {
                      recipientUserIds = staffList.map(s => s._id);
                    } else if (recipientType === 'department' && selectedDepartment) {
                      recipientUserIds = staffList.filter(s => s.department === selectedDepartment).map(s => s._id);
                    } else if (recipientType === 'group' && selectedGroup) {
                      const group = groupList.find(g => g.name === selectedGroup);
                      if (group) {
                        const memberNames = group.members && Array.isArray(group.members) ? group.members : (typeof group.members === 'string' ? group.members.split(',').map(m => m.trim()) : []);
                        recipientUserIds = staffList.filter(s => memberNames.includes(s.name)).map(s => s._id);
                      }
                    } else if (recipientType === 'individual' && selectedStaff.length > 0) {
                      recipientUserIds = staffList.filter(s => selectedStaff.includes(s.email)).map(s => s._id);
                    }
                    // Collect survey data from previous step (store in state or pass as props)
                    const surveyData = {
                      title: surveyTitle || '',
                      description: surveyDescription || '',
                      questions: surveyQuestions || [],
                      recipients: { users: recipientUserIds },
                    };
                    try {
                      await axios.post('/api/surveys/', surveyData);
                      // Fetch updated surveys so the new one appears immediately
                      const res = await axios.get('/api/surveys/all');
                      const surveys = (res.data || []).map(survey => {
                        const responsesCount = Array.isArray(survey.responses) ? survey.responses.length : 0;
                        const questions = (survey.questions || []).map(q => {
                          if (q.type === 'text') {
                            const textResponses = (survey.responses || []).map(r => {
                              const ans = (r.answers || []).find(a => a.questionId === String(q._id));
                              return ans ? ans.answer : null;
                            }).filter(Boolean);
                            return { ...q, textResponses };
                          } else if (q.type === 'multiple-choice' || q.type === 'choice' || q.type === 'rating') {
                            const optionCounts = (q.options || []).map(opt => {
                              const count = (survey.responses || []).filter(r => {
                                const ans = (r.answers || []).find(a => a.questionId === String(q._id));
                                if (Array.isArray(ans?.answer)) {
                                  return ans.answer.includes(opt);
                                }
                                return ans && ans.answer === opt;
                              }).length;
                              return { label: opt, count };
                            });
                            return { ...q, options: optionCounts };
                          }
                          return q;
                        });
                        return {
                          id: survey._id,
                          title: survey.title,
                          responses: responsesCount,
                          status: survey.status || 'Active',
                          created: new Date(survey.createdAt).toLocaleDateString(),
                          summary: survey.description,
                          questions,
                          dailyResponses: [],
                          raw: survey
                        };
                      });
                      setSurveyList(surveys);
                      alert('Survey sent and saved successfully!');
                      setActiveSection('view-surveys');
                    } catch (err) {
                      alert('Failed to send survey: ' + (err.response?.data?.msg || err.message));
                    }
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
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Department:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {departmentList.map(d => (
                            <label key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: selectedDepartment === d.name ? '#fff0f7' : '#f8f9fa', border: selectedDepartment === d.name ? '1px solid #B24592' : '1px solid transparent', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                              <input type="radio" name="department" checked={selectedDepartment === d.name} onChange={() => setSelectedDepartment(d.name)} style={{ accentColor: '#B24592', width: 16, height: 16 }} />
                              {d.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {recipientType === 'group' && (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Group:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {groupList.map(g => (
                            <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: selectedGroup === g.name ? '#fff0f7' : '#f8f9fa', border: selectedGroup === g.name ? '1px solid #B24592' : '1px solid transparent', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                              <input type="radio" name="group" checked={selectedGroup === g.name} onChange={() => setSelectedGroup(g.name)} style={{ accentColor: '#B24592', width: 16, height: 16 }} />
                              {g.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {recipientType === 'individual' && (
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, color: '#444', marginRight: 12 }}>Choose Staff:</span>
                        <div style={{ maxHeight: 180, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', marginTop: 8 }}>
                          {staffList.map(staff => (
                            <label key={staff.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: '6px', background: selectedStaff.includes(staff.email) ? '#fff0f7' : '#f8f9fa', border: selectedStaff.includes(staff.email) ? '1px solid #B24592' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                              <input type="checkbox" checked={selectedStaff.includes(staff.email)} onChange={e => { if (e.target.checked) { setSelectedStaff([...selectedStaff, staff.email]); } else { setSelectedStaff(selectedStaff.filter(email => email !== staff.email)); } }} style={{ accentColor: '#B24592', width: 16, height: 16, cursor: 'pointer' }} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ color: '#333', fontSize: '0.95rem', fontWeight: 500 }}>{staff.name}</span>
                                <span style={{ color: '#888', fontSize: '0.8rem' }}>{staff.email}</span>
                              </div>
                            </label>
                          ))}
                          {staffList.length === 0 && <div style={{ color: '#888', fontStyle: 'italic', padding: 8, gridColumn: '1/-1' }}>No staff found.</div>}
                        </div>
                      </div>
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
                      <div key={poll._id || poll.id} className="list-item-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer', borderRadius: '10px', marginBottom: '1rem', borderLeft: '5px solid #B24592' }} onClick={() => { setSelectedAnalyticsItem(poll); setActiveSection('poll-details'); }}>
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
              {/* Back Button */}
              <button
                onClick={() => setActiveSection('view-surveys')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#B24592',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '1.5rem',
                  padding: '0.5rem 0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#F7941E';
                  e.target.style.transform = 'translateX(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#B24592';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M19 12H5"/>
                  <path d="M12 19l-7-7 7-7"/>
                </svg>
                Back to All Surveys
              </button>

              <h2 style={{ 
                color: '#2c3e50', 
                marginBottom: '1.5rem',
                fontSize: '1.8rem',
                fontWeight: 700
              }}>
                Survey Statistics: {displayedSurvey.title}
              </h2>

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
            <section className="fade-in profile-section" aria-label="Admin Profile Section">
              <div className="profile-desktop-layout">
                {/* Admin Profile Info Card */}
                <Card className="profile-info-card">
                  <CardContent>
                    <div className="profile-info-content">
                      <div className="profile-avatar-section">
                        <div className="profile-avatar-container">
                          <img 
                            src={adminProfile.photo || process.env.PUBLIC_URL + '/vp-pic.png'} 
                            alt="Admin Profile" 
                            className="profile-avatar" 
                          />
                          <button
                            type="button"
                            className="profile-avatar-edit-btn"
                            onClick={() => document.getElementById('admin-photo-upload').click()}
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
                            id="admin-photo-upload"
                            onChange={handlePhotoChange}
                          />
                        </div>
                        <div className="profile-user-info">
                          <h3 className="profile-user-name">{adminProfile.name || 'Admin User'}</h3>
                          <p className="profile-user-email">{adminProfile.email || 'admin@virtual.com'}</p>
                          <p className="profile-user-department">{adminProfile.role || 'Administrator'}</p>
                        </div>
                      </div>
                      
                      <div className="profile-stats">
                        <div className="profile-stat-item">
                          <div className="profile-stat-number">{activePollsList.length}</div>
                          <div className="profile-stat-label">Active Polls</div>
                        </div>
                        <div className="profile-stat-item">
                          <div className="profile-stat-number">{surveyList.length}</div>
                          <div className="profile-stat-label">Total Surveys</div>
                        </div>
                        <div className="profile-stat-item">
                          <div className="profile-stat-number">{staffList.length}</div>
                          <div className="profile-stat-label">Staff Members</div>
                        </div>
                      </div>
                      
                      <div className="profile-member-info">
                        <div className="profile-member-item">
                          <span className="profile-member-label">Admin Since</span>
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

                {/* Admin Profile Edit Form */}
                <Card className="profile-edit-form">
                  <CardHeader>
                    <CardTitle>Admin Profile Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit}>
                      <div className="profile-form-grid">
                        <div className="profile-form-section">
                          <h4 className="profile-section-title">Personal Information</h4>
                          
                          <div className="profile-form-row">
                            <div className="profile-form-group">
                              <label className="profile-form-label">Full Name</label>
                              <div className="profile-input-container">
                                <input 
                                  type="text" 
                                  name="name"
                                  value={adminProfile.name || ''} 
                                  onChange={handleProfileChange}
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
                                  value={(adminProfile.name || 'admin').toLowerCase().replace(/\s+/g, '')} 
                                  className="profile-form-input"
                                  placeholder="Username"
                                  disabled
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
                                  name="email"
                                  value={adminProfile.email || ''} 
                                  onChange={handleProfileChange}
                                  className="profile-form-input"
                                  placeholder="admin@company.com"
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
                              <label className="profile-form-label">Role</label>
                              <div className="profile-input-container">
                                <input 
                                  type="text" 
                                  name="role"
                                  value={adminProfile.role || ''} 
                                  className="profile-form-input"
                                  placeholder="Administrator"
                                  disabled
                                />
                                <div className="profile-input-icon">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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
                          <button type="button" className="profile-cancel-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            Cancel
                          </button>
                          <button type="submit" className="profile-save-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                              <polyline points="17,21 17,13 7,13 7,21"/>
                              <polyline points="7,3 7,8 15,8"/>
                            </svg>
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}
          {renderPollDetailsSection()}
          
          {/* Toast Notification */}
          {toast.show && (
            <div className="toast-notification">
              <span>{toast.message}</span>
              {toast.action && (
                <button className="toast-undo-btn" onClick={toast.action}>UNDO</button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
