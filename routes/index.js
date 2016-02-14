var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Crypto Chat'
    });
});

router.post('/chat', function(req, res, next) {
    res.render('chat', {
        title: req.body.room + ' - Crypto Chat',
        user: req.body.user,
        room: req.body.room
    });
});

module.exports = router;
