import React,{useState,useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios";
import { useLocation } from "react-router-dom";
import moment from "moment";
import parse from "html-react-parser"
import Footer from "../components/footer";
import More from "../components/more";
import Comments from "../components/comments";

export default function Single(){
    var [article,setArticles]=useState([]);
    const location=useLocation();
    const articleId=location.pathname.split('/')[2];

    useEffect(()=>{
        axios.get(`http://localhost:9000/single/${articleId}`)
             .then((response)=>{
                console.log("response::",response)
                setArticles(response.data.article[0]) ;

            })
            .catch((err)=>{
                console.log("get single article error",err)
            });
                
    },[articleId])


    function decodeString(str){
        const htmlString= decodeURIComponent(str)
                    // .replace(/&apos;/g,"'")
                    // .replace(/<p>/g,"")
                    // .replace(/<\/p>/g,"")
                    // .replace(/<br>/,)

        return parse(htmlString);
    }

    return(
        <div className="full-page">
            <MainNav/>
            
            
            {(article.length!==0)
                ?<div className="container-lg mt-5">
                    <div className="container-lg">
                        <h1 className=" headline">{decodeString(article.articleHeadline)}</h1>
                    </div>
                    <div className="d-lg-flex container-lg mt-5 gap-3">
                        <div className=" col-lg-8 p-0">
                            <div className="container-lg p-0">
                                <p className="pt-2 pb-2 border-top border-bottom">
                                    By <span style={{color:"teal",fontWeight:"bold"}}>Brian</span> | {moment(article.articlePostingDate).fromNow()}
                                </p>
                                <img src={require(`../../public/uploads/${article.multimediaUrl}`)} 
                                    style={{display:"block",width:"100%",height:"390px"}}/>


                                <p className="mt-4">{decodeString(article.articleBody)}</p>
                            </div>

                        </div>
                        
                        
                        <More cat={article.articleSection} current={article.articleId} />
                    </div>
                </div>
                :""

            }
           
            {/* <Comments articleId={article.articleId}/> */}
            
            <Footer/>
        </div>
    )
}