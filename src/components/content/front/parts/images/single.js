import React from 'react';
import parse from 'html-react-parser';
import MovableText from './movable_text.js'
import {checkIfVariableExistAndReturn} from "../../../../helpers/returnVariable";

const SingleImage = (props) => {

  function getCaption(content){
    if(checkIfVariableExistAndReturn(content) != ""){
      return <div className="caption">{parse(checkIfVariableExistAndReturn(content))}</div>
    }
  }
  function getCaptionAbove(content){
    if(checkIfVariableExistAndReturn(content) != ""){
      return <div className="caption above">{parse(checkIfVariableExistAndReturn(content))}</div>
    }
  }

  return(
    <>
      {(props.images.length > 0) && (props.subtype == "gecentreerd" || props.subtype == "volle breedte") ?
        <div className="imageHolder">
          {getCaptionAbove(props.images[0].captionAbove)}
          {props.buildImage(props.images[0].url)}
          {getCaption(props.images[0].caption)}
          {props.subtype == "gecentreerd" ?
            <MovableText indexImage={0} part={props.part}/>
            :
            <></>
          }
        </div>
      :''}
    </>
  )
}

export default SingleImage;
