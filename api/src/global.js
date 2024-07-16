const createPool=require('./config/dbConnection')
const pool = createPool();

exports.queryDb=(query, values)=>{ 
    return new Promise((resolve,reject)=>{
        pool.query(query,values,(err,result)=>{
            if(err) console.log(err);
            resolve(result);
        })
    });
}