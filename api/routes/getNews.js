const pool=require('../config/dbConnection');

exports.latest=(req,res)=>{
    pool.query(`SELECT * FROM NEWS  JOIN MULTIMEDIA ON NEWS.newsId=MULTIMEDIA.newsId ORDER BY postDateTime DESC`,
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