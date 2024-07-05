

import { faHome } from "@fortawesome/free-solid-svg-icons";
import Logo from "../logos/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";

export default function AdminSidePanel(){


    return <div className="text-white">

        <div className=" bg-dark  pt-3 slide-in"
            style={{width:"240px",height:"100%"}}
        >
            <div className="d-flex align-items-start ps-2"
                >
                <img src={Logo} alt="" style={{width:"35%"}} />
                <div className="d-flex flex-column mt-2 gap-0">
                    <h6 className="d-flex p-0 m-0">Lorem Healthline</h6>
                    <p className=" fw-lighter">loremhealthline.com</p>
                </div>
            </div>
           
            <div className="mt-4">
                <div className="d-flex gap-2 ps-3">
                    <FontAwesomeIcon icon={faHome}/>
                    <p className="text-light">My Home</p>
                </div>
                <div className="d-flex gap-2 ps-3">
                    <FontAwesomeIcon icon={faChartSimple}/>
                    <p className="text-light">Stats</p>
                </div>

                <div className="d-flex gap-2 ps-3">
                    <FontAwesomeIcon icon={faHome}/>
                    <p className="text-light">Posts</p>
                </div>
            </div>
        </div>
    </div>
}