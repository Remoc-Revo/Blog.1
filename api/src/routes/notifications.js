const createPool=require('../config/dbConnection')
const pool = createPool();

exports.getAdminNotifications = async(req,res)=>{
   
   const param = `${req.session.userName}%`;

   pool.query(`
         SELECT * FROM NOTIFICATION 
         WHERE DATE(createdAt) >= CURDATE() - INTERVAL 7 DAY
            AND notificationMessage NOT LIKE ?
         ORDER BY createdAt DESC
      `,[param],
      (err,result)=>{
         if(err) console.log("Error fetching notifications ", err);

         if(result){
            return res.status(200).json({notifications: result});
         }
      })
   
}