import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import MainNav from "../navs/mainNav";
import Footer from "../components/footer";

export default function ArticlesUpdating(){
    const navigate=useNavigate();

    var [articleSection,set_articleSection]=useState();
    var [articleHeadline,set_articleHeadline]=useState('');
    var [articleBody,set_articleBody]=useState('');
    var [articlePhoto,set_articlePhoto]=useState(null);

    axios.get('http://localhost:9000/user')
         .then((response)=>{
            // console.log("wriii",response.data.userLevel)
            if(response.data.userLevel!==1){
                navigate('/login')
            }
         })

    async function upload(){
        var formData=new FormData();

        formData.append('file',articlePhoto);
        console.log("the file",formData)
        const res=await axios.post('http://localhost:9000/upload/articleImg',formData)
            
        return res.data;

    }

    async function updateArticles(e){
        e.preventDefault();
        console.log("encodeURIComponent:",encodeURI(articleBody).replace("'","&apos;"))
        console.log(articleBody,"\n",articleHeadline,"\n",articleSection,"\n",/*articlePhoto.name.replace(/ /g,"_")*/)
        
        let imgUrl;
        imgUrl = await upload();
        console.log("imgUrl",imgUrl)

        if(imgUrl !== undefined){
            await axios.post('http://localhost:9000/updateArticles',
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
                if(response.status===200){
                    navigate('/');
                }
             })
             .catch((err)=>{
                console.log(err)
                if(err.response.status===401){
                    navigate('/login');
                }
             })
        }    
    }

    

    return(
        <div className="container">
            <MainNav/>
            <form  onSubmit={updateArticles} enctype="multipart/form-data" className="mb-5">

                <div className=" container">
                    <select placeholder="Articles Section" id="articleSection" className="w-100 form-control" value={articleSection} onChange={(e)=>set_articleSection(e.target.value)} required>
                        <option value="" >Select Article Section</option>
                        <option value="FoodAndRecipes">Food and recipes</option>
                        <option value="NewbornCare">Newborn care</option>
                        <option value="KidsPartyIdeas">Kids party ideas</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Travel">Travel </option>
                        <option value="Pregnancy"> Pregnancy</option>
                        <option value="HomeSchooling">Home Schooling </option>

                        
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
                        <input type="file" required id="articleImg" name="file" data-buttonText="Upload image" onChange={(e)=>set_articlePhoto(e.target.files[0])}/>
                    </div>
                    
                    <input className="btn-success col" type="submit" value="Publish"/>
                </div>

                
                
            </form>
            <Footer/>
        </div>
    )
}