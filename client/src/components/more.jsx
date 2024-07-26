import React,{useState,useEffect} from "react";
import api from "../config/api";
import getFirstImage from "../reusables/getImage";

export default function Related({cat,current}){
   var [more,set_more]=useState([]);

   useEffect(()=>{
      api.get(`/related?cat=${cat}`,
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
      <>
         {more.length>0
           &&<div className=" mt-5 "
               style={{borderTop:"1px solid lightgrey"}}
               >
               <div className="row container pt-2 ">
                  <h6>Related</h6>
               </div>

               <div className="d-md-flex " >
               {
                  more.map((article,index)=>{
                     if(index <= 5 && article.articleId !== current){
                           return <RelatedPreview headline={article.articleHeadline}  
                              imgUrl={getFirstImage(article.articleBody)} 
                              articleId={article.articleId}
                              datePosted = {article.articlePostingDate}
                              />                
                                                   
                     }
                     else{
                        return <></>
                     }
                  })
                  } 
               </div>
            
         </div>
         }
      </>
   )
    

    
}


function RelatedPreview({headline,imgUrl,articleId,datePosted}){
   const date = new Date(datePosted);
   const dateStr =   new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(date);

   return <a href={`/sngl/${articleId}`} 
            className="col-md-4 col-sm-12 d-flex flex-md-column text-decoration-none row-xs mb-3 gap-2 p-2">
            <div className="container-xs col-5 col-md-12"
               style={{height:"150px"}}
               >
                  <img src={imgUrl} alt="" className="object-fit-cover rounded" 
                        style={{height:"100%",width:"100%"}}
                  />

            </div>

             <div>
               <h6 className="fw-lighter" style={{fontSize:"14px",color:"grey"}}>{dateStr}</h6>
               <h6 className="fw-lighter" style={{fontSize:"14px",color:"black"}}>
                  {decodeURIComponent(headline).replace(/&apos;/g,"'")}
               </h6>
            </div>  
            

         </a>


}

