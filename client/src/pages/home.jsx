import React,{useState,useEffect} from "react";
import { useUserContext } from "../userContext";
import ReadersHome from "./readersHome";
import AdminPanel from "./adminPanel";

export default  function Home(){
    var [userLevel,set_userLevel]=useState();
    var [userName,set_userName]=useState();   
    const {loading,user} = useUserContext();




    useEffect(()=>{
        if(!loading && user != null){
            console.log("user context!!!!",user);
            set_userLevel(user.userLevel);
            set_userName(user.userName);
          }       
    },[loading,user])
    
    if(!loading)
        return(  
            (userLevel===1)  
            ?<AdminPanel/>        
            :<ReadersHome/> 
                
        )
}