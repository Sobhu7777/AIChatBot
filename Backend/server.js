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
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/chat', require('./routes/chat.js'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chatMessage', async ({ history, messageId, userMsg }) => {
        try {
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: 'tngtech/deepseek-r1t2-chimera:free',
                    messages: history,
                    max_tokens: 300
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.DeepSeek_API_KEY}`
                    }
                }
            );

            const botMsg = response.data?.choices?.[0]?.message?.content || "🤖 Sorry, I couldn’t understand. Try again!";

            if (messageId && userMsg) {
                const chat = await ChatMessage.findById(messageId);
                const isFirstMessage = chat.conversation.length === 0;

                chat.conversation.push({ userMsg, botMsg });

                if (isFirstMessage) {
                    const titlePrompt = [
                        ...history,
                        { role: 'system', content: 'Now generate a short 3-5 word title that best describes this conversation.' }
                    ];

                    const titleRes = await axios.post(
                        'https://openrouter.ai/api/v1',
                        {
                            model: 'tngtech/deepseek-r1t2-chimera:free',
                            messages: titlePrompt,
                            max_tokens: 20
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.DeepSeek_API_KEY}`
                            }
                        }
                    );

                    const title = titleRes.data?.choices?.[0]?.message?.content?.replace(/^"|"$/g, '')?.trim();
                    chat.name = title || 'Untitled Chat';
                }

                await chat.save();
                io.emit('chat renamed', { chatId: chat._id, name: chat.name }); // to render the new chat name in Sidebar
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
