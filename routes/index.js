var express = require('express');
var router = express.Router();
var schemas = require('../models/schemas.js');

/* GET home page. */
router.get('/', async(req, res) => {
  let apply = schemas.apply;
  let sesh = req.session;

  let applyResult = await apply.find({}).then((applyData) => {
  res.render('index', {title: 'Apply Website', data:applyData, search: '', loggedIn:sesh.loggedIn});
});
  
});



router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/q', async(req, res) => {
  let apply = schemas.apply;
  let q = req.body.searchInput;
  let applyData = null;
  let sesh = req.session;
  let qry = {name:{$regex:'^' + q, $options: 'i'}};

  if (q != null){
    let applyResult = await apply.find(qry).then( (data) => {
      applyData = data;
   
    });
  } else {
    q = 'Search';
    let applyResult = await apply.find({}).then( (data) => {
      applyData = data;
    });
  }

  res.render('index', {title:'Job App', data:applyData, search:q, loggedIn:sesh.loggedIn});
});

module.exports = router;
