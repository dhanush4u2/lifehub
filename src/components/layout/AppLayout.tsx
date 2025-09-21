import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-background/95">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppTopbar />
          <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}