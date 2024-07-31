

import React from "react";



export default function EmailTest(){
   const publisher = {
       firstName: 'Loremm',
       lastName: 'Ipseum',
       photoUrl: 'https://res.cloudinary.com/dkhcv34eg/image/upload/v1721232138/fwox2ltztxytjevwcfsq.jpg'
     }
   const name = "Ng'uono"
   const email = "timothynguono@gmail.com"
   const articleHeadline= 'Consectetur%20adipiscing%20elit%2C%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20'
   const articleExcerpt = '<div id="previewImageContainer">\n' +
   '                                <img src="https://res.cloudinary.com/dkhcv34eg/image/upload/v1720946888/a2ygjrhq6y1sw1umrkps.jpg" alt="" id="previewPhoto"/>\n' +
   '                            </div>    \n' +
   '                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
   const readTimeInMinutes = 23;
   const articleId = 12;




   const htmlString = `<!DOCTYPE html>
       <html>
       <head>
           <style>
               body {
                   font-family: "Open Sans", sans-serif;
                   margin: 0;
                   padding: 0;
                   background-color: #f6f6f6;
               }
               .container {
                   max-width: 600px;
                   margin: 0 auto;
                   background-color: #ffffff;
                   padding: 10px;
                   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
               }
               .header {
                   text-align: center;
                   padding: 10px 0;
               }
               .header h1 {
                   margin: 0;
                   font-size: 24px;
                   color: #333333;
               }
               .d-flex{
                   display: flex;                    
               }
               .d-block{
                   display: block;
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
               .cta-button-text{
                   color: white;
               }
               #previewImageContainer{
                   width: 100%;
                   height: 300px;
               }
               #previewPhoto{
                   width:100%;
                   height:100%;
                   object-fit: cover;
               }
               .publisherPhotoContainer{
                   width: 50px;
                   height: 50px;
                   border-radius: 50%;
                   margin-right: 10px;
                   overflow: hidden;
               }
               .publisherPhoto{
                   width: 100%;
                   height: 100%;
                   object-fit: cover;                   
               }
               #publisher-info{
                   margin-bottom: 20px;
                   align-items: center;
                   ;
               }
               .footer {
                   text-align: center;
                   font-size: 12px;
                   color: #999999;
                   margin-top: 20px;
               }
               .black{
               }
               color: black
           </style>
       </head>
       <body>
           <div class="container">
               <div class="header">
                   
               </div>
               <div class="content">
                   
                   <h3>
                       ${name != null ? 'Hello ' + name + ',' : ''}
                   </h3>
                   <h2>${decodeURIComponent(articleHeadline)}</h2>
                   <div class="d-flex" id="publisher-info">
                       <div class="publisherPhotoContainer">
                           <img src="${publisher.photoUrl}"  class="publisherPhoto"/>
                       </div>
                       <div>
                           <b class="d-block black">${publisher.firstName && publisher.firstName}  ${publisher.lastName && publisher.lastName}</b>
                           <span><i class="black"> ${readTimeInMinutes} min read</i></span>
                       </div>
                   </div>
                   ${articleExcerpt}
                   <a href="${process.env.CLIENT_HOST}/sngl/${articleId}" class="cta-button"><span class="cta-button-text">Read the Full Article</span></a>
                   

               </div>
               <div class="footer">
                   <p>Thank you for reading,</p>
                   <p>Dr. Liz</p>
                   <p>If you no longer wish to receive these emails, you can <a href="${process.env.CLIENT_HOST}/unsubscribe/${email}">unsubscribe here</a>.</p>
               </div>
           </div>
       </body>
       </html>
       `

    return <div dangerouslySetInnerHTML={{__html: htmlString}}>
       
    </div>
}