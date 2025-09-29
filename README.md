# 🤖 AI ChatBot

## 📌 Introduction
This project is an **AI-powered full-stack chatbot application** with a **React frontend** and a **Node.js + Express backend**. It provides an interactive real-time chat interface where users can engage in natural conversations with an AI model.  

The chatbot supports **multi-turn conversations**, remembers context during a session, and can be extended with persona-based modes (e.g., a chef, tutor, or assistant).  

---

## 📚 Table of Contents
- [Introduction](#-introduction)  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Installation](#-installation)  
- [Usage](#-usage)  
- [Project Structure](#-project-structure)  
- [Future Improvements](#-future-improvements)  
- [Contributors](#-contributors)  
- [License](#-license)  

---

## ✨ Features
- **Real-time AI chat interface** with Socket.io  
- **Contextual conversations** – chatbot maintains memory within a session
- **Modes**  – Persona mode where you can choose from Gordon Ramsay(cooking) to arnold(fitness) for the specific fit you want
- **Modern React UI** with responsive design for desktop & mobile  
- **Animated chat bubbles** and message history display  
- **Extensible backend** for integrating any AI/LLM API  
- **Support for multiple user inputs**: text, audio (planned), and attachments  

---

## 🛠 Tech Stack
**Frontend:** React, CSS (responsive design)  
**Backend:** Node.js, Express  
**Real-time Communication:** Socket.io  
**AI Integration:** Custom API calls (can be extended with OpenAI/DeepSeek APIs)  
**Database (planned):** MongoDB for chat history & user context  

---

## ⚙️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/Sobhu7777/AIChatBot.git
cd AIChatBot
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
By default, the backend runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`.

---

## 🚀 Usage
1. Start both backend and frontend servers.  
2. Open your browser at `http://localhost:3000`.  
3. Interact with the chatbot in real time.  

---

## 📂 Project Structure
```
AIChatBot/
│
├── backend/         # Node.js + Express backend
│   ├── server.js    # Main server entry point
│   ├── routes/      # API routes
│   └── package.json
│
├── frontend/        # React frontend
│   ├── src/         # React components
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🔮 Future Improvements
- ✅ Persona-based chatbot modes (e.g., cooking tutor, travel planner)  
- ✅ Store user context & chat history in MongoDB  
- ✅ Add **voice interaction** (speech-to-text & text-to-speech)  
- ✅ Enhance UI with audio/video message support  
- ✅ Deploy on cloud (Heroku, Vercel, or AWS)  

---

## 👥 Contributors
- [Sobhu7777](https://github.com/Sobhu7777) (Project Owner)  

---

## 📜 License
This project is licensed under the **MIT License** – free to use and modify.  
