import React,{useState,useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import linearCongruentialGenerator from "../reusables/linearCongruentialGenerator";
import api from "../config/api";
import { useUserContext } from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faReply,faUser } from "@fortawesome/free-solid-svg-icons";
import  { faStar as farStar} from "@fortawesome/free-regular-svg-icons";

const Comments=React.memo(({articleId})=>{
    const navigate=useNavigate();
    let [newComment,set_newComment]=useState();
    let [comments,set_comments]=useState();
    let [newReply,set_newReply]=useState('');
    let [activeButtonKey,set_activeButtonKey]=useState(-1);
    let [likes,set_likes]=useState();
    let [userId, setUserId]=useState();
    let [userName, setUserName] = useState();
    let [userProfilePhoto, setUserProfilePhoto] = useState(null);
    const {loading,user} = useUserContext();


    const fetchComments = useCallback(()=>{
        api.get(`/comments/${articleId}`,{withCredentials:true})
            .then((response)=>{
            set_likes(response.data.likes)
            set_comments(response.data.comments);
            }) 
    },[] )      

    useEffect(()=>{
        fetchComments();
        
        if(!loading && user != null){
            console.log("user context!!!!",user);
            setUserId(user.userId);
            setUserName(user.userName);
            setUserProfilePhoto(user.userProfilePhoto);
        }
    },[fetchComments,articleId,loading,user])
    
    const handleReplyButtonClick=(e,key)=>{
        e.stopPropagation();
        set_newReply('');
        set_activeButtonKey(key)
    }

    const handleOutsideClick=()=>{
        set_activeButtonKey(-1);
    }

    const handleInputClick=(e)=>{
        e.stopPropagation();
    }

    const updateLikes = (updatedLikes)=>{
        set_likes(updatedLikes);
    }


    function addComment(e){
        e.preventDefault();
        
        api.post('/addComment',
             {
                withCredentials:true,
                comment:newComment,
                articleId:articleId
            })
             .then((response)=>{
                if(response.status===201){
                    set_newComment('');
                    fetchComments();
                }
             })
             .catch((err)=>{
                console.log("the errr",err.response.status)
                if(err.response.status===401){
                    navigate('/login');
                }
             })
    }

    function sendReply(parentId){
        if(newReply === '') return;

        api.post('/reply',
            {
                articleId:articleId,
                parentId: parentId,
                reply: newReply
            })
            .then((response)=>{
                if(response.status===201){
                    fetchComments();
                }
            })
            

    }

    function checkLogin(){
        return (userId === undefined) && window.alert('Login to add comment');
    }



    return(
        <div className="" onClick={handleOutsideClick}>
            <hr/>

            {typeof comments!=='undefined' && 
            <div className="col-12  text-start">
                <h4>{`${comments.length} ${(comments.length == 1) ? "Comment" : "Comments"}`}</h4>
            </div>}

            
            {(comments!==undefined)
                ?<div className="mt-4" key="comments">
                    {
                        comments.map(comment=>{
                            return <Comment articleId={articleId}
                                            comment={comment} 
                                            key={comment.commentId}
                                            newReply={newReply} 
                                            set_newReply={set_newReply}
                                            sendReply={sendReply}
                                            handleReplyButtonClick={handleReplyButtonClick}
                                            handleInputClick={handleInputClick}
                                            updateLikes = {updateLikes}
                                            activeButtonKey={activeButtonKey}
                                            likes={likes}
                                            userId={userId}
                                            userName={userName}
                                            userProfilePhoto = {userProfilePhoto}
                                    />
                        })
                    }
                
                </div>

                :<></>
            }

            <label className="mt-4 mb-1">Leave a comment</label>
            <form onSubmit={addComment} className="border">
                <textarea className="col-12 p-3 mb-0" rows={5} 
                    placeholder="Write a comment..." onInput={checkLogin}
                    value={newComment} onChange={(e)=>set_newComment(e.target.value)} required
                    style={{border:"none",borderBottom:"1px solid lightgrey"}}
                    />
                
                <div className="d-flex justify-content-end m-0 p-0">
                    <input type="submit" value="Comment" className="btn rounded-0 m-2" 
                        style={{border:"1px solid lightgrey"}}
                    />
                </div>
                
            </form>
            
        </div>
    )
})

