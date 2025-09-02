import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import Feedback from './pages/Feedback';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;