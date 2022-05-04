import React, {useState, useEffect} from "react";
import apiCall from "../api";
import { useSelector, useDispatch } from "react-redux";
import {appSettings} from "../../custom/settings";
//import t from "../../translate";

const DownloadPDFButton = (props) => {

  const auth = useSelector(state => state.auth);

  function dowloadPdf(type, id){
    window.open( appSettings.domain_url + '/api/download/results.php?token='+auth.token+'&id='+id+'&type='+type );
  }

  return (
    <div>
      <i className="fas fa-file-pdf" onClick={()=>dowloadPdf(props.type, props.id)}></i>
    </div>
  );
}

export default DownloadPDFButton;
