import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Register(){
    var [name,setName]=useState('');
    var [email,setEmail]=useState('');
    var [password,setpassword]=useState('');
    var [passwordConfirm,setpasswordConfirm]=useState('');
    var [errorMessage,setErrorMessage]=useState('');

    var [et,set_et]=useState();

    const navigate=useNavigate();


    function validationErrors(){
        errorMessage='';
        var errorBuffer='';

        if(password.length<4){
            errorBuffer+= "*Password must have at least 4 characters";

        }
        if(password!=passwordConfirm){
            errorBuffer+= "*Passwords don't match ";
         }

        const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(email)){
            errorBuffer+= " *Invalid email"
        }
       
        setErrorMessage(errorBuffer);
        return errorBuffer;
    }

    const Register=(e)=>{
        e.preventDefault();
         
        if(validationErrors().length==0){
            
                axios.post("http://localhost:9000/register",
                    {
                        email:email,
                        userName:name,
                        password:password,
                        withCredentials:true
                    }
                    ).then((response)=>{
                            var responseData=response.data;
                            // setErrorMessage("todaf");
                            set_et("trtr")
                            // document.write(response);
                            // //setName(responseData.enteredName);
                            // setpassword(responseData.enteredpassword);
                            // setpasswordConfirm(responseData.enteredpasswordConfirm);
                            // setEmail(responseData.enteredEmail);
                            // setPhone(responseData.enteredPhone);
                            // setRole(responseData.enteredRole);

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
        <div className="container" style={{marginTop:"100px",backgroundColor:"white",padding:"40px",border:"1px solid lightgrey"}}>
            <h1 style={{paddingLeft:"10%"}}>BrianBlog</h1>
            <br/>

            <form onSubmit={Register} method="post">
                <div className="d-flex" style={{marginBottom:"12px"}}>
                    <p className="col-md-4">User Name</p>
                    <input className="col-md-3" type="text" onChange={(e)=>setName(e.target.value)} value={name} required
                        // <% if(typeof enteredName !='undefined'){%>value="<%=enteredName %>"<%}%> 
                        />
                </div>

               
                <div className="d-flex" style={{marginBottom:"12px"}}>
                    <p className="col-md-4">Email</p>
                    <input  className="col-md-3" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} required
                        // <% if(typeof enteredEmail !='undefined'){%>value="<%=enteredEmail %>"<%}%>
                        />
                </div>


               
                <div className="d-flex" style={{marginBottom:"12px"}}>
                    <p className="col-md-4">Password</p>
                    <input className="col-md-3" type="password" value={password} onChange={(e)=>setpassword(e.target.value)} required
                        // <% if(typeof enteredpassword !='undefined'){%>value="<%=enteredpassword %>"<%}%>
                        />
                </div>

                <div className="d-flex" style={{marginBottom:"12px"}}>
                    <p className="col-md-4">Confirm Password</p>
                    <input className="col-md-3" type="password" value={passwordConfirm} onChange={(e)=>setpasswordConfirm(e.target.value)} required
                        // <% if(typeof enteredpasswordConfirm !='undefined'){%>value="<%=enteredpasswordConfirm %>"<%}%>
                        />
                </div>

                
                    <div style={{marginBottom:"12px"}}>
                        <p style={{color:"red"}}>{errorMessage}</p>
                    </div>
                
                <div className="d-flex">
                    <input type="submit" value="Register"/>
                    <a href="/login" style={{paddingLeft:"60%"}}>Have an account?Login</a>
                </div>
            </form>
        </div>


    )
}