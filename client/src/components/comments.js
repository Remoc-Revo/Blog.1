import React,{useState,useEffect} from "react";
import axios from "axios";


export default function Comments({newsId}){


    return(
        <div className="container">
            <hr/>
            <h4>Comments</h4>
            <form>
                <textarea className="col-10" placeholder="What do you think about this?"/>
                <input type="submit" value="Add Comment" className="btn"/>
                
            </form>

            <div>
            {newsId}
            </div>
        </div>
    )
}