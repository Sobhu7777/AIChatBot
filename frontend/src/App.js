import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer,Bounce } from "react-toastify";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import ModesChatInterface from "./components/ModesChatInterface";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Modes from "./components/Modes";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ChatState from "./Context/Chats/ChatState";
import AuthState from "./Context/Authorisation/AuthState";

export default function App() {
  return (
    <AuthState>
      <ChatState>
        <Router>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            limit={3}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="light"
            transition={Bounce}
          />
          <Routes>
            {/* Auth pages */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* App layout for chat and modes */}
            <Route
              path="*"
              element={
                <div className="app-container d-flex">
                  <Sidebar />
                  <Routes>
                    <Route path="/" element={<ChatInterface />} />
                    <Route path="/modes" element={<Modes />} />
                    <Route
                      path="/modes/:name"
                      element={<ModesChatInterface />}
                    />
                  </Routes>
                </div>
              }
            />
          </Routes>
        </Router>
      </ChatState>
    </AuthState>
  );
}
