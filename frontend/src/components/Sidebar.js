import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { toast, Slide } from "react-toastify";
import Modal from "./Modal";
import { showConfirmToast } from "./showConfirmToast";
import {
  FaPlus,
  FaRegCommentDots,
  FaUserCircle,
  FaTrashAlt,
  FaBars,
} from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { BiSolidConversation } from "react-icons/bi";
import ChatContext from "../Context/Chats/ChatContext";
import AuthContext from "../Context/Authorisation/AuthContext";
import io from "socket.io-client";
import API_BASE_URL from "../config";

const Sidebar = () => {
  const navigate = useNavigate();
  // State for desktop sidebar: true = expanded, false = collapsed.
  // We use this for both desktop and mobile, but mobile only ever uses false as a starting point.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState(null);
  const sidebarRef = useRef(null);

  const {
    allChats,
    fetchAllChats,
    fetchChat,
    deleteChat,
    deleteAllChats,
    setChat,
    setAllChats,
    setMessages,
  } = useContext(ChatContext);
  const { isAuthenticated } = useContext(AuthContext);
  // eslint-disable-next-line
  const [chatId, setChatId] = useState(localStorage.getItem("chatId"));

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleModal = () => setShowModal(!showModal);

  // Use a useEffect to handle the "click outside" logic for mobile
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click is outside the sidebar and if it's a mobile view
      if (
        window.innerWidth <= 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    fetchAllChats();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on("chat renamed", ({ chatId, name }) => {
      setAllChats((prevChats = []) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, name } : chat
        )
      );
    });

    return () => socket.disconnect();
    // eslint-disable-next-line
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/auth/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const data = await res.json();
      setUserName(data.name);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  };

  const handleClearAll = () => {
    showConfirmToast("Are you sure you want to delete all conversations?", () => {
      deleteAllChats();
      localStorage.removeItem("chatId");
      toast.success("All Chats deleted!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    });
  };

  const handleOpenChat = (id) => {
    localStorage.setItem("chatId", id);
    navigate("/");
    setChatId(id);
    fetchChat(id);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    navigate("/");
    localStorage.removeItem("chatId");
    setChatId(null);
    setChat(null);
    setMessages([]);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (id) => {
    showConfirmToast("Are you sure you want to delete the conversation?", () => {
      deleteChat(id);
      localStorage.removeItem("chatId");
      setTimeout(() => {
        toast.success("Chat Deleted!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Slide,
        });
      }, 500);
    });
  };

  const modeNavigate = () => {
    navigate("/modes");
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {isMobile && !isSidebarOpen && (
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <FaBars />
        </button>
      )}

      {isMobile && isSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        ref={sidebarRef}
        className={`sidebar-container ${isSidebarOpen ? "" : "collapsed"}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-top-row">
            <h2 className="chat-title">VYOM +</h2>
            <button className="collapse-btn" onClick={toggleSidebar}>
              <TbLayoutSidebarLeftCollapse className="collapse-icon" />
            </button>
          </div>

          <button className="new-chat-btn" onClick={handleNewChat}>
            <FaPlus /> <span>New chat</span>
          </button>

          <button className="modes-btn" onClick={modeNavigate}>
            <BiSolidConversation /> <span>Modes</span>
          </button>
        </div>
        
        <div className="conversation-section">
          {isAuthenticated ? (
            <>
              <div className="conversation-header">
                <span>Your conversations</span>
                <button className="clear-all" onClick={handleClearAll}>
                  Clear All
                </button>
              </div>
              <div className="conversation-list">
                {Array.isArray(allChats) && allChats.length > 0 ? (
                  allChats.map((chat) => (
                    <div className="conversation-item" key={chat._id}>
                      <FaRegCommentDots className="conv-icon" />
                      <span
                        className="conv-text"
                        onClick={() => handleOpenChat(chat._id)}
                      >
                        {chat.name?.length > 30
                          ? chat.name.slice(0, 27) + "..."
                          : chat.name}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteChat(chat._id)}
                        title="Delete Conversation"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-convos">No conversations yet</div>
                )}
              </div>
            </>
          ) : (
            <div className="signup-prompt">
              <h4>🔐 Save your chats</h4>
              <p>
                Sign up to access and continue your conversations anytime,
                anywhere.
              </p>
            </div>
          )}
        </div>

        <div className="sidebar-footer" onClick={toggleModal}>
          <div className="footer-item">
            <FaUserCircle className="footer-icon" />
            <span id="footer-text">
              {isAuthenticated ? userName || "user" : "SignUp"}
            </span>
          </div>
        </div>
        {showModal && (
          <Modal
            onClose={() => setShowModal(false)}
            isLoggedIn={isAuthenticated}
            name={userName}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
