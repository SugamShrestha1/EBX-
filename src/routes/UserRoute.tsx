import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UsersList from '../pages/Users/UsersList';
import DepartmentManager from '../pages/Users/Departments';

/** User management routes — nested under DashboardLayout in App.jsx */
export const UserRoutes = () => (
  <Routes>
    <Route path="users" element={<UsersList />} />
    <Route path="departments" element={<DepartmentManager />} />
  </Routes>
);
