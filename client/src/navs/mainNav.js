import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavItem, Dropdown } from "react-bootstrap";
import { useLocation, useNavigate} from "react-router-dom";
import parse from "html-react-parser"
import { useUserContext } from "../userContext";
import api from "../config/api";

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
      <div className=" bg-light">
        <Navbar className=" d-flex "   id='main-nav' expand={(windowWidth>=1200)?true:false}>
          <Navbar.Brand  href="#home" id="nav-brand" className="ps-xl-3 ps-3 me-auto ">
            <img src={require("../logos/logo.png")} alt="" id="blog-logo" className="img-fluid logo p-0"></img> 
          </Navbar.Brand>
          
      
            <div id="user-nav" className="d-flex  gap-1  order-xl-2 me-lg-5">
              {(typeof userName!=='undefined')
                  ?<NavItem>
                      <Dropdown isOpen={dropdownOpen} toggle={toggle_dropdown} className=" me-2">
                        <Dropdown.Toggle className="btn  rounded-circle dropdown-toggle" noCaret style={{backgroundColor:`light-green`}}>
                          {
                          // (profileImg!==undefined)
                          //     ?<img src={require(`../../public/uploads/${profileImg}`)} style={{width:"40px"}}/>
                          //     :userName[0]
                            userName[0]

                          }
                        </Dropdown.Toggle>

                        <Dropdown.Menu className=" position-absolute translate-middle-x" id="user-dropdown-menu">
                          <div className="container">
                            <Dropdown.Item>                              
                              <Button className="btn btn-lg rounded-circle">
                                {decodeURIComponent(parse(userName[0]))}
                              </Button>        
                            </Dropdown.Item>

                            {/* <Dropdown.Item className=" " href="/profile"> 
                              <div className="d-flex justify-content-between mb-0 pb-0">
                                <p className="me-4">{decodeURIComponent(parse(userName))}</p>
                                <p>&gt;</p>
                              </div>
                            </Dropdown.Item> */}

                            <Dropdown.Item><Button className="btn btn-light" onClick={logout}>Logout</Button></Dropdown.Item>
                          </div>
                          
                        </Dropdown.Menu>
                      </Dropdown>
                    </NavItem>
                  : <Nav.Link href="/login" className="nav-link">login</Nav.Link>
              }
              
            

            </div>
          
          <Navbar.Toggle as={customToggle} aria-controls="basic-navbar-nav" className="order-xl-1 me-2 ms-2"/>
          <Navbar.Collapse id="basic-navbar-nav" className="">
            <Nav className="container-xl gap-1" id="page-links" style={{}}>
              {
                (sections.length !== 0)
                  ?sections.map((section,index)=>{
                   
                    return <Nav.Link 
                              href={`/?cat=${section}`}
                              id={(cat===`?cat=${section}`)?"active":""} 
                              className="nav-link">
                                {section.toUpperCase()}
                            </Nav.Link>

                  })
                  :null
              }
             
              {(userLevel===1)
                ?<div className="d-flex" id = "write-button-container">
                  <button onClick={()=>{navigate(`/articlePosting/${null}`)}} className="btn btn-transparent  col-xs col-md " title="Write">
                    <h6>Write</h6>
                  </button>
                                    
                 </div>
                :<span/>}
            </Nav>
           {/*  <div className="col-sm-2 col-md-3 d-lg-flex justify-content-lg-end ">
                {(userLevel===1 || userLevel===0)?<Nav.Link href="/logout" className=" col-xs col-md ms-1">Logout</Nav.Link>:<span/>} 
            </div>*/}
          </Navbar.Collapse>
          
        </Navbar>
      
      </div>
        
  
       


    )
}