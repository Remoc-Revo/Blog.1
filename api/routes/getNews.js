const createPool=require('../config/dbConnection')
const pool = createPool();

exports.news=(req,res)=>{
    console.log("the category",req.query)
    let fetchQuery=(req.query.cat)
                        ?`SELECT * FROM ARTICLE JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId 
                          WHERE ARTICLE.articleSection=? ORDER BY articlePostingDate DESC `
                        :`SELECT * FROM ARTICLE  JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId 
                          ORDER BY articlePostingDate DESC`;

    pool.query(fetchQuery,[req.query.cat],
        (err,result)=>{
            if(err){
                console.log(err);
            }
            const articles=result;
            console.log("the articles",articles)

            res.status(200).json({articles}); 
        }) 

}

exports.single=(req,res)=>{
    
    pool.query(`SELECT * FROM ARTICLE JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId
                 WHERE ARTICLE.articleId=${req.params.id} `,
        (err,result)=>{
            if(err){
                throw(err)
            }
            console.log("resullllt",result)
            return res.status(200).json({news:result})
        }) 
}