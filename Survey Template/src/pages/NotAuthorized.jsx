
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Not Authorized - Virtual Pay</title>
        <meta name="description" content="You do not have permission to access this page" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-base">
              You do not have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please contact your administrator if you believe you should have access to this resource.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => navigate('/login')}>
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotAuthorized;
