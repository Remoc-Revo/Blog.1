import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPenFancy, faBell,faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";
import api from "../config/api";
import { decodeString } from "../reusables/global";
import { formatDateTime } from "../reusables/global";

export default function AdminNav({toggleSideNav}){
    const navigate = useNavigate();
    const {loading,user} = useUserContext();
    const [userProfilePhoto,setUserProfilePhoto]=useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isFetchingNotifications, setIsFetchingNotifications] = useState(false);
    const [isDisplayingNotifications, setIsDisplayingNotifications] = useState(false);

    useEffect(()=>{
        if(!loading && user != null){
            console.log("user context!!!!",user);
            setUserProfilePhoto(user.userProfilePhoto);
          }
    
    })

    useEffect(()=>{
        function fetchNotifications(){
            setIsFetchingNotifications(true);
            api.get('/getAdminNotifications')
            .then((response)=>{
                    setNotifications(response.data.notifications);
                    setIsFetchingNotifications(false);
            })
            .catch((err)=>{
                
            })
        }

        fetchNotifications();
    },[])

    function onClickWriteButton(e){
        e.preventDefault();
        e.stopPropagation();
        navigate('/articlePosting/null');
    }

    function handleNotificationClick(){
        setIsDisplayingNotifications(!isDisplayingNotifications);
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
                onMouseOver={()=>setIsDisplayingNotifications(true)}
                onClick={(e)=>{
                    e.stopPropagation();
                    handleNotificationClick();
                }}
                >
                <FontAwesomeIcon icon={faBell} className="admin-nav-icon"/>
            </button>
        </div>

        <div className={`bg-light ${!isDisplayingNotifications ? 'd-none':''} d-flex justify-content-center  rounded p-3 overflow-scroll`}
            style={{position:"absolute", top:"55px", right:"40px",zIndex:"2000", width:"350px", height:"70vh"}}>
            
            {
                isFetchingNotifications
                ?<div className="d-flex w-100 h-100 align-items-center">
                    <div className="spinner-border text-info ">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
                :<div className="mt-2">
                    <h5>Notifications</h5>
                    {
                        notifications.map((notification)=>{
                            return <div className="mb-3 mt-3">
                                        <p className="fw-lighter">{decodeString(notification.notificationMessage)}</p>
                                        <span style={{fontWeight:"100", fontSize:"13px", color:"grey"}}> {formatDateTime(notification.createdAt)}</span>
                                        <hr/>
                                    </div>
                        })
                    }
                </div>
            }
            

        </div>
        
    </div>
}