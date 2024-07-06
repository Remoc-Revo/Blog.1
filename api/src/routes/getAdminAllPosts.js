const {queryDb} = require('../global');

exports.getAdminAllPosts = async (req,res) =>{

   try{
        

        const posts = await queryDb(`SELECT * FROM ARTICLE as a
            JOIN MULTIMEDIA  as m ON a.articleId = m.articleId
            JOIN SECTION as s ON a.articleSectionId = s.sectionId
            WHERE a.articleIsDraft = 0
            ORDER BY a.articlePostingDate DESC 
            LIMIT 20
        `);

        console.log("fetched admin home data",posts);

        return res.status(200).json({posts:posts});
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}
