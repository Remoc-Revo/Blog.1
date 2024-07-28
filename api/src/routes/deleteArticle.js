const createPool=require('../config/dbConnection')
const pool = createPool();
const cloudinary = require('cloudinary');
const {extractPublicId} = require('cloudinary-build-url');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD__NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.deleteArticle = (req,res) =>{
    const articleId = req.params.articleId;
    const imgUrl = req.body.imgUrl;

    pool.query(`DELETE FROM NOTIFICATION WHERE articleId = ?`,[articleId],
        (err)=>{
            if(err) console.log("Error deleting article's notification", err);
        }
    );

    pool.query('DELETE FROM ARTICLE WHERE articleId = ?',[articleId],(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){

            pool.query('DELETE FROM MULTIMEDIA WHERE articleId = ?',[articleId],async (err,result)=>{
                if(err){
                    console.log(err);
                }
                if(result){
                    await deletePrevImg(imgUrl);
                    res.status(200).json({});
                }
            })
            
        }
    })
}

async function deletePrevImg(prevImg){
    try{
        
        cloudinary.uploader.destroy(extractPublicId(prevImg),(err,result)=>{
            if(err){
                console.log("error while deleting from cloudinary",err);
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