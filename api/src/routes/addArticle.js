const createPool=require('../config/dbConnection')
const pool = createPool();

exports.addArticle=(req,res)=>{
    if(req.session.userLevel!=1){
       return res.status(401).json({})
    }
    else{
        console.log('we here')
        const {body}=req;

        const headline=body.articleHeadline;
        const articleBody=body.articleBody;
        const section=body.articleSection;
        const imgUrl=body.img;

        console.log("imgUrl::,",imgUrl)
        pool.query(`INSERT INTO ARTICLE VALUES(null,?,?,?,now(),null)`,[headline,articleBody,section],
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