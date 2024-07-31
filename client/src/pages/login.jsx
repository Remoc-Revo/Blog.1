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
     const [isValidating, setIsValidating] = useState(false);
 
     function login(e){
         e.preventDefault();
         set_errorMessage();
         setIsValidating(true);
 
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
                     setIsValidating(false);
 
                     if( window.history?.length
                         && window.history.length > 2
                         && response.data.userLevel === 0){
                             console.log("why can't w go forward")
                          navigate(-1,{replace:true});
                     }
                     else{
                         navigate("/",{replace:true});
                     }
                 }
             })
             .catch((err)=>{
                 // document.write(err)
                 setIsValidating(false);
                 if(err.response && err.response.status===401){
                     set_errorMessage("Invalid email or password")
                 }
             });
     }
     return(
         <div className="auth-page ">
 
             <div id="auth-form" className="d-flex flex-column">
                 <div className="d-flex justify-content-center">
                     <img className="" src={require("../logos/logo.png")} style={{width:"48%"}} alt=""/>
                     
                 </div>
                 <form onSubmit={login} >
                   
                         <input className="col-md-12" type="text" name="email" placeholder="email" required
                                 value={email} onChange={(e)=>{set_email(e.target.value)}}
                         />
 
                         
                         <input className="col-md-12" type="password" name="password" placeholder="password" required
                             value={password} onChange={(e)=>{set_password(e.target.value)}}
                         />
                     
                     <p style={{color:"red"}}>{errorMessage}</p>
                     <button className="col-md-12 btn-submit" id="" type="submit">
                         {
                             isValidating
                             ?<div className="spinner-border text-white">
                                 <span className="sr-only">Validating...</span>
                             </div>
                             :<span>Login</span>
                         }
                     </button>
 
                     <div className="d-flex justify-content-between" style={{fontSize:"13px"}}>
                             <a href="/register" className="text-decoration-none">Sign up</a>
                             <a href="/resetPassword/null" className="text-decoration-none" >
                                 Forgot  password
                             </a>
                     </div>
                     
                 </form>
             </div>
         </div>
         
     )
 }
 