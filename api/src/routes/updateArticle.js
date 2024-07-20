const createPool=require('../config/dbConnection')
const pool = createPool();
const cloudinary = require('cloudinary');
const {extractPublicId} = require('cloudinary-build-url');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD__NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(cloudinary.uploader.destroy)

exports.updateArticle=(req,res)=>{
    if(req.session.userLevel!=1){
       return res.status(401).json({})
    }
    else{
        const {body}=req;

        console.log('updating articles here',body)


        const articleId = body.articleId;
        const headline=body.articleHeadline;
        const articleBody=body.articleBody;
        const sectionId=body.articleSectionId;
        const imgUrl=body.img;
        const prevImg = body.prevImg;
        const isDraft = body.isDraft ;

        if(prevImg != undefined){
            deletePrevImg(prevImg);
        }

        console.log("imgUrl::,",imgUrl)
        try{pool.query(`UPDATE ARTICLE 
                    SET articleHeadline = ?,
                        articleBody = ?,
                        articleSectionId = ?,
                        articleUpdatingDate = now(),
                        articleIsDraft = ?
                    WHERE articleId = ?
                    `,[headline,articleBody,sectionId,isDraft, articleId],
             (err,result)=>{
                if(err){
                    console.log(err) 
                }

                if(imgUrl!=null){
                    pool.query(`UPDATE MULTIMEDIA SET multimediaUrl = ?  WHERE articleId = ?`,[imgUrl,articleId],
                        (err,result)=>{
                            if(err){
                                console.log(err)
                            }         
                            
                        })
                }
                return res.status(200).json({})
                
             })
            
        }catch(articleUpdateError){
            console.log("Article update error: ",articleUpdateError);
            return;
        }
    }
    
}

function deletePrevImg(prevImg){
    try{
        

        cloudinary.uploader.destroy(extractPublicId(prevImg),(err,result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("cloudinary deletion result :", result);
            }
        })
    }
    catch(err){
        console.log("Error deleting image",err);
    }
}