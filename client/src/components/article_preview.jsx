import React,{useState,useEffect} from "react";
import '../styles/index.scss';
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
            <a href={`/sngl/${articleId}`} style={{textDecoration:"none",color:"black",height:"100%"}} className="">
                <img src={fetchedImgUrl} alt=""   style={{display:"block",width:"100%",maxHeight:"450px"}}></img>

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
        <a href={`/sngl/${articleId}`} style={{textDecoration:"none",padding:"0px",height:"100%"}} className="col-md preview-mid">
            <img src={fetchedImgUrl} alt="" className="" style={{display:"block",width:"100%",maxHeight:"180px"}}></img>

            <div style={{color:"black"}} className="container">
                <i className="duration">{time}</i>
                <h5 className="briefHeadline">{headline}</h5>
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
        <a href={`/sngl/${articleId}`}  style={{textDecoration:"none",color:"black"}} className="mb-4 mt-3 d-md-flex container preview-small" >
            <img src={fetchedImgUrl} alt="" className="col-12 col-md-8" style={{display:"block",width:"",maxHeight:"180px"}}></img>
            
            <div style={{}} className="ms-md-4">
                <i className="duration">{time}</i>
                <h5 >{headline}</h5>
                <p className=" briefDescription">{briefDescription}</p>
            </div>
            
        </a>
    )

}



export function GridItemBig({articleSection,headline,time,briefDescription,imgUrl,articleId}){

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
        <div className="col-lg-4">
            <a href={`/sngl/${articleId}`} style={{textDecoration:"none",color:"black",height:"100%"}} className="">
                <img src={fetchedImgUrl} alt=""   style={{display:"block",minHeight:"250px", maxHeight:"250px"}} className="w-100"></img>

                <div  className="container">
                    <h5>{articleSection.toUpperCase()}</h5>
                    <i className="duration">{time}</i>
                    <h5 className="articleHeadline">{headline}</h5>
                    {/* <p className="briefDescription">{briefDescription}</p> */}
                </div>
                
            </a>
        </div>
            
        )

}


export function GridItemSmall({articleSection,headline,time,briefDescription,imgUrl,articleId,handleClick}){

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
        <div className="col-lg-3 mb-4 articlePreview">
            <a style={{textDecoration:"none",color:"black",height:"100%"}} className="" onClick={handleClick}>
                <div className="overflow-hidden"  style={{display:"block", height:"180px"}}                 > 
                    <img src={fetchedImgUrl} alt=""   
                        className="w-100 h-100  rounded object-fit-cover">                            
                    </img>
                </div>
                <div  className="mt-2">
                    <div className="row">
                        <div className="col-auto bg-light m-2 rounded">
                            <h6 className="text-secondary">{articleSection}</h6>
                            </div>
                    </div>
                    <i className="duration">{time}</i>
                    <h5 className="articleHeadline">{headline}</h5>
                    {/* <p className="briefDescription">{briefDescription}</p> */}
                </div>
                
            </a>
        </div>
            
        )

}



