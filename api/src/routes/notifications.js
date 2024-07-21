const {queryDb} = require('../global')




exports.getAdminNotifications = async(req,res)=>{

   const comments = await queryDb(`SELECT c.comment,
                       c.dateAdded,
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
}