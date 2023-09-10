// import React,{useState,useEffect} from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import linearCongruentialGenerator from "../reusables/linearCongruentialGenerator";

// const Comments=React.memo(({articleId})=>{
//     const navigate=useNavigate();
//     let [newComment,set_newComment]=useState();
//     let [comments,set_comments]=useState();
//     let [newReply,set_newReply]=useState('');
//     let [activeButtonKey,set_activeButtonKey]=useState(-1);
//     let [claps,set_claps]=useState();
//     let [userId, set_userId]=useState();
//     let [userName, set_userName] = useState();

//     // useEffect(()=>{
//     //     axios.get(`http://localhost:9000/comments/${articleId}}`,{withCredentials:true})
//     //         .then((response)=>{
//     //         set_claps(response.data.claps)
//     //         set_comments(response.data.comments);
//     //         })

//     //     axios.get('http://localhost:9000/user')
//     //          .then((response)=>{
//     //             set_userId(response.data.userId);
//     //             set_userName(response.data.userName);
//     //          })
//     // },[articleId])
    
//     const handleReplyButtonClick=(e,key)=>{
//         e.stopPropagation();
//         set_newReply('');
//         set_activeButtonKey(key)
//     }

//     const handleOutsideClick=()=>{
//         set_activeButtonKey(-1);
//     }

//     const handleInputClick=(e)=>{
//         e.stopPropagation();
//     }


//     function addComment(){
//         axios.post('http://localhost:9000/addComment',
//              {
//                 withCredentials:true,
//                 comment:newComment,
//                 articleId:articleId
//             })
//              .then((response)=>{
//                 if(response.status===200){
//                     // window.location.reload()
//                 }
//              })
//              .catch((err)=>{
//                 console.log("the errr",err.response.status)
//                 if(err.response.status===401){
//                     navigate('/login');
//                 }
//              })
//     }

//     function sendReply(parentId){
        
//         axios.post('http://localhost:9000/reply',
//             {
//                 articleId:articleId,
//                 parentId: parentId,
//                 reply: newReply
//             })
//             .then((response)=>{
//                 if(response.status===200){
//                     window.location.reload()
//                 }
//             })

//     }

//     function checkLogin(){
//         return (userId === undefined) && window.alert('Login to add comment');
//     }

//     return(
//         <div className="container" onClick={handleOutsideClick}>
//             <hr/>
//             <h4>Comments</h4>
//             <form onSubmit={addComment}>
//                 <textarea className="col-10" placeholder="What do you think about this?" onInput={checkLogin}
//                      value={newComment} onChange={(e)=>set_newComment(e.target.value)} required/>
//                 <input type="submit" value="Add Comment" className="btn"/>
                
//             </form>

            
//             {(comments!==undefined)
//                 ?<div key="comments">
//                     {
//                         comments.map(comment=>{
//                             return <Comment articleId={articleId}
//                                             comment={comment} 
//                                             key={comment.commentId}
//                                             newReply={newReply} 
//                                             set_newReply={set_newReply}
//                                             sendReply={sendReply}
//                                             handleReplyButtonClick={handleReplyButtonClick}
//                                             handleInputClick={handleInputClick}
//                                             activeButtonKey={activeButtonKey}
//                                             claps={claps}
//                                             userId={userId}
//                                             userName={userName}
//                                     />
//                         })
//                     }
                
//                 </div>

//                 :<></>
//             }
            
//         </div>
//     )
// })

// function Comment({
//         articleId,
//         comment,
//         sendReply,
//         newReply,
//         set_newReply,
//         handleReplyButtonClick,
//         handleInputClick,
//         activeButtonKey,
//         claps,
//         userId,
//         userName
//     }){
//     const key=comment.commentId;
//     console.log("idddd:d:",key,"comment's parent",comment)

//     function clapSum(commentId,value){
//         let sum=0;
//         for(var clap of claps){
//             if(clap.commentId===commentId && clap.value===value) sum++;
//         }
//         return (sum>0) ? sum : '';
//     }

//     function loginAlert(){
//         return window.alert(`You need to login first to respond to this post`);
//     }

//     return(
//         <div className={`pt-3 d-flex ${(comment.parentCommentId === null) ? 'border-bottom':''}`}>
//             <div>
//                 <button className="btn  rounded-circle" style={{backgroundColor:`rgb(100,150,${linearCongruentialGenerator(comment.userId)})`}}>{comment.comment_userName[0]}</button>
//             </div>
//             <div className="container">
//                 <p><b>{comment.comment_userName}</b></p>
//                 <p>{comment.comment}</p>
//                 <div className="">
//                     <div className="d-flex">
//                        <div className="">
//                             <button className="btn " onClick={(userId === undefined) ? ()=>loginAlert() : ()=>clap(articleId,key,1)} title="Clap">
//                                 <img src={require('../icons/clap.png')} className="icon" alt="clap"/>
//                                 <span className="icon-label">{clapSum(key,1)}</span>
//                             </button>
//                             <button className="btn" onClick={(userId === undefined) ? ()=>loginAlert() : ()=>clap(articleId,key,0)} title="Slap">
//                                 <img src={require('../icons/slap.png')} className="icon" alt="slap"/>
//                                 <span className="icon-label">{clapSum(key,0)}</span>
//                             </button>
//                         </div>
                        
//                         <button className="btn" onClick={(userId === undefined) ? ()=>loginAlert() : (e)=>handleReplyButtonClick(e,key)} title="Reply">
//                             <img src={require('../icons/reply.png')} className="icon" alt="reply"/>
//                             <span className="icon-label">{comment.replies && comment.replies.length}</span>
//                         </button> 
//                     </div>
                    
//                     {
//                         (activeButtonKey===key) && (userName !== undefined) && (
//                             <div className="mt-3">
//                                 <button className="btn  rounded-circle" style={{backgroundColor:`rgb(100,150,${linearCongruentialGenerator(userId)})`}}>{userName[0]}</button>
//                                 <input type="text" className="col-10 ms-3" key={['reply',key].join('_')} value={newReply} onChange={(e)=>set_newReply(e.target.value)}   onClick={handleInputClick} />
//                                 <button className="btn" onClick={()=>sendReply(comment.commentId)}>send</button>                                  
//                             </div>
//                         )
//                     }

//                     {
//                         comment.replies && comment.replies.map(reply=>{
                            
//                             return <Comment articleId={articleId}
//                                             comment={reply} 
//                                             key={reply.commentId} 
//                                             newReply={newReply} 
//                                             set_newReply={set_newReply}
//                                             sendReply={sendReply}
//                                             handleReplyButtonClick={handleReplyButtonClick}
//                                             handleInputClick={handleInputClick}
//                                             activeButtonKey={activeButtonKey}
//                                             claps={claps}
//                                             userId={userId}
//                                             userName={userName}
//                                     />

//                         })
//                     }
                
//                 </div>
//             </div>
            
//         </div>

//     )
// }

// function clap(articleId,commentId,value){
//     axios.post('http://localhost:9000/clap',{commentId:commentId, value: value, articleId : articleId})
//          .then(()=>{
//             window.location.reload();
//          })
//          .catch((err)=>{
//             console.log(err);
//          })
// }




// export default Comments;