import React,{useState,useEffect} from "react";
import axios from "axios";
import MainNav from "../navs/mainNav";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Profile(){
    var [userName,set_userName]=useState();
    var [email,set_email]=useState();
    var [phone,set_phone]=useState();
    var [error,set_error]=useState();
    // const [userIconModal_show,set_userIconModal_show]=useState(false);
    // const [profileImg,set_profileImg]=useState();

    const navigate=useNavigate();

    useEffect(()=>{
        axios.get("http://localhost:9000/user")
             .then((response)=>{
                // if(response.data.userName===undefined){
                // }
                var fetched_userName=decodeURIComponent(response.data.userName).replace(/&apos;/g,"'");
                set_userName(fetched_userName);
                const fetched_email=decodeURIComponent(response.data.email).replace(/&apos;/g,"'");
                set_email(fetched_email);
                const fetched_phone=decodeURIComponent(response.data.phone).replace(/&apos;/g,"'");
                set_phone(fetched_phone);
             })
             .catch((err)=>{
                if(err.response.status===401){
                    navigate('/login')
                }
             })
             
    },[])

    function updateUser(){
        axios.post("http://localhost:9000/updateUser",
                {userName:userName,
                 email:email,
                 phone:phone
                }
                )
             .then((response)=>{
                if(response.status==200){
                    window.location.reload();
                }
             })
             .catch((err)=>{
                if(err.response.status===401){
                    navigate('/login');
                }
                if(err.response.status===400){
                    set_error(err.response.data.error);
                }
             })
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
        <div className="position-relative full-page">
            <MainNav/>
            <div className="container pt-4 mb-5 col-sm-5 col-md-4 col-lg-3">
                {(typeof userName !=="undefined" && typeof email!=="undefined" && typeof phone !== "undefined")
                    ?<div className="">
                        <div className="container pt-3  col-8 col-sm-3 ">
                            <button className="btn btn-primary btn-lg rounded-circle" id="userName_Icon">{userName[0]}</button>
                            {/* <button className="btn" onClick={()=>{document.querySelector("#profileImg").click()}}>Edit</button>
                            <input type="file" id="profileImg" className="" onChange={(e)=>set_profileImg(e.target.files[0])}/>
                            <button onClick={upload}>save</button> */}
                        
                        </div>
                        <div className=" pt-3">
                            <form onSubmit={updateUser}>
                                <div className="mt-3">
                                    <label className="d-block">Display name</label>
                                    <input type="text" value={userName}  onChange={(e)=>set_userName(e.target.value)} required/>
                                </div>

                                <div className="mt-3">
                                    <label className="d-block">Email</label>
                                    <input type="email" value={email}  onChange={(e)=>set_email(e.target.value)} required/>
                                </div>

                                <div className="mt-3">
                                    <label className="d-block">Phone</label>
                                    <input  value={phone}  minLength={10} onChange={(e)=>set_phone(e.target.value)} required/>
                                </div>

                                <p style={{color:"red"}}>{error}</p>
                                <div className="d-flex mt-3 col-9 justify-content-sm-end">
                                    <input type="submit" className="btn " value="Update"/>
                                </div> 
                            </form>
                            
                        
                        </div>
                        
                    </div>
                    
                    :<span></span>
                }
            </div>
        </div>
    )
}