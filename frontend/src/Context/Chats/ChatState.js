import {useState}  from 'react';
import ChatContext from './ChatContext';
import API_BASE_URL from '../../config';

const ChatState = (props) => {
  const [chat, setChat] = useState(null);  // full chat object
  const [messages, setMessages] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const headers = {
    'Content-Type': 'application/json',
    'auth-token': localStorage.getItem('token') 
  };
  const host = API_BASE_URL;

  // 1️⃣ Fetch chat from backend
  const fetchChat = async (chatId) => {
    const res = await fetch(`${host}/api/chat/history/${chatId}`, {
      method: 'GET',
      headers
    });
    const data = await res.json();
    setChat(data);
    setMessages(data.conversation || []);
    return data;
  };

  // 2️⃣ Start a new chat
  const startMessage = async (content) => {
  const res = await fetch(`${host}/api/chat/create`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({content, conversation: []})
  });

  const data = await res.json();
  setChat(data);
  setMessages(data.conversation || []);
  setAllChats(prev=>{
    console.log("prevChats",prev);
    return Array.isArray(prev) ? [...prev, data] : [data];
  }
  ); // add new chat to all chats
  return data;
};

// fetch all chats for the user
const fetchAllChats = async () => {
  const res = await fetch(`${host}/api/chat/all`, {
    method: 'GET',
    headers : headers // using the same headers defined above
  });
  const data = await res.json();
  setAllChats(data);
};

// delete a chat by ID
const deleteChat = async (chatId) => {
  const res = await fetch(`${host}/api/chat/delete/${chatId}`, {
    method: 'DELETE',
    headers: headers
  });
  const data = await res.json();
  if (res.ok) {
      setChat(null);
      setMessages([]);
      setAllChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
    } else {
      console.error("Failed to delete chat:", data.message);
    }
  return data; // returns a success message or confirmation
};

// delete all chats for the user
 const deleteAllChats = async () => {
  try {
    const res = await fetch(`${host}/api/chat/deleteAll`, {
      method: 'DELETE',
      headers: headers,
    });

    const data = await res.json();

    if (res.ok) {
      setAllChats([]); // ⬅️ Clear all chats from state
      setMessages([]); // ⬅️ Clear messages
      setChat(null); // ⬅️ Clear current chat
    }

    return data;
  } catch (error) {
    console.error("Error deleting all chats:", error);
  }
};


  return (
    <ChatContext.Provider value={{
      chat,
      allChats,
      messages,
      setChat,
      setAllChats,
      setMessages,
      startMessage,
      fetchChat,
      fetchAllChats,
      deleteChat,
      deleteAllChats
    }}>
      {props.children}
    </ChatContext.Provider>
  );
};
export default ChatState;
