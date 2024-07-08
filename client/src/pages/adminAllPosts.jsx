import React,{useState,useEffect} from "react";
import api from "../config/api";
import { AdminPostPreview } from "../components/article_preview";
import { decodeString,updateHistory } from "../reusables/global";
import moment from "moment";
import { useNavigate,useLocation } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function AdminAllPosts({updateAdminPanelSection}){
    const [allPosts, setAllPosts] = useState(null);
    const navigate = useNavigate();
    const [postsType, setPostsType] = useState(useLocation().search);

    useEffect(()=>{
         function fetchAdminHomeData(){
            api.get("/adminAllPosts",{withCredentials:true})
               .then((response)=>{
                    setAllPosts(response.data);
                    console.log("allposts response",response.data['published'])

               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAdminHomeData();

        window.addEventListener('popstate',(event)=>{
            console.log("new location: ",window.location.search);
            setPostsType(window.location.search);
        })
    },[])

    function onPostsButtonClick(e,path){
        e.preventDefault();
        updateHistory(path);
        updateAdminPanelSection(path);
        setPostsType(path)
    }

    

    return <div className="container d-flex justify-content-center ">
        

        <div className="container mb-5 col-md-12 col-lg-9 ps-5">
            <h4>All Posts</h4>
            <p className="fw-lighter">Create, edit and manage your posts</p>
            <div className=" mt-md-5">  
                <div className="d-flex justify-content-between mb-4" id="posts-nav">
                    
                    <div className="d-flex gap-3" id="admin-posts-buttons">
                        <button className="btn rounded-0 "
                                id={postsType ==="?adminPanel=posts"?"active":""}
                                onClick={(e)=>onPostsButtonClick(e,"?adminPanel=posts")}>
                            <span>Published</span>
                            {(allPosts!==null)&&<span className="ms-2 text-black rounded-circle border">{allPosts['published'].length}</span>}
                        </button>
                        <button className="btn rounded-0"
                            id={postsType ==="?adminPanel=posts/drafts"?"active":""}
                            onClick={(e)=>onPostsButtonClick(e,"?adminPanel=posts/drafts")}>
 
                            Drafts
                            {(allPosts!==null)&&<span className="ms-2 ps-1 pe-1 text-black rounded-circle border">{allPosts['drafts'].length}</span>}

                        </button>
                    </div>
                    
                    <button className="btn rounded-0">
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                </div>
                {
                
                (allPosts===null)
                ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No article published yet</h5></div>
                :<table className="">
                    {allPosts[
                        (postsType ==="?adminPanel=posts/drafts")
                        ?'drafts'
                        :'published'
                    ].map((article,index)=>{
                        return <tr className="">
                                <td>
                                    <AdminPostPreview 
                                        articleSection={decodeString(article.sectionName)}
                                        headline={decodeString(article.articleHeadline)} 
                                        time={moment(article.articlePostingDate).fromNow()} 
                                        briefDescription={decodeString(article.articleBody)} 
                                        imgUrl={article.multimediaUrl}
                                        articleId={article.articleId}
                                        handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                                    />   
                                </td>
                              </tr>
                                              
                    })
                    }
                </table>   
                }
            </div>
        </div>

    

    </div>
}