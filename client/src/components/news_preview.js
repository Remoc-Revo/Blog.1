import React from "react";
import '../styles/index.css';

export  function PreviewBig({headline,time,briefDescription,imgUrl}){
    
        return(
            <a href="" style={{textDecoration:"none",color:"black"}} className="preview-big">
                <img src={require(`../../public/uploads/${imgUrl}`)} alt=""  className="col-md-6" style={{display:"block",width:"100%",height:"500px"}}></img>

                <div  className="container">
                    <i className="duration">{time}</i>
                    <h2 className="">{headline}</h2>
                    <p className="briefDescription">{briefDescription}</p>
                </div>
                
            </a>
        )
    
}

export  function PreviewMid({headline,time,briefDescription,imgUrl}){
    
    return(
        <a href="" style={{textDecoration:"none"}} className="col preview-mid">
            <img src={require(`../../public/uploads/${imgUrl}`)}  className="" style={{display:"block",width:"100%",height:"300px"}}></img>

            <div style={{color:"black"}} className="container">
                <i className="duration">{time}</i>
                <h5 >{headline}</h5>
                <p className="briefDescription">{briefDescription}</p>
            </div>
        </a>
    )

}

export  function PreviewSmall({headline,time,briefDescription,imgUrl}){
    
    return(
        <a href="" style={{textDecoration:"none",color:"black"}} className="mb-4 mt-3 d-flex container preview-small">
            <img src={require(`../../public/uploads/${imgUrl}`)}  className="col-md-5" style={{display:"block",width:"200px",height:"100px"}}></img>
            
            <div style={{}} className="ms-4">
                <i className="duration">{time}</i>
                <h5 >{headline}</h5>
                <p className=" briefDescription">{briefDescription}</p>
            </div>
            
        </a>
    )

}


