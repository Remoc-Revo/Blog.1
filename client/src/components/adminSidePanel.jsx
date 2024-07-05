
import React from "react";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logos/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

 const AdminSidePanel=()=>{
    let adminPanel = ""//useLocation().search;
    // document.write("adminPanel ",adminPanel);

    return <div className="text-white">

        <div className=" bg-dark  pt-3 slide-in"
            style={{width:"240px",height:"100%"}}
        >
            <div className="d-flex align-items-start ps-2"
                >
                <img src={Logo} alt="" style={{width:"35%"}} />
                <div className="d-flex flex-column mt-2 gap-0">
                    <h6 className="d-flex p-0 m-0">Lorem Healthline</h6>
                    <p className=" fw-lighter">loremhealthline.com</p>
                </div>
            </div>
           
            <div className="mt-4 d-flex flex-column gap-2 admin-side-panel-links">
                <a href="/" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel===""?"active":""}
                   >
                    <FontAwesomeIcon icon={faHouseChimney} className=""/>
                    <p className=" m-0">My Home</p>
                </a>
                <a  href="/?adminPanel=stats"
                    className="d-flex gap-2 ps-3 pt-1 pb-1 align-items-center"
                    id={adminPanel==="?adminPanel=stats"?"active":""}
                     >
                    <FontAwesomeIcon icon={faChartSimple}/>
                    <p className="pt-1 m-0">Stats</p>
                </a>

                <a href="/?adminPanel=posts" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=posts"?"active":""}
                   >
                    <FontAwesomeIcon icon={faCalendar}/>
                    <p className=" m-0">Posts</p>
                </a>

                <a href="/?adminPanel=comments" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=comments"?"active":""}
                   >
                    <FontAwesomeIcon icon={faComment} className=""/>
                    <p className=" m-0">Comments</p>
                </a>

                <a href="/?adminPanel=users" 
                   className="d-flex gap-2 ps-3 pt-1 pb-1"
                   id={adminPanel==="?adminPanel=users"?"active":""}
                   >
                    <FontAwesomeIcon icon={faUser} className=""/>
                    <p className=" m-0">Users</p>
                </a>
            </div>
        </div>
    </div>
}


export default React.memo(AdminSidePanel);