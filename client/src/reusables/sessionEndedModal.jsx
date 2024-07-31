import React from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SessionEndedModal({showSessionEndedModal,setShowSessionEndedModal}){
    const navigate = useNavigate();


    return <Modal show={showSessionEndedModal} centered>
        <Modal.Body>
            <h6> Your Session has expired!</h6>
            <div className="d-flex justify-content-between">
                <button className="btn btn-light" onClick={()=>{setShowSessionEndedModal(false)}}>
                    Close
                </button>

                <button className="btn btn-success" onClick={()=>{navigate('/login')}}>
                    Login
                </button>
            </div>
        </Modal.Body>
    </Modal>
}