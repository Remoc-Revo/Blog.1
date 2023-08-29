const createPool=require('../config/dbConnection')
const pool = createPool();

exports.news=(req,res)=>{
    console.log("the category",req.query)
    let fetchQuery=(req.query.cat)
                        ?`SELECT * FROM ARTICLE JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId 
                          WHERE ARTICLE.section=? ORDER BY articlePostingDate DESC `
                        :`SELECT * FROM ARTICLE  JOIN MULTIMEDIA ON ARTICLE.articleId=MULTIMEDIA.articleId 
                          ORDER BY articlePostingDate DESC`;

    pool.query(fetchQuery,[req.query.cat],
        (err,result)=>{
            if(err){
                console.log(err);
            }
            console.log(result)
            const news=result;

            res.status(200).json({news}); 
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