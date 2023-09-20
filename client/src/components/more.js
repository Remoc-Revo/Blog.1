import React,{useState,useEffect} from "react";
import api from "../config/api";
import GetImage from "../reusables/getImage";

export default function More({cat,current}){
   var [more,set_more]=useState([]);

   useEffect(()=>{
      api.get(`/?cat=${cat}`,
         {withCredentials:true,
          params:{
            lastArticleId:0
          }
         })
      .then((response)=>{
         set_more(response.data.articles);
         console.log("article43",response.data)
      })
      .catch((err)=>{
         console.log(err);
      })
   },[cat])

   return(
      <div className="col-lg-3 mt-6 border ">
         <div className="row container ">
            <h5>More like this</h5>
         </div>

         <div className="container-lg">
           {
            more.map((article,index)=>{
               if(index <= 5 && article.articleId !== current){
                     return <SinglePreview headline={article.articleHeadline}  
                      imgUrl={article.multimediaUrl} articleId={article.articleId}/>                
                                               
               }
               else{
                  return <></>
               }
            })
            } 
         </div>
         
      </div>
   )
    

    
}


function SinglePreview({headline,imgUrl,articleId}){
   const [fetchedImgUrl,setFetchedImgUrl] = useState('');

   useEffect(()=>{
      async function fetchImage(){
            try{
               const url = await GetImage(imgUrl);
               setFetchedImgUrl(url)
               console.log("urlllll",url)

            }catch(err){
               console.log('error fetching image',err);
            }
      }

      fetchImage();
   },[imgUrl])

   return <a href={`/sngl/${articleId}`} className=" d-flex d-lg-block text-decoration-none row-xs mb-3 gap-3">
                              <div className="col-4 col-sm-4  col-lg-12 container-xs">
                                 <img src={fetchedImgUrl} alt="" className=" w-100 "/>

                              </div>
                                 
                              <p className="" style={{fontSize:"13px"}}>{decodeURIComponent(headline).replace(/&apos;/g,"'")}</p>

         </a>


}

