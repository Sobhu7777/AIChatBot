import { useState, useContext } from "react";
import "./Login.css";
import { toast, Zoom, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../Context/Authorisation/AuthContext";
import API_BASE_URL from "../config";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/api/auth/Login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.success) {
      login(data.token); // Store token in localStorage
      navigate("/"); // To navigate to the home page after the login is succesfull
      toast.success("Welcome back! You've successfully logged in", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000); // Reload the page to reflect the login state after displaying the toast
    } else {
      toast.error("Invalid credentials. Please try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container d-flex">
      {/* Left Section - Info */}
      <div className="login-info text-white d-flex flex-column justify-content-center">
        <h1 className="mb-4">You're one step away from magic ✨</h1>
        <div className="chat-bubble">
          <p className="chat-label">CHAT A.I+</p>
          <p className="chat-text">
            Unlock specialized <strong>Modes</strong> like Cooking, Fitness, and
            Writing.
            <br />
            Pick up right where you left off with{" "}
            <strong>multi-round conversations</strong>.<br />
            Experience lightning-fast AI replies via{" "}
            <strong>realtime chat</strong>.<br />
            Dive back into a world of <strong>custom AI guidance</strong>—right
            at your fingertips.
          </p>
          <p className="chat-footer">Welcome back to intelligence 🚀</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="login-form d-flex flex-column justify-content-center">
        <h3 className="mb-2">Welcome back!</h3>
        <p className="mb-4 text-muted">Login to continue your AI experience</p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4 password-wrapper">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </Form.Group>

          <Button className="w-100 mb-3 login-btn" type="submit">
            Login
          </Button>

          <div className="text-center">
            <span className="text-muted">Don't have an account?</span>
            <a
              href="#"
              className="ms-1"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
