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
        const newsBody=body.newsBody;
        const section=body.newsSection;
        const imgUrl=body.img;

        console.log("imgUrl::,",imgUrl)
        pool.query(`INSERT INTO NEWS VALUES(null,'${section}','${headline}','${newsBody}',${req.session.userId},now())`,
             (err,result)=>{
                if(err){
                    throw(err) 
                }
                const newsId=result.insertId;

                pool.query(`INSERT INTO MULTIMEDIA VALUES(null,"img",${newsId},'${imgUrl}')`,
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