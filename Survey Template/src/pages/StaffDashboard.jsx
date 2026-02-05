
import React from 'react';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, PlayCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { getMockData } from '@/utils/mockData';
import { useToast } from '@/components/ui/use-toast';

const StaffDashboard = () => {
  const { surveys, staffStats } = getMockData();
  const { toast } = useToast();

  const getStatusBadge = (status) => {
    const variants = {
      'Not Started': 'outline',
      'In Progress': 'warning',
      'Submitted': 'success'
    };
    return variants[status] || 'outline';
  };

  const getStatusIcon = (status) => {
    if (status === 'Submitted') return <CheckCircle className="h-4 w-4" />;
    if (status === 'In Progress') return <Clock className="h-4 w-4" />;
    return <PlayCircle className="h-4 w-4" />;
  };

  const handleContinueSurvey = (surveyName) => {
    toast({
      title: "Survey Feature",
      description: `🚧 Survey "${surveyName}" isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Staff Dashboard - Virtual Pay</title>
        <meta name="description" content="View and complete your assigned surveys" />
      </Helmet>

      <MainLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your assigned surveys and track progress</p>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Assigned</p>
                    <p className="text-3xl font-bold text-foreground">{staffStats.totalAssigned}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-3xl font-bold text-foreground">{staffStats.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                    <p className="text-3xl font-bold text-foreground">{staffStats.completionRate}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Surveys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">My Assigned Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              {surveys.length > 0 ? (
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div
                      key={survey.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{survey.name}</h3>
                          <p className="text-sm text-muted-foreground">{survey.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusBadge(survey.status)} className="gap-1">
                              {getStatusIcon(survey.status)}
                              {survey.status}
                            </Badge>
                            {survey.progress !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                Progress: {survey.progress}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleContinueSurvey(survey.name)}
                        variant={survey.status === 'Submitted' ? 'outline' : 'default'}
                        className="flex-shrink-0"
                      >
                        {survey.status === 'Submitted' ? 'View' : survey.status === 'In Progress' ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No surveys assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </>
  );
};

export default StaffDashboard;
