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

//uncomment before merging to main branch!!!
app.set('trust proxy', 1);

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//uncomment before merging to main branch!!!
// app.use(session({
//   secret:'secreet',
//   saveUninitialized:false,
//   resave:false,
//   store: sessionStore,
//   cookie: {
//     maxAge: 24*60*60*1000,
//     sameSite:'none',
//     httpOnly:true,
//     secure: true,
//     path: '/'
//   }
// }));


//for localhost
app.use(session({
  secret:'secreet',
  saveUninitialized:false,
  resave:false,
  store: sessionStore,
  cookie: {
    maxAge: 24*60*60*1000,
    // sameSite:'none',
    httpOnly:true,
    // secure:true,
    path: '/'
  }
}));

app.use(cors({
  allowedHeaders:['Content-Type'],
  credentials:true,
  origin: [process.env.CLIENT_HOST,process.env.CLIENT_HOST_2]
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

app.get('/oi', async(req,res)=>{
  console.log("ayee whyyyyy");
  res.status(200).send("whyyyyyyyyyyy");
})


// module.exports.server = sls(app);

// module.exports=app;

const port = process.env.PORT

app.listen(port,'0.0.0.0',()=>{console.log("again and again...")})

