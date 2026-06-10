import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useTheme } from './hooks/useTheme';
import { useThemeMode } from './contexts/ThemeContext';

import { Extensions } from './pages/Extensions';
import { Announcement } from './pages/Announcement';
import { IVR } from './pages/IVR';
import { Trunk } from './pages/Trunk';
import { Queue } from './pages/Queue';
import { MusicOnHold } from './pages/MusicOnHold';
import { Routes as RoutesPage } from './pages/Routes';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { UserRoutes } from './routes/UserRoute';

function App() {
  const { themeMode, isDark } = useThemeMode();
  const t = useTheme(themeMode);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected app routes with dashboard layout */}
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard isDark={isDark} />} />
          <Route path="extensions" element={<Extensions t={t} />} />
          <Route path="announcement" element={<Announcement t={t} />} />
          <Route path="ivr" element={<IVR t={t} />} />
          <Route path="trunk" element={<Trunk t={t} />} />
          <Route path="queue" element={<Queue t={t} />} />
          <Route path="music-on-hold" element={<MusicOnHold t={t} />} />
          <Route path="routes" element={<RoutesPage t={t} />} />
          {UserRoutes}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
