import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/news_preview";
import moment from "moment"

export default  function Home(){
    const navigate=useNavigate();
    const [news,setNews]=useState([]);

    useEffect(()=>{
        function fetchNews(){
            axios.get("http://localhost:9000/latest",{withCredentials:true})
               .then((response)=>{
                   setNews(response.data.news)
                   console.log('newss,',response.data.news)
               })
               .catch((err)=>{
                   console.log("the err",err);
               })
       }
       fetchNews()
    },[])
     

    // for(var i=0;i<34;i++){
    //     news.push({
    //         headline:"The way we gooo is that, the president claims",
    //         time:`${new Date().getSeconds()} days ago`,
    //         briefDescription:"Those things are going to be done. No matter whaat the opposition says... "
    //     })
    // }
    
    return(
        <div className="full-page">
            <MainNav/>
            
                <div className="container d-flex ">
                    <div className="container single-content">

                        <h1>Latest</h1>

                        {/*preview of news at the top of the page,
                        its image is the biggest
                        */}     
                        <div className="preview-big">
                            {(news.length!==0)
                                ?<PreviewBig headline={news[0].headline} time={moment(news[0].postDatetime).fromNow()} briefDescription={news[0].body} imgUrl={news[0].storage} />
                                :<span></span>
                            }
                        </div>                   
                        

                        {/* There being only two news articles */}
                        {(news.length===2)
                            ?<PreviewSmall headline={news[1].headline} time={moment(news[1].postDatetime).fromNow()} briefDescription={news[1].body} imgUrl={news[1].storage}/>
                            :<span></span>
                        }

                        {(news.length>2)
                            ?<div className="row preview-mid-container">
                                <PreviewMid headline={news[1].headline} time={moment(news[1].postDatetime).fromNow()} briefDescription={news[1].body} imgUrl={news[1].storage}/>
                                <PreviewMid headline={news[2].headline} time={moment(news[2].postDatetime).fromNow()} briefDescription={news[1].body} imgUrl={news[2].storage}/>
                            </div> 
                            :<span></span>
                        }
                        
                        
                        {(news.length>3)
                            ?<div className="preview-small-container mt-4">
                                {
                                    news.map((article,index)=>{
                                        if(index>2){
                                            return <div className="container">
                                                    <PreviewSmall headline={article.headline} time={moment(article.postDatetime).fromNow()} briefDescription={article.body} imgUrl={article.storage}/>
                                                    <hr/>
                                                </div>
                                        }
                                    })
                                }
                            </div> 
                            :<span></span>
                        }
                    </div>
                <div className="side-page" style={{width:"35%"}}></div>
            </div>

            

        </div>
    )
}