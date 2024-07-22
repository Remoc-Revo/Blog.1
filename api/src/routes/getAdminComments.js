const {queryDb} = require('../global')


exports.getAdminComments = async (req,res) =>{
   
   try{
        const comments = await queryDb(`
                SELECT c.comment,
                       c.dateAdded,
                       c.commentId,
                       c.articleId,
                       u.userName,
                       p.photoUrl as commenterProfilePhoto,
                       a.articleHeadline
                FROM COMMENT c
                JOIN USER u ON u.userId = c.userId
                JOIN ARTICLE a on a.articleId = c.articleId
                LEFT JOIN USERPHOTO p ON p.userId = c.userId
                WHERE c.parentCommentId is NULL 
                ORDER BY c.dateAdded DESC
                
            `)

        console.log("fetched admin home data",comments);

        return res.status(200).json({comments});
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}