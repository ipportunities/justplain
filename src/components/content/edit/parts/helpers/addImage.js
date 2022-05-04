import React, {useState, useEffect}  from 'react';
import t from "../../../../translate";
import ReactTooltip from 'react-tooltip';

const AddImage = (props) => {

  return(
    <div className="image ">
      <div className={"" + (props.image == "" ? 'empty':'set')}>
          {(props.image != "") ?
            <div className='ImageHolderRelative'>
              <img src={props.image} />
              <div className='actionsImage showOnHover'>
                <span className='btn btn-primary  ' onClick={() => props.showMediaLibrary(props.index)}><i className="fas fa-pen" ></i></span>
                {parseInt(props.item_index) >= 0 ?
                  <span className='btn btn-danger ' onClick={() => props.deleteImage(props.index, props.item_index)}><i className="fa fa-trash"></i></span>
                  :
                  <span className='btn btn-danger ' onClick={() => props.deleteImage(props.index)}><i className="fa fa-trash"></i></span>
                }
              </div>
            </div>
          :
          <div className='imageHolder'>
            <span className='btn btn-primary ' onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer afbeelding")} <i className="fa fa-image"></i></span>
          </div>
          }
          <ReactTooltip place="top" effect="solid" delayShow={200}   />
      </div>
    </div>
  )
}

export default AddImage;
