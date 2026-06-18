import { UserRoutes } from "./UserRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/Dashboard";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useThemeMode } from "../contexts/ThemeContext";
import AgentRoute from "./AgentRoute";
import QueueRoute from "./QueueRoute";


export const DashboardRoute = () => {
    const { isDark } = useThemeMode();

    const RouteList = [
        {
            path: "dashboard",
            element: <Dashboard isDark={isDark} />,
        },
        {
            path: "user-management/*",
            element: <UserRoutes />, // In React Router v6, we pass component wrappers to `element`, not `children`
        },
        {
            path: "agent-management/*",
            element: <AgentRoute />,
        },
        {
            path: "queue-management/*",
            element: <QueueRoute />,
        }
    ];

    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                {RouteList.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}
            </Route>
        </Routes>
    );
};