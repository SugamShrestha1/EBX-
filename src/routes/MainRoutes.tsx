import { Routes, Route } from 'react-router-dom';
import { DashboardRoute } from './DashboardRoute';
import ProtectedRoute from './PrivateRoute';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/*" element={
                <ProtectedRoute>
                    <DashboardRoute />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default MainRoutes;