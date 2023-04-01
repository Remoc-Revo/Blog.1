import React,{useState,useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Comments({newsId}){
    const navigate=useNavigate();
    let [newComment,set_newComment]=useState();
    let [comments,set_comments]=useState();
    let [newReply,set_newReply]=useState();
    let [activeButtonIndex,set_activeButtonIndex]=useState(-1);

    useEffect(()=>{
        axios.get(`http://localhost:9000/comments/${newsId}}`,{withCredentials:true})
            .then((response)=>{
            console.log("comments",response.data.comments)
            set_comments(response.data.comments);
            })
    },[newsId])
    
    const handleReplyButtonClick=(e,index)=>{
        e.stopPropagation();
        set_activeButtonIndex(index)
    }

    const handleOutsideClick=()=>{
        set_activeButtonIndex(-1);
    }

    const handleInputClick=(e)=>{
        e.stopPropagation();
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

    function reply(commentId){
        
        axios.post('http://localhost:9000/reply',
            {
                newsId:newsId,
                commentId:commentId,
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
                ?<div>
                    {
                        comments.map((commentData,index)=>{
                            return <div className="pt-3 d-flex border-bottom">
                                        <div>
                                            <button className="btn btn-primary rounded-circle">{commentData.comment_userName[0]}</button>
                                        </div>
                                        <div className="container">
                                            <p><b>{commentData.comment_userName}</b></p>
                                            <p>{commentData.comment}</p>
                                            <div className="">
                                                <button className="btn" onClick={(e)=>handleReplyButtonClick(e,index)}>
                                                    <img src={require('../icons/reply.png')} className="icon" alt="reply"/>
                                                    <span>22</span>
                                                </button>
                                                <button className="btn">
                                                    <img src={require('../icons/like.png')} className="icon" alt="like"/>
                                                </button>
                                                <button className="btn">
                                                    <img src={require('../icons/dislike.png')} className="icon" alt="dislike"/>
                                                </button>
                                                {
                                                    (activeButtonIndex===index) && (
                                                        <div className="mt-3">
                                                            <button className="btn btn-primary rounded-circle">{commentData.comment_userName[0]}</button>
                                                            <input type="text" className="col-10 ms-3" value={newReply} onChange={(e)=>set_newReply(e.target.value)} onClick={handleInputClick} />
                                                            <button className="btn" onClick={()=>reply(commentData.commentId)}>send</button>
                                                            
                                                        </div>
                                                    )
                                                }
                                               
                                            </div>
                                        </div>
                                        
                                    </div>
                        })
                    }
                    </div>

                :<></>
            }
            
        </div>
    )
}