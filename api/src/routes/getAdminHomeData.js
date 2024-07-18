const {queryDb} = require('../global')



exports.getAdminHomeData = async (req,res) =>{
    let adminHomeData ={

    }

   try{
        const latestDrafts = await queryDb(`SELECT * FROM ARTICLE as a
                    JOIN MULTIMEDIA  as m ON a.articleId = m.articleId
                    JOIN SECTION as s ON a.articleSectionId = s.sectionId
                    WHERE a.articleIsDraft = 1
                    ORDER BY a.articlePostingDate DESC 
                    LIMIT 4
                `);        
        adminHomeData['latestDrafts']=latestDrafts;

        const latestPosts = await queryDb(`SELECT * FROM ARTICLE as a
            JOIN MULTIMEDIA  as m ON a.articleId = m.articleId
            JOIN SECTION as s ON a.articleSectionId = s.sectionId
            WHERE a.articleIsDraft = 0
            ORDER BY a.articlePostingDate DESC 
            LIMIT 4
        `);
        adminHomeData['latestPosts']=latestPosts;

        const latestComments = await queryDb(`
                SELECT c.comment,
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
                LIMIT 4
            `)
        adminHomeData['latestComments'] = latestComments;


        console.log("fetched admin home data",adminHomeData);

        return res.status(200).json({adminHomeData});
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}