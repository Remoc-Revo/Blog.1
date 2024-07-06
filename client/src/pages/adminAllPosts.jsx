import React,{useState,useEffect} from "react";
import api from "../config/api";
import { GridItemSmall } from "../components/article_preview";
import { decodeString } from "../reusables/global";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function AdminAllPosts(){
    const [allPosts, setAllPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
         function fetchAdminHomeData(){
            api.get("/adminAllPosts",{withCredentials:true})
               .then((response)=>{
                    console.log("response",response.data.posts)
                    setAllPosts(response.data.posts);

               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAdminHomeData();
    },[])

    return <div className="container ">
        

        <div className="container mb-5">
            <h2>All Posts</h2>
            <div className="row mt-md-5">                            
                {
                
                (allPosts.length===0)
                ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No article published yet</h5></div>
                :allPosts.map((article,index)=>{
                     return <GridItemSmall 
                                articleSection={decodeString(article.sectionName)}
                                headline={decodeString(article.articleHeadline)} 
                                time={moment(article.articlePostingDate).fromNow()} 
                                briefDescription={decodeString(article.articleBody)} 
                                imgUrl={article.multimediaUrl}
                                articleId={article.articleId}
                                handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                            />                     
                })
                    
                }
            </div>
        </div>

    

    </div>
}