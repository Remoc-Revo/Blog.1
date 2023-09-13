var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');
const session=require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const createPool=require('./config/dbConnection');
const pool = createPool();
require('dotenv').config();
// const serverless = require('serverlesshttp');

const sessionStore=new MySQLStore({},pool);

const  indexRouter = require('./routes/index');

const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  allowedHeaders:['Content-Type'],
  credentials:true,
  origin: 'http://localhost:3000'
}));

app.use(session({
  secret:'secreet',
  saveUninitialized:true,
  resave:false,
  store: sessionStore
}))

app.use(indexRouter);
app.get('/',(req,res)=>{console.log("YEewww");res.status(200).send("Yeaaaaa")})


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// const express = require('express');
// const cors = require('cors');
// const app = express();

// app.use(cors({
//   allowedHeaders: ['Content-Type'],
//   credentials: true,
//   origin: 'http://localhost:3000'
// }));
// app.get('/user',()=>{console.log("Conqueringg")})





module.exports = app;

// module.exports.handler = serverless(app);
