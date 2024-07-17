import React from "react";
import Logo from "../logos/logo.png";
import api from "../config/api";
import { useState,useEffect } from "react";
import { Nav } from "react-bootstrap";
import { decodeString } from "../reusables/global";

const Footer = () => {
  const [sections, setSections] = useState([]);

  useEffect(()=>{
    async function fetchSections(){
      await api.get('/sections')
          .then((response)=>{
            // document.write("section name: ", response.data.sections)

            let sectionsBuffer = []
            for(var section of response.data.sections){
                sectionsBuffer.push(section.sectionName);

            }
            setSections(sectionsBuffer);

          })
          .catch((err)=>{
            console.log("error fetching sections", err)
          });        
        }
    fetchSections();
  
  },[]);

  return (
    <footer className="pb-5 d-md-flex justify-content-center ">
      <div className="col-lg-7 d-md-flex">
         <div className="col-md-8 d-md-flex flex-column align-items-start">
            <img src={Logo} alt="" />
            <div className="">
              <p className="fw-lighter">Receive the latest health tips and medical news directly in your inbox</p>
            </div>
            <div className="col-md-9 d-flex flex-row gap-3 "
                  style={{height:"20px", }}
            >
              <input type="text" 
                      className="col-md-7 col-lg-5" 
                      placeholder="Enter your email.."
                      style={{height:"34px"}}
              />
              <button className="btn btn-dark btn-outline-light"
                      style={{height:"34px"}}
              >
                  Subscribe
              </button>
            </div>
          
          </div>
      
          <div className="col-md-4 d-flex flex-column gap-2 mt-4 align-items-md-end">
            {
              sections.map((section)=>{
                return <Nav.Link 
                  href={`/?cat=${section}`}
                  className="nav-link">
                    {section.toUpperCase()}
                </Nav.Link>

              })
            }
          </div>
      </div>
      
    </footer>
  );
};

export default Footer;