import React,{useState,useEffect} from "react";
// import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";

export default function MainNav(){
    var [userLevel,set_userLevel]=useState();

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

                    <ul className="nav " id='flexed-nav'>
                        <li><NavLink to="/" className="nav-link" >Latest</NavLink></li>
                        <li><NavLink to="/lifestyle" className="nav-link">Lifestyle</NavLink></li>
                        <li><NavLink to="/sports" className="nav-link">Sports</NavLink></li>
                        <li><NavLink to="/entertainment" className="nav-link">Entertainment</NavLink></li>
                        <li><NavLink to="/academics" className="nav-link">Academics</NavLink></li>
                        <li><NavLink to="/health" className="nav-link">Health</NavLink></li>
                        <li><NavLink to="/business" className="nav-link">Business</NavLink></li>
                        <li><NavLink to="/politics" className="nav-link">Politics</NavLink></li>


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