import React,{useState,useEffect} from "react";
import api from "../config/api";
import { AdminPostPreview } from "../components/article_preview";
import { decodeString } from "../reusables/global";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function AdminAllPosts(){
    const [allPosts, setAllPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
         function fetchAdminHomeData(){
            api.get("/adminAllPosts",{withCredentials:true})
               .then((response)=>{
                    console.log("response",response.data.posts)
                    setAllPosts(response.data.posts);

               })
               .catch((e)=>{
                console.log("Error fetching admin data", e);
               })
        }
        fetchAdminHomeData();
    },[])

    return <div className="container d-flex justify-content-center ">
        

        <div className="container mb-5 col-md-12 col-lg-9 ps-5">
            <h4>All Posts</h4>
            <p className="fw-lighter">Create, edit and manage your posts</p>
            <div className=" mt-md-5">  
                <div className="d-flex mb-5">
                    <div>
                        <div className="d-flex">
                            <button >
                                Published
                            </button>
                            <button>
                                Draft
                            </button>
                        </div>
                        
                       
                    </div>
                </div>
                {
                
                (allPosts.length===0)
                ?<div className="d-flex justify-content-center"><h5 className="fw-lighter">No article published yet</h5></div>
                :
                <table className="">
                    {allPosts.map((article,index)=>{
                        return <tr className="">
                                <td>
                                    <AdminPostPreview 
                                        articleSection={decodeString(article.sectionName)}
                                        headline={decodeString(article.articleHeadline)} 
                                        time={moment(article.articlePostingDate).fromNow()} 
                                        briefDescription={decodeString(article.articleBody)} 
                                        imgUrl={article.multimediaUrl}
                                        articleId={article.articleId}
                                        handleClick = {()=>{navigate(`/articlePosting/${article.articleId}`)}}
                                    />   
                                </td>
                              </tr>
                                              
                    })
                    }
                </table>   
                }
            </div>
        </div>

    

    </div>
}