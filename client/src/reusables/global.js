import parser from "html-react-parser";


export function decodeString(str){
    return parser(decodeURIComponent(str)
            .replace(/&apos;/g,"'")
            .replace(/<p>/g,"")
            .replace(/<\/p>/g,""))
}