import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PlanTrip from './pages/PlanTrip';
import RecentTrips from './pages/RecentTrips';
import About from './pages/About';
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/recent" element={<RecentTrips />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<div className="-mt-16"><AdminDashboard /></div>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
