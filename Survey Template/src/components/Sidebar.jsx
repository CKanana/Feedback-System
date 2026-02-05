
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole') || 'guest';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const adminLinks = [
    {
      to: '/admin-dashboard',
      icon: LayoutDashboard,
      label: 'Admin Dashboard',
      roles: ['admin']
    },
    {
      to: '/staff-dashboard',
      icon: Users,
      label: 'Staff Dashboard',
      roles: ['admin']
    }
  ];

  const staffLinks = [
    {
      to: '/staff-dashboard',
      icon: LayoutDashboard,
      label: 'My Dashboard',
      roles: ['staff']
    }
  ];

  const links = userRole === 'admin' ? adminLinks : staffLinks;

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-50 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-center border-b border-border px-4">
        <div className={cn(
          "flex items-center gap-3 w-full",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">VP</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="text-sm font-bold text-foreground">Virtual Pay</span>
              <span className="text-xs text-muted-foreground">Survey System</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? link.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border space-y-2 bg-card">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </Button>

          <Button
            variant="ghost"
            onClick={onToggle}
            className={cn(
              "w-full justify-start gap-3 hidden md:flex",
              collapsed && "justify-center px-0"
            )}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
