var express = require('express');
var router = express.Router();
var {body}=require('express-validator');
const jwt=require('jsonwebtoken');
const { updateNews } = require('./updateNews');
const {register,login}=require('./users')
const multer=require('multer')
const {latest}=require('./getNews')

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'../client/public/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname.replace(/ /g,"_"))
        
    }

})
const upload=multer({storage:storage})


router.post('/upload',upload.single('file'),(req,res)=>{

    console.log("the name",req.file)//.filename);
    
    return res.status(200).json(req.file.filename)
})
 


function ifNotLoggedin(req,res,next){
   var token=req.cookies.token;

    console.log("the token::",token);

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

/* GET home page. */
router.get('/latest',
    latest
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

router.get('/userLevel',(req,res)=>{
    return res.json({userLevel:req.session.userLevel})
})

router.post('/updateNews',ifNotLoggedin,updateNews)


module.exports = router;
