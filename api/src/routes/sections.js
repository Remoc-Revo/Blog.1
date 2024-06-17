const createPool=require('../config/dbConnection')
const pool = createPool();


exports.getSections = (req,res)=>{
    pool.query(`SELECT sectionName from SECTION`, (err,result)=>{
        if(err){
            console.log("error fetching sections", err)
        }
        console.log("obtained sections: ",result)
        let sections = []
        for(var section of result){
            sections.push(section.sectionName);
            console.log("section name: ", sections)

        }
        return res.status(200).json({sections:sections});
    })
}