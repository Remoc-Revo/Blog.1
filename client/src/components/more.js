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
      <div className="col-md-3 mt-6 border">
         <div className="row container">
            <h5>More like this</h5>
         </div>

         <div className="container">
           {
            more.map((article,index)=>{
               if(index <= 5 && article.newsId !== current){
                  return <a href={`/news/${article.newsId}`} className="row text-decoration-none m-0">
                              <img src={require(`../../public/uploads/${article.storage}`)} className="w-100"/>
                              <p className="text-success" style={{fontSize:"13px"}}>{decodeURIComponent(article.headline).replace(/&apos;/g,"'")}</p>
                        </a>
                           
                           
                        
               }
            })
            } 
         </div>
         
      </div>
   )
    

    
}