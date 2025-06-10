import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './utils/storage';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import StudentDashboard from './components/StudentDashboard.jsx';
import NotFound from './Pages/NotFound.jsx';


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getDashboardComponent = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      case 'student':
        return <StudentDashboard currentUser={currentUser} />;
      default:
        return <Navigate to="/login"  />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {currentUser && <Navigation currentUser={currentUser} onLogout={handleLogout} />}

        <Routes>
          <Route
            path="/login"
            element={
              !currentUser ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard"  />
              )
            }
          />
          <Route
            path="/register"
            element={
              !currentUser ? (
                <Register />
              ) : (
                <Navigate to="/dashboard"  />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              currentUser ? (
                getDashboardComponent()
              ) : (
                <Navigate to="/login"  />
              )
            }
          />
          <Route
            path="/admin"
            element={
              currentUser?.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard"  />
              )
            }
          />
          <Route
            path="/employee"
            element={
              currentUser?.role === 'employee' ? (
                <EmployeeDashboard />
              ) : (
                <Navigate to="/dashboard"  />
              )
            }
          />
          <Route
            path="/student"
            element={
              currentUser?.role === 'student' ? (
                <StudentDashboard currentUser={currentUser} />
              ) : (
                <Navigate to="/dashboard"  />
              )
            }
          />
          <Route path="*" element={<NotFound/>}/>

          /
        </Routes>
      </div>
    </Router>
  );
}

export default App;
