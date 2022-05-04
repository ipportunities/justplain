import React from "react";
import { useSelector } from 'react-redux';
import { stripTags } from '../../../../utils/';

const DownloadFile = props => {

  const url = useSelector(state => state.url);

  return (
    <div className="download_file">
      {
        props.file.indexOf(url + "/uploads/intervention/") === -1 ?
        <a href={url + "/uploads/intervention/" + props.file} target="_blank" className="btn btn-primary" download>
           {stripTags(props.part.content)}
        </a>
          :
          <a href={props.file} target="_blank" className="btn btn-primary" download>
          {stripTags(props.part.content)}
        </a>
      }
      
    </div>
  );
};
export default DownloadFile;
