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