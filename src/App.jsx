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
import ProtectedRoute from './routes/PrivateRoute';
import MainRoutes from './routes/MainRoutes';

function App() {
  const { themeMode, isDark } = useThemeMode();
  const t = useTheme(themeMode);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Delegate everything else to MainRoutes */}
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
