import React from "react";
import { faPeopleGroup,faEye,faStar,faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminStats(){
    let today = Date.now();
    today = new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(today);

    return <div className=" container col-md-9">

        <h4>Blog Stats</h4>

        <div className="mb-5 mt-5">
            <h2 className="fw-lighter">7-day highlights</h2>
            <div className="d-flex flex-sm-column flex-md-row gap-4 justify-content-between">
                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faEye} className="mb-3 ic-stat"/>
                    <span className="stat-type">Views</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>

                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faPeopleGroup} className="mb-3 ic-stat"/>

                    <span className="stat-type">Visitors</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>
                
                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faStar} className="mb-3 ic-stat"/>

                    <span className="stat-type">Likes</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>


                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faComment} className="mb-3 ic-stat"/>

                    <span className="stat-type">Comments</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>
            </div>
        </div>


        <div className="mb-5 mt-5">
            <h2 className="fw-lighter mb-3">{today}</h2>
            <div className="d-md-flex gap-4 justify-content-between">
                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faEye} className="mb-3 ic-stat"/>
                    <span className="stat-type">Views</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>

                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faPeopleGroup} className="mb-3 ic-stat"/>

                    <span className="stat-type">Visitors</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>
                
                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faStar} className="mb-3 ic-stat"/>

                    <span className="stat-type">Likes</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>


                <div className="border w-100 d-flex flex-column gap-2 align-items-start p-4">
                    <FontAwesomeIcon icon={faComment} className="mb-3 ic-stat"/>

                    <span className="stat-type">Comments</span >
                    <div className="d-flex gap-1">
                        <span className="stat-number">0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}