import React from "react";
import Logo from "../logos/logo.png";
import api from "../config/api";
import { useState,useEffect } from "react";
import { Nav } from "react-bootstrap";
import { decodeString } from "../reusables/global";
import { Modal } from "react-bootstrap";

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
            
            <input type="email" 
                  className="col-md-10 col-lg-5" 
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