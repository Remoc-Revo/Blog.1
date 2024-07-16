var express = require('express');
var router = express.Router();
var {body}=require('express-validator');
const jwt=require('jsonwebtoken');
const { addArticle } = require('./addArticle');
const {updateArticle} = require('./updateArticle');
const {register,login,updateUser,user,getUsers}=require('./users')
const multer=require('multer')
const {article,single}=require('./getArticles')
const createPool=require('../config/dbConnection')
const uuid = require('uuid');
const path = require('path');
const pool = createPool();
const fs = require('fs');
const {addComment,comments,reply,like}= require('./reactions')
const {deleteArticle} = require('./deleteArticle')
const {getSections,addSection,deleteCategory,editCategory} = require('./sections')
const {getAdminHomeData}= require('./getAdminHomeData');
const {getAdminAllPosts} = require('./getAdminAllPosts');
const {getAdminPostsCategories} = require('./getAdminPostsCategories');
const { visitor } = require('./visitorLogger');
const {getStats} = require('./blogStats');

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
    console.log("the session id::",req.session.userId);


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

router.post('/addArticle',ifNotLoggedin,addArticle)

router.post('/updateArticle',ifNotLoggedin,updateArticle)

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
    try{
        req.session.destroy((err)=>{            
            next(err);
        })
        return res.clearCookie('token').json({});
    }
    catch(err){
        console.log("error when logging out: ", err);
    }
})

router.delete('/article/:articleId',ifNotLoggedin,deleteArticle)

router.post('/addComment',ifNotLoggedin, addComment)

router.get('/comments/:articleId',comments)

router.post('/reply',ifNotLoggedin,reply)

router.post('/like',ifNotLoggedin, like);

router.get('/sections', getSections)

router.post('/addSection',addSection);

router.get('/adminHomeData', getAdminHomeData);

router.get('/adminAllPosts',getAdminAllPosts);

router.get('/adminPostsCategories',getAdminPostsCategories);

router.post('/deleteCategory',deleteCategory);

router.post('/editCategory',editCategory);

router.get('/users',getUsers);

router.post('/visitor',visitor);

router.get('/stats',getStats);

module.exports = router;
