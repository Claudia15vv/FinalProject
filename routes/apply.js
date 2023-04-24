var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var schemas = require('../models/schemas.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//edit
router.get('/:id', async(req, res) =>{
    let sesh = req.session;

    if (!sesh.loggedIn){
        res.render('apply', {title:'Edit', loggedIn:false, error:'Invalid Request' });
    }else{
        let id = req.params.id;
        let err = '';

        let apply = schemas.apply;
        let qry = {_id:id};

        let itemResult = await apply.find(qry).then( (itemData) => {
            if (itemData == null) {
                err = 'Invalid ID';

            }
            res.render('apply', {title:'Edit Job', item:itemData, loggedIn:sesh.loggedIn, error:err});

        });
    }
    });
    //delete

router.get('/delete/:id', async(req, res) =>{
    let sesh = req.session;

    if (!sesh.loggedIn){
        res.redirect('/login');
    }else{
        let apply = schemas.apply;
        let applyId = req.params.id;
        let qry = {_id:applyId};
        let deleteResult = await apply.deleteOne(qry);
        if (req.xhr) {
            res.send({success: true}); // Respond with JSON data
          } else {
        res.redirect('/');
          }
    }
});

//save
router.post('/save', async(req, res) =>{
    let sesh = req.session;

    if (!sesh.loggedIn){
        res.redirect('/login');
    }else{
        let applyId = req.body.applyId;
        let applyName = req.body.applyName;
        let applyIcon = req.body.applyIcon;
        let applyUrl = req.body.applyUrl;
        let apply = schemas.apply;

        let qry = {_id:applyId};

        let saveData = {
            $set: {
                
                name: applyName,
                icon: applyIcon,
                applyUrl: applyUrl
            }
        }
        let updateResult = await apply.updateOne(qry, saveData);

        res.redirect('/');
    }

   
});



 



router.post('/new', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn){
        res.redirect('/login');
    }else{

    
    let applyName = req.body.applyName;
    let applyIcon = req.body.applyIcon;
    let applyUrl = req.body.applyUrl;
    let apply = schemas.apply;

    let qry = {name:applyName};

    let searchResults = await apply.findOne(qry).then( async(userData) => {
        if(!userData){

            let newApply = new schemas.apply({
                name: applyName, 
                icon: applyIcon,
                applyUrl: applyUrl
            });
            let saveApply = await newApply.save();
        }
    });
    res.redirect('/');
}
});

module.exports = router;