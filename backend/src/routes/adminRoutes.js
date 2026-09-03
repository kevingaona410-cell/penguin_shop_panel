const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('admin/index', {
        title: 'Panel de administración'
    });
});

module.exports = router;