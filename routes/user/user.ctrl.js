const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../../model/user');
const Item = require('../../model/item');

// TODO: Refresh 토큰 발급 및 만료기간 정하기
const getJWT = id => jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '7d', issuer: 'hanadal-server' });


const login = function login(req, res) {
  res.redirect('https://www.facebook.com/v3.2/dialog/oauth?'
  + `client_id=${process.env.client_id}`
  + `&redirect_uri=https://${req.hostname}/api/user/oauth`
  + `&state=${process.env.csrftoken}`);
};


const oauth = async function oauthWithFacebook(req, res) {
  try {
    const { code } = req.query;

    const tokenResult = await axios.get('https://graph.facebook.com/v3.2/oauth/access_token', {
      params: {
        client_id: process.env.client_id,
        redirect_uri: `https://${req.hostname}/api/user/oauth`,
        client_secret: process.env.client_secret,
        code,
      },
    });

    const userResult = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${tokenResult.data.access_token}`);
    let user = await User.findOne({ id: userResult.data.id });

    if (!user) {
      user = new User({
        id: userResult.data.id,
        name: userResult.data.name,
        pictureUrl: userResult.data.picture.data.url,
        tags: ['운동', '공부'],
        items: [],
        cheering: [],
      });
      await user.save();
    }

    res.status(200).set('authentication', getJWT(user.id)).json({ result: 'success' });
  } catch (e) {
    res.status(500).json({ result: 'failure' });
  }
};


const getProfile = async function getUserInfoWithId(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const user = await User.findById(payload.id);

    if (!user) res.status(404).json({ result: 'failure' });
    else {
      res.status(200).json({
        result: 'success',
        name: user.name,
        picture: user.pictureUrl,
        point: user.point,
        tags: user.tags,
      });
    }
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


const modifyProfile = function modifyProfileWithJwt(req, res) {
  try {
    const { profileName, profileTags } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    User.findByIdAndUpdate(payload.id, { name: profileName, tags: profileTags.split(',') })
      .then(() => res.status(205).json({ result: 'success' }))
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


const getCheering = async function getCheering(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    const cheering = await User.findById(payload.id, 'cheering')
      .populate({
        path: 'cheering',
        select: '_id pictureUrl achievementRate tags name author',
        populate: {
          path: 'author',
          select: 'name pictureUrl',
        },
      });
    cheering.cheering.forEach((e) => { e.isPressed = true; });
    res.status(200).json(cheering.cheering);
  } catch (e) {
    res.status(403).json({ result: 'failure', e });
  }
};


const cheering = function cheering(req, res) {
  try {
    const { id } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    User.findByIdAndUpdate(payload.id, { $addToSet: { cheering: id } })
      .then(() => res.status(201).json({ result: 'success' }))
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


const getItems = function getItems(req, res) {
  try {
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);
    User.findById(payload.id).populate('items').exec()
      .then((u) => {
        const skins = [];
        const medals = [];
        u.items.forEach(e => (e.category === 'skin' ? skins.push(e) : medals.push(e)));
        res.status(200).json({ result: 'success', skins, medals });
      })
      .catch(() => res.status(500).json({ result: 'failure' }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


// TODO: Cost 추가, Response 403 추가, message 추가
const buyItem = function buyItem(req, res) {
  try {
    const { id } = req.body;
    const payload = jwt.verify(req.get('X-Access-Token'), process.env.JWT_KEY);

    User.findOneAndUpdate({
      _id: payload.id, items: { $nin: [id] },
    }, { $push: { items: id } })
      .then(async (u) => {
        if (u === null) res.status(403).json({ result: 'failure', message: '이미 보유중인 아이템입니다' });
        /* else if (u.point < (await Item.findById(id)).cost)
          res.status(402).json({ result: 'failure', message: '포인트가 부족합니다' }); */
        else res.status(200).json({ result: 'success' });
      })
      .catch(e => res.status(500).json({ result: 'failure', e }));
  } catch (e) {
    res.status(403).json({ result: 'failure' });
  }
};


// TODO: Parameter에서 X-Access-Token 삭제 & Response에서 cost 추가
const getStore = async function getStore(req, res) {
  const items = await Item.find();
  const skins = [];
  const medals = [];
  items.forEach(e => (e.category === 'skin' ? skins.push(e) : medals.push(e)));
  res.status(200).json({ result: 'success', skins, medals });
};


exports.login = login;
exports.oauth = oauth;
exports.getProfile = getProfile;
exports.modifyProfile = modifyProfile;
exports.getCheering = getCheering;
exports.cheering = cheering;
exports.getItems = getItems;
exports.buyItem = buyItem;
exports.getStore = getStore;
