
import React,{useState,useEffect} from "react";
import api from "../config/api";
import { GridItemSmall } from "../components/article_preview";
import { decodeString,formatDateTime } from "../reusables/global";
import getFirstImage from "../reusables/getImage";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import SessionEndedModal from "../reusables/sessionEndedModal";

export default function AdminHome(){
    const [latestPosts, setLatestPosts] = useState([]);
    const [latestDrafts,setLatestDrafts] = useState([]);
    const [latestComments, setLatestComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [draftRecoveredFromLocalStorage, setDraftRecoveredFromLocalStorage] = useState(null);
    const navigate = useNavigate();
    const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);


    useEffect(()=>{
         function fetchAdminHomeData(){
            setIsLoading(true);
            api.get("/adminHomeData",{withCredentials:true})
               .then((response)=>{
                    console.log("response",response.data.adminHomeData.latestDrafts)
                    setLatestDrafts(response.data.adminHomeData.latestDrafts);
                    setLatestPosts(response.data.adminHomeData.latestPosts);
                    setLatestComments(response.data.adminHomeData.latestComments);
                    setIsLoading(false);
               })
               .catch((e)=>{
                setIsLoading(false);
                console.log("Error fetching admin data", e);
                if(e.response.status === 401){
                    navigate('/');
                    setShowSessionEndedModal(true);
                }
               })
        }
        fetchAdminHomeData();
    },[])

    //retrieve unsaved draft from local storage
    useEffect(()=>{
        let storedDraft = localStorage.getItem('draft');
        if(storedDraft !== null){
            console.log("the recovered draft",storedDraft)
            storedDraft = JSON.parse(storedDraft);

            let storedArticleBody  = JSON.parse(storedDraft.articleBody);

            console.log("the recovered object",storedArticleBody)

            const blocks = storedArticleBody.blocks;
            let firstBlockWithText = null;

            for(let block of blocks){
                if(block.text && block.text.trim().length > 0){
                    firstBlockWithText = block.text;

                    setDraftRecoveredFromLocalStorage({
                        ...storedDraft,
                        excerpt: firstBlockWithText
                    });
                    break;
                }
            }
            

            console.log("found text: ", firstBlockWithText)
        }
    },[])

    const discardRecoveredDraft = ()=>{
        localStorage.removeItem('draft');
        setDraftRecoveredFromLocalStorage(null);
    }

    return <div className="container col-lg-10 ">
        {
            isLoading &&
            <div className="position-absolute top-0 left-0 d-flex justify-content-center align-items-center w-100" >
                <div className="spinner-border text-success ">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        {
            draftRecoveredFromLocalStorage !== null && !isLoading
            &&<div className="container-md  mb-5 mt-3" >
                <h2>Recovered draft</h2>
                <div className="col-12 d-flex flex-column justify-content-between border rounded p-3 " 
                    >
                    {
                        draftRecoveredFromLocalStorage.articleHeadline !== null
                        && 
                        <h6>{draftRecoveredFromLocalStorage.articleHeadline}</h6>
                        
                    }
                    
                    <div className="overflow-hidden mb-2" style={{height:"120px"}}>
                        {
                            draftRecoveredFromLocalStorage.excerpt !== null
                            && 
                            <p>{draftRecoveredFromLocalStorage.excerpt}</p>
                            
                        }
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-danger"
                            onClick={discardRecoveredDraft}
                            >
                            Discard
                        </button>
                        <button className="btn btn-light"
                            onClick={()=>navigate(`/articlePosting/${draftRecoveredFromLocalStorage.articleId}?recover=true`)}
                            >
                            Recover
                        </button>
                    </div>
                </div>

            </div>
        }

        {!isLoading &&
            <div>
                <div className="container-md  mb-5">
                    <h2>Latest Drafts</h2>
                    <div className="row ">                            
                        {
                        (latestDrafts.length===0)
                        ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No draft available</h5></div>
                        :latestDrafts.map((article,index)=>{
                            return <GridItemSmall 
                                        articleSection={decodeString(article.sectionName)}
                                        headline={decodeString(article.articleHeadline)} 
                                        time={moment(article.articlePostingDate).fromNow()} 
                                        briefDescription={decodeString(article.articleBody)} 
                                        imgUrl={getFirstImage(article.articleBody)}
                                        articleId={article.articleId}
                                        handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                                        isFixed = {true}
                                    />                     
                        })
                            
                        }
                    </div>  
                </div>

                <hr className="d-lg-none"/>

                <div className="container mb-5">
                    <h2>Latest Posts</h2>
                    <div className="row ">                            
                        {
                        
                        (latestPosts.length===0)
                        ?<div className="d-lg-flex justify-content-center overflow-scroll"><h5 className="fw-lighter">No article published yet</h5></div>
                        :latestPosts.map((article,index)=>{
                            return <GridItemSmall 
                                        articleSection={decodeString(article.sectionName)}
                                        headline={decodeString(article.articleHeadline)} 
                                        time={moment(article.articlePostingDate).fromNow()} 
                                        briefDescription={decodeString(article.articleBody)} 
                                        imgUrl={getFirstImage(article.articleBody)}
                                        articleId={article.articleId}
                                        handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                                        isFixed = {true}
                                    />                     
                        })
                            
                        }
                    </div>
                </div>

                <hr className="d-lg-none"/>

                <div className="container mb-5">
                    <h2>Latest Comments</h2>
                    {
                        (latestComments.length===0)
                        ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No Comment Yet</h5></div>
                        :<div>
                            {
                                latestComments.map((comment)=>{
                                    return <div className={`pt-2 d-flex gap-3 border-bottom`}
                                        onClick={()=>navigate(`/sngl/${comment.articleId}?scrollTo=comment${comment.commentId}`)}>
                                    <div>
                                        {
                                            (comment.commenterProfilePhoto !== null)
                                            ?<div style={{width:"50px",height:"50px"}}>                                                                                           
                                                <img src={comment.commenterProfilePhoto}
                                                    className="rounded-circle w-100 h-100 object-fit-cover"
                                                    alt=""
                                                />
                                            </div>

                                            :<div className="rounded-circle overflow-hidden" style={{width:"50px",height:"50px",backgroundColor:"grey"}}>
                                                <FontAwesomeIcon icon={faUser} className="ic-light-grey rounded-circle w-100 h-100 pt-2"/>
                                            </div>
                                        }
                                    </div>
                                    <div className=" d-flex flex-column gap-1">
                                        <span style={{fontWeight:"500"}}>{comment.userName.toUpperCase()}</span>
                        
                                        <span className="" style={{color:"grey",fontSize:"13px"}}>{formatDateTime(comment.dateAdded)}</span>
                        
                                        <p className="mt-3" style={{fontWeight:"300"}}>{comment.comment}</p>

                                        <div className=" d-flex gap-2  align-items-start">
                                            <h6 className="fw-lighter">On: </h6>
                                            <h6 className="" >{decodeString(comment.articleHeadline)}</h6>
                                        </div>
                                    
                                    </div>
                                    
                                </div>
                                })
                            }
                        </div>
                    }
                </div>

            </div>
        }
        
        
                <SessionEndedModal showSessionEndedModal={showSessionEndedModal} setShowSessionEndedModal={setShowSessionEndedModal}/>



    </div>
}