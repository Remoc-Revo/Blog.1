import parser from "html-react-parser";
import {v4 as uuidv4} from 'uuid'
import api from "../config/api";

export function decodeString(str){
    return parser(decodeURIComponent(str)
            .replace(/&apos;/g,"'")
            .replace(/<p>/g,"")
            .replace(/<\/p>/g,""))
}

export function updateHistory(path){
    if(path===""){
        window.history.pushState({},'',"/")
    }
    else{
        window.history.pushState({},'',path)
    }
}


const getVisitorId = ()=>{
    let visitorId = localStorage.getItem("visitorId");
    if(!visitorId){
        visitorId = uuidv4();
        localStorage.setItem("visitorId",visitorId);
    }

    return visitorId;
};

export async function logVisitor(path){
    const visitorId = getVisitorId();
    try{
        api.post('/visitor',{path,visitorId});
    }
    catch(e){
        console.log("Error logging visitor");
    }
};