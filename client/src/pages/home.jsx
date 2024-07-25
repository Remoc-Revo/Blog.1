import React,{useState,useEffect} from "react";
import { useUserContext } from "../userContext";
import ReadersHome from "./readersHome";
import AdminPanel from "./adminPanel";

export default  function Home(){
    var [userLevel,set_userLevel]=useState(null);
    const {loading,user} = useUserContext();




    useEffect(()=>{
        if(!loading && user != null){
            console.log("user context!!!!",user);
            set_userLevel(user.userLevel);
          } 
        else{
            set_userLevel(0);
        }      
    },[loading,user])
    
    if(!loading)
        return(  
            (userLevel===1)  
            ?<AdminPanel/>        
                :<ReadersHome/> 
                
                
        )
}