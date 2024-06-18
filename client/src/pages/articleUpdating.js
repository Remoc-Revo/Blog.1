import React,{useState,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MainNav from "../navs/mainNav";
import Footer from "../components/footer";
import { useUserContext } from "../userContext";
import api from "../config/api";

export default function ArticlesUpdating(){
    const navigate=useNavigate();

    var [articleSectionId,setArticleSectionId]=useState();
    var [articleHeadline,setArticleHeadline]=useState('');
    var [articleBody,setArticleBody]=useState('');
    var [articlePhoto,setArticlePhoto]=useState(null);
    var [articleToUpdateLoaded, setArticleToUpdateLoaded] = useState(false);
    const {loading,user} = useUserContext();
    let {articleIdToUpdate} = useParams();
    const [articleToUpdate,setArticleToUpdate] = useState();
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [isDraft, setIsdraft] = useState();
    const [articleSections, setArticleSections]= useState([]);

    function fetchArticleToUpdate(){
        api.get(`/single/${articleIdToUpdate}`)
             .then((response)=>{
                console.log("fetched articleToBeUpdated::",response)
                setArticleToUpdate(response.data.article[0]) ;
                setArticleSectionId(articleToUpdate.articleSectionId);
                setArticleHeadline(decodeURIComponent(articleToUpdate.articleHeadline))
                setArticleBody(decodeURIComponent(articleToUpdate.articleBody))
                setArticlePhoto(articleToUpdate.multimediaUrl)
                setArticleToUpdateLoaded(true);
            })
            .catch((err)=>{
                console.log("get single article error",err)
            });
    }

    if(articleIdToUpdate !== 'null' && ! articleToUpdateLoaded){
    console.log("articleToUpdate not nulll")
        fetchArticleToUpdate();

    }

    async function fetchSections(){
        await api.get('/sections')
            .then((response)=>{
              setArticleSections(response.data.sections);
              console.log("section : ", articleSections)              

            })
            .catch((err)=>{
              console.log("error fetching sections", err)
            });        
          }

    useEffect(()=>{
        if(!loading && user != null){
            if(user === 'unauthorized'){
                console.log("user current state: ",user);
                navigate('/login')
            }
            fetchSections();

        }

        
    },[loading,navigate,user,articleToUpdate, articleToUpdateLoaded])
   

    async function upload(){
        if(articlePhoto===null){
            return null;
        }
        var formData=new FormData();

        formData.append('file',articlePhoto);
        formData.append('upload_preset',process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        console.log("the file",formData)

        try{
            const res=await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD__NAME}/image/upload/`,
                        {
                            method:"post",
                            body:formData
                        }
                )
            if(res.ok){
                let data;
                data  = await res.json()
                if(data!== undefined){
                   
                    console.log("\n secure_url",data.secure_url)
                    return data.secure_url
                }
            }   
           
        }catch(err){
            console.log("file upload err",err);
        }
    }

    async function addArticle(){
        setAwaitingResponse(true);
        console.log("encodeURIComponent:",encodeURI(articleBody).replace("'","&apos;"))
        console.log(articleBody,"\n",articleHeadline,"\n",articleSectionId,"\n",/*articlePhoto.name.replace(/ /g,"_")*/)
        
        let imgUrl;
        imgUrl = await upload();
        console.log("imgUrl",imgUrl)



        if(imgUrl !== undefined){
            await api.post('/addArticle',
                    {
                        headers: { 'content-type': 'multipart/form-data' },
                        articleSectionId: 3,//articleSectionId,
                        articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                        articleBody:encodeURIComponent(articleBody).replace(/'/g,"&apos;"),
                        withCredentials:true,
                        img:imgUrl,
                        isDraft: isDraft
                    },
                    )
             .then((response)=>{
                if(response && response.status===200){
                    setAwaitingResponse(false);
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response && err.response.status===401){
                    setAwaitingResponse(false);
                    navigate('/login');
                }
             })
        }    
    }

    async function updateArticle(){
        setAwaitingResponse(true);
        let imgUrl;
        let prevImg;
        //if a new image has been uploaded
        if(articlePhoto !== articleToUpdate.multimediaUrl){
            
            imgUrl = await upload();
            prevImg = articleToUpdate.multimediaUrl

        }
        //the image is unchanged
        else{
            imgUrl = articleToUpdate.multimediaUrl;
        }

        if(imgUrl !== undefined){
            await api.post('/updateArticle',
                    {
                        articleId: articleToUpdate.articleId,
                        articleSectionId:articleSectionId,
                        articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                        articleBody:encodeURIComponent(articleBody).replace(/'/g,"&apos;"),
                        withCredentials:true,
                        img:imgUrl,
                        prevImg : prevImg,
                        isDraft:isDraft
                    },
                    )
             .then((response)=>{
                if(response && response.status===200){
                    setAwaitingResponse(false);
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response && err.response.status===401){
                    setAwaitingResponse(false);
                    navigate('/login');
                }
             })
        }
    }

    function handleSubmit(e){
        e.preventDefault();

        if(articleToUpdate == null){
             addArticle();
        }
        else{
            updateArticle();
        }
    }
    

    return(
        <div className="m-2 " id ="article-update">
            <MainNav/>
            
            <form  onSubmit={handleSubmit} enctype="multipart/form-data" className="mb-5 " id = "article-form">

                <div className=" d-lg-flex justify-content-between">
                   

                    <div className="col-lg-9 me-lg-1">
                        <div className="d-flex mb-3 ">
                            <input type="text"  name="articleHeadline" className="w-100 form-control"
                                placeholder="Title"  minlength="8" maxlength="200"required value={articleHeadline}
                                onChange={(e)=>setArticleHeadline(e.target.value)}
                            />
                        </div>

                                

                        <div className="editor-container mb-4">
                            <ReactQuill value={articleBody}
                                    onChange={setArticleBody}
                                    required
                                    className="editor"
                                    // theme="snow"
                            />
                        </div>
                    </div>

                    <div className="menu col-lg-3" id="publish-menu">
                        <div className=" border p-3 mb-2">
                            <h5 className="">Publish</h5>
                            <span className="d-block pb-2">
                                <b>Status: </b> Draft
                            </span>
                            <span className="d-block pb-2">
                                <b>Visibility: </b> Public
                            </span>
                            <div className="col pb-2">
                                <label for="articleImg" className="text-decoration-underline">Upload image</label>
                                <input type="file" accept="image/*" id="articleImg" 
                                    name="file" data-buttonText="Upload image" 
                                    style={{ display: "none", }}
                                    onChange={(e)=>setArticlePhoto(e.target.files[0])}/>
                            </div>
                           
                            <div className="d-flex justify-content-between mt-1" >
                               <div className="" id="save-draft"> 
                                    <button className="btn border" 
                                        onClick={(e)=>{
                                            setIsdraft(true);
                                            document.getElementById("article-form").submit()
                                            }} >
                                        <span>Save as a draft</span>
                                    </button>
                                </div>

                                <div className="">
                                {(awaitingResponse)
                                    ?<div className="spinner-border text-info">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    
                                    :<button className="btn btn-success col" 
                                        id = "publish-btn"
                                        type="submit" 
                                        onClick={(e)=>{setIsdraft(false)}}
                                    >{(articleIdToUpdate === 'null') 
                                        ? "Publish"
                                        : "Update"}</button>
                                } 
                                </div>
                            </div>
                        </div>
                        <div className="border p-3" id="category">
                            <h5>Category</h5>
                            {articleSections.map((section,index)=>{
                                return <div className="section pb-2">
                                    <input
                                    type="radio"
                                    required
                                    checked={section.sectionId === parseInt(articleSectionId,10)}
                                    name="section"
                                    value= {section.sectionId}                               
                                    id={section.sectionId}
                                    onChange={(e)=>{setArticleSectionId(e.target.value); }} />
                                    <label htmlFor={section.sectionId}>{section.sectionName}</label>
                                </div>
                            })
                           }
                           
                        </div>
                    </div>
                </div>
                
                
                
               
                
                
            </form>
            <Footer/>
        </div>
    )
}
