import React,{useState,useEffect, useCallback} from "react";
import api from "../config/api";
import { AdminPostPreview } from "../components/article_preview";
import { decodeString,updateHistory } from "../reusables/global";
import moment from "moment";
import { useNavigate,useLocation } from "react-router-dom";
import { faSearch,faTimes,faTrash,faEllipsisV, faEllipsisH, faPen } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Modal} from 'react-bootstrap';
import getFirstImage from "../reusables/getImage";


export default function AdminAllPosts({updateAdminPanelSection}){
    const [drafts, setDrafts] = useState([]);
    const [published, setPublished] = useState([]);
    const [displayedPosts, setDisplayedPosts] = useState(null);
    const navigate = useNavigate();
    const [postsType, setPostsType] = useState(window.location.search);
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({top:'0px',left:'0px'});
    const [showDeletionModal,setShowDeletionModal] = useState(false);
    const [activeArticle, setActiveArticle] = useState(null);
    
    console.log("postsType:",postsType)
    const updateDisplayedPosts = useCallback(()=>{
        console.log("posttype", postsType)
        let posts;
        if(postsType.includes("?adminPanel=posts&category")){
            const urlParams = new URLSearchParams(postsType);
            let categoryId = urlParams.get('category');
            categoryId = parseInt(categoryId);

            posts = published.filter(
                article => article.articleSectionId === categoryId
            )
        }
        else{
            posts = (postsType ==="?adminPanel=posts/drafts")?drafts:published;
        }
        setDisplayedPosts(posts);
    },[postsType,drafts,published])


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

    useEffect(()=>{
         
        fetchAllPosts();       
    },[])

    useEffect(()=>{
        updateDisplayedPosts();

    },[postsType,updateDisplayedPosts]);


    useEffect(()=>{
        const handleOnPopState = ()=>{
            console.log("new location n: ",window.location.search);
            setPostsType(window.location.search);
            updateDisplayedPosts();
        }
        

        window.addEventListener('popstate',handleOnPopState);

        return ()=>{
            window.removeEventListener('popstate',handleOnPopState);
        }
    })

    window.addEventListener('click',()=>{
        if(menuVisible) setMenuVisible(false);
    }
    );

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

    function toggleMenuVisible(){    
        setMenuVisible(!menuVisible);
    }

    function handleMemuClick(e,article){
        e.preventDefault();
        e.stopPropagation();

        !menuVisible? setActiveArticle(article): setActiveArticle(null);
        toggleMenuVisible();

        const buttonRect = e.target.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY -40,
            left: window.innerWidth >= 992  
                    ? buttonRect.left + window.scrollX - 305
                    : buttonRect.left + window.scrollX - 89//-  menuRef.current.offsetWidth
        })
    }


    function deleteArticle(){
        api.delete(`/article/${activeArticle.articleId}`,
            {withCredentials:true,
            imgUrl: activeArticle.multimediaUrl
        })
        .then((response)=>{
                if(response.status === 200){
                    fetchAllPosts();
                }
        })
        .catch((err)=>{
                if(err.response && err.response.status === 401){
                    navigate('/login');
                }
        })

        setShowDeletionModal(false);
        setMenuVisible(false);

    }

    return <div className="container  d-flex justify-content-center ">
        

        <div className="container mb-5 col-md-9 ">
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
                    &&<table className="w-100">
                        {displayedPosts.map((article,index)=>{
                            return <tr className="" >
                                    <td>
                                        <AdminPostPreview 
                                            articleSection={decodeString(article.sectionName)}
                                            headline={decodeString(article.articleHeadline)} 
                                            time={moment(article.articlePostingDate).fromNow()} 
                                            briefDescription={decodeString(article.articleBody)} 
                                            imgUrl={getFirstImage(article.articleBody)}
                                            articleId={article.articleId}
                                            handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                                        />   
                                    </td>
                                    <td>
                                        <button 
                                            className="btn" 
                                            
                                            onClick={(e)=>handleMemuClick(e,article)}>
                                                {menuVisible && activeArticle.articleId === article.articleId
                                                    ?<FontAwesomeIcon 
                                                        icon={ faEllipsisV} 
                                                        className="ic-orange"/>
                                                    :<FontAwesomeIcon 
                                                        icon={faEllipsisH} 
                                                        className="ic-grey"/>
                                                }
                                                                                        
                                            
                                        </button>
                                    </td>
                                </tr>
                                                
                        })
                        }
                    </table>   
                }
                {
                menuVisible&&(
                    <div 
                    id="category-menu"
                    style={{
                        position:"absolute",
                        top:`${menuPosition.top}px`,
                        left:`${menuPosition.left}px`,
                        zIndex:"1000"
                    }}
                    className="d-flex flex-column align-items-start border bg-light">

                        <button className="btn rounded-0 w-100 d-flex gap-4 align-items-center"
                            onClick={()=>{navigate(`/articlePosting/${activeArticle.articleId}`)}}>
                            <FontAwesomeIcon icon={faPen} className="ic ic-grey "/>
                            Edit
                        </button>

                        <button className="btn rounded-0 w-100 d-flex gap-4 align-items-center "
                            onClick={()=>{setShowDeletionModal(true)}}>
                            <FontAwesomeIcon icon={faTrash} className="ic ic-grey "/>
                            Delete
                        </button>

                       
                    </div>
                    )
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

    
        <Modal show={showDeletionModal} centered >

            <Modal.Body>
                <span>Are your sure you want to permanently delete '{activeArticle!==null && decodeString(activeArticle.articleHeadline)}' ?</span>

                <div className="d-flex justify-content-between mt-2">
                    <button className="btn btn-secondary" onClick={()=>setShowDeletionModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={deleteArticle}>
                        Delete
                    </button>
            </div>
            </Modal.Body>

        </Modal>
    </div>
}