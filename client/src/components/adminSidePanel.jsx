
import React,{useState,useEffect} from "react";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logos/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple,faComment, faUser,faCalendar} from "@fortawesome/free-solid-svg-icons";
// import { useLocation } from "react-router-dom";
import { updateHistory } from "../reusables/global";

 const AdminSidePanel=({updateAdminPanelSection,toggleSideNav})=>{
    const [adminPanel, setAdminPanel] = useState(window.location.search);
    console.log("initial adminPanel",adminPanel)
    const [showPostsLinks, setShowPostsLinks] = useState(false);
    const [showUsersLinks, setShowUsersLinks] = useState(false);
    useEffect(()=>{
        // setAdminPanel(location.search);

        if(adminPanel.includes("posts")){
            setShowPostsLinks(true);
        }
        else{
            setShowPostsLinks(false);
        }

        if(adminPanel.includes("users") || adminPanel.includes("subscribers")){
            setShowUsersLinks(true);
        }else{
            setShowUsersLinks(false);
        }
    

    },[adminPanel])

    useEffect(()=>{

        function onPopState(){
            console.log("new location: ",window.location.search);
            setAdminPanel(window.location.search);
            updateAdminPanelSection(window.location.search);
        }
        window.addEventListener('popstate',onPopState)

        // return ()=>{
        //     window.removeEventListener('popstate',onPopState)
        // }
    },[updateAdminPanelSection])

    function onLinkClick(e,path,closeSideNav){
        e.preventDefault();
        e.stopPropagation();
        updateHistory(path);
        updateAdminPanelSection(path);

        console.log("before setting ",adminPanel)
        setAdminPanel(path)

        if(closeSideNav && window.innerWidth < 992){
            toggleSideNav();
        }
        console.log("should be same after setting: ",adminPanel, "the path: ",path)

    }


    return <div className="text-white " id="admin-side-panel">

        <div className=" bg-dark  pt-3 slide-in position-fixed"
            style={{width:"240px",height:"100%",top:"40px",zIndex:"100"}}
        >
            <button className="btn d-flex ps-3 gap-3 align-items-center"
                onClick={(e)=>onLinkClick(e,'?view=reader',true)}
                >
                <img src={Logo} alt="" style={{maxWidth:"30%"}} />
                <div className="d-flex flex-column  gap-0 justify-content-center">
                    <h6 className="text-white d-flex  m-0 " id="blog-title">Lorem Healthline</h6>
                    <span className="text-white fw-lighter" id="blog-domain">loremhealthline.com</span>
                </div>
            </button>
           
            <div className="mt-4 d-flex flex-column gap-0 admin-side-panel-links">
                <a href="/" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel===""?"active":""}
                   onClick={(e)=>{onLinkClick(e,"",true)} }
                   >
                    <FontAwesomeIcon icon={faHouseChimney} className=""/>
                    <span className=" m-0">My Home</span>
                </a>
                <a  href="/?adminPanel=stats"
                    className="d-flex gap-2 ps-3 pt-1 pb-1 align-items-center"
                    id={adminPanel==="?adminPanel=stats"?"active":""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=stats",true)} }

                     >
                    <FontAwesomeIcon icon={faChartSimple}/>
                    <span className="pt-1 m-0">Stats</span>
                </a>

                <a href="/?adminPanel=posts" 
                   className="d-flex gap-2 ps-3 pt-2 pb-1"
                   id={adminPanel.includes("?adminPanel=posts")
                        ?"sub-active"
                        :""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts",false)} }

                   >
                    <FontAwesomeIcon icon={faCalendar}/>
                    <span className=" m-0">Posts</span>
                </a>

                <div id="posts-links" className="pt-2 mb-2"
                    style={{display:showPostsLinks?"block":"none"}}
                >

                    <a href="/?adminPanel=posts" 
                    className="d-flex gap-2 ps-3 pt-1 pb-1 child-link"
                    id={adminPanel==="?adminPanel=posts"
                            || adminPanel === "?adminPanel=posts/drafts"
                            || adminPanel.includes("?adminPanel=posts&category=")
                            ?"active"
                            :"" }
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts",true)} }

                    >
                        <span className=" m-0">All Posts</span>
                    </a>

                    <a href="/articlePosting/null"
                    className="d-flex gap-2 ps-3 pt-1 pb-1 child-link"
                    id=""

                    >
                        <span className=" m-0">Add New Post</span>
                    </a>

                    <a href="/?adminPanel=posts/categories" 
                    className="d-flex gap-2 ps-3 pt-1 pb-1 child-link"
                    id={adminPanel==="?adminPanel=posts/categories"?"active":""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts/categories",true)} }

                    >
                        <span className=" m-0">Categories</span>
                    </a>
                </div>

                <a href="/?adminPanel=comments" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=comments"?"active":""}
                   onClick={(e)=>{onLinkClick(e,"?adminPanel=comments",true)} }

                   >
                    <FontAwesomeIcon icon={faComment} className=""/>
                    <span className=" m-0">Comments</span>
                </a>

                <a href="/?adminPanel=users" 
                    className="d-flex gap-2 ps-3 pt-1 pb-1"
                    //    id={adminPanel==="?adminPanel=users"?"active":""}
                    id={showUsersLinks
                        ?"sub-active"
                        :""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=users",false)} }

                    >
                        <FontAwesomeIcon icon={faUser} className=""/>
                        <span className=" m-0">Users</span>
                </a>

                <div id="users-links" className="pt-2 pb-2 mb-2"
                    style={{display:showUsersLinks?"block":"none"}}
                    >

                    <a href="/?adminPanel=users" 
                    className="d-flex gap-2 ps-3 pt-1 pb-1 child-link"
                    id={adminPanel==="?adminPanel=users"?"active":""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=users",true)} }

                    >
                        <span className=" m-0">All Users</span>
                    </a>

                    <a href="/?adminPanel=subscribers" 
                    className="d-flex gap-2 ps-3 pt-1 pb-1 child-link"
                    id={adminPanel==="?adminPanel=subscribers"?"active":""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=subscribers",true)} }

                    >
                        <span className=" m-0">Subscribers</span>
                    </a>
                </div>

                
            </div>
        </div>
    </div>
}


export default AdminSidePanel;