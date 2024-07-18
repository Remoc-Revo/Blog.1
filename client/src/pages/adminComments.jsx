
import React,{useState,useEffect} from "react";
import api from "../config/api";
import { decodeString,formatDateTime } from "../reusables/global";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function AdminComments(){
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
         function fetchAdminComments(){
            api.get("/adminComments",{withCredentials:true})
               .then((response)=>{
                    console.log("response",response.data.comments)
                    
                    setComments(response.data.comments);
               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAdminComments();
    },[])

    return <div className="container col-lg-10 ">

        <div className="container mb-5">
            <h2>Comments</h2>
            {
                (comments.length===0)
                ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No Comment Yet</h5></div>
                :<div className="mt-5">
                    {
                        comments.map((comment)=>{
                            return <div className={`pt-2 d-flex gap-3 border-bottom`}>
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
                                        style={{width:"50px",height:"50px", backgroundColor:"grey"}}>
                                        <FontAwesomeIcon icon={faUser} className="ic-light-grey rounded-circle w-100 h-100 pt-2"/>
                                    </div>
                                }
                            </div>
                            <div className=" d-flex flex-column gap-1">
                                <span style={{fontWeight:"500"}}>{comment.userName.toUpperCase()}</span>
                
                                <span className="" style={{color:"grey",fontSize:"13px"}}>{formatDateTime(comment.dateAdded)}</span>
                
                                <p className="mt-3" style={{fontWeight:"300"}}>{comment.comment}</p>

                                <div className=" d-flex gap-3 align-items-start">
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