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
import AdminComments from "./adminComments";
import AdminSubscribersDisplay from "./adminSubscribersDisplay";

export default function AdminPanel(){
    const navigate = useNavigate();
    var [userLevel,set_userLevel]=useState(0);
    var [userName,set_userName]=useState();
    const {loading,user,contextLogout} = useUserContext();
    const [adminPanelSection,setAdminPanelSection] = useState(window.location.search);
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(true);

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

    useEffect(()=>{
        function handleWindowResize(){
            const newWidth = window.innerWidth

            if(newWidth < 992){
                setIsSidePanelVisible(false);
            }
            else{
                setIsSidePanelVisible(true);
            }
        }

        function hideSideNav(){
            if(window.innerWidth < 992){
                setIsSidePanelVisible(false);
            }
        }

        handleWindowResize();

        window.addEventListener('resize',handleWindowResize)
        window.addEventListener('click',hideSideNav)

        return ()=>{
            window.removeEventListener('resize',handleWindowResize)
            window.removeEventListener('click',hideSideNav)

        }

    },[])

    const updateAdminPanelSection=(adminPanelSection)=>{
        setAdminPanelSection(adminPanelSection);
        console.log("location changes: ",adminPanelSection )
    }
   

    const toggleSideNav = ()=>{
        setIsSidePanelVisible(!isSidePanelVisible);
    }

    
    return <div>


        {(adminPanelSection.includes("?adminPanel") || adminPanelSection=="")
            ?<div>
                <AdminNav toggleSideNav = {toggleSideNav} updateAdminPanelSection={updateAdminPanelSection}/>
                <div className="d-flex position-relative w-100" style={{height:"100vh"}}>
                    {
                        isSidePanelVisible &&
                        <AdminSidePanel 
                        updateAdminPanelSection={updateAdminPanelSection}
                        toggleSideNav = {toggleSideNav}
                        />
                    }
                    

                    <div className="position-absolute col-12 col-lg-9 col-xl-10 d-flex justify-content-center" id="adminPanelMainContent"
                        style={{top:"60px"}}
                    >
                        
                        
                        {(adminPanelSection === "")&&<AdminHome />}
                        
                        {(adminPanelSection === "?adminPanel=stats")&&<AdminStats/>}
                        
                        {(adminPanelSection==="?adminPanel=posts"|| adminPanelSection==="?adminPanel=posts/drafts" || adminPanelSection.includes("?adminPanel=posts&category="))
                        &&<AdminAllPosts updateAdminPanelSection={updateAdminPanelSection}/>}
                        
                        {(adminPanelSection === "?adminPanel=posts/categories")&&<AdminPostsCategories updateAdminPanelSection={updateAdminPanelSection}/>}
                        
                        {(adminPanelSection === "?adminPanel=comments")&&<AdminComments/>}
                        
                        {(adminPanelSection === "?adminPanel=users")&&<AdminUsersDisplay/>}

                        {(adminPanelSection === "?adminPanel=subscribers")&&<AdminSubscribersDisplay/>}

                    </div>
                </div>
            </div>
            :<ReadersHome updateAdminPanelSection={updateAdminPanelSection}/>
        }
        
    </div>
}