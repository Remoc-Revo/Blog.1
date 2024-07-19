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