
import React,{useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import api from "../config/api";


export default function AdminUsersDisplay(){
    const [users, setUsers] = useState([]);

    useEffect(()=>{
        api.get('/users',)
            .then((response)=>{
                console.log("fetched users",response.data.users);
                setUsers(response.data.users)
            })
            .catch((e)=>{
                console.log("Error fetching users: ",e);
            })
    },[])



    return <div className="container col-lg-7 col-md-8">

        <h3 className="mb-5">Users</h3>
        <div>
            <table className="w-100 " >
                {
                    users.map(
                        user=><tr className="" >
                            <div className=" d-flex gap-4 ms-4 me-4 align-items-center" style={{height:"90px"}}>
                                <div className="rounded-circle "
                                    style={{width:"70px",height:"70px",backgroundColor:"grey"}}
                                    >
                                    <FontAwesomeIcon className="ic-white pt-2 " icon={faUser}  
                                        style={{width:"100%",height:"100%"}}/>

                                </div>
                                <div>
                                    <span className="fw-bolder">{user.userName}</span>
                                    {
                                        user.userLevel === 0 &&
                                        (<div>
                                            <span style={{color:"teal"}}>Reader</span>
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