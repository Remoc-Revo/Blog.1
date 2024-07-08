const {queryDb} = require('../global');

exports.getAdminAllPosts = async (req,res) =>{

   try{
        let allPosts = {}

        const published = await queryDb(`SELECT * FROM ARTICLE as a
            JOIN MULTIMEDIA  as m ON a.articleId = m.articleId
            JOIN SECTION as s ON a.articleSectionId = s.sectionId
            WHERE a.articleIsDraft = 0
            ORDER BY a.articlePostingDate DESC 
            LIMIT 20
        `);

        const drafts = await queryDb(`SELECT * FROM ARTICLE as a
            JOIN MULTIMEDIA  as m ON a.articleId = m.articleId
            JOIN SECTION as s ON a.articleSectionId = s.sectionId
            WHERE a.articleIsDraft = 1
            ORDER BY a.articlePostingDate DESC 
            LIMIT 20
        `);


        allPosts['published'] = published;
        allPosts['drafts'] = drafts;
        
        console.log("fetched admin home data",allPosts);

        return res.status(200).json(allPosts);
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}
