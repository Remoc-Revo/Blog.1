import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavItem, NavDropdown,NavbarBrandProps,NavLink, ButtonGroup, Container, Dropdown } from "react-bootstrap";
import { /*NavLink,*/useLocation,Link } from "react-router-dom";
import parse from "html-react-parser"
import { useUserContext } from "../userContext";
import api from "../config/api";


export default function MainNav(){
  var [userLevel,set_userLevel]=useState();
  var [userName,set_userName]=useState();
  var [dropdownOpen,set_dropdownOpen]=useState(false);
  var [userId, set_userId]=useState();
  // var [profileImg,set_profileImg]=useState();
  const {loading,user,contextLogin, contextLogout} = useUserContext();
  var cat=useLocation().search;
   
    const toggle_dropdown=()=>set_dropdownOpen(!dropdownOpen)


  var [windowWidth,set_windowWidth]=useState(window.innerWidth)

    useEffect(()=>{
      if(!loading && user != null){
        console.log("user context!!!!",user);
        set_userLevel(user.userLevel);
        set_userId(user.userId);
        set_userName(user.userName);
      }

        window.addEventListener('resize',()=>{set_windowWidth(window.innerWidth)})
        },[loading])

    function logout(){
      api.post('/logout')
           .then(()=>{set_userName();set_userLevel(0)})
    }

    return(
      <div className=" bg-light">
        <Navbar className=" d-flex justify-content-end ms-0 ms-md-4 me-1 position-relative" collapseOnSelect  id='main-nav' expand={(windowWidth>=995)?true:false}>
          <Navbar.Brand  href="#home"  className="ms-2 me-auto">
            <img src={require("../logos/logo2.png")} alt="" id="blog-logo" className="img-fluid logo p-0"></img> 
          </Navbar.Brand>
          
      
            <div id="user-nav" className="ml-auto d-flex  gap-2  order-lg-2 me-lg-5">
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
                  : <Nav.Link href="/login" className=" ">login</Nav.Link>
              }
              {(userLevel===1)?<Nav.Link href="/articlePosting" className="col-xs col-md ">Write</Nav.Link>:<span/>}
            

            </div>
          
          <Navbar.Toggle  aria-controls="basic-navbar-nav" className="order-lg-1 me-2 ms-2"/>
          <Navbar.Collapse id="basic-navbar-nav" className="ms-3 row-md ">
            <Nav className="me-4" id="page-links" style={{}}>
              <Nav.Link href="/" className="" id={(cat==="")?"active":""} >Latest</Nav.Link>
              <Nav.Link href="/?cat=FoodAndRecipes" id={(cat==="?cat=FoodAndRecipes")?"active":""} className="nav-link">Food-and-recipes</Nav.Link>
              <Nav.Link href="/?cat=NewbornCare" id={(cat==="?cat=NewbornCare")?"active":""} className="nav-link">Newborn-care</Nav.Link>
              <Nav.Link href="/?cat=KidsPartyIdeas" id={(cat==="?cat=KidsPartyIdeas")?"active":""} className="nav-link">Kids-party-ideas</Nav.Link>
              <Nav.Link href="/?cat=Fashion" id={(cat==="?cat=Fashion")?"active":""} className="nav-link">Fashion</Nav.Link>
              <Nav.Link href="/?cat=Travel" id={(cat==="?cat=Travel")?"active":""} className="nav-link">Travel</Nav.Link>
              <Nav.Link href="/?cat=Pregnancy" id={(cat==="?cat=Pregnancy")?"active":""} className="nav-link">Pregnancy</Nav.Link>
              <Nav.Link href="/?cat=HomeSchooling" id={(cat==="?cat=HomeSchooling")?"active":""} className="nav-link">Home-Schooling</Nav.Link>

            </Nav>
            <div className="col-sm-2 col-md-3 d-lg-flex justify-content-lg-end ">
                {/* {(userLevel===1 || userLevel===0)?<Nav.Link href="/logout" className=" col-xs col-md ms-1">Logout</Nav.Link>:<span/>} */}
            </div>
          </Navbar.Collapse>
          
        </Navbar>
      
      </div>
        
  
        // <nav className="nav-bar container" id='main-nav'>
            
        //     <div className=" d-flex space-between">
                    
        //             <h1>MoiVoice</h1>

        //             <ul className="nav" id='flexed-nav'>
                        
        //                 <li className="nav-item">
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>

        //                 <li>
        //                 </li>


        //             </ul>
                
        //         <div>
        //             {(userLevel===undefined)?<a href="/login" className="btn ">login</a>:<span/> }
        //             {(userLevel===1)?<a href="/articlePosting" className="btn ">Update Articles</a>:<span/>}
        //         </div>
        //     </div>

        //     <hr/>


           
        // </nav>


    )
}