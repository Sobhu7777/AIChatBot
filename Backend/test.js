require('dotenv').config();
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');

const app = express()
const port = 5000

// mongoDB connection

// mongoDB connection

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI environment variable is not set.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json())
app.use(cors())
app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/chat', require('./routes/chat.js'))
app.listen(port, () => {
  console.log(`chatbot app listening on port ${port}`)
})