function Comment({
        articleId,
        comment,
        sendReply,
        newReply,
        set_newReply,
        handleReplyButtonClick,
        handleInputClick,
        updateLikes,
        activeButtonKey,
        likes,
        userId,
        userName,
        userProfilePhoto
    }){
    const key=comment.commentId;

    function likeSum(commentId,value){
        let sum=0;
        for(var like of likes){
            if(like.commentId===commentId && like.value===value) sum++;
        }
        return (sum>0) ? sum : '';
    }

    const hasLiked = (commentId)=>{
        for(let like of likes){
            if(like.commentId === commentId  && like.value === 1 && userId === like.userId){
                return true;
            }
        }
        return false;
    }

    const hasReplied = ()=>{ 
        return comment.replies && comment.replies.some((reply)=>{
            return userId === reply.userId
              
        });        
    }

    function loginAlert(){
        return window.alert(`You need to login first to respond to this post`);
    }

    function formatDateTime(date){
        date = new Date(date);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours > 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; //convert hour '0' to 12
        minutes = minutes <  10 ? '0' + minutes : minutes;

        const timeStr = hours + ':' + minutes + ' ' + ampm;
        const dateStr =   new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(date);
        const dateTimeStr = dateStr + ' at ' + timeStr;


        return dateTimeStr;

      }

      function like(articleId,commentId){
        api.post('/like',{commentId:commentId, articleId : articleId})
             .then((response)=>{
                updateLikes(response.data.updatedLikes);
             })
             .catch((err)=>{
                console.log(err);
             })
    }
    

    return(
        <div className={`pt-2 d-flex gap-3 ${(comment.parentCommentId === null) ? 'border-bottom':''}`}>
            <div>
                {
                    (comment.commenterProfilePhoto !== null)
                    ?<div style={{width:"50px",height:"50px"}}>                                                                                           
                        <img src={comment.commenterProfilePhoto}
                            className="rounded-circle w-100 h-100 object-fit-cover"
                            alt=""
                        />
                    </div>

                    :<div className="rounded-circle overflow-hidden" 
                        style={{width:"50px",height:"50px", backgroundColor:"lightgrey"}}>
                        <FontAwesomeIcon icon={faUser} className="ic-white rounded-circle w-100 h-100 pt-2"/>
                    </div>
                }

            </div>
            
            <div className=" d-flex flex-column gap-1">
                <span style={{fontWeight:"500"}}>{comment.comment_userName.toUpperCase()}</span>

                <span className="" style={{color:"grey",fontSize:"13px"}}>{formatDateTime(comment.dateAdded)}</span>

                <p className="mt-3" style={{fontWeight:"300"}}>{comment.comment}</p>
                <div className="">
                    <div className="d-flex">
                       <div className="">
                            <button className="btn border-0 no-focus-outline" onClick={(userId === undefined) ? ()=>loginAlert() : ()=>like(articleId,key)} title="Like">
                                {hasLiked(comment.commentId)
                                    ?<FontAwesomeIcon icon={faStar} className="ic-response ic-teal"/>
                                    :<FontAwesomeIcon icon={farStar} className="ic-response ic-grey"/>
                                }
                                <span className="icon-label">{likeSum(key,1)}</span>
                            </button>
                        </div>
                        
                        <button className="btn" onClick={(userId === undefined) ? ()=>loginAlert() : (e)=>handleReplyButtonClick(e,key)} title="Reply">
                            {hasReplied()
                                ?<FontAwesomeIcon icon={faReply} className="ic-response ic-teal" />
                                :<FontAwesomeIcon icon={faReply} className="ic-grey ic-response" />
                            }
                            
                            <span className="icon-label">{comment.replies && comment.replies.length}</span>
                        </button> 
                    </div>
                    
                    {
                        (activeButtonKey===key) && (userName !== undefined) && (
                            <div className="mt-3 ">
                                 <div>
                                    {
                                        (userProfilePhoto !== null)
                                        ?<div style={{width:"50px",height:"50px"}}>                                                                                           
                                            <img src={userProfilePhoto}
                                                className="rounded-circle w-100 h-100 object-fit-cover"
                                                alt=""
                                            />
                                        </div>

                                        :<div className="rounded-circle overflow-hidden" 
                                            style={{width:"50px",height:"50px", backgroundColor:"lightgrey"}}>
                                            <FontAwesomeIcon icon={faUser} className="ic-white rounded-circle w-100 h-100 pt-2"/>
                                        </div>
                                    }

                                </div>
                                <span className="ms-2 fw-bolder ">{userName}</span>

                                <div className="mt-2 col-12 mb-1">
                                    <textarea rows={2} className="col-12 p-2 " key={['reply',key].join('_')} value={newReply} onChange={(e)=>set_newReply(e.target.value)}   onClick={handleInputClick} />
                                    <button className="btn btn-light" onClick={()=>sendReply(comment.commentId)}>send</button>                                  
                                </div>
                            </div>
                        )
                    }

                    {
                        comment.replies && comment.replies.map(reply=>{
                            
                            return <Comment articleId={articleId}
                                            comment={reply} 
                                            key={reply.commentId} 
                                            newReply={newReply} 
                                            set_newReply={set_newReply}
                                            sendReply={sendReply}
                                            handleReplyButtonClick={handleReplyButtonClick}
                                            handleInputClick={handleInputClick}
                                            updateLikes = {updateLikes}
                                            activeButtonKey={activeButtonKey}
                                            likes={likes}
                                            userId={userId}
                                            userName={userName}
                                            userProfilePhoto={userProfilePhoto}
                                    />

                        })
                    }
                
                </div>
            </div>
            
        </div>

    )
}





export default Comments;