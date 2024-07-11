// import axios from 'axios';

export default function fetchImage(imgUrl){
    return new Promise((resolve,reject)=>{
    
        // axios
        //     .get(imgUrl,{withCredentials:true})
        //     .then((response)=>{
        //         resolve(response.config.url);
        //     })
        //     .catch((err)=>{
        //         console.log('Error fetching image from s3',err);
        //         reject(err);
        //     })
        const baseUrlPattern = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;
        const match = imgUrl.match(baseUrlPattern);

        if(!match){
            resolve(null);
        }
        const baseUrl = match[1];
        const imagePath = match[2];
        const transformation = 'w_400,h_300,q_10/';
        const transformedUrl = `${baseUrl}${transformation}${imagePath}`;

        resolve(transformedUrl);
    })
    
}