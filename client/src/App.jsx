import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile"
import About from "./pages/about";
import Feedback from "./pages/Feedback";
import Active_request from "./pages/Active_request";
import Home from "./pages/home";
import Login from "./pages/login";
import Chat from "./chats";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Active_request />} />
        <Route path="/feedback" element={<Feedback />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;