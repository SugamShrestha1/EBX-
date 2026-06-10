import React from 'react';
import { Route } from 'react-router-dom';
import UsersList from '../pages/Users/UsersList';

/** User management routes — nested under DashboardLayout in App.jsx */
export const UserRoutes = (
  <>
    <Route path="identity-users" element={<UsersList />} />
    <Route path="users" element={<UsersList />} />
  </>
);
