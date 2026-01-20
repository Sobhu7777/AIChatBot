import React, { useState, useEffect, useRef, useContext } from "react";
import io from "socket.io-client";
import "./ChatInterface.css";
import BotMessageBubble from "./BotMessageBubble";
import ChatContext from "../Context/Chats/ChatContext";
import AuthContext from "../Context/Authorisation/AuthContext";
import API_BASE_URL from "../config";

function ChatInterface() {
  const { chat, setChat, startMessage, fetchChat, messages, setMessages,fetchAllChats} = useContext(ChatContext);
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

  ;

  // Load guest messages if not authenticated
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
        setMessages((prev=[]) => {
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
  }, [isAuthenticated]);

  //  Send message
  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!inputMessage.trim()) return;

  const systemPrompt = chat?.content || "You are a helpful AI assistant.";
  const userPayload = { role: "user", content: inputMessage };
  
  setIsWaitingForBot(true);
  setMessages((prev = []) => [...prev, { userMsg: inputMessage, botMsg: "" }]);
  setInputMessage(""); // Clear field


  if (!isAuthenticated) {
    //UNAUTHENTICATED MODE
    return socketRef.current.emit("chatMessage", {
      history: [
        { role: "system", content: systemPrompt },
        ...messages.flatMap((msg) => [
          { role: "user", content: msg.userMsg },
          { role: "assistant", content: msg.botMsg }
        ]),
        userPayload,
      ],
      messageId: null,
      userMsg: inputMessage,
    });
  }
  // AUTHENTICATED MODE
  if (!chat) {
    const newChat = await startMessage(systemPrompt);
    setChat(newChat);
    fetchAllChats(); // Refresh sidebar
    localStorage.setItem("chatId", newChat._id);
    setChatId(newChat._id);
    setMessages([{ userMsg: inputMessage, botMsg: "" }]); // Reapply user msg

    socketRef.current.emit("chatMessage", {
      history: [{ role: "system", content: systemPrompt }, userPayload],
      messageId: newChat._id,
      userMsg: inputMessage,
    });

  } else {
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
  }

};


  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <React.Fragment key={index}>
            <div className="message user">
              <span className="message-user">User:</span> {msg.userMsg}
            </div>
            {msg.botMsg ? (
              <BotMessageBubble message={{ user: "Bot", text: msg.botMsg }} />
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

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isWaitingForBot}
        />
        <button type="submit" className="send-button" disabled={isWaitingForBot}>Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;
