import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RealtimeProvider } from './context/RealtimeContext';
import { AppShell } from './components/layout/AppShell';
import { LoginScreen } from './pages/LoginScreen';
import { CommandScreen } from './pages/CommandScreen';
import { IncidentsList } from './pages/IncidentsList';
import { IncidentWorkspace } from './pages/IncidentWorkspace';
import { CameraNetwork } from './pages/CameraNetwork';
import { LiveWallScreen } from './pages/LiveWallScreen';
import { TracksScreen } from './pages/TracksScreen';
import { SwanOverview } from './pages/swan/SwanOverview';
import { SwanActiveTracks } from './pages/swan/SwanActiveTracks';
import { SwanCoordination } from './pages/swan/SwanCoordination';
import { ShieldOverview } from './pages/shield/ShieldOverview';
import { ShieldFaults } from './pages/shield/ShieldFaults';
import { ShieldCoverage } from './pages/shield/ShieldCoverage';
import { ShieldRecovery } from './pages/shield/ShieldRecovery';
import { EvidenceScreen } from './pages/EvidenceScreen';
import { AnalyticsScreen } from './pages/AnalyticsScreen';
import { AdminScreen } from './pages/AdminScreen';

import { DrishtiPublicLanding } from './pages/DrishtiPublicLanding';

export const App: React.FC = () => {
  return (
    <RealtimeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public DRISHTI Explanatory Website */}
          <Route path="/" element={<DrishtiPublicLanding />} />
          <Route path="/platform" element={<DrishtiPublicLanding />} />
          <Route path="/how-it-works" element={<DrishtiPublicLanding />} />
          <Route path="/architecture" element={<DrishtiPublicLanding />} />
          <Route path="/demo" element={<DrishtiPublicLanding />} />

          {/* Operator Authentication */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Protected Command Shell */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/command" replace />} />

            {/* COMMAND */}
            <Route path="command" element={<CommandScreen />} />

            {/* INCIDENTS */}
            <Route path="incidents" element={<IncidentsList />} />
            <Route path="incidents/active" element={<IncidentsList />} />
            <Route path="incidents/assigned" element={<IncidentsList />} />
            <Route path="incidents/resolved" element={<IncidentsList />} />
            <Route path="incidents/:incidentId" element={<IncidentWorkspace />} />

            {/* SURVEILLANCE */}
            <Route path="surveillance/cameras" element={<CameraNetwork />} />
            <Route path="surveillance/live" element={<LiveWallScreen />} />
            <Route path="surveillance/tracks" element={<TracksScreen />} />

            {/* SWAN (Real Routes) */}
            <Route path="swan" element={<Navigate to="/app/swan/overview" replace />} />
            <Route path="swan/overview" element={<SwanOverview />} />
            <Route path="swan/tracks" element={<SwanActiveTracks />} />
            <Route path="swan/coordination" element={<SwanCoordination />} />

            {/* SHIELD (Real Routes) */}
            <Route path="shield" element={<Navigate to="/app/shield/overview" replace />} />
            <Route path="shield/overview" element={<ShieldOverview />} />
            <Route path="shield/faults" element={<ShieldFaults />} />
            <Route path="shield/coverage" element={<ShieldCoverage />} />
            <Route path="shield/recovery" element={<ShieldRecovery />} />

            {/* EVIDENCE */}
            <Route path="evidence" element={<EvidenceScreen />} />
            <Route path="evidence/events" element={<EvidenceScreen />} />
            <Route path="evidence/clips" element={<EvidenceScreen />} />
            <Route path="evidence/audit" element={<EvidenceScreen />} />

            {/* ANALYTICS */}
            <Route path="analytics" element={<AnalyticsScreen />} />

            {/* ADMIN */}
            <Route path="admin/users" element={<AdminScreen />} />
            <Route path="admin/cameras" element={<AdminScreen />} />
            <Route path="admin/zones" element={<AdminScreen />} />
            <Route path="admin/audit" element={<AdminScreen />} />
          </Route>

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/app/command" replace />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/app/command" replace />} />
        </Routes>
      </BrowserRouter>
    </RealtimeProvider>
  );
};

export default App;
