import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import linearCongruentialGenerator from "../reusables/linearCongruentialGenerator";
import api from "../config/api";
import { useUserContext } from "../userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faReply } from "@fortawesome/free-solid-svg-icons";
import  { faStar as farStar} from "@fortawesome/free-regular-svg-icons";

const Comments=React.memo(({articleId})=>{
    const navigate=useNavigate();
    let [newComment,set_newComment]=useState();
    let [comments,set_comments]=useState();
    let [newReply,set_newReply]=useState('');
    let [activeButtonKey,set_activeButtonKey]=useState(-1);
    let [claps,set_claps]=useState();
    let [userId, setUserId]=useState();
    let [userName, setUserName] = useState();
    const {loading,user} = useUserContext();


    useEffect(()=>{
        api.get(`/comments/${articleId}`,{withCredentials:true})
            .then((response)=>{
            set_claps(response.data.claps)
            set_comments(response.data.comments);
            })

        
        if(!loading && user != null){
            console.log("user context!!!!",user);
            setUserId(user.userId);
            setUserName(user.userName);
        }
    },[articleId,loading,user])
    
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


    function addComment(){
        api.post('/addComment',
             {
                withCredentials:true,
                comment:newComment,
                articleId:articleId
            })
             .then((response)=>{
                if(response.status===200){
                    // window.location.reload()
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
    
        api.post('/reply',
            {
                articleId:articleId,
                parentId: parentId,
                reply: newReply
            })
            .then((response)=>{
                if(response.status===200){
                    window.location.reload()
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
            <div className="col-12 text-start">
                <h5>{comments.length} Comments</h5>
            </div>}

            <h4>Leave a comment</h4>
            <form onSubmit={addComment}>
                <textarea className="col-12" rows={5} placeholder="Write a comment" onInput={checkLogin}
                     value={newComment} onChange={(e)=>set_newComment(e.target.value)} required/>
                <input type="submit" value="Add Comment" className="btn"/>
                
            </form>

            
            {(comments!==undefined)
                ?<div key="comments">
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
                                            activeButtonKey={activeButtonKey}
                                            claps={claps}
                                            userId={userId}
                                            userName={userName}

                                    />
                        })
                    }
                
                </div>

                :<></>
            }
            
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
        activeButtonKey,
        claps,
        userId,
        userName
    }){
    const key=comment.commentId;
    console.log("idddd:d:",key,"comment's parent",comment)

    function likeSum(commentId,value){
        let sum=0;
        for(var clap of claps){
            if(clap.commentId===commentId && clap.value===value) sum++;
        }
        return (sum>0) ? sum : '';
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

    return(
        <div className={`pt-3 d-flex gap-3 ${(comment.parentCommentId === null) ? 'border-bottom':''}`}>
            <div>
                <button className="btn  pt-1 pb-1 rounded-circle" style={{backgroundColor:`rgb(10,190,${linearCongruentialGenerator(comment.userId)})`}}>{comment.comment_userName[0]}</button>
            </div>
            <div className=" d-flex flex-column gap-1">
                <b>{comment.comment_userName}</b>
                <span className="fw-light">{formatDateTime(comment.dateAdded)}</span>
                <p className="mt-3">{comment.comment}</p>
                <div className="">
                    <div className="d-flex">
                       <div className="">
                            <button className="btn " onClick={(userId === undefined) ? ()=>loginAlert() : ()=>like(articleId,key)} title="Like">
                                {likeSum(key,1)>0
                                    ?<FontAwesomeIcon icon={faStar} className="ic-response ic-teal"/>
                                    :<FontAwesomeIcon icon={farStar} className="ic-response ic-grey"/>
                                }
                                <span className="icon-label">{likeSum(key,1)}</span>
                            </button>
                        </div>
                        
                        <button className="btn" onClick={(userId === undefined) ? ()=>loginAlert() : (e)=>handleReplyButtonClick(e,key)} title="Reply">
                            {comment.replies && comment.replies.length>0
                                ?<FontAwesomeIcon icon={faReply} className="ic-response ic-teal" />
                                :<FontAwesomeIcon icon={faReply} className="ic-grey ic-response" />
                            }
                            
                            <span className="icon-label">{comment.replies && comment.replies.length}</span>
                        </button> 
                    </div>
                    
                    {
                        (activeButtonKey===key) && (userName !== undefined) && (
                            <div className="mt-3 ">
                                <button className="btn pt-1 pb-1  rounded-circle" style={{backgroundColor:`rgb(100,150,${linearCongruentialGenerator(userId)})`}}>{userName[0]}</button>
                                <span className="ms-2 fw-bolder ">{userName}</span>

                                <div className="mt-2">
                                    <textarea rows={2} className="col-12 " key={['reply',key].join('_')} value={newReply} onChange={(e)=>set_newReply(e.target.value)}   onClick={handleInputClick} />
                                    <button className="btn" onClick={()=>sendReply(comment.commentId)}>send</button>                                  
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
                                            activeButtonKey={activeButtonKey}
                                            claps={claps}
                                            userId={userId}
                                            userName={userName}
                                    />

                        })
                    }
                
                </div>
            </div>
            
        </div>

    )
}

function like(articleId,commentId){
    api.post('/like',{commentId:commentId, articleId : articleId})
         .then(()=>{
            window.location.reload();
         })
         .catch((err)=>{
            console.log(err);
         })
}




export default Comments;