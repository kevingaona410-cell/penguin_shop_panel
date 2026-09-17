const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        autor: {
            type: String,
            trim: true
        },
        text: {
            type: String,
            required: [true, 'El comentario no puede estar vacio'],
            trim: true
        }, 
        
    },
    {
        timestamp: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;