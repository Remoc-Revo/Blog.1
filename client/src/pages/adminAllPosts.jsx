import React,{useState,useEffect, useCallback} from "react";
import api from "../config/api";
import { AdminPostPreview } from "../components/article_preview";
import { decodeString,updateHistory } from "../reusables/global";
import moment from "moment";
import { useNavigate,useLocation } from "react-router-dom";
import { faSearch,faTimes } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function AdminAllPosts({updateAdminPanelSection}){
    const [drafts, setDrafts] = useState([]);
    const [published, setPublished] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState(null);
    const navigate = useNavigate();
    const [postsType, setPostsType] = useState(useLocation().search);
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [searchedText, setSearchedText] = useState('');

    const updateDisplayedPosts = useCallback(()=>{
        const posts = (postsType ==="?adminPanel=posts/drafts")?drafts:published;
        setDisplayedPosts(posts);
    },[postsType,drafts,published])


    useEffect(()=>{
         function fetchAllPosts(){
            api.get("/adminAllPosts",{withCredentials:true})
               .then((response)=>{
                    setDrafts(response.data['drafts']);
                    setPublished(response.data['published']);

               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAllPosts();       
    },[])

    useEffect(()=>{
        updateDisplayedPosts();

    },[postsType,updateDisplayedPosts]);


    useEffect(()=>{
        const handleOnPopState = (event)=>{
            console.log("new location: ",window.location.search);
            setPostsType(window.location.search);
            updateDisplayedPosts();
        }

        window.addEventListener('popstate',handleOnPopState);

        return ()=>{
            window.removeEventListener('popstate',handleOnPopState);
        }
    },[updateDisplayedPosts])

    function onPostsButtonClick(e,path){
        e.preventDefault();
        updateHistory(path);
        updateAdminPanelSection(path);
        setPostsType(path)
        updateDisplayedPosts();

       updateDisplayedPosts();
    }

    function toggleIsSearchInputVisible(){
        setIsSearchInputVisible(!isSearchInputVisible);
    }

    function handleSearch(e){
        const text = e.target.value.toLowerCase();
        setSearchedText(text);

        const viewedPosts = (postsType ==="?adminPanel=posts/drafts")?drafts:published;

        

        const fitleredPosts = viewedPosts.filter(
            article => 
                {
                    const decodedHeadline = decodeString(article.articleHeadline.toLowerCase());
                    const decodedBody = decodeString(article.articleBody.toLowerCase());
                    
                     if(decodedHeadline.includes(text) 
                    || decodedBody.includes(text)){
                    
                        return article;
                    }


                 }
        )

        setDisplayedPosts(fitleredPosts);
    }

    return <div className="container d-flex justify-content-center ">
        

        <div className="container mb-5 col-md-12 col-lg-9 ps-5">
            <h4>All Posts</h4>
            <p className="fw-lighter">Create, edit and manage your posts</p>
            <div className=" mt-md-5">  
                <div className="position-relative d-flex justify-content-between mb-4" id="posts-nav">
                    
                    <div className=" d-flex gap-3 " 
                        id="admin-posts-buttons">
                        <button className="btn rounded-0 "
                                id={postsType ==="?adminPanel=posts"?"active":""}
                                onClick={(e)=>onPostsButtonClick(e,"?adminPanel=posts")}>
                            <span>Published</span>
                            {(published!==null)&&<span className="ms-2 ps-1 pe-1 text-black rounded-circle border">{published.length}</span>}
                        </button>
                        <button className="btn rounded-0"
                            id={postsType ==="?adminPanel=posts/drafts"?"active":""}
                            onClick={(e)=>onPostsButtonClick(e,"?adminPanel=posts/drafts")}>
 
                            Drafts
                            {(drafts!==null)&&<span className="ms-2 ps-1 pe-1 text-black rounded-circle border">{drafts.length}</span>}

                        </button>

                       
                    </div>
                    
                    <button className="btn rounded-0" onClick={toggleIsSearchInputVisible}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>

                    {
                        isSearchInputVisible
                        && 
                        <div className="">
                            <button className="btn position-absolute start-0 top-0 h-100"
                                onClick={toggleIsSearchInputVisible}
                                style={{zIndex:"2",color:"grey"}}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </button>
                            <input 
                                type="text"
                                className="position-absolute w-100 ps-5 pe-5 start-0 top-0 h-100 border-0"
                                placeholder=" Search Posts..."
                                onChange={handleSearch}
                                style={{zIndex:"1"}}
                                />
                            <button className="btn position-absolute end-0 top-0 h-100"
                                onClick={()=>{
                                    toggleIsSearchInputVisible();
                                    updateDisplayedPosts();
                                }}
                                style={{zIndex:"1"}}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </button>
                        </div>
                        }
                    
                </div>
                {                
                (displayedPosts!==null && displayedPosts.length===0 && !isSearchInputVisible)
                &&<div className="d-flex justify-content-center">
                    <h5 className="fw-lighter">
                        {
                            postsType ==="?adminPanel=posts/drafts"
                            ?<span>No draft available</span>
                            :<span>No article published yet</span>
                        }
                    
                    
                    </h5>
                </div>
                
                }
                {
                    (displayedPosts!==null && displayedPosts.length!==0)
                    &&<table className="">
                        {displayedPosts.map((article,index)=>{
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

                {                
                (displayedPosts!==null && displayedPosts.length===0 && isSearchInputVisible)
                &&<div className="d-flex justify-content-center">
                    <h5 className="fw-lighter">
                        {
                            <span> No result for "{searchedText}"</span>
                        }
                    
                    
                    </h5>
                </div>
                
                }
            </div>
        </div>

    

    </div>
}