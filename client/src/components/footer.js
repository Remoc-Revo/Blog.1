import React from "react";


export default function Footer(){

    return(

        <div className="mt-4" id="footer">
            <div id="social-networks" className="d-flex justify-content-center">
                <div className="mt-2">

                    {/* Facebook  */}
                    <a className="fb-ic" href="">
                        <i className="fa fa-facebook-f fa-lg   fa-2x"> </i>
                    </a>
                    {/* Twitter  */}
                    <a className="tw-ic" href="">
                        <i className="fa fa-twitter fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                    </a>
                    {/*  Google + */}
                    {/* <a className="gplus-ic">
                        <i className="fa fa-google-plus-g fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                    </a> */}
                    {/* Linkedin  */}
                    {/* <a className="li-ic">
                        <i className="fa fa-linkedin-in fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                    </a> */}
                    {/* Instagram */}
                    <a className="ins-ic" href="">
                        <i className="fa fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"> </i>
                    </a>
                    {/* Pinterest */}
                    <a className="pin-ic" href="">
                        <i className="fa fa-pinterest fa-lg white-text fa-2x"> </i>
                    </a>
        

                </div>
            </div>

            <div className="d-flex justify-content-between" id="info-contacts">
                <div className="">
                    <h5>Modern Parenting</h5>
                    <p>Parenting and Lifestyle</p>
                 </div>

                <div id="useful-links" className="d-flex flex-column">
                    {/* <h5>USEFUL LINKS</h5>
                    {/* <a>Your Account</a> 
                    <a>Help</a> */}
                </div>
                 <div className="">
                    <h5> CONTACTS</h5>
                    <p><i className="fa fa-envelope"></i> BrianSoita@gmail.com</p>
                    <p><i className="fa fa-phone" style={{fontSize:"20px"}}></i> +254707819708</p>
                    {/* <p><i className="fa fa-phone" style={{fontSize:"20px"}}></i> </p> */}
                 </div>
            </div>

            
            <div className="" id="copyright">
                <p>&copy;2023 Copyright: idiazBuilders</p>
            </div>
            {/* <p>0769658733</p> */}
        </div>
    )
}