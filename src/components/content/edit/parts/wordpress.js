import React, { useState, useEffect } from "react";
import t from "../../../translate"
import { useSelector } from "react-redux";
import {appSettings} from "../../../../custom/settings";

const ImportFormWordpress = props => {

  const [posts, setPosts] = useState([]);

  const url = useSelector(state => state.url);

  useEffect(() => {
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onreadystatechange=function(){
       if (xhr.readyState==4 && xhr.status==200){
          setPosts(JSON.parse(xhr.response));
       }
    }

    xhr.open("POST", url + "/wordpress_content/posts.php");
    /// met code ipv check login omdat ik anders lokaal niet kan testen... kan aangepast worden
    xhr.send(JSON.stringify({post_type:appSettings.wordpress_import_name, code:"fjsf3*(37482fsbvewjhsd82&)"}));
  }, []);

  return(
    <div className='wordpress center'>
      <div className="question">
        {t(appSettings.wordpress_import_title)}
      </div>
      <select onChange={(e) => props.updatePart(props.index, 'post_id', e.target.value)} value={props.part.post_id}>
        {posts.map((post, index) =>
          <option key={index} value={post.ID}>{t(post.post_title)}</option>
        )}
      </select>
    </div>
  )
}

export default ImportFormWordpress;
