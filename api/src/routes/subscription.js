const createPool=require('../config/dbConnection')
const pool = createPool();

exports.subscribe = (req,res)=>{
    const email = req.body.email;

    try{
        pool.query(`SELECT * FROM SUBSCRIBER WHERE subscriberEmail = ?`,[email],
            (err,result)=>{
                if(err) console.log("error saving subscription",err)

                //not subscribed
                if(result && result.length == 0){
                    pool.query(`INSERT INTO SUBSCRIBER VALUES(null,?,now())`,[email],
                        (err)=>{
                            if(err) console.log("error making subscription",err)
                            else return res.status(201).json({})
                        }
                    )
                }else if(result && result.length > 0){
                    return res.status(200).json({})
                }
            }
        )
    }catch(err){
        console.log("Error saving subscription ", err);
    }

}


exports.getSubscribers = (req,res)=>{

    pool.query(`SELECT s.*,
                       u.userName,
                       u.userId,
                       u.userLevel,
                       p.photoUrl as subscriberPhoto
                       FROM SUBSCRIBER s
                       LEFT JOIN USER u on u.userEmail = s.subscriberEmail
                       LEFT JOIN USERPHOTO p on u.userId = p.userId
                       `,
        (err,result)=>{
            if(err) console.log(err);

            if(result){
                console.log("subscribers: ",result);

                return res.status(200).json({subscribers:result});s
            }
        }       
        )
}