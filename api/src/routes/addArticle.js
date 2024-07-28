const createPool=require('../config/dbConnection')
const pool = createPool();
const {notifySubscriber, queryDb, delay} = require('../global');


exports.addArticle=(req,res)=>{
    if(req.session.userLevel!=1){
       return res.status(401).json({})
    }
    else{
        console.log('we here')
        const {body}=req;

        console.log("body", body)
        const headline=body.articleHeadline;
        const articleBody=body.articleBody;

        const sectionId=body.articleSectionId;
        const imgUrl=body.img;
        const isDraft = body.isDraft;
        const articleExcerpt = body.articleExcerpt;
        const readTimeInMinutes = body.readTimeInMinutes;


        console.log("imgUrl::,",imgUrl)
        pool.query(`INSERT INTO ARTICLE VALUES(null,?,?,?,now(),null,?,?)`,
            [headline,articleBody,sectionId,isDraft,req.session.userId],
             async(err,result)=>{
                if(err){
                    throw(err) 
                }
                const articleId=result.insertId;

               
                
                if(result.affectedRows == 1){
                    const articleId = result.insertId;
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

                 pool.query(`INSERT INTO MULTIMEDIA VALUES(null,${articleId},"img",'${imgUrl}')`,
                    (err,result)=>{
                        if(err){
                            console.log(err)
                        }             


                        if(result){
                        }
                    })
             }) 
    }
    
}