
const createPool=require('../config/dbConnection')
const pool = createPool();

exports.addComment=(req,res)=>{
    const newComment=req.body.comment;
    let articleId=req.body.articleId;
    articleId = parseInt(articleId)


    try{
        pool.query("INSERT INTO COMMENT VALUES(null,now(),?,?,?,null)",
            [articleId,req.session.userId,newComment],
            (err,result)=>{
                if(err){
                    console.log(err)
                }
                return res.status(200).json({})
            })
    }catch(err){
        console.log("Error adding comment", err);
    }
}

exports.comments=(req,res)=>{
    let articleId=req.params.articleId;
    // articleId = parseInt(articleId)
    console.log("the iiiiiiiiiiddddd",articleId);
    

    try{
        if(articleId!==undefined){
        
        pool.query(`SELECT c.*, u.userName AS comment_userName
                    FROM COMMENT c
                    LEFT JOIN USER u ON c.userId = u.userId
                    WHERE articleId=?`,[articleId],
            (err,result)=>{
                if(err){
                    console.log(err);
                    return;
                }
                console.log("comments result",result)

                
                function buildCommentTree(comments,parentId = null){
                    const result = [];

                    for(const comment of comments){
                        if(comment.parentCommentId === parentId){
                            console.log("inside if one of them...,",comment)

                            const replies=buildCommentTree(comments,comment.commentId);
                            if(replies.length > 0){
                                comment.replies = replies;
                            }
                            result.push(comment);
                        }
                    }
                    return result;
                }

                let commentTree = buildCommentTree(result)

                console.log("comment tree::",commentTree)

                //fetch likes of the article
                try{
                    pool.query("SELECT commentId,value FROM `LIKE` WHERE articleId=?",articleId,
                    (err,result)=>{
                        if(err) console.log(err);

                        console.log("clapps::",result)
                        return res.status(200).json({claps:result,comments:commentTree})
                    })
                }catch(err){
                    console.log("Error fetching likes", err);
                }
                
                
            })
    }
    }catch(err){
        console.log("Error fetching comments", err);
    }
    
}


exports.reply=(req,res)=>{
    console.log(req.body.reply)
    const reply=req.body.reply;
    const parentId=req.body.parentId;
    const articleId=req.body.articleId;

    pool.query(`INSERT INTO COMMENT VALUES(null,now(),?,?,?,?)`,
            [articleId,req.session.userId,reply,parentId],
            (err,result)=>{
                if(err){
                    throw(err);
                }
                if(result.affectedRows==1){
                    return res.status(201).json({})
                }
            })
}

exports.like=(req,res)=>{    
    const commentId=req.body.commentId
    const articleId=req.body.articleId;

    console.log("like::: ",commentId);
    
    pool.query('SELECT * FROM `LIKE` WHERE commentId=? AND userId=?',[commentId,req.session.userId],
        (err,result)=>{
            if(err) throw(err);

            //the user has not reacted to the comment
            if(result.length==0){
                pool.query('INSERT INTO `LIKE` VALUES(?,?,?,1)',[articleId,commentId,req.session.userId],
                    (err,result)=>{
                        if(err) throw(err);

                        if(result.affectedRows==1) return res.status(201).json({});
                    })
            }
            // the user had previously reacted differently to the comment
            else {
                const newValue = result[0].value == 1 ? 0 : 1;
                pool.query('UPDATE `LIKE` SET value=? WHERE commentId=?',[newValue,commentId],
                    (err,result)=>{
                        if(err) throw(err);

                        if(result.affectedRows==1) return res.status(201).json({});
                    })
            }
           

        })
    
}



