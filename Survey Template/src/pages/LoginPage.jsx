
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Users, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (role) => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
    
    toast({
      title: "Login Successful",
      description: `Welcome ${role === 'admin' ? 'Admin' : 'Staff Member'}!`,
    });

    navigate(role === 'admin' ? '/admin-dashboard' : '/staff-dashboard');
  };

  const quickLogin = (role) => {
    setEmail(role === 'admin' ? 'admin@virtualpay.com' : 'staff@virtualpay.com');
    setPassword('password123');
    
    setTimeout(() => {
      localStorage.setItem('userRole', role);
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: "Quick Login Successful",
        description: `Logged in as ${role === 'admin' ? 'Admin' : 'Staff'}`,
      });

      navigate(role === 'admin' ? '/admin-dashboard' : '/staff-dashboard');
    }, 300);
  };

  return (
    <>
      <Helmet>
        <title>Login - Virtual Pay Survey System</title>
        <meta name="description" content="Login to Virtual Pay Survey System to manage and complete surveys" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">VP</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Virtual Pay
            </CardTitle>
            <CardDescription className="text-base">
              Survey Management System
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@virtualpay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              onClick={() => handleLogin('staff')}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Quick Login</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => quickLogin('admin')}
                className="border-primary/50 hover:bg-primary/10"
              >
                <Shield className="mr-2 h-4 w-4 text-primary" />
                Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('staff')}
                className="border-secondary/50 hover:bg-secondary/10"
              >
                <Users className="mr-2 h-4 w-4 text-secondary" />
                Staff
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 text-center text-xs text-muted-foreground">
            <p>Demo credentials are auto-filled when using Quick Login</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
