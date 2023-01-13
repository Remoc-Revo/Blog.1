const pool=require('../config/dbConnection')
const multer=require('multer')


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

        console.log("the image",body.newsPhoto)
        // pool.query(`INSERT INTO NEWS VALUES(null,'${section}','${headline}','${newsBody}',${req.session.userId},now())`,
        //      (err,result)=>{
        //         if(err){
        //             throw(err)
        //         }
        //         if(result.affectedRows==1){
        //             return res.status(201).json({})
        //         }
        //      }) 
        return res.status(200).json({})
    }
    
}