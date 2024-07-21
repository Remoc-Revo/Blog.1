const createPool=require('../config/dbConnection')
const pool = createPool();

exports.getAdminNotifications = async(req,res)=>{
   pool.query(`
         SELECT * FROM NOTIFICATION 
         WHERE DATE(createdAt) >= CURDATE() - INTERVAL 7 DAY
      `,(err,result)=>{
         if(err) console.log("Error fetching notifications ", err);

         if(result){
            return res.status(200).json({notifications: result});
         }
      })
   
}