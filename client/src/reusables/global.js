import parser from "html-react-parser";


export function decodeString(str){
    return parser(decodeURIComponent(str)
            .replace(/&apos;/g,"'")
            .replace(/<p>/g,"")
            .replace(/<\/p>/g,""))
}

export function updateHistory(path){
    if(path==""){
        window.history.pushState({},'',"/")
    }
    else{
        window.history.pushState({},'',path)
    }
}