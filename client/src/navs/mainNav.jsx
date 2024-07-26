import React,{useState,useEffect} from "react";
import { Nav, Navbar, NavItem} from "react-bootstrap";
import { useLocation, useNavigate} from "react-router-dom";
import { useUserContext } from "../userContext";
import api from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import parser from "html-react-parser";

export default function MainNav(){
  var [userName,set_userName]=useState();
  const [userProfilePhoto,setUserProfilePhoto]=useState(null);
  const {loading,user} = useUserContext();
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();
  var cat=useLocation().search;
   
  var [windowWidth,set_windowWidth]=useState(window.innerWidth)

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

      if(!loading && user != null){
        console.log("user context!!!!",user);
        set_userName(user.userName);
        setUserProfilePhoto(user.userProfilePhoto);
      }

        window.addEventListener('resize',()=>{set_windowWidth(window.innerWidth)})
        },[loading,user])

    const customToggle = ({onClick})=>{
      return <button
                onClick={
                  (e) =>{
                    e.preventDefault();
                    onClick(e);
                  }
                }
                className=""
                id = "menu-button"
              >
                <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="black"
          >
            <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
          </svg>
              </button>
    }

    return(
      
      <div className={`${(windowWidth>=1200)?'container':''} `}>
        <Navbar className="d-flex justify-content-between gap-xl-5 "   id='main-nav' expand={(windowWidth>=1200)?true:false}>
          <Navbar.Brand  href="#home" id="nav-brand" className=" me-auto ">
            <img src={require("../logos/logo.png")} alt="" className="blog-logo  logo p-0"></img> 
          </Navbar.Brand>
          
      
            <div id="user-nav" className=" d-flex  gap-1  order-xl-2 pe-2 ps-2 ">
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
                  : <Nav.Link href="/login" className="nav-link m-2">login</Nav.Link>
              }
              
            
              {/* {(userLevel===1)
                ?<div className="d-flex me-2" id = "write-button-container">
                  <button onClick={()=>{navigate(`/articlePosting/${null}`)}} className="btn btn-transparent  col-xs col-md " title="Write">
                    <h6>Write</h6>
                  </button>
                                    
                 </div>
                :<span/>} */}
            </div>
          
          <Navbar.Toggle as={customToggle} aria-controls="basic-navbar-nav" className="order-xl-1 me-2 ms-2"/>
          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="container-xl gap-1 ps-md-5 ps-4" id="page-links" style={{}}>
              {
                (sections.length !== 0)
                  ?sections.map((section,index)=>{
                    if(section === "uncategorized") return null
                    
                    return <Nav.Link 
                              href={`/?cat=${section}`}
                              id={(decodeString(cat)===`?cat=${section}`)?"active":""} 
                              className="nav-link">
                                {section.toUpperCase()}
                            </Nav.Link>

                  })
                  :null
              }
             
             
            </Nav>
           {/*  <div className="col-sm-2 col-md-3 d-lg-flex justify-content-lg-end ">
                {(userLevel===1 || userLevel===0)?<Nav.Link href="/logout" className=" col-xs col-md ms-1">Logout</Nav.Link>:<span/>} 
            </div>*/}
          </Navbar.Collapse>
          
        </Navbar>
      
      </div>
        
  
       


    )
}