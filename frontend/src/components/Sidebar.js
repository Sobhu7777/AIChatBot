import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { toast,Slide } from "react-toastify";
import Modal from "./Modal";
import { showConfirmToast } from "./showConfirmToast";
import {
  FaPlus,
  FaRegCommentDots,
  FaUserCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { BiSolidConversation } from "react-icons/bi";
import ChatContext from "../Context/Chats/ChatContext";
import AuthContext from "../Context/Authorisation/AuthContext";
import io from "socket.io-client";
const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState(null);
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

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    fetchAllChats();
    fetchUserInfo();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("chat renamed", ({ chatId, name }) => {
      // listening for chat renamed event
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
      const res = await fetch("http://localhost:5000/api/auth/getUser", {
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
    // localStorage.removeItem("chatId"); // clear current chat ID
    localStorage.setItem("chatId", id); // set new chat ID
    navigate("/"); // navigate to home for ex-: when at /modes
    setChatId(id); // set new chat ID
    fetchChat(id); // fetch the chat
  };

  const handleNewChat = () => {
    navigate("/"); // navigate to home for ex-: when at /modes
    localStorage.removeItem("chatId"); // clear current chat ID
    setChatId(null); // reset chat ID
    setChat(null); // reset chat context
    setMessages([]); // clear messages
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

  const modeNavigate = () => navigate("/modes");

  return (
    <div className={`sidebar-container ${collapsed ? "collapsed" : ""}`}>
      {!collapsed ? (
        <>
          <div className="sidebar-header">
            <div className="sidebar-top-row">
              <h2 className="chat-title">CHAT A.I+</h2>
              <button className="collapse-btn" onClick={toggleCollapse}>
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
        </>
      ) : (
        <div className="uncollapse-bar">
          <button className="uncollapse-btn" onClick={toggleCollapse}>
            <TbLayoutSidebarLeftCollapse className="collapse-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
