import React, {useState, useEffect} from 'react';
import t from "../../../../translate";
import ContentEditable from 'react-contenteditable'
import MovableText from './movable_text.js'
import {appSettings} from "../../../../../custom/settings";

const SingleImage = (props) => {

  const [images, setImages] = useState([]);

  //////////////////////
  ///Get content
  useEffect(() => {
    setImages(props.images)
  }, [props.images]);

  return(
    <>
      {(props.images.length > 0) && (props.subtype === "gecentreerd" || props.subtype === "volle breedte") ?
        <div className="imageHolder">
          {appSettings.captionAboveImages == true ?
            <ContentEditable
                  html={typeof props.images[0].captionAbove != "undefined" ? props.images[0].captionAbove:""}
                  disabled={false}
                  onChange={(e) => props.updateCaptionAbove(e.target.value, 0)} // handle innerHTML change
                  className="caption above"
                  placeholder={t("Caption")}
                />
              :''}
          {props.buildImage(props.images[0].url)}
          <ContentEditable
                html={typeof props.images[0].caption != "undefined" ? props.images[0].caption:""}
                disabled={false}
                onChange={(e) => props.updateCaption(e.target.value, 0)} // handle innerHTML change
                className="caption"
                placeholder={t("Caption")}
              />
          <span className="btn btn-primary showOnHover" onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer andere afbeelding")} <i className="fa fa-plus"></i>
          </span>
          {appSettings.textOnImages ?
            <MovableText index={props.index} indexImage={0} part={props.part} updatePart={props.updatePart}/>
            :''}
        </div>
      :
      <>
        {props.part.subtype === "volle breedte" || props.part.subtype === "gecentreerd" ?
          <div className="empty center">
            <span className="btn btn-primary" onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer afbeelding")} <i className="fa fa-plus"></i></span>
          </div>
        :''}
      </>
      }
    </>
  )
}

export default SingleImage;
