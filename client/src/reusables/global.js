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



export async function uploadImageToCloud(imageSrc){
    if(imageSrc===null){
        return null;
    }
    var formData=new FormData();

    formData.append('file',imageSrc);
    formData.append('upload_preset',process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    console.log("the file",formData)

    try{
        const res=await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD__NAME}/image/upload/`,
                    {
                        method:"post",
                        body:formData
                    }
            )
        if(res.ok){
            let data;
            data  = await res.json()
            if(data!== undefined){
               
                console.log("\n secure_url",data.secure_url)
                return data.secure_url
            }
        }   
       
    }catch(err){
        console.log("file upload err",err);
    }
}
