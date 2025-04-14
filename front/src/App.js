import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [taskUpdated, setTaskUpdated] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleTaskAdded = () => {
    setTaskUpdated(!taskUpdated);
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Task Manager</h1>
          {user && (
            <div className="user-info">
              <span>Welcome, {user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </header>

        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={user ? (
            <div className="task-container">
              <TaskForm userId={user.id} onTaskAdded={handleTaskAdded} />
              <TaskList userId={user.id} taskUpdated={taskUpdated} />
            </div>
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
