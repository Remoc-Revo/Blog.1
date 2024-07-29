const createPool=require('../config/dbConnection')
const pool = createPool();
const cloudinary = require('cloudinary');
const {extractPublicId} = require('cloudinary-build-url');
const {notifySubscriber, queryDb, delay} = require('../global');

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
        const sectionId=body.articleSectionId;
        const imgUrl=body.img;
        const prevImg = body.prevImg;
        const isDraft = body.isDraft ;
        const articleExcerpt = body.articleExcerpt;
        const readTimeInMinutes = body.readTimeInMinutes;

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
                    `,[headline,body.articleBody,sectionId,isDraft, articleId],
             async (err,result)=>{
                if(err){
                    console.log(err) 
                }

                console.log("afected rows", await result.affectedRows);

                if(result.affectedRows == 1){

                    res.status(200).json({})

                    //notify subscribers if article is published
                    if(!isDraft){
                        const subscribers = await queryDb(
                            `SELECT s.* , u.userFirstName as firstName, u.userName
                            FROM SUBSCRIBER s
                                LEFT JOIN USER u ON u.userEmail = s.subscriberEmail
                            `
                        )

                        const publisher = await queryDb(
                            `SELECT u.userFirstName as firstName, u.userLastName as lastName, p.photoUrl
                            FROM USER u
                            LEFT JOIN USERPHOTO p ON p.userId = u.userId
                            WHERE u.userId = ${req.session.userId}
                            `
                        )

                        console.log("available subscribers", subscribers);                        

                        for(let subscriber of subscribers){
                            const name = subscriber.firstName || subscriber.userName
                            notifySubscriber(subscriber.subscriberEmail,
                                            name,
                                            articleExcerpt,
                                            articleId,
                                            headline,
                                            readTimeInMinutes,
                                            publisher[0]
                            )

                            //Throttle
                            await delay(3000);
                        }
                    }
                }
               
                
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