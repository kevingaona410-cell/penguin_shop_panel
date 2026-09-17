const router = require('express').Router();
const {createComment} = require('../controllers/CommentController');

router.post('/', createComment);

module.exports = router;