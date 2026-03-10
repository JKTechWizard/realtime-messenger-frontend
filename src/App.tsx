// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './shared/components/ProtectedRoute';
import SignupPage from './features/auth/components/SignupPage';
import LoginPage from './features/auth/components/LoginPage';
import ChatroomsPage from './features/chatrooms/components/ChatroomsPage';
import './styles/global.css';

const App: React.FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/chatrooms" element={<ChatroomsPage />} />
        {/* </Route> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;
