import React,{useState} from "react";
// import { useNavigate } from "react-router-dom";
// import { useUserContext } from "../userContext";
import api from "../config/api";
import { useParams } from "react-router-dom";


export default function ResetPassword(){
    // const navigate=useNavigate();
    const [email,set_email]=useState();
    const [oldPassword,setOldPassword]=useState();
    const [newPassword,setNewPassword]=useState();
    const [errorMessage,set_errorMessage]=useState();
    const {resetToken} = useParams();
    // const {user,contextLogin} = useUserContext();

    function requestPasswordReset(e){
        e.preventDefault();
        set_errorMessage();
        
        api.post('/requestPasswordReset',
            {
                withCredentials:true,
                email:email,
            })
            .then((response)=>{
                if(response && response.status===200){
                }
                document.write(response.status)
            })
            .catch((err)=>{
                // document.write(err)
                if(err.response && err.response.status===401){
                    set_errorMessage("Entered email is not registered")
                }
            });
    }
    return(
        <div className="auth-page ">

            <div id="auth-form" className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                    <img class="" src={require("../logos/logo.png")} style={{width:"48%"}} alt=""/>
                    
                </div>
                <form onSubmit={requestPasswordReset} >
                  
                        <input className="col-md-12" type="text" name="email" placeholder="email" required
                                value={email} onChange={(e)=>{set_email(e.target.value)}}
                        />

                        
                        <div className={`${resetToken === 'null' ? 'd-none': ''}`}>
                            <input className="col-md-12" type="password" name="password" placeholder="password" required
                                value={oldPassword} onChange={(e)=>{setOldPassword(e.target.value)}}
                            />

                            <input className="col-md-12" type="password" name="password" placeholder="password" required
                                value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}}
                            />
                        </div>
                        
                    
                    <p style={{color:"red"}}>{errorMessage}</p>

                    {
                        resetToken === 'null'
                        ?<input className="col-md-12 btn-submit" id="" type="submit" value="Submit" onClick={requestPasswordReset}/>
                        :<input className="col-md-12 btn-submit" id="" type="submit" value="Change Password"/>
                    }
                    

                    
                </form>
            </div>
        </div>
        
    )
}
