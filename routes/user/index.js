const router = require('express').Router();
const ctrl = require('./user.ctrl');

router.post('/login', ctrl.login)
  .get('/profile', ctrl.getProfile)
  .put('/profile', ctrl.modifyProfile)
  .get('/cheering', ctrl.getCheering)
  .post('/cheering', ctrl.cheering)
  .get('/item', ctrl.getItems)
  .post('/item', ctrl.buyItem)
  .get('/store', ctrl.getStore);

module.exports = router;
