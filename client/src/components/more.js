import React,{useState,useEffect} from "react";
import axios from "axios";


export default function More({cat,current}){
   var [more,set_more]=useState([]);

   useEffect(()=>{
      axios.get(`http://localhost:9000/news/?cat=${cat}`,{withCredentials:true})
      .then((response)=>{
         set_more(response.data.news);
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
               if(index <= 5 && article.newsId !== current){
                  return <a href={`/news/${article.newsId}`} className=" d-flex d-lg-block text-decoration-none row-xs mb-3 gap-3">
                              <div className="col-4 col-sm-4  col-lg-12 container-xs">
                                 <img src={require(`../../public/uploads/${article.storage}`)} className=" w-100 "/>

                              </div>
                                 
                              <p className="text-success " style={{fontSize:"13px"}}>{decodeURIComponent(article.headline).replace(/&apos;/g,"'")}</p>

                        </a>
                           
                           
                        
               }
            })
            } 
         </div>
         
      </div>
   )
    

    
}