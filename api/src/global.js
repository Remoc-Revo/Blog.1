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

exports.notifySubscriber = (email, name,articleExcerpt, articleId, articleHeadline,readTimeInMinutes,publisher)=>{
    console.log("publisher info", publisher);

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
                    font-family: "Open Sans", sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f6f6f6;
                }
            </style>
        </head>
        <body style="font-family: 'Open Sans', sans-serif; margin: 0; padding: 0; background-color: #f6f6f6;">
            <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div class="header" style="text-align: center; padding: 10px 0;">
                    <!-- Add any header content if necessary -->
                </div>
                <div class="content" style="margin: 20px 0;">
                    <h3>
                        ${name != null ? 'Hello ' + name + ',' : ''}
                    </h3>
                    <h2 style="font-size: 20px; color: #333333;">${decodeURIComponent(articleHeadline)}</h2>
                    <div class="d-flex" id="publisher-info" style="display: flex; margin-bottom: 20px; align-items: center;">
                        <div class="publisherPhotoContainer" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px; overflow: hidden;">
                            <img src="${publisher.photoUrl}" class="publisherPhoto" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        <div>
                            <b class="d-block black" style="display: block; color: black;">${publisher.firstName && publisher.firstName}  ${publisher.lastName && publisher.lastName}</b>
                            <span><i class="black" style="color: black;">${readTimeInMinutes} min read</i></span>
                        </div>
                    </div>
    
                    ${articleExcerpt}
                    <a href="${process.env.CLIENT_HOST}/sngl/${articleId}" class="cta-button" style="display: block; width: 200px; margin: 20px auto; padding: 10px 0; text-align: center; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">
                        <span class="cta-button-text" style="color: white;">Read the Full Article</span>
                    </a>
                </div>
                <div class="footer" style="text-align: center; font-size: 12px; color: #999999; margin-top: 20px;">
                    <p>Thank you for reading,</p>
                    <p>Dr. Liz</p>
                    <p>If you no longer wish to receive these emails, you can <a href="${process.env.CLIENT_HOST}/unsubscribe/${email}" style="color: #007BFF;">unsubscribe here</a>.</p>
                </div>
            </div>
        </body>
        </html>
     `;
  
     const mailOptions = {
     to: email,
     from: process.env.EMAIL_USER,
     subject: decodeURIComponent(articleHeadline),
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