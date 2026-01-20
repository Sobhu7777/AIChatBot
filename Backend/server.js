require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const ChatMessage = require('./models/Chats.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://vyom-ten.vercel.app'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/chat', require('./routes/chat.js'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// Helper Function: Generate Chat Title (Simple Method)
const generateChatTitle = (userMsg) => {
    if (!userMsg) return 'New Chat';
    // Take the first 5 words
    const title = userMsg.trim().split(/\s+/).slice(0, 5).join(' ');
    // Capitalize first letter
    return title.charAt(0).toUpperCase() + title.slice(1);
};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chatMessage', async ({ history, messageId, userMsg }) => {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'tngtech/deepseek-r1t2-chimera:free',
                    messages: history
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.DeepSeek_API_KEY}`
                    }
                }
            );

            const botMsg = response.data?.choices?.[0]?.message?.content || "🤖 Sorry, I couldn’t understand. Try again!";

            // Save message to DB and generate title if new chat
            if (messageId && userMsg) {
                const chat = await ChatMessage.findById(messageId);
                if (chat) {
                    chat.conversation.push({ userMsg, botMsg });
                    
                    // If this is the first message (or title is default), generate a name
                    if (chat.conversation.length === 1 || chat.name === 'Untitled Chat') {
                        chat.name = generateChatTitle(userMsg);
                        io.emit('chat renamed', { chatId: chat._id, name: chat.name });
                    }
                    await chat.save();
                }
            }

            socket.emit('chat message', { from: 'bot', botMsg });

        } catch (error) {
            console.error('❌ DeepSeek API Error:', error?.response?.data || error.message);
            socket.emit('chat message', {
                from: 'bot',
                botMsg: "⚠️ API Error: Please try again later."
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
