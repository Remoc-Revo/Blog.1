import React,{useState,useEffect} from "react";
// import { Nav } from "react-bootstrap";
import { NavLink,useLocation } from "react-router-dom";
import axios from "axios";

export default function MainNav(){
    var [userLevel,set_userLevel]=useState();
    var cat=useLocation().search;
     if(cat==="?cat=Lifestyle"){
            console.log("categoryyyyy is",useLocation().search)
     } 
     if(cat==="?cat=Sports"){
        console.log("categoryyyyy isporty",useLocation().search)
 }  
    


    useEffect(()=>{
        axios.get('http://localhost:9000/userLevel')
            .then((response)=>{
                set_userLevel(response.data.userLevel);
                console.log("the level",userLevel)

            })
            .catch((err)=>{
                console.log(err);
            })
        },[])
    return(
        <nav className="nav-bar container" id='main-nav'>
            

            <div className=" d-flex space-between">
                    
                    <h1>MoiVoice</h1>

                    <ul className="nav" id='flexed-nav'>
                        
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link" id={(cat==="")?"active":""} >Latest</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Lifestyle" id={(cat==="?cat=Lifestyle")?"active":""} className="nav-link">Lifestyle</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Sports" id={(cat==="?cat=Sports")?"active":""} className="nav-link">Sports</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Entertainment" id={(cat==="?cat=Entertainment")?"active":""} className="nav-link">Entertainment</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Academics" id={(cat==="?cat=Academics")?"active":""} className="nav-link">Academics</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Health" id={(cat==="?cat=Health")?"active":""} className="nav-link">Health</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Business" id={(cat==="?cat=Business")?"active":""} className="nav-link">Business</NavLink>
                        </li>

                        <li>
                            <NavLink to="/?cat=Politics" id={(cat==="?cat=Politics")?"active":""} className="nav-link">Politics</NavLink>
                        </li>


                    </ul>
                
                <div>
                    {(userLevel===undefined)?<a href="/login" className="btn ">login</a>:<span/> }
                    {(userLevel===1)?<a href="/newsPosting" className="btn ">Update News</a>:<span/>}
                </div>
            </div>

            <hr/>


           
        </nav>


    )
}