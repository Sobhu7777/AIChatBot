import {useContext,useRef,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';
import { toast, Zoom } from 'react-toastify';
import { FaUserPlus, FaInfoCircle } from 'react-icons/fa';
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsBoxArrowRight } from 'react-icons/bs';
import AuthContext from '../Context/Authorisation/AuthContext';

const Modal = ({isLoggedIn,name,onClose}) => {
  const navigate = useNavigate();
  const modalRef = useRef();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose(); // <-- Call parent to close modal
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    localStorage.removeItem("chatId");
    logout();
    toast.success("Logout complete. See you again soon!", {
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
  };
  
  const handleSignUp = () => {
    console.log("Sign Up clicked");
    navigate('/signup');
  }

  const handleLogin = () => {
    console.log("Login clicked");
    navigate('/login');
  }
  return (
    <div className="user-modal shadow" ref={modalRef}>
      {isLoggedIn ? (
        <>
          <div className="modal-name d-flex align-items-center">
            <CgProfile className="me-2" id="profile-icon" />
            <span>{name}</span>
          </div>
          <div className="modal-item" onClick={handleLogout}>
            <MdLogout className='me-2' />
            <span>Logout</span>
          </div>
          <div className="modal-item">
            <FaInfoCircle className="me-2" />
            <span>About</span>
          </div>
        </>
      ) : (
        <>
          <div className="modal-item" onClick={handleSignUp}>
            <FaUserPlus className="me-2"  />
            <span>Sign up</span>
          </div>
          <div className="modal-item" onClick={handleLogin}>
            <BsBoxArrowRight className="me-2"/>
            <span>Login</span>
          </div>
          <div className="modal-item">
            <FaInfoCircle className="me-2" />
            <span>About</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Modal;
