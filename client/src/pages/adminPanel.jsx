import React,{useState,useEffect} from "react"
import { useUserContext } from "../userContext";
import { useNavigate,useLocation } from "react-router-dom";
import AdminNav from "../navs/adminNav";
import AdminSidePanel from "../components/adminSidePanel";
import AdminHome from "./adminHome";
import AdminAllPosts from "./adminAllPosts";
import AdminPostsCategories from "./adminPostsCategories";
import AdminStats from "./adminStats";
import AdminUsersDisplay from "./adminUsersDisplay";
import ReadersHome from "./readersHome"; 

export default function AdminPanel(){
    const navigate = useNavigate();
    var [userLevel,set_userLevel]=useState(0);
    var [userName,set_userName]=useState();
    const {loading,user,contextLogout} = useUserContext();
    const [adminPanelSection,setAdminPanelSection] = useState(useLocation().search);

    useEffect(()=>{
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
       
    
        validateUser(); 
        
       
     
    })

    const updateAdminPanelSection=(adminPanelSection)=>{
        setAdminPanelSection(adminPanelSection);
        console.log("location changes: ",adminPanelSection )
    }
   


    
    return <div>


        {(adminPanelSection.includes("?adminPanel") || adminPanelSection=="")
            ?<div>
                <AdminNav/>
                <div className="d-flex position-relative w-100" style={{height:"100vh"}}>
                    <AdminSidePanel updateAdminPanelSection={updateAdminPanelSection}/>
                        <div className="position-absolute col-md-8 col-lg-10 d-flex justify-content-center" id="adminPanelMainContent"
                            style={{left:"240px",top:"60px"}}
                        >
                            
                            
                            {(adminPanelSection === "")&&<AdminHome />}
                            
                            {(adminPanelSection === "?adminPanel=stats")&&<AdminStats/>}
                            
                            {(adminPanelSection==="?adminPanel=posts"|| adminPanelSection==="?adminPanel=posts/drafts" || adminPanelSection.includes("?adminPanel=posts&category="))
                            &&<AdminAllPosts updateAdminPanelSection={updateAdminPanelSection}/>}
                            
                            {(adminPanelSection === "?adminPanel=posts/categories")&&<AdminPostsCategories updateAdminPanelSection={updateAdminPanelSection}/>}
                            
                            {(adminPanelSection === "?adminPanel=comments")&&<>comments on development..</>}
                            
                            {(adminPanelSection === "?adminPanel=users")&&<AdminUsersDisplay/>}
                        </div>
                </div>
            </div>
            :<ReadersHome updateAdminPanelSection={updateAdminPanelSection}/>
        }
        
    </div>
}