const Comment = require('../models/Comment')

async function createComment(req, res, next) {
    try {
        await Comment.create({
            autor: req.body.autor,
            text: req.body.text
        })
        res.redirect('/products');

    } catch (error) {
        next(error);
    }
    
}

module.exports = {createComment};