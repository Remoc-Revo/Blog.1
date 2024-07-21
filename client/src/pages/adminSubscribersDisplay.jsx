
import React,{useState,useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faSearch,faTimes } from "@fortawesome/free-solid-svg-icons";
import api from "../config/api";
import moment from "moment";

export default function AdminSubscribersDisplay(){
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [displayedSubscribers, setDisplayedSubscribers] = useState([])
    const [searchedText, setSearchedText] = useState('');
    const [isSearchInputActive, setIsSearchInputActive] = useState(false);

    useEffect(()=>{
        api.get('/getSubscribers',)
            .then((response)=>{
                console.log("fetched subscribers",response.data.subscribers);
                setAllSubscribers(response.data.subscribers)
                setDisplayedSubscribers(response.data.subscribers)
            })
            .catch((e)=>{
                console.log("Error fetching users: ",e);
            })
    },[])


    function handleSearch(e){
        const text = e.target.value.toLowerCase();
        setSearchedText(text);     

        const filteredSubscribers = allSubscribers.filter(
            subscriber => 
                {
                    const subscriberEmail = subscriber.subscriberEmail.toLowerCase();
                    
                    if(subscriberEmail.includes(text)){            
                        return subscriber;
                    }

                    return null;
                 }
        )

        setDisplayedSubscribers(filteredSubscribers);
    }



    return <div className="container col-lg-7 col-md-9">
        <h3 className="mb-5">Subscribers {allSubscribers.length !== 0 && `(${allSubscribers.length})`}</h3>
        <div className="d-flex  mb-4 " id="users-search">
            <div className="col-12 position-relative d-flex justify-content-between border" >                
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
                        className="position-absolute w-100  ps-5 pe-5 start-0 top-0 h-100 border-0"
                        placeholder=" Search subscriber email..."
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
                            setDisplayedSubscribers(allSubscribers);
                        }}
                        style={{zIndex:"1"}}>
                        <FontAwesomeIcon icon={faTimes} className="ic-grey"/>
                    </button>}
                </div>
                    
                
            </div>
                
            </div>

            <div>
            <table className="w-100 " >
                {
                    displayedSubscribers.map(
                        subscriber=><tr className="" >
                            <div className=" d-flex gap-4 ms-4 me-4 pt-2 align-items-start" style={{height:"100px"}}>
                            {
                                    (subscriber.subscriberPhoto !== null)
                                    ?<div style={{width:"70px",height:"70px"}}>                                                                                           
                                        <img src={subscriber.subscriberPhoto}
                                            className="rounded-circle w-100 h-100 object-fit-cover"
                                            alt=""
                                        />
                                    </div>

                                    :<div className="rounded-circle overflow-hidden" 
                                        style={{width:"70px",height:"70px", backgroundColor:"lightgrey"}}>
                                        <FontAwesomeIcon icon={faUser} className="ic-white rounded-circle w-100 h-100 pt-2"/>
                                    </div>
                                }
                                <div>
                                    {   subscriber.userName &&
                                        <span className="" style={{fontWeight:"500"}}>{subscriber.userName}</span>
                                    }

                                    <span className="d-block" style={{fontWeight:"300"}}>{subscriber.subscriberEmail}</span>

                                    {
                                        subscriber.userLevel !== 1 &&
                                        (<div className="mt-1">
                                            <span style={{color:"teal"}}>Subscribed</span>
                                            <span className="fw-light"> {moment(subscriber.subscriptionDate).fromNow()}</span>
                                        </div>)                                        
                                    }
                                    {     subscriber.userLevel === 1 &&
                                        (<div>
                                            <span style={{color:"orange"}}>Admin</span>
                                        </div>)
                                    }
                                </div>
                            </div>
                            
                                
                        </tr>
                    )
                }
            </table>
        </div>
    </div>
}