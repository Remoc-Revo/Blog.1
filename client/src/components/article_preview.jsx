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
            <a href={`/sngl/${articleId}`} style={{textDecoration:"none",color:"black",height:"100%"}} className="w-100">
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


export function GridItemSmall({articleSection,
                                headline,time,
                                briefDescription,
                                imgUrl,
                                articleId,
                                handleClick,
                                isFixed
                            }){


    

    return(
        <div className={`${isFixed?'col-sm-6  col-lg-3':'col-xl-3 col-lg-4 col-sm-6'} mb-5  fade-in-up p-0 rounded`}
            >
            
            <div style={{textDecoration:"none",color:"black",height:"100%",backgroundColor:"#E6E1FF"}} className="m-2 rounded" onClick={handleClick}>
            {
                   (imgUrl!==null)
                   ?<div className="overflow-hidden"  style={{display:"block", height:"210px"}}                 > 
                    <img src={imgUrl} alt=""   
                        className="w-100 h-100 object-fit-cover rounded-top"
                        style={{objectPosition:"top"}}  
                        >                            
                        </img>
                        
                    </div>
                    :<></>    
                }
                <div  className="m-2 mt-2">
                    <div className="row m-1">
                        <div className="col-auto bg-light rounded">
                            <h6 className="text-secondary pt-2">{articleSection}</h6>
                            </div>
                    </div>
                    <i className="duration">{time}</i>
                    <h5 className="articleHeadline">{headline}</h5>
                    {/* <p className="briefDescription">{briefDescription}</p> */}
                </div>
            </div>
        </div>
            
        )

}



export function AdminPostPreview({articleSection,headline,time,briefDescription,imgUrl,articleId,handleClick}){

    return(
        <div className="col-md-12  p-2">
            <div style={{textDecoration:"none",color:"black"}} 
                className="d-flex  align-items-center justify-content-between" 
                onClick={handleClick}>
                
                <div  className="col-9">
                    <h6 className="articleHeadline">{headline}</h6>
                    <div className="row ">
                        <div className="col-auto">
                            <h6 className="text-secondary m-0">{articleSection}</h6>
                        </div>
                    </div>
                    <i className="duration ">{time}</i>
                    
                    {/* <p className="briefDescription">{briefDescription}</p> */}
                </div>
                
                {
                   (imgUrl!==null)
                   ?<div className="overflow-hidden   d-flex "  style={{display:"block",height:"100px", width:"100px"}}                 > 
                    <img src={imgUrl} alt=""   
                            className="w-100 h-100   object-fit-cover">                            
                        </img>
                        
                    </div>
                    :<div style={{ width:"30vw"}}>
                        
                    </div>    
                }
            </div>
        </div>
            
        )

}
