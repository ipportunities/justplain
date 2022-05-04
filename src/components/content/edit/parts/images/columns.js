import React, {useState, useEffect} from 'react';
import AddImage from "../helpers/addImage";
import AddImageAsBg from "../helpers/addImageAsBg";
import ContentEditable from 'react-contenteditable'
import MovableText from './movable_text.js'
import t from "../../../../translate";
import { getClone } from "../../../../utils";
import {appSettings} from "../../../../../custom/settings";

const ImageColumns = (props) => {

  const subtypesColumns = ["twee afbeeldingen naast elkaar", "drie afbeeldingen naast elkaar", "vier afbeeldingen naast elkaar", "vier afbeeldingen naast elkaar niet als achtergrond"];
  const [images, setImages] = useState([]);
  const [asBg, setAsBg] = useState(true);

  //////////////////////
  ///Get content
  useEffect(() => {
    setImages(props.images)
    if(typeof props.part.asbg != "undefined"){
      setAsBg(props.part.asbg)
    }
  }, [props]);

  function toggleAsBg(){
    let tempAsBg = asBg ? false:true
    setAsBg(tempAsBg)

    let clonedPart = getClone(props.part);
    props.updatePart(props.index, 'asbg', tempAsBg)
  }

  return(
    <>
      {props.gridColumns > 0 && props.images.length > 3 && subtypesColumns.includes(props.part.subtype) ?
        <div className={"columns grid-"+props.gridColumns+" clearfix " + (asBg ? 'asbg':'fillout')}>
          <div className='column'>
            {appSettings.captionAboveImages == true ?
              <ContentEditable
                  html={typeof props.images[0].captionAbove != "undefined" ? props.images[0].captionAbove:""}
                  disabled={false}
                  onChange={(e) => props.updateCaptionAbove(e.target.value, 0)} // handle innerHTML change
                  className="caption above"
                  placeholder={t("Caption")}
                />
              :''}
            {!asBg ?
              <AddImage image={props.images[0].url != '' ? props.images[0].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(0)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(0)} />
              :
              <AddImageAsBg image={props.images[0].url != '' ? props.images[0].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(0)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(0)} />
            }

            {appSettings.textOnImages ?
              <MovableText index={props.index} indexImage={0} part={props.part} updatePart={props.updatePart}/>
              :''}

            <ContentEditable
                  html={typeof props.images[0].caption != "undefined" ? props.images[0].caption:""}
                  disabled={false}
                  onChange={(e) => props.updateCaption(e.target.value, 0)} // handle innerHTML change
                  className="caption"
                  placeholder={t("Caption")}
                />
          </div>
          <div className='column'>
            {appSettings.captionAboveImages == true ?
              <ContentEditable
                  html={typeof props.images[1].captionAbove != "undefined" ? props.images[1].captionAbove:""}
                  disabled={false}
                  onChange={(e) => props.updateCaptionAbove(e.target.value, 1)} // handle innerHTML change
                  className="caption above"
                  placeholder={t("Caption")}
                />
              :''}
            {!asBg ?
              <AddImage image={props.images[1].url != '' ? props.images[1].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(1)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(1)} />
              :
              <AddImageAsBg image={props.images[1].url != '' ? props.images[1].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(1)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(1)} />
            }
            <MovableText index={props.index} indexImage={1} part={props.part} updatePart={props.updatePart}/>
            <ContentEditable
                  html={typeof props.images[1].caption != "undefined" ? props.images[1].caption:""}
                  disabled={false}
                  onChange={(e) => props.updateCaption(e.target.value, 1)} // handle innerHTML change
                  className="caption"
                  placeholder={t("Caption")}
                />
          </div>
          {props.gridColumns > 2?
            <div className='column'>
              {appSettings.captionAboveImages == true ?
                <ContentEditable
                    html={typeof props.images[2].captionAbove != "undefined" ? props.images[2].captionAbove:""}
                    disabled={false}
                    onChange={(e) => props.updateCaptionAbove(e.target.value, 2)} // handle innerHTML change
                    className="caption above"
                    placeholder={t("Caption")}
                  />
                :''}
              {!asBg ?
                <AddImage image={props.images[2].url != '' ? props.images[2].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(2)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(2)} />
                :
                <AddImageAsBg image={props.images[2].url != '' ?props.images[2].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(2)} index={props.index} deleteImage={e =>  props.deleteImageAndSetChosenImageIndex(2)} />
              }
              <MovableText index={props.index} indexImage={2} part={props.part} updatePart={props.updatePart}/>
              <ContentEditable
                    html={typeof props.images[2].caption != "undefined" ? props.images[2].caption:""}
                    disabled={false}
                    onChange={(e) => props.updateCaption(e.target.value, 2)} // handle innerHTML change
                    className="caption"
                    placeholder={t("Caption")}
                  />
            </div>
          :''}
          {props.gridColumns > 3?
            <div className='column'>
            {appSettings.captionAboveImages == true ?
              <ContentEditable
                  html={typeof props.images[3].captionAbove != "undefined" ? props.images[3].captionAbove:""}
                  disabled={false}
                  onChange={(e) => props.updateCaptionAbove(e.target.value, 3)} // handle innerHTML change
                  className="caption above"
                  placeholder={t("Caption")}
                />
              :''}
              {!asBg ?
                <AddImage image={props.images[3].url != '' ? props.images[3].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(3)} index={props.index} deleteImage={e => props.deleteImageAndSetChosenImageIndex(3)} />
                :
                <AddImageAsBg image={props.images[3].url != '' ?props.images[3].url:''} showMediaLibrary={e => props.showMediaLibraryAndSetChosenImageIndex(3)} index={props.index} deleteImage={e =>  props.deleteImageAndSetChosenImageIndex(3)} />
              }
              <MovableText index={props.index} indexImage={3} part={props.part} updatePart={props.updatePart}/>
              <ContentEditable
                    html={typeof props.images[3].caption != "undefined" ? props.images[3].caption:""}
                    disabled={false}
                    onChange={(e) => props.updateCaption(e.target.value, 3)} // handle innerHTML change
                    className="caption"
                    placeholder={t("Caption")}
                  />
            </div>
          :''}
          <div className="actionsBottom showOnHover">
            <span className="btn btn-primary" onClick={() => toggleAsBg()}>
              {asBg ?
                t("Als achtergrond")
                :
                t("Uitvullen")
              } <i className="fas fa-image"></i>
            </span>
          </div>
        </div>
      :''}
    </>
  )
}

export default ImageColumns;
