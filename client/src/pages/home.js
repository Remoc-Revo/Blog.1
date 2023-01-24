import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/news_preview";
import moment from "moment"
import Footer from "../components/footer";

export default  function Home(){
    const navigate=useNavigate();
    const [news,setNews]=useState([]);
    var cat=/*(useLocation().search==="")?"/latest":*/useLocation().search;
    console.log("cat",cat)

    const title=(cat==="/latest")?"Latest":cat.split(":")[1];

    useEffect(()=>{
        setNews([]);
        function fetchNews(){
            axios.get(`http://localhost:9000/news${cat}`,{withCredentials:true})
               .then((response)=>{
                   setNews(response.data.news)
                   console.log('newss,',news)
               })
               .catch((err)=>{
                   console.log("the err",err);
               })
       }
       fetchNews()
    },[cat])
     

    // for(var i=0;i<34;i++){
    //     news.push({
    //         headline:"The way we gooo is that, the president claims",
    //         time:`${new Date().getSeconds()} days ago`,
    //         briefDescription:"Those things are going to be done. No matter whaat the opposition says... "
    //     })
    // }

    function decodeString(str){
        return decodeURIComponent(str).replace(/&apos;/g,"'").replace(/<p>/g,"").replace(/<\/p>/g,"")
    }
    
    return(
        <div className="full-page ">
            <MainNav/>
            
                <div className="container d-flex mb-4">
                    <div className="container single-content">

                        <h1>{title}</h1>

                        {/*preview of news at the top of the page,
                        its image is the biggest
                        */}     
                        <div className="preview-big">
                            {(news.length!==0)
                                ?<PreviewBig headline={decodeString(news[0].headline)} time={moment(news[0].postDatetime).fromNow()} 
                                             briefDescription={decodeString(news[0].body)} imgUrl={news[0].storage} newsId={news[0].newsId}/>
                                :<span></span>
                            }
                        </div>                   
                        

                        {/* There being only two news articles */}
                        {(news.length===2)
                            ?<PreviewSmall headline={decodeString(news[1].headline)} time={moment(news[1].postDatetime).fromNow()} 
                                           briefDescription={decodeString(news[1].body)} imgUrl={news[1].storage} newsId={news[1].newsId}/>
                            :<span></span>
                        }

                        {(news.length>2)
                            ?<div className="row preview-mid-container">
                                <PreviewMid headline={decodeString(news[1].headline)} time={moment(news[1].postDatetime).fromNow()}
                                            briefDescription={decodeString(news[1].body)} imgUrl={news[1].storage} newsId={news[1].newsId}/>
                                <PreviewMid headline={decodeString(news[2].headline)} time={moment(news[2].postDatetime).fromNow()}
                                            briefDescription={decodeString(news[2].body)} imgUrl={news[2].storage} newsId={news[2].newsId}/>
                            </div> 
                            :<span></span>
                        }
                        
                        
                        {(news.length>3)
                            ?<div className="preview-small-container mt-4">
                                {
                                    news.map((article,index)=>{
                                        if(index>2){
                                            return <div className="container">
                                                    <PreviewSmall headline={decodeString(article.headline)} time={moment(article.postDatetime).fromNow()} 
                                                                  briefDescription={decodeString(article.body)} imgUrl={article.storage} newsId={article.newsId}/>
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

            
            <Footer/>
        </div>
    )
}