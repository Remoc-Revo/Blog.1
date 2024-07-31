
 export default function getFirstImage(stringifiedContentState){
     console.log("typeof stringifiedContentState",typeof stringifiedContentState ,stringifiedContentState)
     // Parse the JSON string back into an object
     let contentState = JSON.parse(stringifiedContentState);
 
     console.log("typeof contentState 3",typeof contentState ,contentState)
 
 
     // Check if the entityMap exists and has entities
     if (contentState.entityMap) {
         for (let key in contentState.entityMap) {
             const entity = contentState.entityMap[key];
 
             console.log("Entity type:", entity.type);
 
             // Check if the entity type is 'IMAGE'
             if (entity.type === 'IMAGE') {
                 console.log("found image: ",entity.data.src)
                 // Return the transformed src of the first image entity
 
                 return transformImage(entity.data.src);
             }
         }
     }
 
     // If no image entity is found, return null or an appropriate value
     return null;   
         
         
     
 }
 
 
 export function transformImage(imgUrl){
     const baseUrlPattern = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;
     const match = imgUrl.match(baseUrlPattern);
 
     if(!match){
         return null;
     }
     const baseUrl = match[1];
     const imagePath = match[2];
     const transformation ='w_800,q_70/'// 'w_800,h_500,q_70/';
     const transformedUrl = `${baseUrl}${transformation}${imagePath}`;
 
     console.log("transformed image: ",transformedUrl)
 
     return transformedUrl;
 
 }