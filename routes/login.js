var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var schemas = require('../models/schemas.js');


/* GET users listing. */
router.get('/', (req, res) => {
  res.render('login', {title:'Login', loggedIn:false, error:null});
});

router.get('/new-account', (req, res) => {
  res.render('new-account', {title:'New Account', loggedIn:false, error:null});
});



router.post('/', async(req, res)=> {
  let username = req.body.userInput;
  let pass = req.body.pwdInput;
  let loginSuccess = false;
  let sesh = req.session;
  sesh.loggedIn = false;

  let users = schemas.users;
  let qry = {username:username};
  if(username != '' && pass != ''){
    //find account usuing username

    let usersResult = await users.findOne(qry).then(async(data)=>{
      if(data) {
        // check if password matches 
        let passResult = await bcrypt.compare(pass, data.pwd).then( (isMatch) =>{
          if (isMatch){

          //ok - set sesions
          sesh.loggedIn = true;
          loginSuccess = true;
         

          
          }

        });
      }

    });
  }
  if(loginSuccess == true){
    res.redirect('/');
  }else{
    res.render('login', {title:'Login', loggedIn:false, error:'Invalid Login!'});
  }
});

router.post('/new', async(req, res) => {
  let username = req.body.userInput;
  let pass = req.body.pwdInput;

  if(username != '' && pass != ''){
    let users = schemas.users;
    let qry = {username:username};

    let userSearch = await users.findOne(qry).then( async(data) => {
      if (!data) {
        // password encryption

        let saltRounds = 10;
        let passSalt = await bcrypt.genSalt(saltRounds, async(err, salt) => {
          let passHash = await bcrypt.hash(pass, salt, async(err, hash) => {
            let account = {username:username, pwd:hash, level: 'admin'};
            let newUser = new schemas.users(account);
            let saveUser = await newUser.save();

          });

        });
      }
    });
    res.render('login', {title:'Login', loggedIn:false, error:'Please login with your new account'});
  } else {
    res.render('new-account', {title:'New Account', loggedIn:false, error:'All fields are required. Please check and try again.'});
  }

});
      

module.exports = router;
