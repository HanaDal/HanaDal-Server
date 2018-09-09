const router = require('express').Router();
const ctrl = require('./user.ctrl');

router.post('/login', ctrl.login);
router.get('/:id', ctrl.getUserInfo);

module.exports = router;