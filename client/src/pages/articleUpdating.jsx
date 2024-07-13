import React,{useState,useEffect, useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorState, convertToRaw,convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useUserContext } from "../userContext";
import api from "../config/api";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";


export default function ArticlesUpdating(){
    const navigate=useNavigate();

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
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
    const [isAddingNewCategory,setIsAddingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [articlePhotos, setArticlePhotos] = useState([]);

    function fetchArticleToUpdate(){
        api.get(`/single/${articleIdToUpdate}`)
             .then((response)=>{
                console.log("fetched articleToBeUpdated::",response)
                setArticleToUpdate(response.data.article[0]) ;

                setArticleSectionId(articleToUpdate.articleSectionId);
                setArticleHeadline(decodeURIComponent(articleToUpdate.articleHeadline))
                setArticleBody(response.data.article[0].articleBody)


                setArticlePhoto(articleToUpdate.multimediaUrl)

                const fetchedArticleBody = response.data.article[0].articleBody;
                const parsedArticleBody = JSON.parse(fetchedArticleBody);
                const articleBodyContentState = convertFromRaw(parsedArticleBody);
                setEditorState(EditorState.createWithContent(articleBodyContentState));

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

    const onEditorStateChange = (editorState)=>{
        setEditorState(editorState);
    }

    const uploadImageToEditor = (file)=>{
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({ data: { link: reader.result } });
            };
            reader.readAsDataURL(file);
        });
    }


     const fetchSections = useCallback(async()=>{
        await api.get('/sections')
            .then((response)=>{
              setArticleSections(response.data.sections);

            })
            .catch((err)=>{
              console.log("error fetching sections", err)
            });        
          }
     ,[])

    useEffect(()=>{
        if(!loading && user != null){
            if(user === 'unauthorized'){
                console.log("user current state: ",user);
                navigate('/login')
            }
            fetchSections();

        }

        
    },[loading,navigate,user,articleToUpdate, articleToUpdateLoaded,fetchSections])
   

    async function uploadImageToCloud(imageSrc){
        if(imageSrc===null){
            return null;
        }
        var formData=new FormData();

        formData.append('file',imageSrc);
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

    const replaceImageInContent = (contentState, oldSrc, newSrc) => {
        let newContentState = contentState;
        const blockMap = newContentState.getBlockMap();
    
        blockMap.forEach((block) => {
            block.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity();
                    return (
                        entityKey !== null &&
                        newContentState.getEntity(entityKey).getType() === 'IMAGE'
                    );
                },
                (start, end) => {
                    const entityKey = block.getEntityAt(start);
                    const entity = newContentState.getEntity(entityKey);
                    const { src } = entity.getData();
                    if (src === oldSrc) {
                        newContentState = newContentState.replaceEntityData(entityKey, { src: newSrc });
                    }
                }
            );
        });
    
        return newContentState;
    };

    const extractImagesFromContent = (contentState) => {
        const contentBlocks = contentState.getBlocksAsArray();
        let images = [];
        contentBlocks.forEach((block) => {
            block.findEntityRanges(
                (character) => {
                    const entityKey = character.getEntity();
                    return (
                        entityKey !== null &&
                        contentState.getEntity(entityKey).getType() === 'IMAGE'
                    );
                },
                (start, end) => {
                    const entityKey = block.getEntityAt(start);
                    const entity = contentState.getEntity(entityKey);
                    const { src } = entity.getData();
                    console.log("gotten src:", src,"the entity type:", entity.getType(), "the entity data:", entity.getData().url)
                    images.push(src);
                }
            );
        });
        return images;
    };

    async function addArticle(articleBody){
        console.log("encodeURIComponent:",encodeURI(articleBody).replace("'","&apos;"))
        console.log(articleBody,"\n",articleHeadline,"\n",articleSectionId,"\n",/*articlePhoto.name.replace(/ /g,"_")*/)
        
        let imgUrl = null;
        imgUrl = await uploadImageToCloud();
        console.log("imgUrl",imgUrl)


        if(articlePhotos.length>0) imgUrl=  articlePhotos[0];
        
        await api.post('/addArticle',
                {
                    headers: { 'content-type': 'multipart/form-data' },
                    articleSectionId: articleSectionId,
                    articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                    articleBody:articleBody,//encodeURIComponent(articleBody).replace(/'/g,"&apos;"),
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

    async function updateArticle(articleBody){
        let imgUrl= null;
        let prevImg;

       

        // //if a new image has been uploaded
        // if(articlePhoto !== articleToUpdate.multimediaUrl){
            
        //     imgUrl = await uploadImageToCloud();
        //     prevImg = articleToUpdate.multimediaUrl

        // }
        // //the image is unchanged
        // else{
        //     imgUrl = articleToUpdate.multimediaUrl;
        // }
        console.log("editor state",editorState)
        //for test
       if(articlePhotos.length>0) imgUrl=  articlePhotos[0];

        await api.post('/updateArticle',
                {
                    articleId: articleToUpdate.articleId,
                    articleSectionId:articleSectionId,
                    articleHeadline:encodeURIComponent(articleHeadline).replace(/'/g,"&apos;"),
                    articleBody: articleBody,//encodeURIComponent().replace(/'/g,"&apos;"),
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

    async function handleSubmit(e){
        e.preventDefault();
        setAwaitingResponse(true);

        // Extract images from editor content
        const contentState = editorState.getCurrentContent();
        const images = extractImagesFromContent(contentState);


        //When Editing an already saved article
        let previousImages= [];
        if(articleIdToUpdate!=null){
            console.log(typeof articleToUpdate," article itself",articleToUpdate.articleBody)
            const uneditedArticleBody = articleToUpdate.articleBody;
            const parsedUneditedArticleBody = JSON.parse(uneditedArticleBody);
            const articleBodyContentState = convertFromRaw(parsedUneditedArticleBody);
            previousImages = extractImagesFromContent(articleBodyContentState);
        }
        

        // Upload each image and replace in content with URL
        const uploadedUrls = await Promise.all(
            images.map(async (imageSrc) => {
                if(previousImages.includes(imageSrc)){
                    console.log("image saved already")
                    return null;
                }

                //upload image  
                const imageUrl = await uploadImageToCloud(imageSrc);

                // Replace image in content with the uploaded URL
                const newContentState = replaceImageInContent(contentState, imageSrc, imageUrl);
                setEditorState(EditorState.createWithContent(newContentState));

                return imageUrl;
               
                   
            })
        );

        console.log("Uploaded urls",uploadedUrls)

        setArticlePhotos(uploadedUrls);

        const rawContentState = convertToRaw(editorState.getCurrentContent())
        const serializedContent = JSON.stringify(rawContentState);

        console.log("Article body: ",serializedContent);

        if(articleToUpdate == null){
             addArticle(serializedContent);
        }
        else{
            updateArticle(serializedContent);
        }
    }
    
    async function addNewSection(){
        if(newCategory!==""){
            await api.post('/addSection',{sectionName: newCategory})
                     .then((response)=>{
                        setArticleSectionId(response.data.sectionId);
                        setNewCategory("");
                        setIsAddingNewCategory(false);
                        fetchSections();
                     })

        }
    }

    return(
        <div className="m-2 " id ="article-update">
            <div className="d-flex justify-content-between">
                <div>

                </div>
            </div>
            
            <div style={{height:"100px"}}></div>

            <form  onSubmit={handleSubmit} enctype="multipart/form-data" className="mb-5 ms-4 me-4" id = "article-form">

                <div className=" d-lg-flex justify-content-between">
                   

                    <div className="col-lg-9 me-lg-1">
                        <div className="d-flex mb-3 ">
                            <input type="text"  name="articleHeadline" className="w-100 border-0" 
                                id = "title-input"
                                placeholder="Add Title..."  minlength="2"  required value={articleHeadline}
                                onChange={(e)=>setArticleHeadline(e.target.value)}
                            />
                        </div>

                                

                        <div className="editor-container mb-4">
                            {/* <ReactQuill value={articleBody}
                                    onChange={setArticleBody}
                                    required
                                    className="editor"
                                    // theme="snow"
                            /> */}

                            <Editor
                                editorState={editorState}
                                onEditorStateChange={onEditorStateChange}
                                toolbarClassName="toolbar-class"
                                wrapperClassName="wrapper-class"
                                editorClassName="editor-class"
                                placeholder="Type your content here or add images..."
                                toolbar={{
                                    image:{
                                        uploadCallback:uploadImageToEditor,
                                        alignmentEnabled: true,
                                        previewImage :true,
                                        alt:{
                                            present:true,
                                            mandatory:false
                                        },
                                        defaultSize:{
                                            height:'300px',
                                            width:'400px'
                                        }
                                    }
                                }}
                                customStyleMap={{
                                    IMAGE: {
                                        display: 'block',
                                        maxWidth: '400px',
                                        height: '300px'
                                    }
                                }}
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
                                    <button className="btn border" type="submit"
                                        onClick={(e)=>{
                                            setIsdraft(true);
                                            // document.getElementById("article-form").submit()
                                            }} >
                                        <span>Save as a draft</span>
                                    </button>
                                </div>

                                <div className="">
                                {(awaitingResponse)
                                    ?<div className="spinner-border text-info">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    
                                    :<button className="btn btn-light col" 
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
                        <div className="border p-3 d-flex flex-column" id="category">
                            <h5>Category</h5>
                            <div className="mb-3" id="available-categories">
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
                            <div id="add-category">
                                <button className="btn btn-link p-0 mb-3" id="new-category-btn" type="button" onClick={()=>{setIsAddingNewCategory(true)}}>
                                    Add New Category
                                </button>

                                {(isAddingNewCategory)
                                    ?<div className="d-flex flex-column gap-3">
                                        <input type="text"  name="newCategory" className="w-100 form-control"
                                            placeholder="New Category name"  minlength="" maxlength="200" value={newCategory}
                                            onChange={(e)=>setNewCategory(e.target.value)}
                                        />

                                        <button className={newCategory===""?"btn btn-light": "btn-ready"}
                                            type="button"
                                            id="add-category-btn"
                                            onClick={addNewSection}
                                            >
                                            Add new category
                                        </button>
                                    </div>

                                    :null
                                }
                            </div>
                        </div>
                        
                    </div>
                </div>                      
                
            </form>
        </div>
    )
}
