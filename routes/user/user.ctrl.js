const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const Item = require('../../model/item');

// TODO: Refresh 토큰 발급 및 만료기간 정하기
const getJWT = id => jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d', issuer: 'hanadal-server' });


const login = async function login(req, res) {
  const {
    id, name, tags, pictureUrl,
  } = req.body;
  const user = await User.findOne({ id });

  if (user) res.status(200).json({ result: 'success', jwt: getJWT(user._id) });
  else if (name !== undefined && tags !== undefined) {
    const newUser = new User({
      id,
      name,
      picture: pictureUrl || 'https://www.somewhere.com',
      tags: tags.split(','),
      items: [],
      cheering: [],
    });
    newUser.save()
      .then(u => res.status(200).json({ result: 'success', jwt: getJWT(u._id) }))
      .catch(() => res.status(500).json({ result: 'failure' }));
  } else res.status(418).json({ result: 'continue' });
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
          select: 'name picture',
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
    User.findByIdAndUpdate(payload.id, { $push: { cheering: id } })
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
exports.getProfile = getProfile;
exports.modifyProfile = modifyProfile;
exports.getCheering = getCheering;
exports.cheering = cheering;
exports.getItems = getItems;
exports.buyItem = buyItem;
exports.getStore = getStore;
