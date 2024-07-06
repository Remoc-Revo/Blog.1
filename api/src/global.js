const createPool=require('./config/dbConnection')
const pool = createPool();

exports.queryDb=(query)=>{ 
    return new Promise((resolve,reject)=>{
        pool.query(query,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        })
    });
}