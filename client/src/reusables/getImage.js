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

        resolve(imgUrl);
    })
    
}