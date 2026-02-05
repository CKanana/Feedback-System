
import React, { useState } from 'react';
import { Sun, Moon, Bell, User, LogOut, Shield, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notificationCount] = useState(3);
  
  const userRole = localStorage.getItem('userRole') || 'guest';
  const userName = userRole === 'admin' ? 'Admin User' : 'Staff Member';

  const handleRoleSwitch = (newRole) => {
    localStorage.setItem('userRole', newRole);
    toast({
      title: "Role Switched",
      description: `You are now viewing as ${newRole === 'admin' ? 'Admin' : 'Staff'}`,
    });
    navigate(newRole === 'admin' ? '/admin-dashboard' : '/staff-dashboard');
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-end px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full hover:bg-accent"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-foreground" />
            )}
          </Button>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2">
                {userRole === 'admin' ? (
                  <Shield className="h-4 w-4 text-primary" />
                ) : (
                  <Users className="h-4 w-4 text-secondary" />
                )}
                <span className="hidden sm:inline text-foreground">
                  {userRole === 'admin' ? 'Admin' : 'Staff'}
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownItem onClick={() => handleRoleSwitch('admin')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Switch to Admin</span>
              </DropdownItem>
              <DropdownItem onClick={() => handleRoleSwitch('staff')}>
                <Users className="mr-2 h-4 w-4" />
                <span>Switch to Staff</span>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent relative"
            onClick={handleNotifications}
          >
            <Bell className="h-5 w-5 text-foreground" />
            {notificationCount > 0 && (
              <Badge variant="danger" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>

          <Dropdown>
            <DropdownTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userRole}@virtualpay.com</span>
                </div>
              </div>
              <DropdownSeparator />
              <DropdownItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
