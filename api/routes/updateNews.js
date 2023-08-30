const createPool=require('../config/dbConnection')
const pool = createPool();

exports.updateNews=(req,res)=>{
    if(req.session.userLevel!=1){
       return res.status(401).json({})
    }
    else{
        console.log('we here')
        const {body}=req;

        const headline=body.newsHeadline;
        const articleBody=body.newsBody;
        const section=body.newsSection;
        const imgUrl=body.img;

        console.log("imgUrl::,",imgUrl)
        pool.query(`INSERT INTO ARTICLE VALUES(null,?,?,?,now())`,[headline,articleBody,section],
             (err,result)=>{
                if(err){
                    throw(err) 
                }
                const articleId=result.insertId;

                pool.query(`INSERT INTO MULTIMEDIA VALUES(null,${articleId},"img",'${imgUrl}')`,
                    (err,result)=>{
                        if(err){
                            console.log(err)
                        }             


                        if(result){
                            return res.status(200).json({})
                        }
                    })
             }) 
    }
    
}