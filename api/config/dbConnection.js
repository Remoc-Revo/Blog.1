const mysql=require('mysql2');

const pool=mysql.createPool(
    {
        host:'localhost',
        user:'moiVoice_user',
        password:'moi2021.',
        database:'nodelogin',
        waitForConnections:true,
        connectionLimit:10,
        queueLimit:0
    }
);

module.exports=pool;