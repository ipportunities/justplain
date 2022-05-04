import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import AddImage from "../helpers/addImage";
import { setChosenImage } from "../../../../../actions";
import EditorPart from '../editor_part.js';
import t from "../../../../translate";

const Speechballoon = (props) => {

  const url = useSelector(state => state.url);
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == props.index)
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    props.updatePart(props.index, 'image', url + "/uploads/intervention/" + medialibrary.chosen_image)
  }

  //////////////////////
  ///Delete image
  //////////////////////
  function deleteImage(){
    props.updatePart(props.index, 'image', '')
  }

  return(
    <div className="speech_balloon clearfix">
      <div className="image">
        <AddImage image={typeof props.part.image !== 'undefined'?props.part.image:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={deleteImage} />
      </div>
      <div className="text">
        <EditorPart
        index={props.index}
        updatePart={props.updatePart}
        part_content={props.part.question}
        update_field="question" />
      </div>
    </div>
  )
}
export default Speechballoon
