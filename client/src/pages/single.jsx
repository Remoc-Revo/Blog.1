import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import api from "../config/api";
import { useLocation, useNavigate} from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser"
import Footer from "../components/footer";
import More from "../components/more";
import s3GetImage from "../reusables/getImage";
import { useUserContext } from "../userContext";
import Delete from "../img/delete.png";
import Edit from "../img/edit.png";
import { logVisitor } from "../reusables/global";
import draftToHtml from 'draftjs-to-html';

import Comments from "../components/comments";

export default function Single(){
    var [article,setArticle]=useState([]);
    const [articleBody, setArticleBody] = useState('');
    const location=useLocation();
    const navigate = useNavigate();
    const articleId=location.pathname.split('/')[2];
    const [fetchedImgUrl,setFetchedImgUrl] = useState('');
    const {user} = useUserContext();
    const [deleting, setDeleting] = useState(false);


    async function fetchImage(imgUrl){
        try{
           const url = await s3GetImage(imgUrl);
           setFetchedImgUrl(url)
           console.log("urlllll",url)

        }catch(err){
           console.log('error fetching image',err);
        }
  }


    useEffect(()=>{
        api.get(`/single/${articleId}`)
             .then((response)=>{
                console.log("response of single  req::",response)
                setArticle(response.data.article[0]) ;
                
                const fetchedArticleBody = response.data.article[0].articleBody;
                const parsedArticleBody = JSON.parse(fetchedArticleBody);
                
                const htmlArticleBody = draftToHtml(parsedArticleBody);

                setArticleBody(htmlArticleBody);

                fetchImage(article.multimediaUrl);
            })
            .catch((err)=>{
                console.log("get single article error",err)
            });

         
    },[articleId,article.multimediaUrl])


    useEffect(()=>{
        logVisitor(`/single/${articleId}`);
       },[])


    function decodeString(str){
        const htmlString= decodeURIComponent(str)
                    // .replace(/&apos;/g,"'")
                    // .replace(/<p>/g,"")
                    // .replace(/<\/p>/g,"")
                    // .replace(/<br>/,)

        return parse(htmlString);
    }

    function navigateToUpdate(){
        try{
    
            navigate(`/articlePosting/${article.articleId}`);
                    
        }
        catch(err){
            console.log("navigateToUpdate error:", err)
        }
       
    }

    function deleteArticle(){

        if(window.confirm(`Are you sure you want to delete the article: '${decodeString(article.articleHeadline)}' ?`)){
            setDeleting(true);

            api.delete(`/article/${article.articleId}`,
                {withCredentials:true,
                imgUrl: article.multimediaUrl
            })
            .then((response)=>{
                    if(response.status === 200){
                        setDeleting(false);
                        navigate('/')
                    }
            })
            .catch((err)=>{
                    if(err.response && err.response.status === 401){
                        setDeleting(false);
                        navigate('/login');
                    }
            })

        }
        
    }    

    return(
        <div className="full-page">
            <MainNav/>
            
            
            {(article.length!==0)
                ?<div className=" mt-2 ">
                    <div className="">
                        
                        <div className="d-lg-flex container-lg mt-2 justify-content-center gap-3">
                            <div className="col-lg-8 p-0">

                                <div className="">
                            
                                    <h2 className="text-center headline">{decodeString(article.articleHeadline)}</h2>
                                </div>
                                <div className="pt-3 pb-2 mb-2  d-flex justify-content-between align-items-center">
                                    
                                    <div className=" d-flex gap-3 align-items-center">
                                        <img src={require("../img/author_placeholder.jpeg") }
                                            className="rounded-circle"
                                            style={{width:"40px",height:"40px"}}
                                            alt=""
                                        />
                                        <p style={{color:"teal",fontWeight:"bold"}}>Dr. Lorem</p>
                                        <p className="fw-lighter">                                           
                                            {(article.articleUpdatingDate !== null)
                                                ? "Updated  "+moment(article.articleUpdatingDate).fromNow() 
                                                :  `Published ${moment(article.articlePostingDate).fromNow()} `
                                                
                                            } 
                                
                                        </p>
                                    </div>    
                                    
                                    {(user !== null && user.userLevel === 1)
                                        ? <div className="d-flex gap-2">
                                            <img src={Edit} alt ="" onClick={navigateToUpdate} className="edit-img"/>
                                            {(deleting)
                                                ?<div className="spinner-border text-light">
                                                    <span className="sr-only">Loading</span>
                                                </div>
                                                :<img src={Delete} alt ="" onClick={deleteArticle} className="delete-img"/>
                                            }
                                            </div>
                                        : <></>
                                    }
                                    
                                </div>

                                {/* <div className="w-100" style={{height:"430px",overflow:"hidden"}}>
                                    {
                                    
                                        (fetchedImgUrl!=='null')
                                            ?<img src={fetchedImgUrl} alt="article img"
                                            className="rounded object-fit-cover img-fluid"
                                            style={{display:"block",width:"100%",height:"100%"}}/>
                                            :null
                                    }
                                </div> */}
 
                                <div className="container-lg p-0" id="single-article-body">              
                                    <div 
                                        dangerouslySetInnerHTML={{__html:articleBody}}
                                        className="mt-4" >                                      
                                    </div>
                                </div>

                            </div>
                            
                            
                            {/* <More cat={article.sectionName} current={article.articleId} /> */}
                        </div>

                    </div>
                   
                </div>
                :""

            }
           
            <Comments articleId={article.articleId}/>
            
           
            
            <Footer/>
        </div>
    )
}