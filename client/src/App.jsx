import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ChatBot from "../pages/ChatBot";
import Login from "../pages/Login";
import Register from "../pages/Register";
 import UserComplaintDashboard from "../pages/UserComplaintDashboard";
import LawyerDashboard from "../pages/LawyerDashboard";



function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path="/user-dashboard" element={<UserComplaintDashboard />} />
            <Route path="/lawyer-dashboard" element={<LawyerDashboard />} /> 

          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;


