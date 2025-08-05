import { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { IoChevronDown } from 'react-icons/io5';
import ChatContext from '../Context/Chats/ChatContext';
import './ModesChatHeader.css';

export default function ModesChatHeader({ name, profilePic }) {
  const navigate= useNavigate();
  const { setChat, setMessages } = useContext(ChatContext);

    const handleNewChat = () => {
    navigate("/"); // navigate to home for ex-: when at /modes
    localStorage.removeItem("chatId"); // clear current chat ID
    setChat(null); // reset chat context
    setMessages([]); // clear messages
    }
  return (
    <div className="mode-chat-header">
      <button className="back-button" onClick={() => navigate('/modes')}>
        <FaArrowLeft />
      </button>

      <img src={profilePic} alt="Profile" className="mode-profile-pic" />

      {/* <button className="title-button" >
        {name}
        <IoChevronDown className="chevron-icon" />
      </button> */}
  <div className="dropdown">
    <button
      className="title-button btn "
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {name}
      <IoChevronDown className="chevron-icon" />
    </button>
    <ul className="dropdown-menu custom-dropdown">
      <li><button className="dropdown-item" onClick={handleNewChat}> New chat</button></li>
    </ul>
</div>

    </div>
  );
};

