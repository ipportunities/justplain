import React from 'react';
import parse from 'html-react-parser';
import MovableText from './movable_text.js'
import {checkIfVariableExistAndReturn} from "../../../../helpers/returnVariable";

const ImageColumns = (props) => {

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
      {props.gridColumns > 0 && props.images.length > 3 ?
        <div className={"columns grid-"+props.gridColumns+" clearfix " + (props.part.asbg ? 'asbg':'fillout')}>
          <div className='column'>
            {getCaptionAbove(props.images[0].captionAbove)}
            {props.part.asbg ?
              <div className='ImageHolderRelative'>
                <div className="image" style={{ background: "url('"+ props.images[0].url + "') center center" }}></div>
              </div>
            :
              <div className='ImageHolderRelative'>
                <img src={props.images[0].url}/>
              </div>
            }
            <MovableText indexImage={0} part={props.part}/>
            {getCaption(props.images[0].caption)}
          </div>
          <div className='column'>
            {getCaptionAbove(props.images[1].captionAbove)}
            {props.part.asbg ?
              <div className='ImageHolderRelative'>
                <div className="image" style={{ background: "url('"+ props.images[1].url + "') center center" }}></div>
              </div>
            :
              <div className='ImageHolderRelative'>
                <img src={props.images[1].url}/>
              </div>
            }
            <MovableText indexImage={1} part={props.part}/>
            {getCaption(props.images[1].caption)}
          </div>
          {props.gridColumns > 2?
            <div className='column'>
              {getCaptionAbove(props.images[2].captionAbove)}
              {props.part.asbg ?
                <div className='ImageHolderRelative'>
                  <div className="image" style={{ background: "url('"+ props.images[2].url + "') center center" }}></div>
                </div>
              :
                <div className='ImageHolderRelative'>
                  <img src={props.images[2].url}/>
                </div>
              }
              <MovableText indexImage={2} part={props.part}/>
              {getCaption(props.images[2].caption)}
            </div>
          :''}
          {props.gridColumns > 3?
            <div className='column'>
              {getCaptionAbove(props.images[3].captionAbove)}
              {props.part.asbg ?
                <div className='ImageHolderRelative'>
                  <div className="image" style={{ background: "url('"+ props.images[3].url + "') center center" }}></div>
                </div>
              :
                <div className='ImageHolderRelative'>
                  <img src={props.images[3].url}/>
                </div>
              }
              <MovableText indexImage={3} part={props.part}/>
              {getCaption(props.images[3].caption)}
            </div>
          :''}
        </div>
      :''}
    </>
  )
}

export default ImageColumns;
