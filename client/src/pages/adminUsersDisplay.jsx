
import React,{useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faSearch,faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../config/api";
import moment from "moment";

export default function AdminUsersDisplay(){
    const [allUsers, setAllUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([])
    const [searchedText, setSearchedText] = useState('');
    const [isSearchInputActive, setIsSearchInputActive] = useState(false);

    useEffect(()=>{
        api.get('/users',)
            .then((response)=>{
                console.log("fetched users",response.data.users);
                setAllUsers(response.data.users)
                setDisplayedUsers(response.data.users)
            })
            .catch((e)=>{
                console.log("Error fetching users: ",e);
            })
    },[])


    function handleSearch(e){
        const text = e.target.value.toLowerCase();
        setSearchedText(text);     

        const filteredUsers = allUsers.filter(
            user => 
                {
                    const userName = user.userName.toLowerCase();
                    const userEmail = user.userEmail.toLowerCase();
                    
                    if(userName.includes(text) || userEmail.includes(text)){            
                        return user;
                    }

                    return null;
                 }
        )

        setDisplayedUsers(filteredUsers);
    }



    return <div className="container col-lg-7 col-md-8">

        <h3 className="mb-5">All Users {allUsers.length !== 0 && `(${allUsers.length})`}</h3>
        <div className="d-flex  mb-4 " id="users-search">
            <div className="col-12 position-relative d-flex justify-content-between border" >                
                <button className="btn rounded-0">
                    <FontAwesomeIcon icon={faSearch}/>
                </button>                
                
                <div className="">
                    <button className="btn position-absolute start-0 top-0 h-100"
                        // onClick={}
                        style={{zIndex:"2",color:"grey"}}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>
                    <input 
                        type="text"
                        className="position-absolute w-100  ps-5 pe-5 start-0 top-0 h-100 border-0"
                        placeholder=" Search user name or email..."
                        onClick={()=>{setIsSearchInputActive(true)}}
                        onChange={handleSearch}
                        value={searchedText}
                        style={{zIndex:"1"}}
                        />
                    
                { isSearchInputActive 
                    &&<button className="btn position-absolute end-0 top-0 h-100"
                        onClick={()=>{
                            setIsSearchInputActive(false);
                            setSearchedText('')
                            setDisplayedUsers(allUsers);
                        }}
                        style={{zIndex:"1"}}>
                        <FontAwesomeIcon icon={faTimes} className="ic-grey"/>
                    </button>}
                </div>
                    
                
            </div>
                
            </div>

            <div>
            <table className="w-100 " >
                {
                    displayedUsers.map(
                        user=><tr className="" >
                            <div className=" d-flex gap-4 ms-4 me-4 pt-2 align-items-start" style={{height:"100px"}}>
                            {
                                    (user.photoUrl !== null)
                                    ?<div style={{width:"70px",height:"70px"}}>                                                                                           
                                        <img src={user.photoUrl}
                                            className="rounded-circle w-100 h-100 object-fit-cover"
                                            alt=""
                                        />
                                    </div>

                                    :<div className="rounded-circle overflow-hidden" 
                                        style={{width:"70px",height:"70px", backgroundColor:"lightgrey"}}>
                                        <FontAwesomeIcon icon={faUser} className="ic-white rounded-circle w-100 h-100 pt-2"/>
                                    </div>
                                }
                                <div>
                                    <span className="" style={{fontWeight:"500"}}>{user.userName}</span>
                                    <span className="d-block" style={{fontWeight:"300"}}>{user.userEmail}</span>

                                    {
                                        user.userLevel === 0 &&
                                        (<div className="mt-1">
                                            <span style={{color:"teal"}}>Registered</span>
                                            <span className="fw-light"> {moment(user.userRegistrationDate).fromNow()}</span>
                                        </div>)                                        
                                    }
                                    {     user.userLevel === 1 &&
                                        (<div>
                                            <span style={{color:"orange"}}>Admin</span>
                                        </div>)
                                    }
                                </div>
                            </div>
                            
                                
                        </tr>
                    )
                }
            </table>
        </div>
    </div>
}