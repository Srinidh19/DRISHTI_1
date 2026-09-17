import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DemoBar } from './DemoBar';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const AppShell: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-full overflow-hidden bg-bg text-text">
      {/* Top Telemetry Header */}
      <TopBar onToggleMobileMenu={() => setIsMobileNavOpen(prev => !prev)} />

      {/* Developer / Operations Demo Controller */}
      <DemoBar />

      {/* Main Workspace with Sidebar & Dynamic Content */}
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden relative">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />
        <main className="flex-1 min-h-0 min-w-0 overflow-hidden bg-bg flex flex-col relative">
          <ErrorBoundary fallbackTitle="WORKSPACE ISOLATION ACTIVE">
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
