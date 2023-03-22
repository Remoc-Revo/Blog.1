var {validationResult} = require('express-validator');
const pool=require('../config/dbConnection')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

exports.register=(req,res)=>{
   const errors=validationResult(req);

   console.log("register called")
   if(!errors.isEmpty()){
      res.status(400).json({
         errors:errors.array()[0].msg
      })
   }
   else{
      try{
         const {body}=req;
         const userName=body.userName;
         const email=body.email;
         const phone=body.phone;
         const password=body.password;

         console.log("the bodyy::",body)

         //confirm if email is already in use
         pool.query(`SELECT userEmail FROM USER WHERE userEmail='${email}'`,async(err,result)=>{
            if(err){
               throw(err);
            }
            
            if(result.length>0){
               console.log("email already in use",result)

               res.status(400).json({errors:"email is already in use"})
            }
            else{
               const hashedPassword=await bcrypt.hash(password,12);

               
               //register the user
               pool.query(`INSERT INTO USER VALUES(null,'${userName}','${email}',0,null,now(),${phone},'${hashedPassword}')`,
                  (err,result)=>{
                  if(err){
                     throw(err)
                  }
                  else if(result.affectedRows){
                     console.log("registered");

                     //fetch the id of the user in the database
                     pool.query(`SELECT userId from USER WHERE userEmail='${email}'`,(err,result)=>{
                        if(err){
                           throw(err);
                        }

                        req.session.userId=result[0].userId;
                        req.session.userLevel=0;
                        
                        const token=jwt.sign({userId:req.session.userId},"secreet",{expiresIn:'1h'});

                        console.log("the token hhh::",token)
                        return res.status(200)
                                  .cookie('token',
                                          token,
                                          {httpOnly:true,
                                          secure:false,
                                          maxAge:3600*1000*24
                                          })
                                  .json({});

                     })


                  }
               })
            }
            
         })
      }
      catch(err){
         throw(err);
      }
      

   }

}



exports.login=(req,res)=>{
   const {body}=req;

   const email=body.email;
   const password=body.password;

   pool.query(`SELECT * from USER WHERE userEmail='${email}'`,async(err,result)=>{
      if(err){
         throw(err)
      }

      if(result.length==0){//entered email is unregistered
         console.log("theee errr")
         return res.status(401).json({});
      }
      else{
         const fetchedPassword=result[0].password;
         const fetchedUserId=result[0].userId;

         req.session.userLevel=result[0].userLevel;
         req.session.userName=result[0].userName;
         req.session.userId=result[0].userId;
         const checkPass=await bcrypt.compare(password,fetchedPassword);

         if(checkPass==true){//entered password matches the one stored in database
            console.log("in");

            const token=jwt.sign({userId:fetchedUserId},"secreet",{expiresIn:"1h"});

            
            return res.status(200)
                      .cookie('token',token,{httpOnly:true,secure:false,maxAge:3600*1000})
                      .json({userLevel:req.session.userLevel})
         }
         else{
            return res.status(401).json({});
         }
      }
   })

}


exports.updateUser=(req,res)=>{
   const errors=validationResult(req);

   if(!errors.isEmpty()){
      return res.status(400).json({
         error:errors.array()[0].msg
      })
   }
   else{
      const new_userName=req.body.userName;
      const new_email=req.body.email;
      const new_phone=req.body.phone;

      console.log("neww",new_userName);
      
      pool.query(`SELECT * from USER WHERE userEmail=?`,new_email,
            (err,result)=>{
               if(err){
                  throw(err);
               }
               //email used by another user
               if(result.length>0 && result[0].userId != req.session.userId){
                  return res.status(400).json({error:"email already in use"});
               }
               else{
                  pool.query(`UPDATE USER SET userName=? ,userEmail=? ,phone=? WHERE userId=?`,
                     [new_userName, new_email, new_phone, req.session.userId],
                     (err,result)=>{
                        if(err){
                           throw(err)
                        }
                        req.session.userName=new_userName;            
                        return res.status(200).json({})
                     })
               }
            })
   }
   
}

exports.user=(req,res)=>{
   pool.query(`SELECT * FROM USER WHERE userId=${req.session.userId}`,
         (err,result)=>{
            if(err){
               throw(err);
            }

            return res.json({profileImg:result[0].profileImg,
                            userLevel:req.session.userLevel, 
                            userName:req.session.userName,
                            phone: result[0].phone,
                            email:result[0].userEmail
                           })

         })
}