const jwt = require('jsonwebtoken');
const User = require('../../model/user');

//TODO: Refresh 토큰 발급 및 만료기간 정하기
const getJWT = (id) => jwt.sign({ id: id }, process.env.JWT_KEY, {
    expiresIn: '10s',
    issuer: 'hanadal-server'
});

const newUser = function saveNewUser(id, name, tags) {
    let newUser = new User();
    newUser._id = id;
    newUser.name = name;
    newUser.picture = 'https://www.somewhere.com';//TODO:사진추가
    newUser.tags = tags.split(',');
    newUser.items.skin = [];
    newUser.items.badge = [];
    newUser.cherring = [];
    newUser.save();
};

//TODO: 메인에 필요한 정보 제공하기
const login = async function login(req, res) {
    const { id, name, tags } = req.body;
    const user = await User.findOne({ id: id });
    if (user)
        res.status(200).json(getJWT(id));
    else if (name !== undefined && tags !== undefined) {
        newUser(id, name, tags);
        res.status(200).json(getJWT(id));
    } else
        return res.status(100).end();
};

const getUserInfo = async function getUserInfoWithId(req, res) {
    const user = await User.findById(req.params.id);
    //TODO: 걸러내기
    res.status(200).json(user);
};

exports.login = login;
exports.getUserInfo = getUserInfo;