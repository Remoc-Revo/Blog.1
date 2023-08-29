
const createPool=require('../config/dbConnection')
const pool = createPool();

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

                console.log("comment tree::",commentTree[0])

                //feth claps-data of that news
                pool.query(`SELECT commentId,value FROM CLAP WHERE newsId=?`,newsId,
                    (err,result)=>{
                        if(err) throw(err);

                        console.log("clapps::",result)
                        return res.status(200).json({claps:result,comments:commentTree})
                    })
                
                
            })
    }
    
}


exports.reply=(req,res)=>{
    console.log(req.body.reply)
    const reply=req.body.reply;
    const parentId=req.body.parentId;
    const newsId=req.body.newsId;

    pool.query(`INSERT INTO COMMENT VALUES(null,now(),?,?,?,?)`,
            [newsId,req.session.userId,reply,parentId],
            (err,result)=>{
                if(err){
                    throw(err);
                }
                if(result.affectedRows==1){
                    return res.status(201).json({})
                }
            })
}

exports.clap=(req,res)=>{    
    const commentId=req.body.commentId
    const clap_value=req.body.value;
    const newsId=req.body.newsId;

    console.log("claping or slaping::: clapp",commentId);
    
    pool.query(`SELECT * FROM CLAP WHERE commentId=${commentId} AND userId=${req.session.userId}`,
        (err,result)=>{
            if(err) throw(err);

            //the user has not reacted to the comment
            if(result.length==0){
                pool.query(`INSERT INTO CLAP VALUES(?,?,?,1)`,[newsId,commentId,req.session.userId],
                    (err,result)=>{
                        if(err) throw(err);

                        if(result.affectedRows==1) return res.status(201).json({});
                    })
            }
            // the user had previously reacted differently to the comment
            else if(result[0].value != clap_value){
                pool.query(`UPDATE CLAP SET value=${clap_value} WHERE commentId=${commentId}`,
                    (err,result)=>{
                        if(err) throw(err);

                        if(result.affectedRows==1) return res.status(201).json({});
                    })
            }
            //the user is making the same reaction she made previously
            else{
                return res.status(200).json({});
            }

        })
    
}



