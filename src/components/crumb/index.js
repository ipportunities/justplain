import React, { useState, useEffect } from "react";
import t from "../translate";
import { useHistory } from "react-router-dom";
import parse from 'html-react-parser';

const Crumb = props => {

  let history = useHistory();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    if (props.content != "") {
      setCrumbs(props.content);
    }
  }, [props.content]);

  function goTo(link){
    history.push(
      link
    );
  }
  return(
    <div className="crumb center">
      {crumbs.map((crumb, index) =>
        <span key={index}>
          <span onClick={()=>goTo(crumb.path)}>{crumb.title}</span>
          {(index != crumbs.length - 1) ? <span> > </span>:''}
        </span>
      )}
    </div>
  )
}
export default Crumb;
