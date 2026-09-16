import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { DemoBar } from './DemoBar';

export const AppShell: React.FC = () => {
  return (
    <div className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-bg text-text">
      {/* Top Telemetry Header */}
      <TopBar />

      {/* Developer / Operations Demo Controller */}
      <DemoBar />

      {/* Main Workspace with Sidebar & Dynamic Content */}
      <div className="flex flex-1 min-h-0 min-w-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-h-0 min-w-0 overflow-hidden bg-bg flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
