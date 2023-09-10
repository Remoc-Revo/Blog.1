import { useContext, createContext, useState, useEffect, Children } from "react";
import api from "./config/api";

const UserContext = createContext();

export function useUserContext(){
    return useContext(UserContext);
}


export function UserProvider({children}){
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(user == null){
            setLoading(true);

            api.get('/user')
            .then((response)=>{
            // console.log("wriii",response.data.userLevel)
                setUser(response.data);
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setUser('unauthorized');
                setLoading(false);
            })
        }
   },[])

   function contextLogin(user){
    setUser(user)
   }

   function contextLogout(){
    setUser(null)
   }

   return(
        <UserContext.Provider value={{user,loading,contextLogin,contextLogout}}>
            {children}
        </UserContext.Provider>
   )
    
}