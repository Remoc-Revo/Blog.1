import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


export default function AdminNav(){

    return <div className="bg-black m-0 p-1 ps-3 pe-4">
        <div className='d-flex justify-content-end align-items-center'>
            <button className="btn btn-light  rounded-circle d-flex  p-2" 
                noCaret style={{width:"30px",height:"28px"}}>
                {
                // (profileImg!==undefined)
                //     ?<img src={require(`../../public/uploads/${profileImg}`)} style={{width:"40px"}}/>
                //     :userName[0]
                <FontAwesomeIcon icon={faUser} />

                }
            </button>
        </div>
        
    </div>
}