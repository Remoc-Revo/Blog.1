import React,{useState,useEffect,useRef,useCallback,useMemo} from "react";
import MainNav from "../navs/mainNav";
import { useLocation } from "react-router-dom";
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/article_preview";
import moment from "moment"
import Footer from "../components/footer";
import parser from "html-react-parser";
// import { useQuery } from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools';
import api from "../config/api";

export default  function Home(){
    const [articles,setArticles]=useState([]);
    var cat=/*(useLocation().search==="")?"/latest":*/useLocation().search;
    const lastArticleRef = useRef(null);
    // const title=(cat==="")?"Latest":cat.split("=")[1].replaceAll('_',' ');
    const [initialFetch, setInitialFetch] = useState(true);
    const [fullyLoaded, setFullyLoaded] = useState(false);

    
    const  fetchArticles = useCallback((lastArticleId)=>{
        console.log("the lasssst",lastArticleId)

        if(lastArticleId != null){
            api.get(`/${cat}`,
                {withCredentials:true,
                params:{
                    lastArticleId:lastArticleId
                }
                })
                .then((response)=>{
                    console.log("articles response",response.data.articles)
                    if(response.data.articles.length === 0){
                        setFullyLoaded(true);
                    }
                    else if(response.data.articles.length > 0 && response.data.articles.length <5){
                        setArticles((prevArticles)=>[...prevArticles,...response.data.articles])
                        setFullyLoaded(true);
                    }
                    else {
                        setArticles((prevArticles)=>[...prevArticles,...response.data.articles])
                    }
                })
                .catch((err)=>{
                    console.log("Encountered Error when fetching articles",err);
                })
        //    .catch((err)=>{
        //        console.log("the err",err);
        //        throw err;
        //    })
        }
   },[cat]);


//    if(isLoading){
//     return <div>Loading...</div>;
//    }

//    if(isError){
//     return <div>Error: {error.message}</div>;
//    }

//    if(articles){
//     console.log("deeee articulddddd",articles)

//    }

    function decodeString(str){
        return parser(decodeURIComponent(str).replace(/&apos;/g,"'").replace(/<p>/g,"").replace(/<\/p>/g,""))
    }

    if(initialFetch){
        fetchArticles(0);
        setInitialFetch(false);
    }

    //disabling eslint from insisting on non-empty dependency array
    //eslint-disable-next-line 
    const options=useMemo(()=>({
        root:null,
        rootMargin: "0px",
        threshold : 0.1,
    }));


    useEffect(()=>{


        const observerCallback = (entries)=>{
            if(entries[0].isIntersecting){
                const lastArticleId = entries[0].target.getAttribute('id');
                console.log("uwwwwwwwwwwdwwwaadaaaaasd::",lastArticleId)
                if(!fullyLoaded){
                    fetchArticles(lastArticleId)
                }
            }
        };
        
        const observer = new IntersectionObserver(observerCallback,options);
        const lastArticleRefCurrent = lastArticleRef.current;

        if(lastArticleRefCurrent){
            observer.observe(lastArticleRefCurrent);
        }

        return ()=>{
            if(lastArticleRefCurrent){
                observer.unobserve(lastArticleRefCurrent);
            }
        }
    },[lastArticleRef,fetchArticles,fullyLoaded,options])
    
    return(
        <div className="full-page">
            <MainNav/>
                <ReactQueryDevtools/>
                <div className="container d-md-flex mb-4 ps-5">
                    <div className="container single-content">

                        {/* <h1>{title}</h1> */}

                        {/*preview of article at the top of the page,
                        its image is the biggest
                        */}     
                        <div className="preview-big">
                            {(articles.length!==0)
                                ?<PreviewBig headline={decodeString(articles[0].articleHeadline)} time={moment(articles[0].articlePostingDate).fromNow()} 
                                             briefDescription={decodeString(articles[0].articleBody)} imgUrl={articles[0].multimediaUrl} articleId={articles[0].articleId}/>
                                :<span></span>
                            }
                        </div>                   
                        

                        {/* There being only two articles */}
                        {(articles.length===2)
                            ?<PreviewSmall headline={decodeString(articles[1].articleHeadline)} time={moment(articles[1].articlePostingDate).fromNow()} 
                                           briefDescription={decodeString(articles[1].articleBody)} imgUrl={articles[1].multimediaUrl} articleId={articles[1].articleId}/>
                            :<span></span>
                        }

                        {(articles.length>2)
                            ?<div className="row preview-mid-container " style={{margin:"0px"}}>
                                <PreviewMid headline={decodeString(articles[1].articleHeadline)} time={moment(articles[1].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(articles[1].articleBody)} imgUrl={articles[1].multimediaUrl} articleId={articles[1].articleId}/>
                                <PreviewMid headline={decodeString(articles[2].articleHeadline)} time={moment(articles[2].articlePostingDate).fromNow()}
                                            briefDescription={decodeString(articles[2].articleBody)} imgUrl={articles[2].multimediaUrl} articleId={articles[2].articleId}/>
                            </div> 
                            :<span></span>
                        }
                        
                        
                        {(articles.length>3)
                            ?<div className="preview-small-container mt-4">
                                {
                                    articles.map((article,index)=>{
                                        if(index === articles.length-1 && index >=4){
                                            return <div className="container" ref={lastArticleRef} id={article.articleId} key={article.articleId}>
                                                    <PreviewSmall headline={decodeString(article.articleHeadline)} time={moment(article.articlePostingDate).fromNow()} 
                                                                briefDescription={decodeString(article.articleBody)} imgUrl={article.multimediaUrl} articleId={article.articleId}
                                                                />
                                                    <hr/>
                                                </div>
                                        }
                                        else if(index>2){
                                            return <div className="container" key={article.articleId}>
                                                    <PreviewSmall headline={decodeString(article.articleHeadline)} time={moment(article.articlePostingDate).fromNow()} 
                                                                  briefDescription={decodeString(article.articleBody)} imgUrl={article.multimediaUrl} articleId={article.articleId}/>
                                                    <hr/>
                                                </div>
                                        }
                                        else{
                                            return <></>
                                        }
                                    })
                                }
                            </div> 
                            :<span></span>
                        }
                    </div>
                {/* <div className="side-page" style={{width:"38%"}}></div> */}
            </div>

            
            <Footer/>
        </div>
    )
}