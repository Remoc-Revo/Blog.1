import React,{useState,useEffect} from "react";
import axios from "axios";
import MainNav from "../navs/mainNav";
import Footer from "../components/footer";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Profile(){
    var [userName,set_userName]=useState();
    const [userNameModal_show,set_userNameModal_show]=useState(false);
    const [userIconModal_show,set_userIconModal_show]=useState(false);
    const [profileImg,set_profileImg]=useState();

    const navigate=useNavigate();

    useEffect(()=>{
        axios.get("http://localhost:9000/user")
             .then((response)=>{
                // if(response.data.userName===undefined){
                // }
                var fetched_userName=decodeURIComponent(response.data.userName).replace(/&apos;/g,"'");
                set_userName(fetched_userName);
             })
             .catch((err)=>{
                if(err.response.status===401){
                    navigate('/login')
                }
             })
             
    },[])

    function updateUserName(){
        axios.post("http://localhost:9000/updateUserName",
                {userName:encodeURIComponent(userName).replace(/'/g,"&apos;")}
                )
            //  .then((response)=>{
            //     set_userName(response.data.new_userName);
            //  })
             .catch((err)=>{
                if(err.response.status===401){
                    navigate('/login');
                }
             })
    }

    async function upload(){
        let formData=new FormData();
        formData.append('file',profileImg);
        console.log("forrm",formData)
        await axios.post('http://localhost:9000/upload/profileImg',formData)
                    .then(()=>{
                        window.location.reload();
                    })
                    .catch((err)=>{
                        if(err.response.status===401){
                            navigate('/login');
                        }
                    })

    }
    return(
        <div className="position-relative full-page">
            <MainNav/>
            <div className="container pt-4 mb-5 ">
                {(typeof userName !=="undefined")
                    ?<div>
                        <div className="d-flex pt-3 col-7">
                            <button className="btn btn-primary btn-lg rounded-circle">{userName[0]}</button>
                            <button className="btn" onClick={()=>{document.querySelector("#profileImg").click()}}>Edit</button>
                            <input type="file" id="profileImg" className="" onChange={(e)=>set_profileImg(e.target.files[0])}/>
                            <button onClick={upload}>save</button>
                        
                        </div>
                        <div className="d-flex pt-3 col-7">
                            <p className="me-4 pt-2">{userName}</p>
                            <button className="btn " onClick={()=>set_userNameModal_show(true)}>Edit</button>

                            <Modal show={userNameModal_show} onHide={()=>{set_userNameModal_show(false)}}>
                                <Modal.Header>
                                    <p>Edit your user-name</p>
                                </Modal.Header>

                                <Modal.Body>
                                    <form onSubmit={updateUserName}>
                                        <input type="text" value={userName} onChange={(e)=>set_userName(e.target.value)}/>
                                        <input type="submit" value="Update"/>
                                    </form>
                                </Modal.Body>
                            </Modal>
                        </div>
                        
                    </div>
                    
                    :<span></span>
                }
            </div>
        </div>
    )
}