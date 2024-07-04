const createPool=require('../config/dbConnection')
const pool = createPool();

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

exports.single=(req,res)=>{
    
    pool.query(`SELECT * FROM ARTICLE 
                JOIN SECTION ON ARTICLE.articleSectionId = SECTION.sectionId
                JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId
                 WHERE ARTICLE.articleId=${req.params.id} `,
        (err,result)=>{
            if(err){
                throw(err)
            }
            console.log("resullllt",result)
            return res.status(200).json({article:result})
        }) 
}