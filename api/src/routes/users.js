var {validationResult} = require('express-validator');
const createPool=require('../config/dbConnection')
const pool = createPool();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

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
               pool.query(`INSERT INTO USER(userId,userName,userEmail,userLevel,userRegistrationDate,userPassword) 
                     VALUES(null,?,?,0,now(),?)`,
                  [userName ,email, hashedPassword],
                  (err,result)=>{
                  if(err){
                     throw(err)
                  }
                  else if(result.affectedRows){
                     console.log("registered");

                     //fetch the id of the user in the database
                     pool.query(`SELECT userId from USER WHERE userEmail=?`,
                        [email],
                        (err,result)=>{
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
                                          {
                                           sameSite:'none',
                                           httpOnly:true,
                                           secure: true,
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

   pool.query(`SELECT * from USER WHERE userEmail=?`,[email],async(err,result)=>{
      if(err){
         throw(err)
      }

      if(result.length==0){//entered email is unregistered
         console.log("theee errr")
         return res.status(401).json({});
      }
      else{
         const fetchedPassword=result[0].userPassword;
         const fetchedUserId=result[0].userId;

         req.session.userLevel=result[0].userLevel;
         req.session.userName=result[0].userName;
         req.session.userId=result[0].userId;
         console.log("login fetched user Id",result[0].userId);
         console.log("session userid after login: ",req.session.userId)
         const checkPass=await bcrypt.compare(password,fetchedPassword);

         if(checkPass==true){//entered password matches the one stored in database
            console.log("in");

            const token=jwt.sign({userId:fetchedUserId},"secreet",{expiresIn:"1h"});

            return res.status(200)
                      .cookie('token',
                              token,
                              {
                               sameSite:'none',
                               httpOnly:true,
                               secure: true,
                               maxAge:3600*1000*24
                              })
                      .json({
                        userId:req.session.userId,
                        userLevel:req.session.userLevel, 
                        userName:req.session.userName,
                        email:result[0].userEmail
                     })
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
      const {body} = req;
      const newUserName=body.userName;
      const userFirstName = body.userFirstName;
      const userLastName = body.userLastName;
      const userDescription = body.userDescription;
      const newProfilePhoto = body.newProfilePhoto;

      if(newProfilePhoto != null){
         updateProfilePhoto(req.session.userId,newProfilePhoto);
      }

      console.log("neww photo",newProfilePhoto);
      pool.query(`UPDATE USER 
                     SET userName=?,
                     userFirstName=?,
                     userLastName=?,
                     userDescription=?
                        WHERE userId=?`,
         [newUserName,userFirstName,userLastName,userDescription,req.session.userId],
         (err,result)=>{
            if(err){
               console.log(err)
            }
            req.session.userName=newUserName;            
            return res.status(201).json({})
         })
   }
           
   
}

function updateProfilePhoto(userId,newProfilePhoto){
   pool.query(`SELECT * FROM USERPHOTO WHERE userId = ?`,[userId],
      (err,result)=>{
         if(err) console.log("err querying user photo",err)

         //user has never set profile photo
         if(result && result.length == 0){
            pool.query(`INSERT INTO USERPHOTO VALUES(null,?,?)`,
               [userId,newProfilePhoto],
               (err,result)=>{
                  if(err) console.log("Error saving profile photo",err)
                  
                  if(result) return;
               }
            );
         }
         else if(result && result.length >0 ){
            pool.query(`UPDATE USERPHOTO SET photoUrl=? WHERE userId=?`,
               [newProfilePhoto,userId],
               (err,result)=>{
                  if(err) console.log("Error updating profile photo",err)
                  
                  if(result) return;
               }
            );
         }
      }
   )
}


// pool.query(`SELECT * from USER WHERE userEmail=?`,new_email,
//    (err,result)=>{
//       if(err){
//          throw(err);
//       }
//       //email used by another user
//       if(result.length>0 && result[0].userId != req.session.userId){
//          return res.status(400).json({error:"email already in use"});
//       }
//       else{}
// })


exports.user=(req,res)=>{
   pool.query(`SELECT u.*, p.photoUrl
               FROM USER u
               LEFT JOIN USERPHOTO p
               ON u.userId = p.userId
               WHERE u.userId=${req.session.userId}`,
         (err,result)=>{
            if(err){
               throw(err);
            }
            console.log("theee name and level, ",req.session.userName,req.session.userLevel)

            const userInfo = result[0];
            return res.json({
                              userId:userInfo.userId,
                              userLevel:userInfo.userLevel, 
                              userName:userInfo.userName,
                              userFirstName:userInfo.userFirstName,
                              userLastName: userInfo.userLastName,
                              userDescription: userInfo.userDescription,
                              userProfilePhoto: userInfo.photoUrl
                           })

         })
}

exports.getUsers = (req,res)=>{

   pool.query(`SELECT u.*,
                     p.photoUrl 
               FROM USER u
               LEFT JOIN USERPHOTO p ON u.userId = p.userId
               ORDER BY userLevel DESC`,
         (err,result)=>{
            if(err) console.log("error fetching users",err)
            if(result){
               console.log("users: ",result);
               return res.status(200).json({users:result});
            }
         }
   )
}


exports.requestPasswordReset = async(req,res)=>{
   const email = req.body.email;
   try {

      //verify that the email is registered
      pool.query(`SELECT userEmail FROM USER WHERE userEmail=?`,[email],async(err,result)=>{
         if(err){
            console.log("eror verifying email",err);
         }
         
         if(result.length < 1 ){
            console.log("email doesn't exist",result)

            return res.status(401).json({errors:"email doesn't exist"})
         }
         else{

            const token = crypto.randomBytes(32).toString('hex');
            const expiration = new Date(Date.now() + 3600000); // 1 hour expiration    


            // Store token and expiration in the database
            pool.query(
            'UPDATE USER SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE userEmail = ?',
            [token, expiration, email]
            );
      
            // Send email with the reset token
            const transporter = nodemailer.createTransport({
               host: process.env.MAIL_HOST,
               port: 465,
               secure: true,
            auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
            },
            });


            //REM : change back the href's client host after refactoring

            const htmlContent = `
               <!DOCTYPE html>
               <html>
                  <head>
                     <meta charset="UTF-8">
                     <title>Password Reset Request</title>
                  </head>
                  <body>
                     <p>Hello,</p>
                     <p>We received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>
                     <p>To reset your password, please click the link below or paste it into your browser:</p>
                     <p><a href="${process.env.CLIENT_HOST_2}/resetPassword/${token}">Reset your password</a></p>
                     <p>The link will expire in 1 hour. If you have any questions or need further assistance, please contact our support team.</p>
                     <p>Thank you.</p>
                     <p><small>If you did not request this, please ignore this email and your password will remain unchanged.</small></p>
                  </body>
               </html>
            `;
         
            const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            html: htmlContent
            };
      
            transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
               return console.log("error sending email to: ", email,error);
               }
               console.log('Message sent, id : %s', info.messageId, "to :",email,"the info:", info);
            });
      
            res.status(200).send('Password reset link sent.');

         }
      });



      
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending password reset link.');
    }

}



exports.resetPassword = (req,res)=>{
   const {body} = req;
   const password = body.password;
   const resetToken = body.resetToken;
   const email = body.email;

   pool.query(`SELECT resetPasswordToken,resetPasswordExpires FROM USER WHERE userEmail=?`,[email],async(err,result)=>{
      if(err){
         console.log("eror fetching password reset token email",err);
      }
      
      
      if(result.length > 0 ){
         const storedToken = result[0].resetPasswordToken;
         console.log("token found", storedToken)

         //stored token doesn't match token sent
         if(storedToken != resetToken){
            return res.status(401).json({errors:"Invalid password reset link"})
         }else{
            let tokenExpirationTime = result[0].resetPasswordExpires;
            tokenExpirationTime = new Date(tokenExpirationTime);
            const currentTime = new Date();
            const timeDifference = currentTime - tokenExpirationTime;


            //link has
            if(timeDifference > 3600000){
               return res.status(401).json({errors:"The password reset link has expired. Request for a new one."})
            }
            else{
               const hashedPassword=await bcrypt.hash(password,12);
               
               pool.query(`UPDATE USER 
                           SET userPassword = ?,
                              resetPasswordToken = null,
                              resetPasswordExpires = null 
                           WHERE userEmail = ?`,
                  [hashedPassword, email],
                  (err,result)=>{
                     if(err) console.log("Error saving new password");

                     if(result.affectedRows == 1){
                        console.log("new password set!");

                        return res.status(201).json({});
                     }
                  }
               )

            }
         }
         
         
      }

   });

}