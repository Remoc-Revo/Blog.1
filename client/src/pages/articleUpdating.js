import React,{useState,useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MainNav from "../navs/mainNav";
import Footer from "../components/footer";
import { useUserContext } from "../userContext";
import api from "../config/api";
import axios from "axios";

export default function ArticlesUpdating(){
    const navigate=useNavigate();

    var [articleSection,set_articleSection]=useState();
    var [articleHeadline,set_articleHeadline]=useState('');
    var [articleBody,set_articleBody]=useState('');
    var [articlePhoto,set_articlePhoto]=useState(null);
    var [articleToUpdateLoaded, set_articleToUpdateLoaded] = useState(false);
    const {loading,user} = useUserContext();
    let {articleToUpdate} = useParams();
    articleToUpdate = JSON.parse(decodeURIComponent(articleToUpdate));
       

    useEffect(()=>{
        if(!loading && user != null){
            if(user === 'unauthorized'){
                console.log("user current state: ",user);
                navigate('/login')
            }
        }
        if(articleToUpdate != null && ! articleToUpdateLoaded){
            set_articleSection(articleToUpdate.articleSection);
            set_articleHeadline(articleToUpdate.articleHeadline);
            set_articleBody(articleToUpdate.articleBody);
            set_articlePhoto(articleToUpdate.multimediaUrl)
            set_articleToUpdateLoaded(true);
        }
    },[loading,navigate,user,articleToUpdate, articleToUpdateLoaded])
   

    async function upload(){
        var formData=new FormData();

        formData.append('file',articlePhoto);
        formData.append('upload_preset',process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        console.log("the file",formData)

        try{
            const res=await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD__NAME}/image/upload/`,
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

    async function addArticle(e){
        e.preventDefault();
        console.log("encodeURIComponent:",encodeURI(articleBody).replace("'","&apos;"))
        console.log(articleBody,"\n",articleHeadline,"\n",articleSection,"\n",/*articlePhoto.name.replace(/ /g,"_")*/)
        
        let imgUrl;
        imgUrl = await upload();
        console.log("imgUrl",imgUrl)

        if(imgUrl !== undefined){
            await api.post('/addArticle',
                    {
                        headers: { 'content-type': 'multipart/form-data' },
                        articleSection:articleSection,
                        articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                        articleBody:encodeURIComponent(articleBody).replace(/'/g,"&apos;"),
                        withCredentials:true,
                        img:imgUrl
                    },
                    )
             .then((response)=>{
                if(response && response.status===200){
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response && err.response.status===401){
                    navigate('/login');
                }
             })
        }    
    }

    async function updateArticle(e){
        e.preventDefault();
        let imgUrl;
        let prevImg;
        //if a new image has been uploaded
        if(articlePhoto !== articleToUpdate.multimediaUrl){
            const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD__NAME}/image/delete_by_url`
            await axios.delete(cloudinaryDeleteUrl,{
                auth:{
                    username: process.env.REACT_APP_CLOUDINARY_API_KEY,
                    password: process.env.REACT_APP_CLOUDINARY_API_SECRET
                },
                data: {
                    url: articleToUpdate.multimediaUrl
                }
            })
            .then(()=>{
                console.log("Deleted ?")
            })
            .catch((err)=>{
                console.log("Error while deleting :", err );
            })


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
                        articleSection:articleSection,
                        articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                        articleBody:encodeURIComponent(articleBody).replace(/'/g,"&apos;"),
                        withCredentials:true,
                        img:imgUrl,
                        prevImg : prevImg
                    },
                    )
             .then((response)=>{
                if(response && response.status===200){
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response && err.response.status===401){
                    navigate('/login');
                }
             })
        }
    }
    

    return(
        <div className="container">
            <MainNav/>
            <form  onSubmit={(articleToUpdate===null) ? addArticle : updateArticle} enctype="multipart/form-data" className="mb-5">

                <div className=" container">
                    <select placeholder="Articles Section" id="articleSection" className="w-100 form-control" value={articleSection} onChange={(e)=>set_articleSection(e.target.value)} required>
                        <option value="" selected disabled>Select Article Section</option>
                        <option value="Food_and_Recipes">Food and recipes</option>
                        <option value="Newborn_Care">Newborn care</option>
                        <option value="Kids_Party_Ideas">Kids party ideas</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Travel">Travel </option>
                        <option value="Pregnancy"> Pregnancy</option>
                        <option value="Home_Schooling">Home Schooling </option>

                        
                    </select>

                    <div className="d-flex mb-3 mt-3">
                        <input type="text"  name="articleHeadline" className="w-100 form-control"
                            placeholder="Headline"  minlength="8" maxlength="200"required value={articleHeadline}
                            onChange={(e)=>set_articleHeadline(e.target.value)}
                        />
                    </div>

                            

                    <div className="editor-container mb-4">
                        <ReactQuill value={articleBody}
                                onChange={set_articleBody}
                                required
                                className="editor"
                                // theme="snow"
                        />
                    </div>
                </div>
                
                
                
                <div className="d-flex row container">
                    <div className="col">
                        <label for="articleImg">Upload image</label>
                        <input type="file" accept="image/*" id="articleImg" name="file" data-buttonText="Upload image" onChange={(e)=>set_articlePhoto(e.target.files[0])}/>
                    </div>
                    
                    <input className="btn-success col" type="submit" value={(articleToUpdate===null) ? "Publish" : "Update"}/>
                </div>

                
                
            </form>
            <Footer/>
        </div>
    )
}
