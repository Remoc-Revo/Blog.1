const createPool=require('../config/dbConnection')
const pool = createPool();


exports.visitor = (req,res)=>{
    if(req.method === 'OPTIONS'){
        console.log("preflight req")
        return res.status(204);
    }

    console.log("method ",req.method)

    const {path,visitorId } = req.body;
    const timestamp = new Date();


    const logViewQuery = 'INSERT INTO PAGEVIEW (timestamp,path,visitor_id) VALUES (?,?,?)';
    try{
        pool.query(logViewQuery,[timestamp,path,visitorId],(err,result)=>{
            
        })  
    }
    catch(err){
        console.log("Error logging page view: ", err);

    }



    const checkVisitorQuery = 'SELECT COUNT(*) AS count FROM VISITOR WHERE visitor_id = ?';
    const logVisitorQuery = 'INSERT INTO VISITOR (visitor_id, timestamp) VALUES (?,?)';

    try{ 
        pool.query(checkVisitorQuery,[visitorId],(err,result)=>{
            if(err){
                console.log("Error checking visitor",err);
            }else{
                if(result[0].count ===0){
                    pool.query(logVisitorQuery,[visitorId,timestamp],(err,result)=>{
                        if(err){
                            console.log('Error storing visitor info',err);
                        }
                        else{
                            return res.status(200).send('Visitor and page view logges');
                        }
                    })
                }else{
                    return res.status(200).send("page view logged");
                }
            }
        })
    }catch(err){
        console.log("Error logging visitor ",err);
    }

}