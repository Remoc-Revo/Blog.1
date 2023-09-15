import AWS from '../config/aws';

export default function s3GetImage(key){
    return new Promise((resolve,reject)=>{
        const s3 = new AWS.S3();

        const params = {
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: key
        }
    
        s3.getSignedUrl('getObject',params,(err,url)=>{
            if(err){
                console.log('Error fetching image from s3',err);
                reject(err);
            }
            else{
                console.log("thee data:",url);
                resolve(url);
            }
        })
    })
    
}