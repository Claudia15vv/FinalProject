var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose'); // mongodb
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv/config');

//must do if inputting a new router
var indexRouter = require('./routes/index');
var applyRouter = require('./routes/apply');
var loginRouter = require('./routes/login');


var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(session({secret:process.env.SESSION_SECRET, saveUninitialized:false, resave:false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//must do if inputting a new router
app.use('/', indexRouter);
app.use('/apply', applyRouter);
app.use('/login', loginRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// db connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})

.then( () =>{
  console.log('DB Connected');
})

.catch( (err) => {
  console.log(err);
});



module.exports = app;
