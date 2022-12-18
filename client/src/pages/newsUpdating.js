import React from "react";

export default function NewsUpdating(){

    return(
        <div className="container">
            <h1>MoiVoice</h1>
            <h3> News Updating Page!</h3>
            <form  action="/newsUpdate" method="POST" enctype="multipart/form-data">

                <div className="d-flex ">
                    <p className="col-md-3">News Section:</p>
                    <select name="newsSection" className="col-md-6">
                        <option value="breaking_news">Breaking News</option>
                        <option value="admission">Admission </option>
                        <option value="sports">Sports</option>
                        <option value="music">Music</option>
                        <option value="academics">Academics</option>
                    </select>
                </div>
                
                <div className="d-flex mb-3 mt-3">
                    <p className="col-md-3">News Headline:</p>
                    <input type="text"  name="newsHeadline" className="col-md-6"
                           placeholder="The news headline"  minlength="8" maxlength="200"required 
                    />
                </div>

                <div className="d-flex">
                    <p className="col-md-3">News Article:
                    <textarea name="newsArticle"  rows="20" cols="82">Write the News composition here!</textarea>
                    </p>
                </div>

                <div>
                    <label class="flex">select a News photo to upload:</label>
                    <input type="file" name="newsPhoto" />
                    
                </div>
                
                <input type="submit" value="Update"/>
                
            </form>
        </div>
    )
}