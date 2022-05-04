import React, {useState, useEffect}  from 'react';
import t from "../../../../translate";

const AddImageAsBg = (props) => {

  return(
    <div className="image asBg">
      <div className={"" + (props.image == "" ? 'empty':'')}>
          {(props.image != "") ?
            <div className='ImageHolderRelative'>
              <div className="image" style={{ background: "url('"+ props.image + "')  center center" }}></div>
              <div className='actionsImage showOnHover'>
                <span className='btn btn-primary  ' onClick={() => props.showMediaLibrary(props.index)}><i className="fas fa-pen"></i></span>
                <span className='btn btn-danger ' onClick={() => props.deleteImage(props.index)}><i className="fa fa-trash"></i></span>
              </div>
            </div>
          :
          <div className='imageHolder'>
            <span className='btn btn-primary ' onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer afbeelding")} <i className="fa fa-image"></i></span>
          </div>
          }
      </div>
    </div>
  )
}

export default AddImageAsBg;
