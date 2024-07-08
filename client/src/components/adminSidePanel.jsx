
import React,{useState,useEffect} from "react";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logos/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

 const AdminSidePanel=({updateAdminPanelSection})=>{
    const [adminPanel, setAdminPanel] = useState(useLocation().search);
    const [showPostsLinks, setShowPostsLinks] = useState(false);

    useEffect(()=>{
        if(adminPanel.includes("posts")){
            setShowPostsLinks(true);
        }
        else{
            setShowPostsLinks(false);
        }
    },[showPostsLinks,adminPanel])

    function onLinkClick(e,path){
        e.preventDefault();
        if(path==""){
            window.history.pushState({},'',"/")
        }
        else{
            window.history.pushState({},'',path)
        }
        updateAdminPanelSection(path);
        setAdminPanel(path)
    }


    return <div className="text-white ">

        <div className=" bg-dark  pt-3 slide-in position-fixed"
            style={{width:"240px",height:"100%",top:"40px"}}
        >
            <div className="d-flex ps-2"
                >
                <img src={Logo} alt="" style={{maxWidth:"35%"}} />
                <div className="d-flex flex-column  gap-0 justify-content-center">
                    <h6 className="d-flex  m-0" id="blog-title">Lorem Healthline</h6>
                    <span className=" fw-lighter" id="blog-domain">loremhealthline.com</span>
                </div>
            </div>
           
            <div className="mt-4 d-flex flex-column gap-0 admin-side-panel-links">
                <a href="/" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel===""?"active":""}
                   onClick={(e)=>{onLinkClick(e,"")} }
                   >
                    <FontAwesomeIcon icon={faHouseChimney} className=""/>
                    <span className=" m-0">My Home</span>
                </a>
                <a  href="/?adminPanel=stats"
                    className="d-flex gap-2 ps-3 pt-1 pb-1 align-items-center"
                    id={adminPanel==="?adminPanel=stats"?"active":""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=stats")} }

                     >
                    <FontAwesomeIcon icon={faChartSimple}/>
                    <span className="pt-1 m-0">Stats</span>
                </a>

                <a href="/?adminPanel=posts" 
                   className="d-flex gap-2 ps-3 pt-2 pb-1"
                   id={adminPanel==="?adminPanel=posts"
                    ||adminPanel==="?adminPanel=posts/categories"
                        ?"sub-active"
                        :""}
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts")} }

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
                            ?"active"
                            :"" }
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts")} }

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
                    onClick={(e)=>{onLinkClick(e,"?adminPanel=posts/categories")} }

                    >
                        <span className=" m-0">Categories</span>
                    </a>
                </div>

                <a href="/?adminPanel=comments" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=comments"?"active":""}
                   onClick={(e)=>{onLinkClick(e,"?adminPanel=comments")} }

                   >
                    <FontAwesomeIcon icon={faComment} className=""/>
                    <span className=" m-0">Comments</span>
                </a>

                <a href="/?adminPanel=users" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=users"?"active":""}
                   onClick={(e)=>{onLinkClick(e,"?adminPanel=users")} }

                   >
                    <FontAwesomeIcon icon={faUser} className=""/>
                    <span className=" m-0">Users</span>
                </a>
            </div>
        </div>
    </div>
}


export default AdminSidePanel;