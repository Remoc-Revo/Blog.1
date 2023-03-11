import React,{useState,useEffect} from "react";
import { Button,Nav, Navbar, NavDropdown,NavbarBrandProps,NavLink, ButtonGroup, Container } from "react-bootstrap";
import { /*NavLink,*/useLocation,Link } from "react-router-dom";
import axios from "axios";

export default function MainNav(){
  var [userLevel,set_userLevel]=useState();
  var [userName,set_userName]=useState("");
  var cat=useLocation().search;
    if(cat==="?cat=Lifestyle"){
          console.log("categoryyyyy is",useLocation().search)
    } 
    if(cat==="?cat=Sports"){
      console.log("categoryyyyy isporty",useLocation().search)
}  
    const [expanded, setExpanded] = useState(false);

  var [windowWidth,set_windowWidth]=useState(window.innerWidth)

    useEffect(()=>{
        axios.get('http://localhost:9000/user')
            .then((response)=>{
                set_userLevel(response.data.userLevel);
                set_userName(response.data.userName);
                console.log("the level",userLevel)

            })
            .catch((err)=>{
                console.log(err);
            })

        window.addEventListener('resize',()=>{set_windowWidth(window.innerWidth)})
        },[])

    return(
      <div className=" bg-light">
        <Navbar className=" d-lg-flex ms-0 ms-md-4 position-relative" collapseOnSelect  id='main-nav' expand={(windowWidth>=995)?true:false}>
          <Navbar.Brand  href="#home" id="brand" className="ms-2"><h1>MoiVoice</h1></Navbar.Brand>
          
      

          <div id="user-nav" className="d-flex gap-2 order-lg-2 me-4">
            {(typeof userName!=="undefined")
                ?<Button className="rounded-circle">{userName[0]}</Button> 
                : <Nav.Link href="/login" className=" ">login</Nav.Link>
            }
            {(userLevel===1)?<Nav.Link href="/newsPosting" className="col-xs col-md ms-1">Write</Nav.Link>:<span/>}
          

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