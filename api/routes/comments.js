
const pool=require('../config/dbConnection');


exports.addComment=(req,res)=>{
    const newComment=req.body.comment;
    const newsId=req.body.newsId;


    pool.query("INSERT INTO COMMENT VALUES(null,now(),?,?,?,null)",
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
    
    if(newsId!==undefined){
        pool.query(`SELECT c.*, u.userName AS comment_userName
                    FROM COMMENT c
                    LEFT JOIN USER u ON c.userId = u.userId
                    
                    WHERE newsId=?`,[newsId],
            (err,result)=>{
                if(err){
                    throw(err);
                }
                console.log("euuult3",result)

                
                function buildCommentTree(comments,parentId = null){
                    const result = [];

                    for(const comment of comments){
                        if(comment.parentCommentId === parentId){
                            const replies=buildCommentTree(comments,comment.commentId);
                            if(replies.length > 0){
                                comment.replies = replies;
                            }
                            result.push(comment);
                        }
                    }
                    return result;
                }

                  const commentTree= buildCommentTree(result)

               

                return res.status(200).json({comments:commentTree})
            })
    }
    
}


exports.reply=(req,res)=>{
    console.log(req.body.reply)
    const reply=req.body.reply;
    const parentCommentId=req.body.commentId;
    const newsId=req.body.newsId;

    pool.query(`INSERT INTO COMMENT VALUES(null,now(),?,?,?,?)`,
            [newsId,req.session.userId,reply,parentCommentId],
            (err,result)=>{
                if(err){
                    throw(err);
                }
                if(result.affectedRows==1){
                    return res.status(200).json({})
                }
            })
}


