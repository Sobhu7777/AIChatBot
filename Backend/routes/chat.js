const express = require('express');
const router = express.Router();
const Chats = require('../models/Chats');
const fetchUser = require('../middleware/fetchUser');

//Create/start a new chat
router.post('/create', fetchUser, async (req, res) => {
  try {
    const {content} = req.body;

    const newChat = new Chats({
      userId: req.user.id,
      name: 'Untitled Chat',
      content,
      conversation: []
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Get chat history by chat ID
router.get('/history/:id', fetchUser, async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chats.findOne({ _id: id, userId: req.user.id }); // scoped to user

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all chats for a user
router.get('/all', fetchUser, async (req, res) => {
  try {
    const chats = await Chats.find({ userId: req.user.id });
    if(!chats || chats.length === 0) {
      return res.status(404).json({ message: 'No chats found' });
    } // scoped to user
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching all chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Update a chat message
router.put('/update/:id', fetchUser, async (req, res) => {
  const {id}=req.params;
  const {userMsg,botMsg}=req.body;
  try{
    const updatedChat= await Chats.findByIdAndUpdate(id,{
      $push:{
        conversation: {
          userMsg,
          botMsg
        }
      }
    },
    { new: true, runValidators: true });
    if (!updatedChat) {
      return res.status(404).json({ message: 'Chat not found or unauthorized' });
    }
    res.status(200).json(updatedChat);
  }catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Delete a chat message
router.delete('/delete/:id', fetchUser, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedChat = await Chats.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedChat) {
      return res.status(404).json({ message: 'Chat not found or unauthorized' });
    }

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all chats for a user
router.delete('/deleteAll', fetchUser, async (req, res) => {
  try {
    await Chats.deleteMany({ userId: req.user.id }); // scoped to user
    res.status(200).json({ message: 'All chats deleted successfully' });
  } catch (error) {
    console.error('Error deleting all chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

