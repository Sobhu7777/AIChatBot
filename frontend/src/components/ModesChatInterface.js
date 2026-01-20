import  React,{ useRef, useState,useEffect,useContext } from "react";
import io from "socket.io-client";
import {useParams,useLocation} from "react-router-dom";
import ModesChatHeader from "./ModesChatHeader"; //
import ModesBotMessageBubble from "./ModesBotMessageBubble";
import "./ModesChatInterface.css";
import ChatContext from "../Context/Chats/ChatContext";
import AuthContext from "../Context/Authorisation/AuthContext";
import API_BASE_URL from "../config";

export default function ModesChatInterface() {
    const { name } = useParams(); // get the name from the URL
    const location = useLocation(); // get the location object
    const title = location.state?.name || name;
    const profilePic = location.state?.image || "/images/default-profile.jpg";
    const domain = location.state?.domain || "General";
    const content = location.state?.content || "You are a helpful AI assistant.";

    const { chat, startMessage, fetchChat, messages, setMessages,fetchAllChats} = useContext(ChatContext);
    const { isAuthenticated } = useContext(AuthContext);
    const [inputMessage, setInputMessage] = useState("");
    const [chatId, setChatId] = useState(localStorage.getItem("chatId"));
    const [isWaitingForBot, setIsWaitingForBot] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
      if (!isAuthenticated) {
        const guestMessages = localStorage.getItem("guestMessages");
        if (guestMessages) {
          setMessages(JSON.parse(guestMessages));
        }
      } else {
        localStorage.removeItem("guestMessages");
      }
    }, [isAuthenticated]);

  // Fetch chat on mount
    useEffect(() => {
      if (isAuthenticated && chatId && chatId !== "undefined") {
        if(messages.length === 0) {
          fetchChat(chatId);
        }
      } else {
        setMessages([]);
      }
    }, [chatId]);

  // WebSocket setup
  useEffect(() => {
    socketRef.current = io(API_BASE_URL);

    socketRef.current.on("chat message", ({ from,botMsg }) => {
      // If the message is from the bot, update the messages state
      if (from === "bot") {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.botMsg === "") {
            const updated = [...prev.slice(0, -1), { ...last, botMsg }];
            if (!isAuthenticated) {
              localStorage.setItem("guestMessages", JSON.stringify(updated));
            }
            setIsWaitingForBot(false); // Bot has responded
            return updated;
          }
          return prev;
        });
      }
    });

    return () => socketRef.current.disconnect();
  }, []);
  

  //  Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const systemPrompt = chat?.content || content;
    const userPayload = { role: "user", content: inputMessage };
    setIsWaitingForBot(true);

    // Update UI immediately
    setMessages((prev = []) => {
      const updated = [...prev, { userMsg: inputMessage, botMsg: "" }];
      if (!isAuthenticated) {
        localStorage.setItem("guestMessages", JSON.stringify(updated));
      }
      return updated;
    });

    if (isAuthenticated && !chat) {
      const newChat = await startMessage(systemPrompt);
      fetchAllChats();
      localStorage.setItem("chatId", newChat._id);
      setChatId(newChat._id);

      socketRef.current.emit("chatMessage", {
        history: [{ role: "system", content: systemPrompt }, userPayload],
        messageId: newChat._id,
        userMsg: inputMessage
      });
    } else if (isAuthenticated && chat) {
      const history = [
        { role: "system", content: systemPrompt },
        ...messages.flatMap((msg) => [
          { role: "user", content: msg.userMsg },
          { role: "assistant", content: msg.botMsg }
        ]),
        userPayload
      ];

      socketRef.current.emit("chatMessage", {
        history,
        messageId: chat._id,
        userMsg: inputMessage
      });
    } else {
      // For guest users: reconstruct history from localStorage
      const guestHistory = [
        { role: "system", content: systemPrompt },
        ...(JSON.parse(localStorage.getItem("guestMessages") || "[]") || []).flatMap((msg) => [
          { role: "user", content: msg.userMsg },
          msg.botMsg ? { role: "assistant", content: msg.botMsg } : null
        ]).filter(Boolean),
        userPayload
      ];

      socketRef.current.emit("chatMessage", {
        history: guestHistory,
        userMsg: inputMessage
      });
    }

    setInputMessage(""); // Clear input field
  };

  return (
    <div className="modes-chat-container">
      {/* Fixed Header */}
      <ModesChatHeader 
      name={title}
      profilePic={profilePic}  
      />

      {/* Chat Body */}
      <div className="modes-chat-box">
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <div className="message user">
              <span className="message-user">User:</span> {msg.userMsg}
            </div>
            {msg.botMsg ? (
              <ModesBotMessageBubble
              key={index}
              profilePic={profilePic}
              name={title}
              domain={domain}
               message={{ user: "Bot", text: msg.botMsg }}
              />
            ) : index === messages.length - 1 && isWaitingForBot ? (
              <div className="wave-loader">
                <div className="wave-dot"></div>
                <div className="wave-dot"></div>
                <div className="wave-dot"></div>
                <div className="wave-dot"></div>
                <div className="wave-dot"></div>
            </div>
            ) : null}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form className="modes-chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="modes-chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isWaitingForBot} // Disable input while waiting for bot response
        />
        <button type="submit" className="send-button" disabled={isWaitingForBot}>Send</button>
      </form>
    </div>
  );
}



