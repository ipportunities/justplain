import React, {useState, useEffect}  from 'react';
import t from "../../../../translate";
import ReactTooltip from 'react-tooltip';


//tbv translation....

const AddFile = (props) => {

  return(
    <div className="file ">
      <div className={"" + (props.file == "" ? 'empty':'set')}>
          {(props.file != "") ?
            <div className='ImageHolderRelative'>
                <a href={props.file} target="_blank">{props.file}</a><br /><br />
              <div className='actionsImage showOnHover'>
                <span className='btn btn-primary  ' onClick={() => props.showMediaLibrary(props.index)}><i className="fas fa-pen" ></i></span>
                <span className='btn btn-danger ' onClick={() => props.deleteImage(props.index)}><i className="fa fa-trash"></i></span>
              </div>
            </div>
          :
            <span className='btn btn-primary ' onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer bestand")} <i className="fa fa-image"></i></span>
          }
          <ReactTooltip place="top" effect="solid" delayShow={200}   />
      </div>
    </div>



  )
}

export default AddFile;
