
const {queryDb} = require('../global')



exports.getAdminPostsCategories = async (req,res) =>{
    let adminHomeData ={

    }

   try{
        const categories = await queryDb(`
                    SELECT s.sectionId, s.sectionName, COUNT(a.articleId) articleCount
                    FROM SECTION as s
                    LEFT JOIN ARTICLE as a ON a.articleSectionId = s.sectionId
                    GROUP BY s.sectionId
                `);        
        


        console.log("fetched posts categories data",categories);

        return res.status(200).json({categories});
    }
    catch(e){
        console.log("Error fetching admin home data", e);
    }


    
}