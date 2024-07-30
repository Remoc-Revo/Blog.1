import React from "react";
import Logo from "../logos/logo.png";
import api from "../config/api";
import { useState,useEffect } from "react";
import { Nav } from "react-bootstrap";
import { decodeString } from "../reusables/global";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faBlogger,faTiktok,faFacebook, faMedium, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [sections, setSections] = useState([]);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [showSubscriptionMessageModal, setShowSubscriptionMessageModal] = useState(false);

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

  const isValidEmail = (email)=> {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test the email against the regex
    return emailRegex.test(email);
  }

  const subscribe = ()=>{

    if(!isValidEmail(subscriberEmail)){
      window.alert('Invalid Email! Please Enter a valid Email');
      return;
    }

    if(subscriberEmail !== ''){
      api.post('/subscribe',{email:subscriberEmail})
         .then((response)=>{
           const responseStatus = response.status;
           if(responseStatus === 200 ) {
            setSubscriptionMessage('You are subcribed  already!')
            setShowSubscriptionMessageModal(true);
           }else if(responseStatus === 201){
            setSubscriptionMessage('Thank you for subscribing!')
            setShowSubscriptionMessageModal(true)
           }

         })
    }
  }

  return (
    <footer className="pb-5">
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-center">
          <div className="col-12 col-lg-9 d-xl-flex justify-content-between align-items-start">
            <div className="d-md-flex">
              <div className="col-md-5 d-lg-flex flex-column align-items-start mb-5">
                  <img src={Logo} alt="" className="blog-logo"/>
                  <div className="">
                    <p className="fw-lighter">Receive the latest health tips and medical news directly in your inbox</p>
                  </div>
                  <div className="col-md-12 d-flex flex-row gap-3 "
                        style={{height:"20px", }}
                  >
                  
                    <input type="email" 
                          className="col-md-7" 
                          placeholder="Enter your email.."
                          value={subscriberEmail}
                          onChange={(e)=>setSubscriberEmail(e.target.value)}
                          style={{height:"34px"}}
                    />
                    <button className="btn btn-dark btn-outline-light"
                            type="submit"
                            style={{height:"34px"}}
                            onClick={subscribe}
                    >
                        Subscribe
                    </button>
                  
                  </div>

                </div>
                <div className="col-md-7 d-flex flex-column justify-content-start gap-2  align-items-md-end align-items-xl-center align-items-xxl-end mt-4">
                  {
                    sections.map((section)=>{
                      // if(section === "uncategorized") return null
                      
                      return <Nav.Link 
                        href={`/?cat=${section}`}
                        className="nav-link">
                          {decodeString(section).toUpperCase()}
                      </Nav.Link>

                    })
                    }
                </div>
              </div>
            <div className="d-flex justify-content-xl-between align-items-start gap-3 mt-5 mt-xl-3 mb-2"> 
                <a href="https://youtu.be/spv7kgNP1Ho?si=QBqpKVufBbWCSK5K" target="_blank" rel="noreferrer" className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faYoutube} size="1x" color="white"/>
                </a>
                <a href="https://www.linkedin.com/in/drliz-okemwa" target="_blank" rel="noreferrer" className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faLinkedin} size="1x" color="white"/>
                </a>
                <a href="https://drlizinspiration.blogspot.com" target="_blank" rel="noreferrer" className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faBlogger} size="1x" color="white"/>
                </a> 
                <a href="https://medium.com/@doctorsandmoney" target="_blank" rel="noreferrer"  className="border border-dark bg-dark  rounded p-2" >
                  <FontAwesomeIcon icon={faMedium} size="1x" color="white"/>
                </a>
                <a href="https://www.facebook.com/elizabeth.okemwa?mibextid=ZbWKwL" target="_blank" rel="noreferrer"  className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faFacebook} size="1x" color="white"/>
                </a>
                <a href="https://www.instagram.com/drlizokemwa?igsh=cWtkenk2aXY1cHFm" target="_blank" rel="noreferrer"  className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faInstagram} size="1x" color="white"/>
                </a>
                <a href="https://www.tiktok.com/@drlizokemwa?_t=8nDH9IAqYnW&amp;_r=1" target="_blank" rel="noreferrer"  className="border border-dark bg-dark  rounded p-2">
                  <FontAwesomeIcon icon={faTiktok} size="1x" color="white"/>
                </a>

              </div> 
          </div>
        </div>
      </div>
      <Modal show={showSubscriptionMessageModal} centered>
        
        <Modal.Body>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sucees" onClick={()=>setShowSubscriptionMessageModal(false)}>
                <span style={{fontSize:"30px"}}>&times;</span>
              </button>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <h3>{subscriptionMessage}</h3>
            </div>
            
          
        </Modal.Body>
         
      </Modal>
      
    </footer>
  );
};

export default Footer;