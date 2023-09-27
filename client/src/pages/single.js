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

// import Comments from "../components/comments";

export default function Single(){
    var [article,setArticle]=useState([]);
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
                console.log("response::",response)
                setArticle(response.data.article[0]) ;
                fetchImage(article.multimediaUrl);
            })
            .catch((err)=>{
                console.log("get single article error",err)
            });

         
    },[articleId,article.multimediaUrl])


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
                ?<div className="container-lg mt-5">
                    <div className="container-lg">
                        {(user !== null && user.userLevel === 1)
                            ? <button onClick={navigateToUpdate} className="btn btn-secondary">UPDATE ARTICLE</button>
                            : <></>
                        }
                        <h1 className=" headline">{decodeString(article.articleHeadline)}</h1>
                    </div>
                    <div className="d-lg-flex container-lg mt-5 gap-3">
                        <div className=" col-lg-8 p-0">
                            <div className="container-lg p-0">
                                <p className="pt-2 pb-2 border-top border-bottom">
                                    Published {moment(article.articlePostingDate).fromNow()} 
                                    <span> | </span>
                                    {(article.articleUpdatingDate !== null)? "Updated  "+moment(article.articleUpdatingDate).fromNow() : <></>} 
                                    <span> </span>| By <span style={{color:"teal",fontWeight:"bold"}}>Brian</span>
                                </p>
                                <img src={fetchedImgUrl} alt="article img"
                                    style={{display:"block",width:"100%",maxHeight:"390px"}}/>


                                <p className="mt-4">{decodeString(article.articleBody)}</p>
                            </div>

                        </div>
                        
                        
                        <More cat={article.articleSection} current={article.articleId} />
                    </div>
                </div>
                :""

            }
           
            {/* <Comments articleId={article.articleId}/> */}
            
            <div className="container-lg">
                {(user !== null && user.userLevel === 1)
                    ?<button onClick={deleteArticle} className="btn btn-danger">
                        {(deleting)
                            ?<div className="spinner-border text-light">
                                <span className="sr-only">Loading</span>
                            </div>
                            :"DELETE ARTICLE"
                        }
                    </button>
                    : <></>
                }
            </div>
            
            <Footer/>
        </div>
    )
}