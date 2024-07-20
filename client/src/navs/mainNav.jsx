import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavItem, Dropdown } from "react-bootstrap";
import { useLocation, useNavigate} from "react-router-dom";
import parse from "html-react-parser"
import { useUserContext } from "../userContext";
import api from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import parser from "html-react-parser";

export default function MainNav(){
  var [userLevel,set_userLevel]=useState();
  var [userName,set_userName]=useState();
  var [dropdownOpen,set_dropdownOpen]=useState(false);
  // var [profileImg,set_profileImg]=useState();
  const {loading,user,contextLogout} = useUserContext();
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();
  var cat=useLocation().search;
   
  const toggle_dropdown=()=>set_dropdownOpen(!dropdownOpen)



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
        set_userLevel(user.userLevel);
        set_userName(user.userName);
      }

        window.addEventListener('resize',()=>{set_windowWidth(window.innerWidth)})
        },[loading,user])

    function logout(){
      api.post('/logout')
           .then(()=>{
              set_userName();
              set_userLevel();
              contextLogout();
            })
    }

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
            fill="white"
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
        <Navbar className="d-flex justify-content-between gap-xl-5 ps-xl-0 pe-xl-0 ps-md-5 pe-md-5 ps-3 pe-3 "   id='main-nav' expand={(windowWidth>=1200)?true:false}>
          <Navbar.Brand  href="#home" id="nav-brand" className=" me-auto ">
            <img src={require("../logos/logo.png")} alt="" id="blog-logo" className="img-fluid logo p-0"></img> 
          </Navbar.Brand>
          
      
            <div id="user-nav" className=" d-flex  gap-1  order-xl-2 pe-2 ps-2 ">
              {(typeof userName!=='undefined')
                  ?<NavItem>

                        <button className="btn btn-light btn-user rounded-circle dropdown-toggle m-1" 
                          noCaret style={{backgroundColor:``}}
                          onClick={()=>navigate('/profile')}
                          >
                          {
                          // (profileImg!==undefined)
                          //     ?<img src={require(`../../public/uploads/${profileImg}`)} style={{width:"40px"}}/>
                          //     :userName[0]
                          <FontAwesomeIcon icon={faUser} />

                          }
                        </button>
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
            <Nav className="container-xl gap-1 ps-md-5 ps-2" id="page-links" style={{}}>
              {
                (sections.length !== 0)
                  ?sections.map((section,index)=>{
                   
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