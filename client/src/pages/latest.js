import React,{useEffect} from "react";
import MainNav from "../navs/mainNav";
import axios from "axios"
import {PreviewBig,PreviewMid,PreviewSmall} from "../components/news_preview";

export default function Home(){

    // axios.get("http://localhost:9000/latest")
    //      .then((response)=>{
    //         document.write("this",response.data.that);
    //      })
    //      .catch((err)=>{
    //         document.write(err)
    //      })

    var news=[];

    for(var i=0;i<34;i++){
        news.push({
            headline:"The way we gooo is that, the president claims",
            time:`${new Date().getSeconds()} days ago`,
            briefDescription:"Those things are going to be done. No matter whaat the opposition says... "
        })
    }
    
    return(
        <div>
            <MainNav/>

            <div className="container d-flex">
                <div className="container">

                    <h1>Latest</h1>

                    {/*preview of news at the top of the page,
                      its image is the biggest
                    */}
                    <PreviewBig headline={news[0].headline} time={news[0].time} briefDescription={news[0].briefDescription} />

                    <div className="row">
                        <PreviewMid headline={news[1].headline} time={news[1].time} briefDescription={news[1].briefDescription}/>
                        <PreviewMid headline={news[2].headline} time={news[2].time} briefDescription={news[1].briefDescription}/>
                    </div>
                    
                    <hr/>
                    {
                        news.map((article,index)=>{
                            if(index>2){
                                return <div>
                                        <PreviewSmall headline={article.headline} time={article.time} briefDescription={article.briefDescription}/>
                                        <hr/>
                                       </div>
                            }
                        })
                    }
                </div>
                <div style={{width:"35%"}}></div>
            </div>

            

        </div>
    )
}