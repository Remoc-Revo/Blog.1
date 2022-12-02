import React,{useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios"

export default function Home(){

    axios.get("http://localhost:9000/latest")
         .then((response)=>{
            document.write("this",response.data.that);
         })
         .catch((err)=>{
            document.write(err)
         })

    return(
        <div>
            <MainNav/>

            <h2>here we goooo</h2>
        </div>
    )
}