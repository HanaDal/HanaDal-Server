const router = require('express').Router();
const ctrl = require('./user.ctrl');

router.get('/login', ctrl.login)
  .get('/oauth', ctrl.oauth)
  .get('/profile', ctrl.getProfile)
  .put('/profile', ctrl.modifyProfile)
  .get('/cheering', ctrl.getCheering)
  .post('/cheering', ctrl.cheering)
  .get('/item', ctrl.getItems)
  .post('/item', ctrl.buyItem)
  .get('/store', ctrl.getStore);

module.exports = router;
