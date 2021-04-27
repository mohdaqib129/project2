const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Aqib rehman',
        email: 'test@test.com',
        password: 'testers'
    }
];

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({},'-password');
    }catch(err){
        const error = new HttpError('Fetching users failed, please try again later',500)
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
};

const signup = async (req, res, next) => {
    const {name,email,password} = req.body;
    let existingUser
    try{
        existingUser = await User.findOne({ email: email})
    }catch(err){
        const error = new HttpError('signup fail, please Try again later.',500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('user exists already,please login instead.',422)
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image:'https://imgd.aeplcdn.com/476x268/n/cw/ec/38904/mt-15-front-view.jpeg?q=80',
        password,
        places:[]
    });
    try{
        await createdUser.save();
      }catch(err){
        const error = new HttpError('Signing up fail, please Try again later.',500);
        return next(error);
      }

    res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
    const {email,password} = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({ email: email})
    }catch(err){
        const error = new HttpError('logging fail, please Try again later.',500);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError('invalid credential, could not log you in.',401);
        return next(error);
    }

    res.json({message: 'Logged in!',user: existingUser.toObject({getters: true})});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;