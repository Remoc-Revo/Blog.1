import React,{useState} from "react";
import api from "../config/api";
import {useNavigate} from "react-router-dom";

export default function Register(){
    var [name,setName]=useState('');
    var [email,setEmail]=useState('');
    var [password,setpassword]=useState('');
    var [passwordConfirm,setpasswordConfirm]=useState('');
    var [errorMessage,setErrorMessage]=useState('');

    const navigate=useNavigate();


    function validationErrors(){
        errorMessage='';
        var errorBuffer='';

        if(password.length<4){
            errorBuffer+= "*Password must have at least 4 characters";

        }
        if(password!==passwordConfirm){
            errorBuffer+= "*Passwords don't match ";
         }

        const emailRegex=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            errorBuffer+= " *Invalid email"
        }
       
        setErrorMessage(errorBuffer);
        return errorBuffer;
    }

    const Register=(e)=>{
        e.preventDefault();
         
        if(validationErrors().length===0){
            
                api.post("/register",
                    {
                        email:email,
                        userName:name,
                        password:password,
                        withCredentials:true
                    }
                    ).then((response)=>{
                            
                            if(response && response.status===200){
                                navigate("/login");
                            }
                    })
                .catch((err)=>{
                // document.write("the error:   ",err);

                if(err.response.status===400){
                    // document.write(err)
                    setErrorMessage(err.response.data.errors);

                    
                }
                });
        }
       
    }

    return(
    <div id="register-page" className="d-flex flex-column justify-content-center ">
        <div className="container d-flex flex-column bg-white justify-content-center align-items-center" 
            id="register-form"
            style={{}}>
            <div className="d-flex justify-content-center mb-4">
                <img className="" src={require("../logos/logo.png")} style={{width:"78%"}} alt=""/>
            </div> 

            <form onSubmit={Register} method="post" className="d-flex flex-column gap-2">
               
                    <input className="col-12" type="text" placeholder="User name" onChange={(e)=>setName(e.target.value)} value={name} required
                        // <% if(typeof enteredName !='undefined'){%>value="<%=enteredName %>"<%}%> 
                        />

               
               
                    <input  className="col-12" type="text" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required
                        // <% if(typeof enteredEmail !='undefined'){%>value="<%=enteredEmail %>"<%}%>
                        />


               
               
                    <input className="col-12" type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)} required
                        // <% if(typeof enteredpassword !='undefined'){%>value="<%=enteredpassword %>"<%}%>
                        />

               
                    <input className="col-12" type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={(e)=>setpasswordConfirm(e.target.value)} required
                        // <% if(typeof enteredpasswordConfirm !='undefined'){%>value="<%=enteredpasswordConfirm %>"<%}%>
                        />

                
                    <div style={{}}>
                        <p style={{color:"red"}}>{errorMessage}</p>
                    </div>
                
                    <div className="d-flex flex-column">
                        <input type="submit" value="Register" className="col-12 btn-submit"/>
                       <div className="col-12 d-flex justify-content-center">
                        <p className="mt-3 ">
                                Have an account?
                                <a href="/login" style={{}}>Login</a>
                            </p>
                        </div>
                    </div>
            </form>
        </div>
    </div>

    )
}