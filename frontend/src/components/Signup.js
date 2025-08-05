import { useState, useContext } from "react";
import "./Signup.css";
import { toast, Zoom, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AuthContext from "../Context/Authorisation/AuthContext";

const Signup = () => {
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/CreateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (data.success) {
      signUp(data.token); // Store token in localStorage
      navigate("/login"); // Redirect to login page
      await toast.success(
        "Account created successfully! Please log in to continue",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        }
      );
    } else if (data.message === "Email already exists") { //  email existence case
      toast.error("Email already in use. Try logging in", {
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
    } else if (data.message === "Validation failed") {
      // first validation error case
      toast.error(data.errors[0].msg, {
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
    } else {
       // generic error case
      toast.error("Something went wrong. Please try again", {
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
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="signup-container d-flex">
      {/* Left Section */}
      <div className="signup-info text-white d-flex flex-column justify-content-center">
        <h1 className="mb-4">
          Learn, Discover &<br />
          Automate in One Place.
        </h1>
        <div className="chat-bubble">
          <p className="chat-label">CHAT A.I+</p>
          <p className="chat-text">
            Welcome to Chat A.I+, your personal AI powerhouse. Unlock the full
            potential of intelligent interactions with:
          </p>
          <ul className="feature-list">
            <li>
              <strong>Modes:</strong> Switch personas like Gordon Ramsay,
              Fitness Mentor, and more.
            </li>
            <li>
              <strong>Multi-round Conversations:</strong> Maintain context
              across questions.
            </li>
            <li>
              <strong>Realtime Chat:</strong> Built with sockets for instant
              interaction.
            </li>
            <li>
              <strong>Custom Commands & Smart Formatting:</strong> Experience
              truly dynamic AI.
            </li>
          </ul>
          <p className="chat-footer">Reply...</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="signup-form d-flex flex-column justify-content-center">
        <h3 className="mb-2">Sign up with free trial</h3>
        <p className="mb-4 text-muted">
          Empower your experience, sign up for a free account today
        </p>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
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

          <Button className="w-100 mb-3 get-started-btn" type="submit">
            Get started free
          </Button>

          <div className="text-center">
            <span className="text-muted">Already have an account?</span>
            <a
              href="#"
              className="ms-1"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
