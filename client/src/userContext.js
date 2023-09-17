import { useContext, createContext, useState, useEffect,} from "react";
import api from "./config/api";

const UserContext = createContext();

export function useUserContext(){
    return useContext(UserContext);
}


export function UserProvider({children}){
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(user == null && ! loading){
            setLoading(true);
            console.log("either way:::  time",new Date().getTime())

            api.get('/user',{withCredentials:true})
            .then((response)=>{
            console.log("response of user context:::",response.data.userLevel,"  time",new Date().getTime())
                setUser(response.data);
                setLoading(false);
            })
            .catch((err)=>{
                console.log(err);
                setUser('unauthorized');
                setLoading(false);
            })
        }
   },[user,loading])

   function contextLogin(){
    //force fetching of login status
    setUser(null);
   }

   function loggingIn(){
       setLoading(true);
   }
    
   function contextLogout(){
    setUser(null)
   }

   return(
        <UserContext.Provider value={{user,loading,contextLogin,contextLogout,loggingIn}}>
            {children}
        </UserContext.Provider>
   )
    
}
