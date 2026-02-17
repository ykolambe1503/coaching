import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Super Admin
import { FacultyDashboard } from './pages/FacultyDashboard';
import StudentDashboard from './components/StudentDashboard'; // Temporarily using component as page
import LandingPage from './pages/LandingPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/faculty/*" element={<FacultyDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App; // Ensure export is included since we replaced the whole block
