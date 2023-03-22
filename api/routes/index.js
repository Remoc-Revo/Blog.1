var express = require('express');
var router = express.Router();
var {body}=require('express-validator');
const jwt=require('jsonwebtoken');
const { updateNews } = require('./updateNews');
const {register,login,updateUser,user}=require('./users')
const multer=require('multer')
const {news,single}=require('./getNews')
const pool=require('../config/dbConnection')
const {addComment}=require('./comments')
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../client/public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,req.session.userId*18+"_"+Date.now()+file.originalname.replace(/ /g,"_"))
        
    }

})
const upload=multer({storage:storage})


router.post('/upload/:type',ifNotLoggedin, upload.single('file'),(req,res)=>{

    console.log("the name",req.file)//.filename);
    console.log("the type::",req.params.type)

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
    else{
        return res.status(200).json(req.file.filename)
    }
})
 


function ifNotLoggedin(req,res,next){
   var token=req.cookies.token;

    console.log("the token::",token);

    if(token==undefined || req.session.userId==undefined){
        return res.status(401).json({})  
    }

    jwt.verify(token,"secreet",(err,user)=>{
        if(err){
            return res.status(401).json({})
        }
        else{
            req.session.userId=user.userId; 
            console.log("hereeee")
            next();
        }
    })
   
}

router.get('/news',
    news
);

router.post('/register',
        [body('phone','Phone number must have at least 10 digits')
             .notEmpty()
             .isLength({min:10})
             .trim(),
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

router.post('/updateNews',ifNotLoggedin,updateNews)

router.get('/news/:id',single)

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
    return res.json({}).clearCookie('token');
})

module.exports = router;
