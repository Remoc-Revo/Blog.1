var createError = require('http-errors');
var express = require('express');
const sls = require('serverless-http');
const app = express();
require('dotenv').config();

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');

const session=require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const createPool=require('./config/dbConnection');
let pool = createPool();
const sessionStore=new MySQLStore({},pool);


const  indexRouter = require('./routes/index');

// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// app.use(cors({
//   allowedHeaders:['Content-Type'],
//   credentials:true,
//   origin: process.env.CLIENT_HOST
// }));

app.use(session({
  secret:'secreet',
  saveUninitialized:true,
  resave:false,
  store: sessionStore
}));

app.use(indexRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific database-related error (e.g., connection lost)
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Attempt to re-establish the database connection
    pool = createPool();

    // You may want to log the reconnection attempt here
    console.log('Reconnecting to the database...');

    // You can also clear the session or perform other error recovery tasks as needed

    // Continue processing the request or send an appropriate response
    return next();
  }

  // Handle other errors
  next(err);
});

app.get('/ye',async (req,res,next)=>{
  try{
    pool.query(`select articleId, articleHeadline from ARTICLE`,(err,rows)=>{
      if(rows){
      res.status(200).send("Yuuuuuu"+JSON.stringify(rows));
      }
    }) 
  
  }
  catch(err){
    console.log("connection pooling error",err);
    res.status(200).send("Yeaaaaaa")

  }
  
  
  
})


module.exports.server = sls(app);

// module.exports=app;

