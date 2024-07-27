import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import api from "../config/api";
import { useLocation, useNavigate} from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser"
import Footer from "../components/footer";
import Related from "../components/more";
import { useUserContext } from "../userContext";
import Delete from "../img/delete.png";
import Edit from "../img/edit.png";
import { logVisitor } from "../reusables/global";
import draftToHtml from 'draftjs-to-html';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import Comments from "../components/comments";

export default function Single(){
    var [article,setArticle]=useState([]);
    const [articleBody, setArticleBody] = useState('');
    const location=useLocation();
    const navigate = useNavigate();
    const articleId=location.pathname.split('/')[2];
    const {user} = useUserContext();
    const [deleting, setDeleting] = useState(false);
    const [likes,setLikes] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const scrollToId =  queryParams.get('scrollTo');

   


    useEffect(()=>{
        api.get(`/single/${articleId}`)
             .then((response)=>{
                console.log("response of single  req::",response)
                setArticle(response.data.article[0]) ;
                
                const fetchedArticleBody = response.data.article[0].articleBody;
                const parsedArticleBody = JSON.parse(fetchedArticleBody);
                
                const htmlArticleBody = draftToHtml(parsedArticleBody);

                setArticleBody(htmlArticleBody);
                setLikes(response.data.likes)

            })
            .catch((err)=>{
                console.log("get single article error",err)
            });

         
    },[articleId,article.multimediaUrl])


    useEffect(()=>{
        logVisitor(`/single/${articleId}`);
       },[articleId])

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(scrollToId){
                const element = document.getElementById(scrollToId);
                if(element){
                    element.scrollIntoView({behavior:'smooth'});
                }
            }
        }, 1000)

        return () => clearTimeout(timer)
        
    },[scrollToId])

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
    
    
    function like(){
        if(user !==null  && user.userId)
        {    api.post('/like',{articleId : articleId,commentId: null})
                .then((response)=>{
                    setLikes(response.data.updatedLikes)
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
        else{
            window.alert(`You need to login first to respond to this post`);
        }
    }

    const hasLiked = ()=>{
        for(let like of likes){
            if(user !== null && user.userId === like.userId){
                return true;
            }
        }
        return false;
    }


    return(
        <div className="">
            <MainNav/>
            
            
            {(article.length!==0)
                ?<div className="mt-3 ">
                    <div className="container p-3 p-sm-0">
                        
                        <div className="d-lg-flex justify-content-center gap-3">
                            <div className="col-12 col-lg-9  p-0">
                                <div className="col-xl-9 mt-3">
                                    <h2 className="text-center headline">{decodeString(article.articleHeadline)}</h2>
                                    <div className="pt-2 pb-2 mb-2  d-flex justify-content-between align-items-center">
                                        
                                        <div className=" d-flex gap-3 align-items-end">
                                            {
                                                article.publisherPhotoUrl !== null
                                                ?<div style={{width:"50px",height:"50px"}}>                                                                                           
                                                    <img src={article.publisherPhotoUrl}
                                                        className="rounded-circle w-100 h-100 object-fit-cover"
                                                        alt=""
                                                    />
                                                </div>

                                                :<div className="rounded-circle overflow-hidden" style={{width:"50px",height:"50px"}}>
                                                    <FontAwesomeIcon icon={faUser} className="rounded-circle w-100 h-100 pt-2"/>
                                                </div>
                                            }
                                        
                                            <p style={{color:"teal",fontWeight:"bold"}}>{article.publisherName}</p>
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
                                            className="mt-2" >                                      
                                        </div>
                                    </div>

                                    <div className=" mt-5">
                                        <hr/>

                                    </div>

                                    <div className="col-md-6 col-lg-4 d-flex justify-content-between align-items-center">
                                        {
                                            (likes!==null && hasLiked())
                                            ?<button className="btn border no-focus-outline rounded-0 d-flex gap-3 align-items-center"
                                                onClick={like}
                                                >
                                                <FontAwesomeIcon icon={faStar} className="ic-teal"/>
                                                <span>Liked</span>
                                            </button>
                                            :<button className="btn border rounded-0 d-flex gap-3 align-items-center"
                                                onClick={like}
                                                >
                                                <FontAwesomeIcon icon={farStar}/>
                                                <span>Like</span>
                                            </button>
                                        }
                                        

                                        {
                                            (likes!==null)&&
                                            <div style={{fontSize:"14px"}}>
                                                {
                                                    likes.length>0
                                                    ? <span> Liked by {likes.length} 
                                                        {likes.length > 1 ? " People " : " Person "}
                                                    </span>
                                                    : <span style={{fontSize:"12px"}}>Be the first to like</span>
                                                }
                                            </div>
                                        }
                                    </div>

                                    <div className="col-12 border mt-5 p-5 d-sm-flex gap-3">
                                        <div className="col-12 col-sm-9 d-flex flex-column justify-content-center">
                                            <h6>Published by {article.publisherName}</h6>
                                            <p className="fw-lighter" style={{fontSize:"13px"}}>
                                                {article.publisherDescription}
                                            </p>
                                        </div>
                                        <div className="col-12 col-sm-3  d-flex justify-content-center">
                                            <div className=" rounded-circle overflow-hidden" style={{width:"120px",height:"120px"}}>
                                                {
                                                    article.publisherPhotoUrl !== null
                                                    ?<img src={article.publisherPhotoUrl} alt=""
                                                        className="w-100 h-100 object-fit-cover"
                                                    />
                                                    :<FontAwesomeIcon icon={faUser} className="pt-2 h-100 w-100 ic-grey"/>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <Related cat={article.sectionName} current={article.articleId} />


                                    <Comments articleId={article.articleId}/>
                                </div>
                                


                            </div>
                            
                            
                            
                        </div>

                    </div>


                   
                </div>
                :""

            }
           
            
           
            
            <Footer/>
        </div>
    )
}