import React,{useState,useEffect} from "react";
import '../styles/index.css';
import GetImage from "../reusables/getImage";

export  function PreviewBig({headline,time,briefDescription,imgUrl,articleId}){

        const [fetchedImgUrl,setFetchedImgUrl] = useState('');

        useEffect(()=>{
            async function fetchImage(){
                try{
                    const url = await GetImage(imgUrl);
                    setFetchedImgUrl(url)
                    console.log("urlllll",url)

                }catch(err){
                    console.log('error fetching image',err);
                }
            }

            fetchImage();
        },[imgUrl])

        return(
            <a href={`/sngl/${articleId}`} style={{textDecoration:"none",color:"black"}} className="">
                <img src={fetchedImgUrl} alt=""   style={{display:"block",width:"100%",height:"500px"}}></img>

                <div  className="container">
                    <i className="duration">{time}</i>
                    <h2 className="">{headline}</h2>
                    <p className="briefDescription">{briefDescription}</p>
                </div>
                
            </a>
        )
    
}

export  function PreviewMid({headline,time,briefDescription,imgUrl,articleId}){
    const [fetchedImgUrl,setFetchedImgUrl] = useState('');

        useEffect(()=>{
            async function fetchImage(){
                try{
                    const url = await GetImage(imgUrl);
                    setFetchedImgUrl(url)
                    console.log("urlllll",url)

                }catch(err){
                    console.log('error fetching image',err);
                }
            }

            fetchImage();
        },[imgUrl])

    return(
        <a href={`/sngl/${articleId}`} style={{textDecoration:"none",padding:"0px"}} className="col preview-mid">
            <img src={fetchedImgUrl} alt="" className="" style={{display:"block",width:"100%",height:"300px"}}></img>

            <div style={{color:"black"}} className="container">
                <i className="duration">{time}</i>
                <h5 >{headline}</h5>
                <p className="briefDescription">{briefDescription}</p>
            </div>
        </a>
    )

}

export  function PreviewSmall({headline,time,briefDescription,imgUrl,articleId}){
    const [fetchedImgUrl,setFetchedImgUrl] = useState('');

        useEffect(()=>{
            async function fetchImage(){
                try{
                    const url = await GetImage(imgUrl);
                    setFetchedImgUrl(url)
                    console.log("urlllll",url)

                }catch(err){
                    console.log('error fetching image',err);
                }
            }

            fetchImage();
        },[imgUrl])
        
    return(
        <a href={`/sngl/${articleId}`}  style={{textDecoration:"none",color:"black"}} className="mb-4 mt-3 d-flex container preview-small" >
            <img src={fetchedImgUrl} alt="" className="col-md-5" style={{display:"block",width:"200px",height:"100px"}}></img>
            
            <div style={{}} className="ms-4">
                <i className="duration">{time}</i>
                <h5 >{headline}</h5>
                <p className=" briefDescription">{briefDescription}</p>
            </div>
            
        </a>
    )

}


