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
               pool.query(`INSERT INTO USER VALUES(null,'${userName}','${email}',0,now(),${phone},'${hashedPassword}')`,(err,result)=>{
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

         const checkPass=await bcrypt.compare(password,fetchedPassword);

         if(checkPass==true){//entered password matches the one stored in database
            console.log("in");

            const token=jwt.sign({userId:fetchedUserId},"secreet",{expiresIn:"1h"});

            
            return res.status(200)
                      .cookie('token',token,{httpOnly:true,secure:false,maxAge:3600*1000})
                      .json({})
         }
         else{
            return res.status(401).json({});
         }
      }
   })

}