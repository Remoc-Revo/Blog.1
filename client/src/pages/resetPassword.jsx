import React,{useState} from "react";
 import { useNavigate } from "react-router-dom";
 import { Modal } from "react-bootstrap";
 // import { useUserContext } from "../userContext";
 import api from "../config/api";
 import { useParams } from "react-router-dom";
 
 
 export default function ResetPassword(){
     const navigate=useNavigate();
     const [email,set_email]=useState();
     const [newPassword,setNewPassword]=useState();
     const [passwordConfirm,setPasswordConfirm]=useState();
     const [errorMessage,setErrorMessage]=useState();
     const {resetToken} = useParams();
     const [isValidating, setIsValidating] = useState(false);
     const [showSuccessModal, setShowSuccesModal] = useState(false);
     const [successMessage, setSuccessMessage] = useState();
     // const {user,contextLogin} = useUserContext();
 
 
     function requestPasswordReset(e){
         e.preventDefault();
         setErrorMessage();
         setIsValidating(true);
 
         api.post('/requestPasswordReset',
             {
                 withCredentials:true,
                 email:email,
             })
             .then((response)=>{
                 setIsValidating(false);
                 if(response && response.status===200){
                     setSuccessMessage(`A password reset link has been sent to your email. Please check your spam folder if you don't see it in your inbox.`);
                     setShowSuccesModal(true);
                 }
             })
             .catch((err)=>{
                 setIsValidating(false);
                 // document.write(err)
                 if(err.response && err.response.status===401){
                     setErrorMessage("Entered email is not registered")
                 }
             });
     }
 
 
     function validationErrors(){
         var errorBuffer='';
 
         if(newPassword.length<4){
             errorBuffer+= "*Password must have at least 4 characters";
 
         }
         if(newPassword!==passwordConfirm){
             errorBuffer+= "*Passwords don't match ";
          }
 
         const emailRegex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
         if(!emailRegex.test(email)){
             errorBuffer+= " *Invalid email"
         }
        
         setErrorMessage(errorBuffer);
         return errorBuffer;
     }
 
     const resetPassword=(e)=>{
         e.preventDefault();
         if(validationErrors().length===0){
             setIsValidating(true);
 
                 api.post("/resetPassword",
                     {
                         email:email,
                         password:newPassword,
                         resetToken:resetToken,
                         withCredentials:true
                     }
                     ).then((response)=>{
                             setIsValidating(false);                            
                             if(response && response.status===201){
                                 setSuccessMessage('Password reset successful!');
                                 setShowSuccesModal(true);
                             }
                     })
                 .catch((err)=>{
                     setIsValidating(false);
                 // document.write("the error:   ",err);
 
                     if(err.response.status===401){
                         // document.write(err)
                         setErrorMessage(err.response.data.errors);                    
                     }
                 });
         }
        
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
                             <input className="col-md-12" type="password" name="password" placeholder="new password" required
                                 value={newPassword} onChange={(e)=>{setNewPassword(e.target.value)}}
                             />
 
                             <input className="col-md-12" type="password" name="password" placeholder="confirm password" required
                                 value={passwordConfirm} onChange={(e)=>{setPasswordConfirm(e.target.value)}}
                             />
                         </div>
                         
                     
                     <p style={{color:"red"}}>{errorMessage}</p>
 
                     {
                         resetToken === 'null'
                         ?<button className="col-md-12 btn-submit" id="" type="submit" onClick={requestPasswordReset}>
                             {isValidating
                                 ?<div className="spinner-border text-white">
                                     <span className="sr-only">Validating...</span>
                                 </div>
                                 :<span>Submit</span>
                             }
                         </button>
                         :<button className="col-md-12 btn-submit" id="" type="submit" onClick={resetPassword}>
                              {isValidating
                                 ?<div className="spinner-border text-white">
                                     <span className="sr-only">Validating...</span>
                                 </div>
                                 :<span>Change Password</span>
                             }
                         </button>
                     }
                     
 
                     
                 </form>
             </div>
 
             <Modal show={showSuccessModal} centered>
                     <Modal.Body>
                         <div className=" d-flex flex-column justify-content-center">
                             <p>{successMessage}</p>
                             <div>
                                 <button className=" col-12 btn btn-light" 
                                     onClick={()=>{
                                         setShowSuccesModal(false);
                                         navigate("/login");
                                     }}>
                                     Okay
                                 </button>
                             </div>
                         </div>
                     </Modal.Body>
             </Modal>
         </div>
         
     )
 }
 