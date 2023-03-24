
const pool=require('../config/dbConnection');


exports.addComment=(req,res)=>{
    const newComment=req.body.comment;
    const newsId=req.body.newsId;


    pool.query("INSERT INTO COMMENT VALUES(null,now(),?,?,?)",
            [newsId,req.session.userId,newComment],
            (err,result)=>{
                if(err){
                    throw(err)
                }
                return res.status(200).json({})
            })
}

exports.comments=(req,res)=>{
    const newsId=req.params.newsId;
    console.log("the idddd",newsId);
    
    pool.query(`SELECT COMMENT.*, USER.userName
                    FROM COMMENT 
                    JOIN USER
                    ON COMMENT.userId = USER.userId
                    WHERE newsId=?`,[newsId],
            (err,result)=>{
                if(err){
                    throw(err);
                }
                console.log("euuult3",result)

                return res.status(200).json({comments:result})
            })
}