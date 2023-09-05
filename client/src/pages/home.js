import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/article_preview";
import moment from "moment"
import Footer from "../components/footer";
import parser from "html-react-parser";
import { useQuery } from "react-query";

export default  function Home(){
    const navigate=useNavigate();
    const [article,setArticles]=useState([]);
    var cat=/*(useLocation().search==="")?"/latest":*/useLocation().search;
    console.log("cat",cat)

    const title=(cat==="")?"Latest":cat.split("=")[1];

    function fetchArticles(){
        axios.get(`http://localhost:9000/${cat}`,{withCredentials:true})
           .then((response)=>{
               return response.data.articles.json();
           })
           .catch((err)=>{
               console.log("the err",err);
           })
   }

//    const {data,}

    useEffect(()=>{
        setArticles([]);
        function fetchArticles(){
            axios.get(`http://localhost:9000/${cat}`,{withCredentials:true})
               .then((response)=>{
                   setArticles(response.data.articles)
                   console.log('articles,',response.data.articles)
               })
               .catch((err)=>{
                   console.log("the err",err);
               })
       }
       fetchArticles()
    },[cat])
     

    // for(var i=0;i<34;i++){
    //     article.push({
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

                        {/*preview of article at the top of the page,
                        its image is the biggest
                        */}     
                        <div className="preview-big">
                            {(article.length!==0)
                                ?<PreviewBig headline={decodeString(article[0].articleHeadline)} time={moment(article[0].articlePostingDate).fromNow()} 
                                             briefDescription={decodeString(article[0].articleBody)} imgUrl={article[0].multimediaUrl} articleId={article[0].articleId}/>
                                :<span></span>
                            }
                        </div>                   
                        

                        {/* There being only two article articles */}
                        {(article.length===2)
                            ?<PreviewSmall headline={decodeString(article[1].articleHeadline)} time={moment(article[1].articlePostingDate).fromNow()} 
                                           briefDescription={decodeString(article[1].articleBody)} imgUrl={article[1].multimediaUrl} articleId={article[1].articleId}/>
                            :<span></span>
                        }

                        {(article.length>2)
                            ?<div className="row preview-mid-container " style={{margin:"0px"}}>
                                <PreviewMid headline={decodeString(article[1].articleHeadline)} time={moment(article[1].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(article[1].articleBody)} imgUrl={article[1].multimediaUrl} articleId={article[1].articleId}/>
                                <PreviewMid headline={decodeString(article[2].articleHeadline)} time={moment(article[2].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(article[2].articleBody)} imgUrl={article[2].multimediaUrl} articleId={article[2].articleId}/>
                            </div> 
                            :<span></span>
                        }
                        
                        
                        {(article.length>3)
                            ?<div className="preview-small-container mt-4">
                                {
                                    article.map((article,index)=>{
                                        if(index>2){
                                            return <div className="container">
                                                    <PreviewSmall headline={decodeString(article.articleHeadline)} time={moment(article.articlePostingDate).fromNow()} 
                                                                  briefDescription={decodeString(article.articleBody)} imgUrl={article.multimediaUrl} articleId={article.articleId}/>
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