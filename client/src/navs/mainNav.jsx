import React,{useState,useEffect} from "react";
import { Nav, Navbar, NavItem} from "react-bootstrap";
import { useLocation, useNavigate} from "react-router-dom";
import api from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faUser,
          faBarsStaggered,
          faSearch,
          faTimes,
          faChevronRight
         } from "@fortawesome/free-solid-svg-icons";
import { faYoutube, faBlogger,faTiktok,faFacebook, faMedium, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import parser from "html-react-parser";
import { Modal } from "react-bootstrap";

export default function MainNav(){
  var [userName,setUserName]=useState();
  const [userProfilePhoto,setUserProfilePhoto]=useState(null);
  const [sections, setSections] = useState([]);
  const [showSideNav, setShowSideNav] =useState(false);
  const navigate = useNavigate();
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [showSubscriptionMessageModal, setShowSubscriptionMessageModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  var cat=useLocation().search;
   
  function decodeString(str){
    return parser(decodeURIComponent(str).replace(/&apos;/g,"'").replace(/<p>/g,"").replace(/<\/p>/g,""))
}

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

        
        },[])

    useEffect(()=>{
      api.get('/user',{withCredentials:true})
      .then((response)=>{
          setUserProfilePhoto(response.data.userProfilePhoto);
          setUserName(response.data.userName)
      })
      .catch((err)=>{

      })
      
        console.log("the user profile photot", userProfilePhoto)
  
    },[userProfilePhoto]);

    useEffect(()=>{
      const onScreenClick = ()=>{
        setShowSideNav(false);
      }
      window.addEventListener('click',onScreenClick);

      return ()=>{
        window.removeEventListener('click',onScreenClick);
      }
    })

    
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
              if(showSubscriptionModal){
                setShowSubscriptionModal(false);
              }
              setSubscriptionMessage('You are subcribed  already!')
              setShowSubscriptionMessageModal(true);
             }else if(responseStatus === 201){
              if(showSubscriptionModal){
                setShowSubscriptionModal(false);
              }
              setSubscriptionMessage('Thank you for subscribing!')
              setShowSubscriptionMessageModal(true)
             }
  
           })
      }
    }

    return(
      
      <div className={`col-12 b-white`} >
        <div className=" w-100 border-bottom">
          <div className="container p-2 p-sm-0">
            <div className="d-flex justify-content-center">
              <div className="col-12 col-lg-9 d-flex justify-content-between align-items-center pt-2 pb-2 pb-xl-0">
                  <button className="btn btn-light no-focus-outline rounded-0 d-flex align-items-center justify-content-center gap-2 p-2"
                    onClick={(e)=>{
                      e.stopPropagation();
                      setShowSideNav(true);
                    }}
                    style={{height:"28px"}}>
                    <FontAwesomeIcon icon={faBarsStaggered}/>
                    <span className="d-none d-xl-block">All sections</span>
                  </button>
                  <img src={require("../logos/logo.png")} alt="" className="blog-logo  logo p-0"></img>
                  <div className="d-flex gap-1 align-items-center justify-content-center">
                    {(typeof userName!=='undefined')
                          ?<NavItem>

                              
                            <div style={{backgroundColor:'lightgrey', width:"50px",height:"50px"}}
                              className="d-flex justify-content-center align-items-center rounded-circle overflow-hidden"
                              onClick={()=>navigate('/profile')}
                              >

                              
                                {
                                (userProfilePhoto!==null)
                                    ?<img src={userProfilePhoto} alt="" className="w-100 h-100 object-fit-cover rounded-circle" style={{}}/>
                                    :<FontAwesomeIcon icon={faUser} className="ic-white w-100 h-100 pt-2"/>

                                }
                            </div>
                                
                            </NavItem>
                          : <Nav.Link href="/login" className="nav-link m-2">sign in</Nav.Link>
                    } 
                    <button className="btn btn-dark no-focus-outline rounded-0 d-none d-md-flex align-items-center justify-content-center "
                      onClick={()=>setShowSubscriptionModal(true)}
                      style={{height:"28px", width:"90px"}}>
                        Subscribe
                    </button>
                    <button className="btn no-focus-outline">
                      <FontAwesomeIcon icon={faSearch} className="ic-grey"/>
                    </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-100 border-bottom" style={{display:sections.length < 2 || window.innerWidth < 1200 ? "none" : "block"}}>
          <div className="container p-0">
            <div className="d-flex justify-content-center">
              <Navbar className="col-lg-9  gap-xl-5 p-0 pt-2"   id='main-nav' expand={(window.innerWidth>=1200)?true:false}>
                <Navbar.Collapse id="basic-navbar-nav" className="col-12">
                  <Nav className="container-xl gap-1  d-flex justify-content-between p-0" id="page-links" style={{}}>
                    {
                      (sections.length !== 0)
                        ?sections.map((section,index)=>{
                          if(section === "uncategorized" && index < 7) return null
                          
                          return <Nav.Link 
                                    href={`/?cat=${section}`}
                                    id={(decodeString(cat)===`?cat=${section}`)?"active":""} 
                                    className="nav-link pb-2">
                                      {section}
                                  </Nav.Link>

                        })
                        :null
                    }
                  
                  
                  </Nav>
                </Navbar.Collapse>
                
              </Navbar>
            </div>
          </div>
          
        </div>
        
        {
          showSideNav &&
          <div className="position-fixed top-0 left-0 w-100 h-100 " style={{backgroundColor:"rgba(0,0,0,0.5", zIndex:"200"}} >
            <div className="col-12 bg-white h-100 slide-in p-4" style={{width:window.innerWidth > 650 ?"400px" : "100vw"}}
                 onClick={(e)=>e.stopPropagation()}
                 >
                <button className="btn border  no-focus-outline"
                  onClick={()=>setShowSideNav(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                <div className="d-xl-none d-flex justify-content-between gap-3 pb-3 pt-3" style={{borderBottom:"2px solid black"}}>
                  <button className="btn btn-dark no-focus-outline d-flex align-items-center justify-content-center col-6"
                    onClick={()=>setShowSubscriptionModal(true)}
                    style={{height:"40px"}}>
                      Subscribe
                  </button>
                  <button className="btn btn-light no-focus-outline d-flex align-items-center justify-content-center col-6"
                      onClick={()=>navigate('/login')}
                      style={{height:"40px"}}>
                        Sign in
                    </button>
                </div>

                <div className="d-flex flex-column gap-4 mt-4 border-bottom pb-4">
                {
                  (sections.length !== 0) &&
                  sections.map((section,index)=>{
                                        
                    return <a 
                          href ={`/?cat=${section}`}
                              // id={(decodeString(cat)===`?cat=${section}`)?"active":""} 
                              className="nav-link d-flex justify-content-between">                                
                                <span>{section}</span>
                                <FontAwesomeIcon icon={faChevronRight} className="ic-grey"/>
                            </a>
                  })
                     
                  }
                </div>


                <div className="d-flex justify-content-between mt-5"> 
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

                <div className="col-12 d-md-flex flex-column align-items-start border p-3 mt-5">
                  <div className="">
                    <p className="fw-lighter">Receive the latest health tips and medical news directly in your inbox</p>
                  </div>
                  <div className="col-12 d-flex flex-row gap-1"
                        style={{ }}
                  >
                  
                    <input type="email" 
                          className="col-8 p-2" 
                          placeholder="Enter your email.."
                          value={subscriberEmail}
                          onChange={(e)=>setSubscriberEmail(e.target.value)}
                          style={{height:"34px"}}
                    />
                    <button className="btn btn-secondary btn-outline-light rounded-0 col-4 d-flex align-items-center justify-content-center"
                            type="submit"
                            style={{height:"34px"}}
                            onClick={subscribe}
                    >
                        <span>Sign up</span>
                    </button>
                  
                  </div>

                </div>
                
            </div>
          </div>
        }

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


      <Modal show={showSubscriptionModal}  centered>
        <Modal.Body>
          <div className="col-12 d-flex flex-column align-items-start  p-3 m-2 ">
              <div className="">
                <p className="fw-lighter">Subscribe to Receive the latest health
                   tips and medical news directly in your inbox.</p>
              </div>
              <input type="email" 
                      className="col-12 p-2 mb-3" 
                      placeholder="Enter your email.."
                      value={subscriberEmail}
                      onChange={(e)=>setSubscriberEmail(e.target.value)}
                      style={{height:"34px"}}
              />
              <div className="col-12 d-flex flex-row gap-1"
                    style={{ }}
              >
                <button className="btn btn-light col-6" onClick={()=>setShowSubscriptionModal(false)}
                  style={{height:"34px"}}>
                  cancel
                </button>
                <button className="btn btn-secondary btn-outline-light rounded-0 col-6 d-flex align-items-center justify-content-center"
                        type="submit"
                        style={{height:"34px"}}
                        onClick={subscribe}
                >
                    <span>Sign up</span>
                </button>
              
              </div>

            </div>
        </Modal.Body>
      </Modal>
      </div>
        
  
       


    )
}