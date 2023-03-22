import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavItem, NavDropdown,NavbarBrandProps,NavLink, ButtonGroup, Container, Dropdown } from "react-bootstrap";
import { /*NavLink,*/useLocation,Link } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser"

export default function MainNav(){
  var [userLevel,set_userLevel]=useState();
  var [userName,set_userName]=useState();
  var [dropdownOpen,set_dropdownOpen]=useState(false);
  // var [profileImg,set_profileImg]=useState();

  var cat=useLocation().search;
    if(cat==="?cat=Lifestyle"){
          console.log("categoryyyyy is",useLocation().search)
    } 
    if(cat==="?cat=Sports"){
      console.log("categoryyyyy isporty",useLocation().search)
    }  

    const toggle_dropdown=()=>set_dropdownOpen(!dropdownOpen)


  var [windowWidth,set_windowWidth]=useState(window.innerWidth)

    useEffect(()=>{
        axios.get('http://localhost:9000/user')
            .then(async (response)=>{
                set_userLevel(response.data.userLevel);
                // const fetched_userName=decodeURIComponent(response.data.userName).replace(/&apos;/g,"'");
                set_userName(response.data.userName);
                // set_profileImg(response.data.profileImg);
                console.log("the namee",typeof  userName)

            })
            .catch((err)=>{
                console.log(err);
            })

        window.addEventListener('resize',()=>{set_windowWidth(window.innerWidth)})
        },[])

    function logout(){
      axios.post('http://localhost:9000/logout')
           .then(()=>{set_userName();set_userLevel(0)})
    }

    return(
      <div className=" bg-light">
        <Navbar className=" d-flex justify-content-end ms-0 ms-md-4 me-1 position-relative" collapseOnSelect  id='main-nav' expand={(windowWidth>=995)?true:false}>
          <Navbar.Brand  href="#home"  className="ms-2 me-auto"><h1>MoiVoice</h1></Navbar.Brand>
          
      
            <div id="user-nav" className="ml-auto d-flex  gap-2  order-lg-2 me-lg-5">
              {(typeof userName!=='undefined')
                  ?<NavItem>
                      <Dropdown isOpen={dropdownOpen} toggle={toggle_dropdown} className=" me-2">
                        <Dropdown.Toggle className="btn btn-sm rounded-circle dropdown-toggle" noCaret>
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
                            <Dropdown.Item className=" " href="/profile"> 
                              <div className="d-flex justify-content-between mb-0 pb-0">
                                <p className="me-4">{decodeURIComponent(parse(userName))}</p>
                                <p>&gt;</p>
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item><Button className="btn btn-light" onClick={logout}>Logout</Button></Dropdown.Item>
                          </div>
                          
                        </Dropdown.Menu>
                      </Dropdown>
                    </NavItem>
                  : <Nav.Link href="/login" className=" ">login</Nav.Link>
              }
              {(userLevel===1)?<Nav.Link href="/newsPosting" className="col-xs col-md ">Write</Nav.Link>:<span/>}
            

            </div>
          
          <Navbar.Toggle  aria-controls="basic-navbar-nav" className="order-lg-1 me-2 ms-2"/>
          <Navbar.Collapse id="basic-navbar-nav" className="ms-3 row-md ">
            <Nav className="me-4" id="page-links" style={{}}>
              <Nav.Link href="/" className="" id={(cat==="")?"active":""} >Latest</Nav.Link>
              <Nav.Link href="/?cat=Lifestyle" id={(cat==="?cat=Lifestyle")?"active":""} className="nav-link">Lifestyle</Nav.Link>
              <Nav.Link href="/?cat=Sports" id={(cat==="?cat=Sports")?"active":""} className="nav-link">Sports</Nav.Link>
              <Nav.Link href="/?cat=Entertainment" id={(cat==="?cat=Entertainment")?"active":""} className="nav-link">Entertainment</Nav.Link>
              <Nav.Link href="/?cat=Academics" id={(cat==="?cat=Academics")?"active":""} className="nav-link">Academics</Nav.Link>
              <Nav.Link href="/?cat=Health" id={(cat==="?cat=Health")?"active":""} className="nav-link">Health</Nav.Link>
              <Nav.Link href="/?cat=Business" id={(cat==="?cat=Business")?"active":""} className="nav-link">Business</Nav.Link>
              <Nav.Link href="/?cat=Politics" id={(cat==="?cat=Politics")?"active":""} className="nav-link">Politics</Nav.Link>

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
        //             {(userLevel===1)?<a href="/newsPosting" className="btn ">Update News</a>:<span/>}
        //         </div>
        //     </div>

        //     <hr/>


           
        // </nav>


    )
}