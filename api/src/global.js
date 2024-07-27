const createPool=require('./config/dbConnection')
const pool = createPool();
const nodemailer = require('nodemailer')

exports.queryDb=(query, values)=>{ 
    return new Promise((resolve,reject)=>{
        pool.query(query,values,(err,result)=>{
            if(err) console.log(err);
            resolve(result);
        })
    });
}

exports.notifySubscriber = (email, userFirstName,articleExcerpt, articleId)=>{


    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
     });

     const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f6f6f6;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                    color: #333333;
                }
                .content {
                    margin: 20px 0;
                }
                .content h2 {
                    font-size: 20px;
                    color: #333333;
                }
                .content p {
                    font-size: 16px;
                    color: #666666;
                    line-height: 1.5;
                }
                .cta-button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px 0;
                    text-align: center;
                    background-color: #007BFF;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999999;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Article Published</h1>
                </div>
                <div class="content">
                    
                    <h2>
                        Hello ${userFirstName != null ? userFirstName : ''},
                    </h2>
                    <p>I'm excited to share my latest article with you!</p>
                    <p>${articleExcerpt}</p>
                    <a href="${process.env.CLIENT_HOST}/sngl/${articleId}" class="cta-button">Read the Full Article</a>
                    
                    <p>I’d love to hear your thoughts!</p>
                </div>
                <div class="footer">
                    <p>Thank you for reading,</p>
                    <p>Dr. Liz</p>
                    <p>If you no longer wish to receive these emails, you can <a href="${process.env.CLIENT_HOST}/unsubscribe/${email}">unsubscribe here</a>.</p>
                </div>
            </div>
        </body>
        </html>
     `;
  
     const mailOptions = {
     to: email,
     from: process.env.EMAIL_USER,
     subject: 'Password Reset',
     html: htmlContent
     };

     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return console.log("error sending email to: ", email,error);
        }
        console.log('Message sent, id : %s', info.messageId, "to :",email,"the info:", info);
     });


}


exports.delay = (ms) =>{
    return new Promise(resolve => setTimeout(resolve, ms));
}