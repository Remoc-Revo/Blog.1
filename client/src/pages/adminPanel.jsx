import React,{useState,useEffect} from "react"
import { useUserContext } from "../userContext";
import { useNavigate } from "react-router-dom";
import AdminNav from "../navs/adminNav";
import AdminSidePanel from "../components/adminSidePanel";

export default function AdminPanel(){
    const navigate = useNavigate();
    var [userLevel,set_userLevel]=useState(0);
    var [userName,set_userName]=useState();
    const {loading,user,contextLogout} = useUserContext();

    useEffect(()=>{
        validateUser(); 
    },[])

    function validateUser(){
        if(!loading && user != null){
            console.log("user context!!!!",user);
            set_userLevel(user.userLevel);
            set_userName(user.userName);
          }
          
          if(user === 'unauthorized'){
            console.log("user current state: ",user);
            navigate('/login')
        }
    }

    return <div>
        <AdminNav/>
        <div className="d-flex" style={{height:"100vh"}}>
            <AdminSidePanel/>
        </div>
    </div>
}