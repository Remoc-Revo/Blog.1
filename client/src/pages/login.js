import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../userContext";
import api from "../config/api";


export default function Login(){
    const navigate=useNavigate();
    var [email,set_email]=useState();
    var [password,set_password]=useState();
    var [errorMessage,set_errorMessage]=useState();
    const {user,contextLogin} = useUserContext();

    function login(e){
        e.preventDefault();
        set_errorMessage();
        
        api.post('/login',
            {
                withCredentials:true,
                email:email,
                password:password
            })
            .then((response)=>{
                if(response && response.status===200){
                    contextLogin(response.data);
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
        <div className="login-page ">

            <div id="login-form" className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                    <img class="" src={require("../logos/logo.png")} style={{width:"48%"}} alt=""/>
                    
                </div>
                <form onSubmit={login} >
                  
                        <input className="col-md-12" type="text" name="email" placeholder="email" required
                                value={email} onChange={(e)=>{set_email(e.target.value)}}
                        />


                        <input className="col-md-12" type="password" name="password" placeholder="password" required
                            value={password} onChange={(e)=>{set_password(e.target.value)}}
                        />
                    
                    <p style={{color:"red"}}>{errorMessage}</p>
                    <input className="col-md-12 " id="btn-login" type="submit" value="login"/>
                    <span>Don't have an account?<a href="/register">Sign up</a></span>
                </form>
            </div>
        </div>
        
    )
}
