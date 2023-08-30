import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/news_preview";
import moment from "moment"
import Footer from "../components/footer";
import parser from "html-react-parser";

export default  function Home(){
    const navigate=useNavigate();
    const [news,setNews]=useState([]);
    var cat=/*(useLocation().search==="")?"/latest":*/useLocation().search;
    console.log("cat",cat)

    const title=(cat==="")?"Latest":cat.split("=")[1];

    useEffect(()=>{
        setNews([]);
        function fetchNews(){
            axios.get(`http://localhost:9000/${cat}`,{withCredentials:true})
               .then((response)=>{
                   setNews(response.data.articles)
                   console.log('newss,',response.data.articles)
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
        return parser(decodeURIComponent(str).replace(/&apos;/g,"'").replace(/<p>/g,"").replace(/<\/p>/g,""))
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
                                ?<PreviewBig headline={decodeString(news[0].articleHeadline)} time={moment(news[0].articlePostingDate).fromNow()} 
                                             briefDescription={decodeString(news[0].articleBody)} imgUrl={news[0].multimediaUrl} newsId={news[0].articleId}/>
                                :<span></span>
                            }
                        </div>                   
                        

                        {/* There being only two news articles */}
                        {(news.length===2)
                            ?<PreviewSmall headline={decodeString(news[1].articleHeadline)} time={moment(news[1].articlePostingDate).fromNow()} 
                                           briefDescription={decodeString(news[1].articleBody)} imgUrl={news[1].multimediaUrl} newsId={news[1].articleId}/>
                            :<span></span>
                        }

                        {(news.length>2)
                            ?<div className="row preview-mid-container " style={{margin:"0px"}}>
                                <PreviewMid headline={decodeString(news[1].articleHeadline)} time={moment(news[1].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(news[1].articleBody)} imgUrl={news[1].multimediaUrl} newsId={news[1].articleId}/>
                                <PreviewMid headline={decodeString(news[2].articleHeadline)} time={moment(news[2].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(news[2].articleBody)} imgUrl={news[2].multimediaUrl} newsId={news[2].articleId}/>
                            </div> 
                            :<span></span>
                        }
                        
                        
                        {(news.length>3)
                            ?<div className="preview-small-container mt-4">
                                {
                                    news.map((article,index)=>{
                                        if(index>2){
                                            return <div className="container">
                                                    <PreviewSmall headline={decodeString(article.articleHeadline)} time={moment(article.articlePostingDate).fromNow()} 
                                                                  briefDescription={decodeString(article.articleBody)} imgUrl={article.multimediaUrl} newsId={article.articleId}/>
                                                    <hr/>
                                                </div>
                                        }
                                    })
                                }
                            </div> 
                            :<span></span>
                        }
                    </div>
                <div className="side-page" style={{width:"5%"}}></div>
            </div>

            
            <Footer/>
        </div>
    )
}