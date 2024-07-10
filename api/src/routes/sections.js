const createPool=require('../config/dbConnection')
const pool = createPool();


exports.getSections = (req,res)=>{
    pool.query(`SELECT * from SECTION`, (err,result)=>{
        if(err){
            console.log("error fetching sections", err)
        }
        
        return res.status(200).json({sections:result});
    })
}

exports.addSection = (req,res)=>{
    const sectionName = req.body.sectionName;
    console.log("adding section",req.body);

    pool.query(`INSERT INTO SECTION (sectionName) VALUES(?)`,[sectionName],
        (err,result)=>{
            if(err){
                console.log("error adding ", sectionName, err);
            }
            if(result && result.insertId !=null){
                res.status(200).json({sectionId: result.insertId});
            }
        }
    )
}


exports.deleteCategory = (req,res)=>{
    const categoryId = req.body.categoryId;

   try{ 
        pool.query(`DELETE FROM SECTION WHERE sectionId = ?`,[categoryId],
            (err,result)=>{
                if(result){
                    return res.status(200).json({});
                }
            }
        )
    }
    catch(e){
        console.log("error deleting category",e);
    }
}