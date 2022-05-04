import React, {useState, useEffect}  from 'react';
import { useSelector } from 'react-redux';
import InputTextfield from '../input_textfield.js';
import { useDispatch } from "react-redux";
import { filterUploadType } from "../../../../../actions";
import t from '../../../../translate';

const AddFile = (props) => {

  const dispatch = useDispatch();

  const url = useSelector(state => state.url);

  function showMediaLibrary(){
    if (props.filterUploadType != "") {
      props.showMediaLibrary(props.index, props.filterUploadType);
    } else {
      props.showMediaLibrary(props.index)
    }
  }

  //////////////////////
  ///Delete File
  function deleteFile() {
    props.updatePart(props.index, "file", "");
  }

  return(
    <div className="file">
      <div className={"" + (props.file == "" ? 'empty':'')}>
          {(props.file != "") ?
            <div className='ImageHolderRelative'>
              <span className="btn btn-primary" target="_blank">
                <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Download bestand" updateField="content"/>
              </span>
              <span className='actionsImage showOnHover'>
                <a href={url + "/uploads/intervention/" + props.file}>{props.file.split("/").pop()}</a>
                <span className='btn btn-primary  ' onClick={() => showMediaLibrary()}><i className="fas fa-pen"></i></span>
                <span className='btn btn-danger ' onClick={() => deleteFile(props.index)}><i className="fa fa-trash"></i></span>
              </span>
            </div>
          :
          <span className='btn btn-primary ' onClick={() => showMediaLibrary()}>{typeof props.buttonText !== "undefined" && props.buttonText != "" ? props.buttonText: t("Selecteer bestand")} <i className="fa fa-image"></i></span>
          }
      </div>
    </div>
  )
}

export default AddFile;
