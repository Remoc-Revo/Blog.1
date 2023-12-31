import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavItem, Dropdown } from "react-bootstrap";
import { /*NavLink,*/useLocation, useNavigate} from "react-router-dom";
import parse from "html-react-parser"
import { useUserContext } from "../userContext";
import api from "../config/api";


export default function MainNav(){
  var [userLevel,set_userLevel]=useState();
  var [userName,set_userName]=useState();
  var [dropdownOpen,set_dropdownOpen]=useState(false);
  // var [profileImg,set_profileImg]=useState();
  const {loading,user,contextLogout} = useUserContext();
  const navigate = useNavigate();
  var cat=useLocation().search;
   
  const toggle_dropdown=()=>set_dropdownOpen(!dropdownOpen)


  var [windowWidth,set_windowWidth]=useState(window.innerWidth)

    useEffect(()=>{
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

    return(
      <div className=" bg-light">
        <Navbar className=" d-flex me-1"   id='main-nav' expand={(windowWidth>=1200)?true:false}>
          <Navbar.Brand  href="#home"  className="ps-xl-1 ps-sm-5 me-auto">
            <img src={require("../logos/logo2.png")} alt="" id="blog-logo" className="img-fluid logo p-0"></img> 
          </Navbar.Brand>
          
      
            <div id="user-nav" className="d-flex  gap-1  order-xl-2 me-lg-5">
              {(typeof userName!=='undefined')
                  ?<NavItem>
                      <Dropdown isOpen={dropdownOpen} toggle={toggle_dropdown} className=" me-2">
                        <Dropdown.Toggle className="btn btn-sm rounded-circle dropdown-toggle" noCaret style={{backgroundColor:`light-blue`}}>
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
                              <Button className="btn btn-lg rounded-circle" style={{backgroundColor:`light-blue`}}>
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
              {(userLevel===1)
                ?<div className="d-flex">
                  <button onClick={()=>{navigate(`/articlePosting/${null}`)}} className="btn btn-transparent col-xs col-md " title="Write">
                    <img src={require("../icons/write.png")} alt="" style={{width:"30px"}}/>
                  </button>
                                    
                 </div>
                :<span/>}
            

            </div>
          
          <Navbar.Toggle  aria-controls="basic-navbar-nav" className="order-xl-1 me-2 ms-2"/>
          <Navbar.Collapse id="basic-navbar-nav" className="ms-5 ">
            <Nav className="container-xl gap-gap-1" id="page-links" style={{}}>
              <Nav.Link href="/" className="" id={(cat==="")?"active":""} >Latest</Nav.Link>
              <Nav.Link href="/?cat=Food_and_Recipes" id={(cat==="?cat=Food_and_Recipes")?"active":""} className="nav-link">Food-and-recipes</Nav.Link>
              <Nav.Link href="/?cat=Newborn_Care" id={(cat==="?cat=Newborn_Care")?"active":""} className="nav-link">Newborn-care</Nav.Link>
              <Nav.Link href="/?cat=Kids_Party_Ideas" id={(cat==="?cat=Kids_Party_Ideas")?"active":""} className="nav-link">Kids-party-ideas</Nav.Link>
              <Nav.Link href="/?cat=Fashion" id={(cat==="?cat=Fashion")?"active":""} className="nav-link">Fashion</Nav.Link>
              <Nav.Link href="/?cat=Travel" id={(cat==="?cat=Travel")?"active":""} className="nav-link">Travel</Nav.Link>
              <Nav.Link href="/?cat=Pregnancy" id={(cat==="?cat=Pregnancy")?"active":""} className="nav-link">Pregnancy</Nav.Link>
              <Nav.Link href="/?cat=Home_Schooling" id={(cat==="?cat=Home_Schooling")?"active":""} className="nav-link">Home-Schooling</Nav.Link>

            </Nav>
           {/*  <div className="col-sm-2 col-md-3 d-lg-flex justify-content-lg-end ">
                {(userLevel===1 || userLevel===0)?<Nav.Link href="/logout" className=" col-xs col-md ms-1">Logout</Nav.Link>:<span/>} 
            </div>*/}
          </Navbar.Collapse>
          
        </Navbar>
      
      </div>
        
  
       


    )
}