import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPenFancy, faBell,faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function AdminNav({toggleSideNav}){
    const navigate = useNavigate();
    function onClickWriteButton(e){
        e.preventDefault();
        e.stopPropagation();
        navigate('/articlePosting/null');
    }


    return <div className="bg-black d-flex justify-content-between m-0  p-1 ps-3 pe-4  top-0 w-100 position-fixed" 
        style={{height:"40px",zIndex:"1000"}}>
        <div>
            <button className="btn no-focus-outline d-lg-none" onClick={(e)=>{e.stopPropagation();toggleSideNav()}}>
                <FontAwesomeIcon icon={faBarsStaggered} className="admin-nav-icon"/>
            </button>
        </div>
        <div className='d-flex justify-content-end align-items-center gap-2 gap-md-3 '>
            <a className="btn  d-flex align-items-center gap-1" 
                onClick={onClickWriteButton}
            >
                <FontAwesomeIcon icon={faPenFancy} className="admin-nav-icon"/>
            </a>
            <button className="btn btn-light  rounded-circle d-flex align-items-center justify-content-center" 
                noCaret 
                style={{width:"25px",height:"24px"}}
                onClick={(e)=>{
                    e.stopPropagation();
                    navigate("/profile")
                    }}
                >
                {
                // (profileImg!==undefined)
                //     ?<img src={require(`../../public/uploads/${profileImg}`)} style={{width:"40px"}}/>
                //     :userName[0]
                <FontAwesomeIcon icon={faUser} />

                }
            </button>
            <button className="btn d-flex"
                onClick={(e)=>{e.stopPropagation();}}
                >
                <FontAwesomeIcon icon={faBell} className="admin-nav-icon"/>
            </button>
        </div>
        
    </div>
}