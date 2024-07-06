import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPenFancy, faBell } from "@fortawesome/free-solid-svg-icons";


export default function AdminNav(){

    return <div className="bg-black m-0 p-1 ps-3 pe-4">
        <div className='d-flex justify-content-end align-items-center gap-2 gap-md-3'>
            <button className="btn  d-flex align-items-center gap-1" 
            // style={{height:"24px"}}
            >
                <FontAwesomeIcon icon={faPenFancy} className="admin-nav-icon"/>
            </button>
            <button className="btn btn-light  rounded-circle d-flex align-items-center justify-content-center" 
                noCaret 
                style={{width:"25px",height:"24px"}}
                >
                {
                // (profileImg!==undefined)
                //     ?<img src={require(`../../public/uploads/${profileImg}`)} style={{width:"40px"}}/>
                //     :userName[0]
                <FontAwesomeIcon icon={faUser} />

                }
            </button>
            <button className="btn d-flex">
                <FontAwesomeIcon icon={faBell} className="admin-nav-icon"/>
            </button>
        </div>
        
    </div>
}