const mongoose = require('mongoose');
const {Schema} = mongoose;
const chatSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false,
        default: 'Untitled Chat'
    },
    conversation:[
        {
            userMsg:{
                type: String,
                required: false
            },
            botMsg:{
                type: String,
                required: false
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('ChatMessage', chatSchema);