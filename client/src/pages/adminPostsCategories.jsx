import React,{useCallback, useEffect,useRef,useState} from "react";
import api from "../config/api";
import { decodeString,updateHistory } from "../reusables/global";
import { faSearch,faTimes,faFolder,faEllipsisH, faEllipsisV,faPen, faTrash,faEye } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Modal} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function AdminPostsCategories({updateAdminPanelSection}){
    const [fetchedCategories,setFetchedCategories] = useState([]);
    const [displayedCategories, setDisplayedCategories] = useState(null);
    const [isSearchInputActive, setIsSearchInputActive] = useState(false);
    const [searchedText, setSearchedText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({top:'0px',left:'0px'});
    const menuRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const [showDeletionModal,setShowDeletionModal] = useState(false);
    const [showCategoryEditingModal, setShowCategoryEditingModal] = useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const navigate =useNavigate();


    const  fetchCategories= useCallback(()=>{
        api.get('/adminPostsCategories')
            .then((response)=>{
                setFetchedCategories(response.data.categories);
                console.log("type of fetchedCategories", typeof response.data.categories,":",response.data.categories);
                setDisplayedCategories(response.data.categories);
             })
            .catch((e)=>{})
    },[])

    useEffect(()=>{             
        fetchCategories();
    },[fetchCategories])

    function handleSearch(e){
        const text = e.target.value.toLowerCase();
        setSearchedText(text);     

        const filteredCategories = fetchedCategories.filter(
            category => 
                {
                    const decodedSectionName = decodeString(category.sectionName.toLowerCase());
                    
                     if(decodedSectionName.includes(text)){
                    
                        return category;
                    }

                    return null;
                 }
        )

        setDisplayedCategories(filteredCategories);
    }


    window.addEventListener('click',()=>{
        if(menuVisible) setMenuVisible(false);
    }
    );

   function toggleMenuVisible(){
    
    setMenuVisible(!menuVisible);
   }

    function handleMemuClick(e,category){
        e.preventDefault();
        e.stopPropagation();

        !menuVisible? setActiveCategory(category): setActiveCategory(null);
        toggleMenuVisible();

        const buttonRect = e.target.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY -40,
            left: window.innerWidth >= 992  
                    ? buttonRect.left + window.scrollX - 305
                    : buttonRect.left + window.scrollX - 89//-  menuRef.current.offsetWidth
        })
    }


    function addNewCategory(){
        if(activeCategory.sectionName!==null)
        {api.post('/addSection',
            {
                withCredentials:true,
                sectionName: activeCategory.sectionName,
                categoryDescription: activeCategory.sectionDescription
            })
            .then(()=>{
                fetchCategories();
                setShowNewCategoryModal(false);
            })
            .catch((e)=>{
                console.log("Error creating new category",e);
            })
        }
    }

    function editCategory(){
        if(activeCategory.sectionName!==null)
        {api.post('/editCategory',
            {
                withCredentials:true,
                categoryId: activeCategory.sectionId,
                categoryName: activeCategory.sectionName,
                categoryDescription: activeCategory.sectionDescription
            })
            .then(()=>{
                fetchCategories();
                setShowCategoryEditingModal(false);
            })
            .catch((e)=>{
                console.log("Error editing category",e);
            })
        }
    }

    function onCategoryNameChange(e){
        const newName = e.target.value;
        console.log("new name", newName);
        const updatedCategory = {
            ...activeCategory,
            sectionName:newName
        };
        setActiveCategory(updatedCategory);
    }

    function onCategoryDescriptionChange(e){
        const newDescription = e.target.value;
        console.log("new description",newDescription);
        const updatedCategory = {
            ...activeCategory,
            sectionDescription:newDescription
        };
        setActiveCategory(updatedCategory);
    }

    function deleteCategory(){
        api.post('/deleteCategory',
            {
                withCredentials:true,
                categoryId: activeCategory.sectionId,
            })
            .then(()=>{
                fetchCategories();
                setShowDeletionModal(false);
            })
            .catch((e)=>{
                console.log("Error deleting category",e);
            }) 
    }

    function viewCategoryPosts(categoryId){
        navigate(`?adminPanel=posts&category=${categoryId}`);
        // updateHistory(`?adminPanel=posts&category=${categoryId}`);
        updateAdminPanelSection(`?adminPanel=posts&category=${categoryId}`);
    }
    

    return <div className="container d-flex justify-content-center ">
        

    <div className="container mb-5 col-md-9 ">
        <h4>Categories</h4>
        <p className="fw-lighter">Create, edit and manage categories</p>
        <div className=" mt-md-5">  
            <div className="d-flex  mb-4 " id="categories-nav">
                <div className="col-9 position-relative d-flex justify-content-between border" >                
                    <button className="btn rounded-0">
                        <FontAwesomeIcon icon={faSearch}/>
                    </button>                
                    
                    <div className="">
                        <button className="btn position-absolute start-0 top-0 h-100"
                            // onClick={}
                            style={{zIndex:"2",color:"grey"}}>
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                        <input 
                            type="text"
                            className="position-absolute w-100 ps-5 pe-5 start-0 top-0 h-100 border-0"
                            placeholder=" Search Categories..."
                            onClick={()=>{setIsSearchInputActive(true)}}
                            onChange={handleSearch}
                            value={searchedText}
                            style={{zIndex:"1"}}
                            />
                        
                    { isSearchInputActive 
                        &&<button className="btn position-absolute end-0 top-0 h-100"
                            onClick={()=>{
                                setIsSearchInputActive(false);
                                setSearchedText('')
                                setDisplayedCategories(fetchedCategories);
                            }}
                            style={{zIndex:"1"}}>
                            <FontAwesomeIcon icon={faTimes} className="ic-grey"/>
                        </button>}
                    </div>
                        
                    
                </div>

                <button className=" col-3 btn rounded-0 btn-new-category m-0 "
                    onClick={()=>{
                        setActiveCategory({})
                        setShowNewCategoryModal(true)
                        console.log("active category na,e")
                    }}>
                    <span>Add new Category</span>
                </button>
                
            </div>
            
            {                
            (displayedCategories!==null && displayedCategories.length===0 && !isSearchInputActive)
            &&<div className="d-flex justify-content-center">
                <h5 className="fw-lighter">
                    {
                        <span>No Category available</span>
                    }
                
                
                </h5>
            </div>
            
            
            }
            
            {
                (displayedCategories!==null && displayedCategories.length!==0)
                &&<table className="w-100 " id="admin-posts-categories">
                    {displayedCategories.map((category,index)=>{
                        return <tr className="" 
                                    style={{zIndex:"0"}}
                                    onClick={()=>{
                                        setActiveCategory(category);
                                        setShowCategoryEditingModal(true)
                                    }}>
                                
                                    <div className="p-2 d-flex justify-content-between ">
                                       
                                        <div className="p-2  d-flex  gap-2 justify-content-between align-items-center">

                                            <FontAwesomeIcon icon={faFolder} className="ic-grey"/>
                                            <span className="category-name">{category.sectionName}</span>
                                        </div>

                                        <div className="p-2 d-flex  gap-2 justify-content-between align-items-center">
                                            <span className=" border rounded-circle ps-2 pe-2">
                                                {category.articleCount}
                                            </span>
                                            <button 
                                                className="btn" 
                                                
                                                onClick={(e)=>handleMemuClick(e,category)}>
                                                 {menuVisible && activeCategory.sectionId === category.sectionId ?
                                                    <FontAwesomeIcon 
                                                        icon={ faEllipsisV} 
                                                        className="ic-orange"/>
                                                    :<FontAwesomeIcon 
                                                        icon={faEllipsisH} 
                                                        className="ic-grey"/>
                                                }
                                            </button>
                                        </div>
                                    </div>

                                                                   
                            </tr>
                                            
                    })
                    }
                </table>   
            }
            {
            menuVisible&&(
                <div 
                ref={menuRef}
                id="category-menu"
                style={{
                    position:"absolute",
                    top:`${menuPosition.top}px`,
                    left:`${menuPosition.left}px`,
                    zIndex:"1000"
                }}
                className="d-flex flex-column align-items-start border bg-light">

                    <button className="btn rounded-0 w-100 d-flex gap-4 align-items-center"
                        onClick={()=>setShowCategoryEditingModal(true)}>
                        <FontAwesomeIcon icon={faPen} className="ic ic-grey "/>
                        Edit
                    </button>

                    <button className="btn rounded-0 w-100 d-flex gap-4 align-items-center "
                        onClick={()=>{setShowDeletionModal(true)}}>
                        <FontAwesomeIcon icon={faTrash} className="ic ic-grey "/>
                        Delete
                    </button>

                    {
                    (activeCategory.articleCount > 0)&&
                    <button className="btn rounded-0 w-100 d-flex gap-4 align-items-center "
                        onClick={()=>viewCategoryPosts(activeCategory.sectionId)}>
                        <FontAwesomeIcon icon={faEye} className="ic ic-grey "/>
                        View Posts
                    </button>
                    }
                </div>
            )
        }
           

            {                
            (displayedCategories!==null && displayedCategories.length===0 && isSearchInputActive)
            &&<div className="d-flex justify-content-center">
                <h5 className="fw-lighter">
                    {
                        <span> No result for "{searchedText}"</span>
                    }
                
                
                </h5>
            </div>
            
            }
        </div>
    </div>


    
    <Modal show={showDeletionModal} centered >

            <Modal.Body>
                <span>Are your sure you want to permanently delete '{activeCategory!==null && activeCategory.sectionName}' ?</span>

                <div className="d-flex justify-content-between mt-2">
                    <button className="btn btn-secondary" onClick={()=>setShowDeletionModal(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" onClick={deleteCategory}>
                        Delete
                    </button>
            </div>
            </Modal.Body>

            
    </Modal>


    <Modal show={showCategoryEditingModal} centered  className="" dialogClassName="category-editing-modal modal-dialogue modal-lg">

    {activeCategory!==null &&
    <Modal.Body className="d-flex flex-column gap-3" >
        <span>Edit Category</span>
        <div>
            <input type="text" 
                className="w-100 modal-input"
                value={activeCategory.sectionName}
                onChange={onCategoryNameChange}
                />
        </div>
        
        <div>
            <label>Description</label>
            <textarea rows={5} className="w-100 h-100 modal-input"
                onChange={onCategoryDescriptionChange}
                value={activeCategory.sectionDescription}
            />
        </div>
       

        <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-light border rounded-0" onClick={()=>setShowCategoryEditingModal(false)}>
                Cancel
            </button>
            <button className="btn btn-success rounded-0" onClick={editCategory}>
                Update
            </button>
        </div>
    </Modal.Body>
    }

    </Modal>


    <Modal show={showNewCategoryModal} centered  className="" dialogClassName="category-editing-modal modal-dialogue modal-lg">

        {activeCategory!==null &&
        <Modal.Body className="d-flex flex-column gap-3" >
            <span>New Category</span>
            <div>
                <input type="text" 
                    className="w-100 modal-input p-2"
                    onChange={onCategoryNameChange}
                    value={activeCategory.sectionName}
                    />
            </div>
            
            <div>
                <label>Description</label>
                <textarea rows={5} className="w-100 h-100 modal-input p-2"
                    onChange={onCategoryDescriptionChange}
                    value={activeCategory.sectionDescription}
                />
            </div>
        

            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-light border rounded-0" onClick={()=>setShowNewCategoryModal(false)}>
                    Cancel
                </button>
                <button 
                    // className={activeCategory.sectionName && activeCategory.sectionName.length>0 ?"btn btn-light rounded-0":"btn btn-success rounded-0"} 
                    className="btn btn-success rounded-0"
                    onClick={addNewCategory}>
                    Create
                </button>
            </div>
        </Modal.Body>
        }

    </Modal>
</div>
}




