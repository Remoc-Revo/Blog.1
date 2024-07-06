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


        console.log("fetched admin home data",adminHomeData);

        return res.status(200).json({adminHomeData});
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}