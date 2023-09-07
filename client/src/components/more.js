import React,{useState,useEffect} from "react";
import axios from "axios";


export default function More({cat,current}){
   var [more,set_more]=useState([]);

   useEffect(()=>{
      axios.get(`http://localhost:9000/?cat=${cat}`,
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
   },[])

   return(
      <div className="col-lg-3 mt-6 border ">
         <div className="row container ">
            <h5>More like this</h5>
         </div>

         <div className="container-lg">
           {
            more.map((article,index)=>{
               if(index <= 5 && article.articleId !== current){
                  return <a href={`/sngl/${article.articleId}`} className=" d-flex d-lg-block text-decoration-none row-xs mb-3 gap-3">
                              <div className="col-4 col-sm-4  col-lg-12 container-xs">
                                 <img src={require(`../../public/uploads/${article.multimediaUrl}`)} className=" w-100 "/>

                              </div>
                                 
                              <p className="text-success " style={{fontSize:"13px"}}>{decodeURIComponent(article.articleHeadline).replace(/&apos;/g,"'")}</p>

                        </a>
                           
                           
                        
               }
            })
            } 
         </div>
         
      </div>
   )
    

    
}