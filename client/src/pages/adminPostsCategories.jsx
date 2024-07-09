import React,{useEffect,useState} from "react";
import api from "../config/api";
import { decodeString } from "../reusables/global";
import { faSearch,faTimes,faFolder } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminPostsCategories(){
    const [fetchedCategories,setFetchedCategories] = useState([]);
    const [displayedCategories, setDisplayedCategories] = useState(null);
    const [isSearchInputActive, setIsSearchInputActive] = useState(false);
    const [searchedText, setSearchedText] = useState('');


    useEffect(()=>{

        function fetchCategories(){
            api.get('/adminPostsCategories')
                .then((response)=>{
                    setFetchedCategories(response.data.categories);
                    console.log("type of fetchedCategories", typeof response.data.categories,":",response.data.categories);
                    setDisplayedCategories(response.data.categories);
                 })
                .catch((e)=>{})
        }
        
        fetchCategories();
    },[])

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


                 }
        )

        setDisplayedCategories(filteredCategories);
    }


    return <div className="container  d-flex justify-content-center ">
        

    <div className="container mb-5 col-md-9 ">
        <h4>Categories</h4>
        <p className="fw-lighter">Create, edit and manage categories</p>
        <div className=" mt-md-5">  
            <div className="d-flex justify-content-between  mb-4 " id="categories-nav">
                <div className="col-9 position-relative d-flex justify-content-between " >                
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

                <button className="h-100 col-3 btn rounded-0 btn-new-category m-0 ">
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
                        return <tr className="">
                                
                                    <div className="p-2 d-flex justify-content-between ">
                                       
                                        <div className="p-2  d-flex  gap-2 justify-content-between align-items-center">

                                            <FontAwesomeIcon icon={faFolder} className="ic-grey"/>
                                            <span className="category-name">{category.sectionName}</span>
                                        </div>

                                        <div className="p-2 d-flex  gap-2 justify-content-between align-items-center">
                                            <span className=" border rounded-circle ps-2 pe-2">
                                                {category.articleCount}
                                            </span>

                                        </div>
                                    </div>
                                
                            </tr>
                                            
                    })
                    }
                </table>   
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



</div>
}