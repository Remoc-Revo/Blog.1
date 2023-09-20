var express = require('express');
var router = express.Router();
var {body}=require('express-validator');
const jwt=require('jsonwebtoken');
const { updateArticles } = require('./updateArticles');
const {register,login,updateUser,user}=require('./users')
const multer=require('multer')
const {article,single}=require('./getArticles')
const createPool=require('../config/dbConnection')
const uuid = require('uuid');
const path = require('path');
const pool = createPool();
const fs = require('fs');
const {addComment,comments,reply,clap}= require('./comments')
require('dotenv').config();

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../../client/public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`${uuid.v4()}${path.extname(file.originalname)}`)
        
    }

})
const upload=multer({storage:storage})


router.post('/upload/:type',ifNotLoggedin, upload.single('file'),(req,res)=>{

    console.log("the name",req.file)//.filename);
    console.log("the type::",req.params.type)
    
            //profile pic upload
            if(req.params.type=="profileImg"){
                console.log("werwwerw")
                pool.query("UPDATE USER SET profileImg=? WHERE userId=?",[req.file.filename,req.session.userId],
                    (err)=>{
                        if(err){
                            throw(err);
                        }
                        return res.status(200).json({})
                    })
            }
            //article image
            else{                
                return res.status(200).json(req.file.filename)
            }
    
})
 


function ifNotLoggedin(req,res,next){
   var token=req.cookies.token;

    console.log("the token::",token);

    if(token==undefined || req.session.userId == undefined){
        return res.status(401).json({})  
    }

    jwt.verify(token,"secreet",(err,user)=>{
        if(err){
            console.log("error verifying tocken::",err);
            return res.status(401).json({})
        }
        else{
            req.session.userId=user.userId; 
            console.log("token validated hereeee")
            next();
        }
    })
   
}

router.get('/',
    article
);

router.post('/register',
        [
         body('userName')
             .trim(),
         body('email','invalid email')
             .isEmail()
             .trim(),
         body('password','Password must have at least 4 characters')
             .trim()
             .isLength({min:4})
        ],
        register
        )

router.post('/login',login)

router.get('/user',ifNotLoggedin,user
)

router.post('/updateArticles',ifNotLoggedin,updateArticles)

router.get('/single/:id',single)

router.post('/updateUser',ifNotLoggedin,
        [body('phone','Phone number must have at least 10 digits')
             .notEmpty()
             .isLength({min:10})
             .trim(),
         body('userName')
             .trim(),
         body('email','invalid email')
             .isEmail()
             .trim()
        ],
        updateUser)

router.post('/logout',(req,res,next)=>{
    console.log("logging out")
    req.session.destroy((err)=>{
        next(err);
    })
    return res.clearCookie('token').json({});
})

router.post('/addComment',ifNotLoggedin, addComment)

router.get('/comments/:articleId',comments)

router.post('/reply',ifNotLoggedin,reply)

router.post('/clap',ifNotLoggedin, clap);


module.exports = router;
