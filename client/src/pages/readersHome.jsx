import React,{useState,useEffect,useRef,useCallback,useMemo} from "react";
import MainNav from "../navs/mainNav";
import { useLocation,useNavigate} from "react-router-dom";
import {GridItemSmall} from "../components/article_preview";
import moment from "moment"
import Footer from "../components/footer";
import parser from "html-react-parser";
// import { useQuery } from "react-query";
import api from "../config/api";
import getFirstImage from "../reusables/getImage";


export default  function ReadersHome({updateAdminPanelSection}){
    const [articles,setArticles]=useState([]);
    var cat=useLocation().search;
    const lastArticleRef = useRef(null);
    // const title=(cat==="")?"Latest":cat.split("=")[1].replaceAll('_',' ');
    const [initialFetch, setInitialFetch] = useState(true);
    const [fullyLoaded, setFullyLoaded] = useState(false);
    const navigate = useNavigate();
    
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
                    else if(response.data.articles.length > 0 //&& response.data.articles.length <5

                    ){
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

  
   //tracking routes when admin is using readers' view
   useEffect(()=>{
    function handlePopstate(){
        console.log('new reader location:',window.location.search, typeof updateAdminPanelSection)
        if(typeof updateAdminPanelSection !== undefined){
            updateAdminPanelSection(window.location.search);

        }

    }
    window.addEventListener('popstate',handlePopstate)

    return ()=>{
        window.removeEventListener('popstate',handlePopstate)
    }
   },[])


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
        <div className="">
            
            <div className="">
                <MainNav/>
                <div className="container-md d-lg-flex justify-content-center mb-4  mt-4">
                    <div className="col-lg-9 single-content">

                    
                    {
                    (articles.length>0)
                    ?<div className="position-relative">
                        <a href={`/sngl/${articles[0].articleId}`} style={{textDecoration:"none",color:"black"}} className="">

                            
                            <div className="rounded"  style={{width:"100%", height:"450px",overflow:"hidden"}}  > 
                                <img src={getFirstImage(articles[0].articleBody)} alt=""   
                                    className=" object-fit-cover"
                                    style={{display:"block",width:"100%",height:"100%"}} 
                                    >                            
                                </img>
                            </div>

                            
                            
                            
                            <div  className="latest-article-preview container-md bg-white ms-md-5 pb-3 rounded" 
                                style={{width:"420px"}}
                                >
                                <div className="row">
                                    <div className="col-auto bg-primary m-2 rounded">
                                        <h5 className="text-white pt-2">{decodeString(articles[0].sectionName)}</h5>
                                    </div>
                                </div>
                                <i className="duration">{moment(articles[0].articlePostingDate).fromNow()}</i>
                                <h5 className="articleHeadline">{decodeString(articles[0].articleHeadline)}</h5>
                                {/* <p className="briefDescription">{briefDescription}</p> */}
                            </div>
                        </a>
                    </div>
                        :<></>}

                        {/* Spacer */}
                    <div style={{height:"80px"}}></div>

                    <h4>Latest Posts</h4>
                    {/* Spacer */}
                    <div style={{height:"15px"}}></div>


                    <div className="row ">
                            
                            {
                                articles.map((article,index)=>{
                                if(index>0 && index < 12){
                                    return <GridItemSmall 
                                                articleSection={decodeString(article.sectionName)}
                                                headline={decodeString(article.articleHeadline)} 
                                                time={moment(article.articlePostingDate).fromNow()} 
                                                briefDescription={decodeString(article.articleBody)} 
                                                imgUrl={getFirstImage(article.articleBody)}
                                                articleId={article.articleId}
                                                handleClick = {()=>{navigate(`/sngl/${article.articleId}`)}}
                                                isFixed = {false}
                                            /> 
                                }
                                else{
                                    return null;
                                }
                            })
                                
                            
                            }
                        </div>  





                        
                    </div>
                {/* <div className="side-page" style={{width:"38%"}}></div> */}
            </div>

            </div>
            
            
            <Footer/>
        </div>
    )
}