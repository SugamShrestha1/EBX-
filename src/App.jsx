import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useThemeMode } from './contexts/ThemeContext';
import { Login } from './pages/Login';
// import { SignUp } from './pages/SignUp';
import MainRoutes from './routes/MainRoutes';

function App() {
  const { themeMode, isDark } = useThemeMode();
  const t = useTheme(themeMode);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<SignUp />} /> */}

        {/* Delegate everything else to MainRoutes */}
        <Route path="/*" element={<MainRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
