const createPool=require('../config/dbConnection')
const pool = createPool();


exports.getSections = (req,res)=>{
    pool.query(`SELECT * from SECTION`, (err,result)=>{
        if(err){
            console.log("error fetching sections", err)
        }
        console.log("obtained sections: ",result)
        
        return res.status(200).json({sections:result});
    })
}