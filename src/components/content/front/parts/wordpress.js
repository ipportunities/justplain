import React, { useState, useEffect } from "react";
import t from "../../../translate"
import { useSelector } from "react-redux";
import Video from './video.js';
import Wysiswg from './wysiwyg.js';
import Special from './special.js';

const ImportFormWordpress = props => {

  const [content, setContent] = useState([]);

  const url = useSelector(state => state.url);

  useEffect(() => {
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onreadystatechange=function(){
       if (xhr.readyState==4 && xhr.status==200){
          setContent(JSON.parse(xhr.response));
       }
    }

    xhr.open("POST", url + "/wordpress_content/post.php");
    /// met code ipv check login omdat ik anders lokaal niet kan testen... kan aangepast worden
    xhr.send(JSON.stringify({id:props.part.post_id, code:"fjsf3*(37482fsbvewjhsd82&)"}));
  }, []);

  function getContent(part){
    let content = "";
    if(part.acf_fc_layout == "editor"){
      content = <Wysiswg part={{type: "wysiwyg", subtype: "paragraaf", content:part.content}} />;
    }
    if(part.acf_fc_layout == "accordion"){
      let items = [];
      for(let i = 0 ; i < part.item.length ; i++){
        items.push({content:part.item[i]["zichtbare_tekst"], content2:part.item[i]["uitklapbare_tekst"]})
      }

      content = <Special part={{type: "special", subtype: "accordion", items:items}} />;
    }
    if(part.acf_fc_layout == "video"){
      content = <Video part={{type: "video", url:part.embed_url}} />;
    }

    return content;
  }

  return(
    <div className='wordpress center'>
      {content.map((part, index) =>
        <div className="wordpress_component">
          {getContent(part)}
        </div>
      )}
    </div>
  )
}

export default ImportFormWordpress;
