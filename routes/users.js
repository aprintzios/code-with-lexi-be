var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // import bcrypt
const SALT_ROUNDS = 6; // tell bcrypt how many times to randomize the generation of salt. usually 6 is enough.

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async function(req, res, next){
  console.log("signup controller");
  try{
    //catch user info
    const userInfo = req.body;
    //put userinfo in db
    const hashedPassword = await bcrypt.hash(userInfo.password, SALT_ROUNDS)
    let user;
    if (userInfo.email == "alex.printzios@gmail.com") {
      user = await User.create({name:userInfo.name, email:userInfo.email, password:hashedPassword, isAdmin: true});
    } else {
      user = await User.create({name:userInfo.name, email:userInfo.email, password:hashedPassword, isAdmin: false});
    }
    //create jwt + send to fe
    const token = jwt.sign({user}, process.env.SECRET,{expiresIn: '24h'});
    res.status(200).json(token);

  }catch(err){
    res.status(400).json(err);
  }
});

router.post('/login', async function(req, res, next){
  try{
    const userInfo = req.body;
    console.log("userInfo", userInfo);
    const user = await User.findOne({email: userInfo.email});
    if (!(await bcrypt.compare(userInfo.password, user.password))) throw new Error();

    const token = jwt.sign({ user }, process.env.SECRET,{ expiresIn: '24h' });
    res.status(200).json(token)

  }catch(err){
    res.status(400).json('Bad Credentials');
  }

});

module.exports = router;
