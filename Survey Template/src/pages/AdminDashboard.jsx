
import React from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Users, TrendingUp, UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getMockData } from '@/utils/mockData';

const AdminDashboard = () => {
  const { surveys, recentActivity, stats } = getMockData();

  const kpiCards = [
    {
      title: 'Total Surveys',
      value: stats.totalSurveys,
      icon: ClipboardList,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Responses Today',
      value: stats.responsesToday,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      icon: UserCheck,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Submitted': 'success',
      'In Progress': 'warning',
      'Not Started': 'outline'
    };
    return variants[status] || 'outline';
  };

  const getStatusIcon = (status) => {
    if (status === 'Submitted') return <CheckCircle className="h-4 w-4" />;
    if (status === 'In Progress') return <Clock className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Virtual Pay</title>
        <meta name="description" content="Manage surveys, track responses, and monitor staff activity" />
      </Helmet>

      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of survey system performance and activity</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                        <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Survey Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Staff Member</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity) => (
                        <tr key={activity.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">{activity.surveyName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-foreground">{activity.staffName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getStatusBadge(activity.status)} className="gap-1">
                              {getStatusIcon(activity.status)}
                              {activity.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">{activity.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

export default AdminDashboard;
