import React from "react";
// import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function MainNav(){
    return(
        <nav className="nav-bar container" >{/*style={{position:"fixed"}}>*/}

            <div className=" container">
                <h1>MoiVoice</h1>
            </div>

            <div className="container ms:4">
                <ul className="nav nav-pills">
                    <li><NavLink to="/" className="nav-link" >Latest</NavLink></li>
                    <li><NavLink to="/lifestyle" className="nav-link">Lifestyle</NavLink></li>
                    <li><NavLink to="/sports" className="nav-link">Sports</NavLink></li>
                    <li><NavLink to="/entertainment" className="nav-link">Entertainment</NavLink></li>
                    <li><NavLink to="/academics" className="nav-link">Academics</NavLink></li>
                    <li><NavLink to="/health" className="nav-link">Health</NavLink></li>
                    <li><NavLink to="/business" className="nav-link">Business</NavLink></li>
                    <li><NavLink to="/politics" className="nav-link">Politics</NavLink></li>


                </ul>
                <hr></hr>
            </div>

            

           
        </nav>


    )
}