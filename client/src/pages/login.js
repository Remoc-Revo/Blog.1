import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";
import api from "../config/api";


export default function Login(){
    const navigate=useNavigate();
    var [email,set_email]=useState();
    var [password,set_password]=useState();
    var [errorMessage,set_errorMessage]=useState();
    const {user,contextLogin,loggingIn} = useUserContext();
    
    function login(e){
        e.preventDefault();
        set_errorMessage();
        loggingIn();
        
        api.post('/login',
            {
                withCredentials:true,
                email:email,
                password:password
            })
            .then((response)=>{
                if(response && response.status===200){
                    contextLogin(response.data)
                    console.log("user after login ",user);
                    navigate("/");
                }
            })
            .catch((err)=>{
                // document.write(err)
                if(err.response && err.response.status===401){
                    set_errorMessage("Invalid email or password")
                }
            });
    }
    return(
        <div className="login-page">

            <div id="login-form">
                <div class="pageHead container">
                    <img class="voiceIcon" src="" alt=""/>
                    <h2><b style={{color:"black"}}>Mordern </b>Mum and Dad</h2>
                </div>
                <form onSubmit={login}>
                    <div  >
                        <label className="col-md-3">Email</label>
                        <input className="col-md-5" type="text" name="email" placeholder="email" required
                                value={email} onChange={(e)=>{set_email(e.target.value)}}
                        />

                    </div>

                    <div >
                        <label className="col-md-3">Password</label>
                        <input className="col-md-5" type="password" name="password" placeholder="password" required
                            value={password} onChange={(e)=>{set_password(e.target.value)}}
                        />
                    </div>
                    
                    <p style={{color:"red"}}>{errorMessage}</p>
                    <input className="col-md-8 btn-success" type="submit" value="login"/>
                    <p>Don't have an account?<a href="/register">Sign up</a></p>
                </form>
            </div>
        </div>
        
    )
}
