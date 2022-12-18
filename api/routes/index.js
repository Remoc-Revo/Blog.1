var express = require('express');
var router = express.Router();
var {body}=require('express-validator');
const jwt=require('jsonwebtoken');

const {register,login}=require('./users')


function ifNotLoggedin(req,res,next){
   var token=req.cookies.token;

    console.log("the token::",token);

    jwt.verify(token,"secreet",(err,user)=>{
        if(err){
            return res.status(401).json({})
        }
        else{
            req.session.userId=user.userId;
        }
    })
    // next()
}

/* GET home page. */
router.get('/latest',
    ()=>{
        return res.json({})
    }
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

module.exports = router;
