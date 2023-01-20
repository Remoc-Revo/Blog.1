import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser"
import Footer from "../components/footer";


export default function Single(){
    var [news,setNews]=useState([]);
    const location=useLocation();
    const newsId=location.pathname.split('/')[2];

    useEffect(()=>{
        axios.get(`http://localhost:9000/news/${newsId}`)
             .then((response)=>{
                console.log("response::",response)
                setNews(response.data.news[0]) ;

            })
            .catch((err)=>{
                console.log("get single news error",err)
            });
                
    },[newsId])


    function decodeString(str){
        const htmlString= decodeURIComponent(str)
                    // .replace(/&apos;/g,"'")
                    // .replace(/<p>/g,"")
                    // .replace(/<\/p>/g,"")
                    // .replace(/<br>/,)

        return parse(htmlString);
    }

    return(
        <div>
            <MainNav/>
            
            <div className="container">
                {(news.length!==0)
                    ?<div className="container ">
                        <h2>{decodeString(news.headline)}</h2>
                        <img src={require(`../../public/uploads/${news.storage}`)} style={{display:"block",width:"100%",height:"500px"}}/>

                        <p className="mt-4 mb-4">{moment(news.postDatetime).fromNow()}</p>

                        <p>{decodeString(news.body)}</p>
                     </div>

                    :""

                }
                <p>
                    
                </p>
            </div>
               
            

            <Footer/>
        </div>
    )
}