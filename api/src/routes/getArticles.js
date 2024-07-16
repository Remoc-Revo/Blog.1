const createPool=require('../config/dbConnection')
const pool = createPool();
const {queryDb} = require('../global');


exports.article=(req,res)=>{
    let {lastArticleId} = req.query;
    lastArticleId = parseInt(lastArticleId,10)
    console.log("the cat",req.query.cat)

    const fetchQuery = `
        SELECT * 
        FROM ARTICLE  
        JOIN SECTION ON ARTICLE.articleSectionId = SECTION.sectionId
        JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId 

        WHERE ( 
        CASE 
            WHEN ? !=0 THEN ARTICLE.articleId < ?
            ELSE TRUE
        END
        )
        ${req.query.cat ? 'AND SECTION.sectionName = ?' : ''}
        AND articleIsDraft = 0
        ORDER BY articlePostingDate DESC 
        LIMIT 12
    `;

    

    pool.query(fetchQuery,[lastArticleId,lastArticleId,req.query.cat],
        (err,result)=>{
            if(err){
                console.log(err);
            }
            const articles=result;
            console.log("the last  article",lastArticleId)
            console.log("articles: ",result);
            res.status(200).json({articles}); 
        }) 

}

exports.single= async (req,res)=>{
    const articleId = req.params.id;

    
    const article = await queryDb(`SELECT * FROM ARTICLE 
                JOIN SECTION ON ARTICLE.articleSectionId = SECTION.sectionId
                JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId
                 WHERE ARTICLE.articleId=${articleId} `) 

    const likes = await queryDb(
        'SELECT * FROM `LIKE` WHERE articleId = ? AND commentId is NULL AND VALUE = 1',
        [articleId]
    )
                 
    console.log("resullllt",article,"likes", likes)
    return res.status(200).json({article:article,likes:likes})
}