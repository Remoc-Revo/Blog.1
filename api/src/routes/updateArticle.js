const createPool=require('../config/dbConnection')
const pool = createPool();

exports.updateArticle=(req,res)=>{
    if(req.session.userLevel!=1){
       return res.status(401).json({})
    }
    else{
        console.log('we here')
        const {body}=req;

        const articleId = body.articleId;
        const headline=body.articleHeadline;
        const articleBody=body.articleBody;
        const section=body.articleSection;
        const imgUrl=body.img;

        console.log("imgUrl::,",imgUrl)
        pool.query(`UPDATE ARTICLE 
                    SET articleHeadline = ?,
                        articleBody = ?,
                        articleSection = ?,
                        articleUpdatingDate = now()
                    WHERE articleId = ?
                    `,[headline,articleBody,section,articleId],
             (err,result)=>{
                if(err){
                    throw(err) 
                }

                pool.query(`UPDATE MULTIMEDIA SET multimediaUrl = ?  WHERE articleId = ?`,[imgUrl,articleId],
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