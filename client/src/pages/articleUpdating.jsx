import React,{useState,useEffect, useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorState, convertToRaw,convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useUserContext } from "../userContext";
import api from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faBarsStaggered, faBell, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { transformImage } from "../reusables/getImage";

export default function ArticlesUpdating(){
    const navigate=useNavigate();

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    var [articleSectionId,setArticleSectionId]=useState(27); // default id for uncategoried sections, ensure it's changed
    var [articleHeadline,setArticleHeadline]=useState('');
    var [articleToUpdateLoaded, setArticleToUpdateLoaded] = useState(false);
    const {loading,user} = useUserContext();
    let {articleIdToUpdate} = useParams();
    const [articleToUpdate,setArticleToUpdate] = useState(null);
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [isDraft, setIsdraft] = useState();
    const [articleSections, setArticleSections]= useState([]);
    const [isAddingNewCategory,setIsAddingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [articlePhotos, setArticlePhotos] = useState([]);
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(true);
    const [windowWidth,setWindowWidth]=useState(window.innerWidth)
    const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
    const [isAutoSaving, setIsAutoSaving] = useState(true);
    const [userProfilePhoto, setUserProfilePhoto] = useState(null);

    function  fetchArticleToUpdate() {
        api.get(`/single/${articleIdToUpdate}`)
             .then((response)=>{
                console.log("fetched articleToBeUpdated::",response)
                setArticleToUpdate(response.data.article[0]) ;

                setArticleSectionId(articleToUpdate.articleSectionId);
                setArticleHeadline(decodeURIComponent(articleToUpdate.articleHeadline))

                const fetchedArticleBody = response.data.article[0].articleBody;
                const parsedArticleBody = JSON.parse(fetchedArticleBody);
                const articleBodyContentState = convertFromRaw(parsedArticleBody);
                const bodyWithResizedImages = resizeImages(articleBodyContentState);
                setEditorState(EditorState.createWithContent(bodyWithResizedImages));

                setArticleToUpdateLoaded(true);
            })
            .catch((err)=>{
                console.log("get single article error",err)
            });
    }

   useEffect(()=>{
        if(articleIdToUpdate !== 'null' && ! articleToUpdateLoaded){
            console.log("articleToUpdate not nulll")
                fetchArticleToUpdate();

            }
            
        }
    )

    // useEffect(()=>{
    //     const autoSaveToServer = ()=>{
    //         if(!isEditorStateEmpty(editorState) 
    //             && articleHeadline !== '' 
    //             && user !== 'unauthorized')
    //         { 
    //             console.log("Saviing draft again..", new Date().getSeconds())
    //             handleSubmit(null, true);

    //             const rawContentState = convertToRaw(editorState.getCurrentContent())
    //             const serializedContent = JSON.stringify(rawContentState);
    //             setArticleToUpdate({
    //                 ...articleToUpdate,
    //                 articleBody: serializedContent,
    //                 articleHeadline: articleHeadline,
    //                 articleSectionId: articleSectionId
    //             });

    //             console.log("The article to update some time in future:", articleToUpdate)
    //         }
    //     }

    //     const intervalId = setInterval(autoSaveToServer, 10000);

    //     return  ()=> clearInterval(intervalId);
    // })

    useEffect(()=>{
        function handleWindowResize(){
            const newWidth = window.innerWidth

            if(newWidth < 1200){
                setIsSidePanelVisible(false);
            }
            else{
                setIsSidePanelVisible(true);
            }
            setWindowWidth(newWidth)
        }

        handleWindowResize()

        window.addEventListener('resize',handleWindowResize)

        return ()=>{
            window.removeEventListener('resize',handleWindowResize)
        }

    },[])

    const isEditorStateEmpty = (editorState)=>{
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        const blocks  = rawContent.blocks;

        return blocks.every(block =>{
            const isEmptyText = !block.text.trim();
            const hasNoEntities = block.entityRanges.length === 0;
            return isEmptyText && hasNoEntities;
        });
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
            
            setUserProfilePhoto(user.userProfilePhoto);
            fetchSections();

        }

        
    },[loading,navigate,user,articleToUpdate, articleToUpdateLoaded,fetchSections])
    

    async function uploadImageToCloud(imageSrc){
        console.log("uplading to cloud called");

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

    const replaceImageInContent = (contentState, oldSrc, newSrc,newHeight) => {
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
                        newContentState = newContentState
                                            .replaceEntityData(entityKey, 
                                                { src: newSrc,
                                                  height:newHeight,
                                                  width:'600px',
                                                  alignment:'left'
                                                });
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

    function resizeImages(contentState){
        const images = extractImagesFromContent(contentState);
        let updatedContentState = contentState;

        for(var imageSrc of images){        
            // Replace image in content with the resized image
            updatedContentState = replaceImageInContent(updatedContentState, imageSrc, imageSrc,'400px');             
        }

        return updatedContentState;
    }

    async function addArticle(articleBody,submitAsDraft){
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
                    isDraft: submitAsDraft
                },
                )
            .then((response)=>{
            if(response && response.status===200){
                const articleId = response.data.articleId;
                setAwaitingResponse(false);
                navigate(`/articlePosting/${articleId}`,{replace:true});
            }
            })
            .catch((err)=>{
            console.log(err)
            if(err.response && err.response.status===401){
                setAwaitingResponse(false);
                setShowSessionEndedModal(true);
            }
            })
           
    }

    async function updateArticle(articleBody,submitAsDraft){
        let imgUrl= null;
        let prevImg;

    
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
                    isDraft:submitAsDraft
                },
                )
            .then((response)=>{
            if(response && response.status===200){
                setAwaitingResponse(false);

                if(!isAutoSaving)fetchArticleToUpdate();
            }
            })
            .catch((err)=>{
            console.log(err)
            if(err.response && err.response.status===401){
                setAwaitingResponse(false);
                setShowSessionEndedModal(true);
            }
            })
        
    }

    /*
        function handleSubmit : extract images, call image upload, call update or add article

        params: e - submit Event
                submitAsDraft              

    */
    async function handleSubmit(e, submitAsDraft){
        if(e) e.preventDefault();
        

        // Extract images from editor content
        const contentState = editorState.getCurrentContent();
        const images = extractImagesFromContent(contentState);


        //When Editing an already saved article
        let previousImages= [];
        if(articleIdToUpdate !== 'null'){
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

                const tranformedImageUrl = transformImage(imageUrl);

                // Replace image in content with the uploaded URL
                const newContentState = replaceImageInContent(contentState, imageSrc, tranformedImageUrl);
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
             addArticle(serializedContent,submitAsDraft);
        }
        else{
            updateArticle(serializedContent,submitAsDraft);
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
        <div className="" >
            <div className="bg-black m-0  p-1 ps-1 pe-1 ps-md-3 pe-md-4  top-0 w-100 position-fixed" 
                id="writing-nav"
               >
                <div className="d-flex justify-content-between">
                    <button onClick={()=>{navigate('/')}} className="btn d-flex gap-2 align-items-center ms-xl-3">
                        <FontAwesomeIcon icon={faChevronLeft} className="admin-nav-icon"/>
                        <span className="text-white">My home</span>
                    </button>

                    <div className='d-flex justify-content-end align-items-center gap-2 gap-md-3 '>
                    <a className="btn  d-flex align-items-center gap-1" 
                        onClick={()=>{}}
                    >
                        {/* <FontAwesomeIcon icon={faPenFancy} className="admin-nav-icon"/> */}
                    </a>
                    <div style={{backgroundColor:'lightgrey', width:"24px",height:"24px"}}
                      className="d-flex justify-content-center align-items-center rounded-circle overflow-hidden"
                      onClick={(e)=>{e.stopPropagation(); navigate('/profile')}}
                      >
                      
                        {
                        (userProfilePhoto!==null)
                            ?<img src={userProfilePhoto} className="w-100 h-100 object-fit-cover rounded-circle" style={{}}/>
                            :<FontAwesomeIcon icon={faUser} className="ic-white w-100 h-100 pt-2"/>

                        }
                    </div>
                    
                    <button className="btn d-flex" 
                        onClick={()=>{setIsSidePanelVisible(!isSidePanelVisible)}}
                        >
                        <FontAwesomeIcon icon={faBarsStaggered} className="admin-nav-icon"/>
                    </button>
                </div>
                </div>             
            </div>
            <div id="writing-nav-spacer"></div>
            
            <div id ="article-update">
                <form  onSubmit={handleSubmit} 
                    encType="multipart/form-data" 
                    className="mb-5 " 
                    id = "article-form">

                    <div className={`col-xl-9  d-lg-flex justify-content-start`}>
                    
                        {/* spacer in xl screens */}
                        <div className="col-xl-2"></div>

                        <div className="col-10 m-xl-0 ms-4 me-4">
                            <div className="d-flex mt-3 mt-sm-0">
                                <input type="text"  name="articleHeadline" className="w-100 border-0" 
                                    id = "title-input"
                                    placeholder="Add title..."  minLength="2"  required value={articleHeadline}
                                    onChange={(e)=>setArticleHeadline(e.target.value)}
                                />
                            </div>

                                    

                                
                            <Editor
                                editorState={editorState}
                                onEditorStateChange={onEditorStateChange}
                                toolbarClassName="toolbar col-xl-8 me-xl-5 me-3"
                                wrapperClassName="wrapper-class "
                                editorClassName="editor "
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
                                            height:'350px',
                                            width:'400px'
                                        }
                                    }
                                }}
                            
                            />
                        </div>


                    </div>  

                    <div className={`menu ${isSidePanelVisible?"":" d-none"}`}
                            id="writing-side-panel" >
                        <div className=" border p-3 mb-2">
                            <h5 className="">Post</h5>
                            <span className="d-block pb-2">
                                <b>Status: </b> 
                                {
                                    articleToUpdate !== null && !articleToUpdate.articleIsDraft
                                    ? <span>Published</span>
                                    : <span>Draft</span>
                                }
                                
                            </span>
                            <span className="d-block pb-2">
                                <b>Visibility: </b> 
                                {
                                    articleToUpdate !== null && !articleToUpdate.articleIsDraft
                                    ? <span>Public</span>
                                    : <span>Private</span>
                                }
                            </span>
                        
                        
                            <div className="d-flex gap-2  align-items-center justify-content-between mt-1" >
                                {(awaitingResponse && isDraft )
                                    ?<div className="spinner-border text-info">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    
                                    :<div className="col-8" id="save-draft"> 
                                        <button className="btn border" type="submit"
                                            onClick={(e)=>{
                                                setIsdraft(true);
                                                setAwaitingResponse(true);
                                                setIsAutoSaving(false);
                                                handleSubmit(e, true);
                                                }} >
                                            <span>Save as a draft</span>
                                        </button>
                                    
                                    </div>
                                }

                                <div className="">
                                {(awaitingResponse && !isDraft )
                                    ?<div className="spinner-border text-info col-12">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    
                                    :<button className="btn btn-light col-12" 
                                        id = "publish-btn"
                                        type="submit" 
                                        onClick={(e)=>{
                                            setIsdraft(false);
                                            setAwaitingResponse(true);
                                            setIsAutoSaving(false);
                                            handleSubmit(e, false);
                                        }}
                                    >                                       
                                        Publish
                                    </button>
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
                    
                </form>

            </div>

            <Modal show={showSessionEndedModal} centered>
                <Modal.Body>
                    <h6> Your Session has expired!</h6>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-light" onClick={()=>{setShowSessionEndedModal(false)}}>
                            Close
                        </button>

                        <button className="btn btn-success" onClick={()=>{navigate('/login')}}>
                            Login
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
            
        </div>
    )
}
