
import React,{useState,useEffect} from "react";
import api from "../config/api";
import { GridItemSmall } from "../components/article_preview";
import { decodeString } from "../reusables/global";
import getFirstImage from "../reusables/getImage";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function AdminHome(){
    const [adminHomeData,setAdminHomeData] = useState();
    const [latestPosts, setLatestPosts] = useState([]);
    const [latestDrafts,setLatestDrafts] = useState([]);
    const [latestComments, setLatestComments] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
         function fetchAdminHomeData(){
            api.get("/adminHomeData",{withCredentials:true})
               .then((response)=>{
                    console.log("response",response.data.adminHomeData.latestDrafts)
                    setLatestDrafts(response.data.adminHomeData.latestDrafts);
                    setLatestPosts(response.data.adminHomeData.latestPosts);

               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAdminHomeData();
    },[])

    return <div className="container col-lg-10 ">
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

        <hr/>

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

        <hr/>

        <div className="container mb-5">
            <h2>Latest Comments</h2>
            {
                (latestComments.length===0)
                ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No Comment Yet</h5></div>
                :<></>
            }
        </div>

    </div>
}