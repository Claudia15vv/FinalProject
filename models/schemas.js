var mongoose = require('mongoose');
var schema = mongoose.Schema;

let applySchema = new schema({
    name: {type:String, require:true},
    icon: {type:String, require:true},
    applyUrl: {type:String, require:true},
    entryDate:{type:Date, default:Date.now}
});

let usersSchema = new schema({
    username: {type:String, require:true},
    pwd: {type:String, require:true},
    entryDate:{type:Date, default:Date.now}

});

let apply = mongoose.model('apply', applySchema, 'apply');
let users = mongoose.model('users', usersSchema, 'users');
let mySchemas = {'apply': apply, 'users': users};

module.exports = mySchemas;