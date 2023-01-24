const pool=require('../config/dbConnection');

exports.news=(req,res)=>{
    console.log("the category",req.query)
    let fetchQuery=(req.query.cat)
                        ?`SELECT * FROM NEWS  JOIN MULTIMEDIA ON NEWS.newsId=MULTIMEDIA.newsId 
                          WHERE NEWS.section=? ORDER BY postDateTime DESC `
                        :`SELECT * FROM NEWS  JOIN MULTIMEDIA ON NEWS.newsId=MULTIMEDIA.newsId 
                          ORDER BY postDateTime DESC`;

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
    
    pool.query(`SELECT * FROM NEWS JOIN MULTIMEDIA ON NEWS.newsId=MULTIMEDIA.newsId WHERE NEWS.newsId=${req.params.id}`,
        (err,result)=>{
            if(err){
                throw(err)
            }
            console.log("result",result)

            return res.status(200).json({news:result})
        }) 
}