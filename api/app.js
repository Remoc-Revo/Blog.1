var createError = require('http-errors');
var express = require('express');
const sls = require('serverless-http');
const app = express();
require('dotenv').config();

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors=require('cors');
// const session=require('express-session');
// const MySQLStore = require('express-mysql-session')(session);
// const createPool=require('./config/dbConnection');
// const pool = createPool();

// const sessionStore=new MySQLStore({},pool);

// const  indexRouter = require('./routes/index');

// // app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));



// app.use(cors({
//   allowedHeaders:['Content-Type'],
//   credentials:true,
//   origin: 'http://localhost:3000'
// }));

// app.use(session({
//   secret:'secreet',
//   saveUninitialized:true,
//   resave:false,
//   store: sessionStore
// }))

// app.use(indexRouter);

app.get('/ye',async (req,res,next)=>{res.status(200).send("Yeaaaaa"+process.env.DB_NAME)})


module.exports.server = sls(app);


