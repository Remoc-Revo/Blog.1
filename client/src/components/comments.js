import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Comments=React.memo(({newsId})=>{
    const navigate=useNavigate();
    let [newComment,set_newComment]=useState();
    let [comments,set_comments]=useState();
    let [newReply,set_newReply]=useState('');
    let [activeButtonKey,set_activeButtonKey]=useState(-1);

    useEffect(()=>{
        axios.get(`http://localhost:9000/comments/${newsId}}`,{withCredentials:true})
            .then((response)=>{
            console.log("comments",response.data.comments)
            set_comments(response.data.comments);
            })
    },[newsId])
    
    const handleReplyButtonClick=(e,key)=>{
        // e.stopPropagation();
        set_newReply('');
        set_activeButtonKey(key)
    }

    const handleOutsideClick=()=>{
        // set_activeButtonKey(-1);
    }

    const handleInputClick=(e)=>{
        // e.stopPropagation();
    }


    function addComment(){
        axios.post('http://localhost:9000/addComment',
             {
                withCredentials:true,
                comment:newComment,
                newsId:newsId
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
        
        axios.post('http://localhost:9000/reply',
            {
                newsId:newsId,
                parentId: parentId,
                reply: newReply
            })
            .then((response)=>{
                if(response.status===200){
                    window.location.reload()
                }
            })

    }

    return(
        <div className="container" onClick={handleOutsideClick}>
            <hr/>
            <h4>Comments</h4>
            <form onSubmit={addComment}>
                <textarea className="col-10" placeholder="What do you think about this?"
                     value={newComment} onChange={(e)=>set_newComment(e.target.value)} required/>
                <input type="submit" value="Add Comment" className="btn"/>
                
            </form>

            
            {(comments!==undefined)
                ?<div key="comments">
                    {
                        comments.map(comment=>{
                            return <Comment comment={comment} 
                                            key={comment.commentId}
                                            newReply={newReply} 
                                            set_newReply={set_newReply}
                                            sendReply={sendReply}
                                            handleReplyButtonClick={handleReplyButtonClick}
                                            handleInputClick={handleInputClick}
                                            activeButtonKey={activeButtonKey}
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
        comment,
        sendReply,
        newReply,
        set_newReply,
        handleReplyButtonClick,
        handleInputClick,
        activeButtonKey
    }){
    const key=comment.commentId;
    console.log("idddd:d:",key,"comment",comment.comment)

    return(
        <div className="pt-3 d-flex border-bottom">
            <div>
                <button className="btn btn-primary rounded-circle">{comment.comment_userName[0]}</button>
            </div>
            <div className="container">
                <p><b>{comment.comment_userName}</b></p>
                <p>{comment.comment}</p>
                <div className="">
                    <button className="btn" onClick={(e)=>handleReplyButtonClick(e,key)}>
                        <img src={require('../icons/reply.png')} className="icon" alt="reply"/>
                        <span>22</span>
                    </button>
                    <button className="btn" onClick={()=>clap(key,1)}>
                        <img src={require('../icons/like.png')} className="icon" alt="like"/>
                    </button>
                    <button className="btn" onClick={()=>clap(key,0)}>
                        <img src={require('../icons/dislike.png')} className="icon" alt="dislike"/>
                    </button>
                    {
                        (activeButtonKey===key) && (
                            <div className="mt-3">
                                <button className="btn btn-primary rounded-circle">{comment.comment_userName[0]}</button>
                                <input type="text" className="col-10 ms-3" key={['reply',key].join('_')} value={newReply} onChange={(e)=>set_newReply(e.target.value)}   onClick={handleInputClick} />
                                <button className="btn" onClick={()=>sendReply(comment.commentId)}>send</button>                                  
                            </div>
                        )
                    }

                    {
                        comment.replies && comment.replies.map(reply=>{
                            
                            return <Comment comment={reply} 
                                            key={reply.commentId} 
                                            newReply={newReply} 
                                            set_newReply={set_newReply}
                                            sendReply={sendReply}
                                            handleReplyButtonClick={handleReplyButtonClick}
                                            handleInputClick={handleInputClick}
                                            activeButtonKey={activeButtonKey}
                                    />

                        })
                    }
                
                </div>
            </div>
            
        </div>

    )
}

function clap(commentId,value){
    axios.post('http://localhost:9000/clap',{commentId:commentId, value: value})
         .catch((err)=>{
            console.log(err);
         })
}


export default Comments;