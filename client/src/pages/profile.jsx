import React,{useState,useEffect, useCallback} from "react";
 import api from "../config/api";
 import { useNavigate } from "react-router-dom";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faUser,faCloudArrowUp, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
 import { useUserContext } from "../userContext";
 import { uploadImageToCloud } from "../reusables/global";
 
 export default function Profile(){
     var [userName,set_userName]=useState();
     // var [userId,set_userId]=useState();
     var [email,set_email]=useState();
     var [error,set_error]=useState();
     const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);
     const [userFirstName, setUserFirstName] = useState(null);
     const [userLastName, setUserLastName] = useState(null);
     const [userDescription, setUserDescription] = useState(null);
     const {contextLogout} = useUserContext();
     // const [userIconModal_show,set_userIconModal_show]=useState(false);
     const [profilePhoto,setProfilePhoto]=useState(null);
     const [updatingProfile, setUpdatingProfile] = useState(false);
 
     const navigate=useNavigate();
 
     const fetchUserInfo = useCallback(
         ()=>{
         api.get("/user")
              .then((response)=>{
                 // if(response.data.userName===undefined){
                 // }
                 var fetched_userName=decodeURIComponent(response.data.userName).replace(/&apos;/g,"'");
                 set_userName(fetched_userName);
                 const fetched_email=decodeURIComponent(response.data.email).replace(/&apos;/g,"'");
                 set_email(fetched_email);
                 setUserFirstName(response.data.userFirstName);
                 setUserLastName(response.data.userLastName);
                 setUserDescription(response.data.userDescription);
                 // set_userId(response.data.userId)
                 setProfilePhoto(response.data.userProfilePhoto);
              })
              .catch((err)=>{
                 if(err.response.status===401){
                     navigate(-1);
                 }
              })
     }
     ,[navigate])
 
     useEffect(()=>{
         fetchUserInfo();
              
     },[fetchUserInfo])
 
     // const config={
     //     headers:{
     //         'Content-Type' : 'application/json'
     //     }
     // }
 
     const  handleUpdateUser = async(e)=>{
         e.preventDefault();
 
         setUpdatingProfile(true);
         if(profilePhotoChanged){
            let newProfilePhoto = await uploadImageToCloud(profilePhoto);
            updateUser(newProfilePhoto);
         }
         else{
             console.log("photo not changed")
             updateUser(null);
         }
         // console.log("new profile photo", newProfilePhoto)
 
     }
 
     async function updateUser(newProfilePhoto){
         
         await api.post("/updateUser",
                 {
                     headers:{
                         'Content-Type' : 'application/json'
                     },
                     withCredentials:true,
                     userName: userName,
                     userFirstName: userFirstName,
                     userLastName: userLastName,
                     userDescription: userDescription,
                     newProfilePhoto: newProfilePhoto
                 }
                 
                 )
              .then((response)=>{
                 if(response.status===201){
                     fetchUserInfo();
                     setUpdatingProfile(false);
                 }
              })
              .catch((err)=>{
                 if(err.response.status===401){
                     navigate('/');
                 }
                 if(err.response.status===400){
                     set_error(err.response.data.error);
                     setUpdatingProfile(false);
 
                 }
              })
     }
 
     function logout(){
         api.post('/logout')
              .then(()=>{
                 navigate(-1);
                 contextLogout();
               })
       }
 
     const handlePhotoChange = (e)=>{
         const file = e.target.files[0];
 
         if(file){
             const reader = new FileReader();
             reader.onloadend = ()=>{
                 setProfilePhoto(reader.result);
                 setProfilePhotoChanged(true);
             }
             reader.readAsDataURL(file);
         }
     }
   
     const triggerFileInput = ()=>{
         document.getElementById("photo-input").click();
     }
 
     // async function upload(){
     //     let formData=new FormData();
     //     formData.append('file',profileImg);
     //     console.log("forrm",formData)
     //     await axios.post('http://localhost:9000/upload/profileImg',formData)
     //                 .then(()=>{
     //                     window.location.reload();
     //                 })
     //                 .catch((err)=>{
     //                     if(err.response.status===401){
     //                         navigate('/login');
     //                     }
     //                 })
 
     // }
 
 
     return(
         <div className="position-relative bg-light"
             style={{width:"100vw",height:"100vh"}}
             id="user-profile"
             >
             <form>
                 <div className="container-lg d-flex   justify-content-center">
                     <div className="col-lg-8 col-md-9  bg-white mt-md-5 p-4" id="user-info">
                         <div className="mt-3 pb-3 mb-3">
                             <h6> My Profile</h6>
                             <span className="fw-lighter"> Set your name,bio, and other public-facing information.</span>
                             <hr/>
                         </div>
                         
 
                         {(typeof userName !=="undefined" && typeof email!=="undefined" )
                             ?<div className="mt-2 border ">
                                 <label className="p-2 pb-1">Profile</label>
                                 <hr/>
                                 <div className="d-md-flex col-md-12  p-3 pe-5 ps-4">
 
                                     <div className=" col-md-4 d-flex flex-column align-items-center ">
                                         <input type="file"
                                                id ="photo-input"
                                                style={{display:"none"}}
                                                onChange={handlePhotoChange}
                                                accept="image/*"
                                         />
                                         <div className="position-relative rounded-circle"
                                             style={{width:"120px",height:"120px"}}
                                             onClick={triggerFileInput}
                                             >
                                             
                                            { 
                                             (profilePhoto ==null) 
                                                 ?<div className="rounded-circle overflow-hidden"
                                                     style={{width:"100%",height:"100%",backgroundColor:"grey"}}
                                                     >
                                                     <FontAwesomeIcon className=" pt-2 ic-light-grey" icon={faUser}  
                                                         style={{width:"100%",height:"100%"}}/>
 
                                                 </div>
                                                 :<div className="rounded-circle w-100 h-100 overflow-hidden">
                                                     <img src={profilePhoto} alt="" className="object-fit-cover w-100 h-100"/>
                                                 </div>
                                             }
 
                                             
                                             
 
                                             <div className="d-flex flex-column align-items-center justify-content-center text-center rounded-circle" 
                                                 style={{position:"absolute",top:"0",width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.3)"}}
                                                 >
                                                 <FontAwesomeIcon icon={faCloudArrowUp} className="ic-white"/>
                                                 <span className="text-white">Click to change photo</span>
                                             </div>
                                         </div>
 
                                         <i className="fw-lighter text-center me-1">Your profile photo is public</i>
                                     </div>
                                     <div className="col-md-8 d-flex flex-column align-items-start gap-3">
                                         <div className="col-12">
                                             <label className="profile-label">First name</label>
                                             <input type="text"maxLength={50} name="userFirstName"
                                                 className="col-12 border-light-grey p-2"
                                                 value={userFirstName}
                                                 onChange={(e)=>{setUserFirstName(e.target.value)}}
                                                 />
                                         </div>
                                         
                                         <div className="col-12">
                                             <label className="profile-label">Last name</label>
                                             <input type="text" maxLength={50} name="userLastName"
                                                 className="col-12 border-light-grey p-2"
                                                 value={userLastName}
                                                 onChange={(e)=>{setUserLastName(e.target.value)}}
                                             />
                                         </div>
                                     </div>
                                 </div>
                                 <div className="col-12 mt-3 pe-5 ps-4 d-flex flex-column gap-3">
                                     <div className="">
                                         <label className="d-block profile-label">Display name</label>
                                         <input type="text" className="col-12 border-light-grey p-2" 
                                             maxLength={50} name="userName"
                                             value={userName}  onChange={(e)=>set_userName(e.target.value)} 
                                             required/>
                                     </div>
 
                     
                                     <div>
                                         <label className="profile-label">About me</label>
                                         <textarea rows={6} maxLength={1000} 
                                             className="p-2 col-12 border-light-grey"
                                             value={userDescription}
                                             onChange={(e)=>{setUserDescription(e.target.value)}}
                                             />
                                     </div>
 
                                     <p style={{color:"red"}}>{error}</p>
                                     <div className="d-flex gap-2 col-12 justify-content-between mb-2">
                                         <button  className="btn border col-md-5 col-9 no-focus-outline" onClick={handleUpdateUser}>
                                             {
                                                 updatingProfile
                                                 ?<div className="spinner-border text-info">
                                                     <span className="sr-only">Loading...</span>
                                                 </div>
                                                 :<span className="fw-light">Update profile details</span>
                                             }
                                             
                                         </button>
 
                                         <button className="btn border no-focus-outline" onClick={logout}>
                                             <FontAwesomeIcon icon={faRightFromBracket} className="me-1"/>
                                             <span className="fw-light">Logout</span>
                                         </button>
                                     </div> 
                                     
                                 
                                 </div>
                                 
                             </div>
                             
                             :<span></span>
                         }
                         
                     </div>
                 </div>
             </form>
            
 
            
         </div>
     )
 }