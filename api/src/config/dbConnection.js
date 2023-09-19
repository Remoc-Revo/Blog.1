const mysql=require('mysql2');
require('dotenv').config();

const createPool=()=>{
    try
        {
            const pool = mysql.createPool(
                {
                    host:process.env.DB_HOST,
                    user:process.env.DB_USER,
                    password:process.env.DB_PASSWORD,
                    database:process.env.DB_NAME,
                    port: process.env.DB_PORT,
                    waitForConnections:true,
                    connectionLimit:15,
                    queueLimit:0
                }
            );
            return pool;
        }
    catch(err){
        console.log("\n\Error when creating db connection pool:\n\n",err)
        throw err; 
    }
}

module.exports=createPool;
