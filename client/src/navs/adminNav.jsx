import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPenFancy, faBell,faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";

export default function AdminNav({toggleSideNav}){
    const navigate = useNavigate();
    const {loading,user} = useUserContext();
    const [userProfilePhoto,setUserProfilePhoto]=useState(null);

    useEffect(()=>{
        if(!loading && user != null){
            console.log("user context!!!!",user);
            setUserProfilePhoto(user.userProfilePhoto);
          }
    
    })

    function onClickWriteButton(e){
        e.preventDefault();
        e.stopPropagation();
        navigate('/articlePosting/null');
    }


    return <div className="bg-black d-flex justify-content-between m-0  p-1 ps-3 pe-4  top-0 w-100 position-fixed" 
        style={{height:"40px",zIndex:"1000"}}>
        <div>
            <button className="btn no-focus-outline d-lg-none" onClick={(e)=>{e.stopPropagation();toggleSideNav()}}>
                <FontAwesomeIcon icon={faBarsStaggered} className="admin-nav-icon"/>
            </button>
        </div>
        <div className='d-flex justify-content-end align-items-center gap-2 gap-md-3 '>
            <a className="btn  d-flex align-items-center gap-1" 
                onClick={onClickWriteButton}
            >
                <FontAwesomeIcon icon={faPenFancy} className="admin-nav-icon"/>
            </a>

            <div style={{backgroundColor:'lightgrey', width:"24px",height:"24px"}}
                      className="d-flex justify-content-center align-items-center rounded-circle overflow-hidden"
                      onClick={(e)=>{e.stopPropagation(); navigate('/profile')}}
                      >

                      
                        {
                        (userProfilePhoto!==null)
                            ?<img src={userProfilePhoto} className="w-100 h-100 object-fit-cover rounded-circle" style={{}}/>
                            :<FontAwesomeIcon icon={faUser} className="ic-white w-100 h-100 pt-2"/>

                        }
             </div>
            
            <button className="btn d-flex"
                onClick={(e)=>{e.stopPropagation();}}
                >
                <FontAwesomeIcon icon={faBell} className="admin-nav-icon"/>
            </button>
        </div>
        
    </div>
}