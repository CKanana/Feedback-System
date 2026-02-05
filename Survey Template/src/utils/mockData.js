
const MOCK_DATA_KEY = 'virtualPayMockData';
const INITIALIZED_KEY = 'virtualPayDataInitialized';

const initialMockData = {
  surveys: [
    {
      id: 1,
      name: 'Customer Satisfaction Survey Q1 2026',
      description: 'Quarterly customer satisfaction assessment',
      status: 'In Progress',
      progress: 65,
      assignedTo: 'Staff Member',
      createdAt: '2026-01-15',
      dueDate: '2026-02-28'
    },
    {
      id: 2,
      name: 'Employee Engagement Survey',
      description: 'Annual employee engagement and satisfaction survey',
      status: 'Not Started',
      progress: 0,
      assignedTo: 'Staff Member',
      createdAt: '2026-01-20',
      dueDate: '2026-03-15'
    },
    {
      id: 3,
      name: 'Product Feedback Survey',
      description: 'Gather feedback on new product features',
      status: 'Submitted',
      progress: 100,
      assignedTo: 'Staff Member',
      createdAt: '2026-01-05',
      dueDate: '2026-01-31'
    },
    {
      id: 4,
      name: 'Market Research Survey',
      description: 'Understanding market trends and customer preferences',
      status: 'In Progress',
      progress: 40,
      assignedTo: 'Staff Member',
      createdAt: '2026-01-25',
      dueDate: '2026-03-01'
    }
  ],
  recentActivity: [
    {
      id: 1,
      surveyName: 'Customer Satisfaction Survey Q1 2026',
      staffName: 'John Smith',
      status: 'In Progress',
      timestamp: '2026-02-04 10:30 AM'
    },
    {
      id: 2,
      surveyName: 'Product Feedback Survey',
      staffName: 'Sarah Johnson',
      status: 'Submitted',
      timestamp: '2026-02-04 09:15 AM'
    },
    {
      id: 3,
      surveyName: 'Market Research Survey',
      staffName: 'Michael Brown',
      status: 'In Progress',
      timestamp: '2026-02-03 04:45 PM'
    },
    {
      id: 4,
      surveyName: 'Employee Engagement Survey',
      staffName: 'Emily Davis',
      status: 'Not Started',
      timestamp: '2026-02-03 02:20 PM'
    },
    {
      id: 5,
      surveyName: 'Customer Satisfaction Survey Q1 2026',
      staffName: 'David Wilson',
      status: 'Submitted',
      timestamp: '2026-02-03 11:00 AM'
    }
  ],
  stats: {
    totalSurveys: 12,
    responsesToday: 8,
    completionRate: 78,
    activeStaff: 15
  },
  staffStats: {
    totalAssigned: 4,
    completed: 1,
    inProgress: 2,
    completionRate: 25
  }
};

export const initializeMockData = () => {
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  
  if (!isInitialized) {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(initialMockData));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  }
};

export const getMockData = () => {
  initializeMockData();
  
  const data = localStorage.getItem(MOCK_DATA_KEY);
  return data ? JSON.parse(data) : initialMockData;
};

export const updateMockData = (newData) => {
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(newData));
};
