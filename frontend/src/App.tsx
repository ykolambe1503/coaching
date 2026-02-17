import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Super Admin
import { FacultyDashboard } from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard'; // Updated modern student dashboard
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage'; // Test page
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/faculty/*" element={<FacultyDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
