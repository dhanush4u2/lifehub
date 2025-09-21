import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  Target, 
  BarChart3, 
  Trophy,
  Settings,
  Plus,
  GraduationCap,
  Code,
  Dumbbell,
  Heart,
  User
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data for hubs
const mockHubs = [
  { id: '1', title: 'Academics', slug: 'academics', icon: GraduationCap, color: 'hub-academics' },
  { id: '2', title: 'Tech', slug: 'tech', icon: Code, color: 'hub-tech' },
  { id: '3', title: 'Fitness', slug: 'fitness', icon: Dumbbell, color: 'hub-fitness' },
  { id: '4', title: 'Relationships', slug: 'relationships', icon: Heart, color: 'hub-relationships' },
  { id: '5', title: 'Personal', slug: 'personal', icon: User, color: 'hub-personal' },
];

const mainNavItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Hubs', url: '/hubs', icon: FolderOpen },
  { title: 'Planner', url: '/planner', icon: Calendar },
  { title: 'Goals', url: '/goals', icon: Target },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Rewards', url: '/rewards', icon: Trophy },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isHubActive = (hubSlug: string) => currentPath === `/hub/${hubSlug}`;

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="custom-scrollbar">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-gradient">LifeHub</h1>
          {open && (
            <p className="text-xs text-sidebar-foreground/60 mt-1">
              Your life, gamified
            </p>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth",
                        isActive(item.url) 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft" 
                          : "hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hubs */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-3">
            <SidebarGroupLabel>Hubs</SidebarGroupLabel>
            {open && (
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockHubs.map((hub) => (
                <SidebarMenuItem key={hub.id}>
                  <SidebarMenuButton asChild isActive={isHubActive(hub.slug)}>
                    <NavLink 
                      to={`/hub/${hub.slug}`}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth",
                        isHubActive(hub.slug)
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-soft"
                          : "hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                    >
                      <div className={cn("h-4 w-4 rounded-sm", hub.color)}>
                        <hub.icon className="h-3 w-3 text-white m-0.5" />
                      </div>
                      {open && <span>{hub.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Stats (when expanded) */}
        {open && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Credits</span>
                <span className="text-sidebar-primary font-medium">247</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Streak</span>
                <span className="text-success font-medium">7 days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground/60">Life Score</span>
                <span className="text-accent font-medium">78%</span>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}