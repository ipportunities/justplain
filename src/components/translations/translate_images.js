import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import t from "../translate";
import MediaLibrary from "../medialibrary";
import AddImage from "../content/edit/parts/helpers/addImage";
import AddFile from "../content/edit/parts/helpers/addFile2";
import { setChosenImage, setTranslation } from "../../actions";
import { getClone } from "../utils";



const TranslateImages = (props) => {

  const dispatch = useDispatch();

  const mediaLibrary = useSelector(state => state.mediaLibrary);
  const translation = useSelector(state => state.translation);
  const url = useSelector(state => state.url);

  ////////////////////////////////////////////
  /////////Media library functies om door te geven
  ///////////////////////////////////////////
  const [mediaLibraryVisible, setMediaLibraryVisible] = useState("hide");
  const [filterTypes, setFilterTypes] = useState([]);

  //////////////////////
  ///show mediaLibrary
  const showMediaLibrary = (index, types) => {
    setMediaLibraryVisible("show");
    document.getElementsByTagName('html')[0].style.overflow = "hidden";

    if (types && types != "") {
      setFilterTypes(types);
    } else {
      setFilterTypes([]);
    }

    /// empty store + set index
    dispatch(setChosenImage("", index));
  }

  const deleteImage = (mlIndex) => {

    if (typeof props.props.part !== 'undefined' && props.props.part.id === mlIndex && props.props.part.hasOwnProperty("image") && props.props.part.image.length > 0)
      {
        let newTranslation = getClone(translation);
        delete newTranslation[props.props.mainId+"_"+props.props.part.id+"_image"];
        dispatch(setTranslation(newTranslation));
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.id === mlIndex && props.props.part.hasOwnProperty("file") && props.props.part.file.length > 0)
      {
          let newTranslation = getClone(translation);
          delete newTranslation[props.props.mainId+"_"+props.props.part.id+"_file"];
          dispatch(setTranslation(newTranslation));
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.hasOwnProperty("images") && props.props.part.images.length > 0)
      {
        let imageKey = -1;
        props.props.part.images.forEach((image, index) => {
          if (mlIndex === image.id) {
            imageKey = index;
          }
        });
        if (imageKey > -1)
        {
          let newTranslation = getClone(translation);
          delete newTranslation[props.props.mainId+"_"+props.props.part.id+"_"+props.props.part.images[imageKey].id+"_image"];
          dispatch(setTranslation(newTranslation));

        }
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.hasOwnProperty("items") && props.props.part.items.length > 0 && !props.props.part.hasOwnProperty("file"))
      {
        let imageKey = -1;
        props.props.part.items.forEach((item, index) => {
          if (mlIndex === item.id) {
            imageKey = index;
          }
        });
        if (imageKey > -1)
        {
          let newTranslation = getClone(translation);
          delete newTranslation[props.props.mainId+"_"+props.props.part.id+"_"+props.props.part.items[imageKey].id+"_image"];
          dispatch(setTranslation(newTranslation));

        }
      }
      else if (typeof props.alternative_menu_image !== 'undefined')
      {
        let newTranslation = getClone(translation);
        delete newTranslation["alternative_menu_image_"+props.lesson_id];
        dispatch(setTranslation(newTranslation));
      }

  }

  useEffect(() => {

    if (typeof mediaLibrary.index !== 'undefined' && typeof mediaLibrary.chosen_image !== 'undefined' && mediaLibrary.chosen_image.length > 0)
    {
      //if (Number.isInteger(mediaLibrary.index) && parseInt(mediaLibrary.index) === parseInt(props.props.index))
      if (typeof props.props.part !== 'undefined' && props.props.part.id === mediaLibrary.index && props.props.part.hasOwnProperty("image") && props.props.part.image.length > 0)
      {
        let newTranslation = getClone(translation);
        newTranslation[props.props.mainId+"_"+props.props.part.id+"_image"] = url + '/uploads/intervention/' + mediaLibrary.chosen_image;
        dispatch(setTranslation(newTranslation));
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.id === mediaLibrary.index && props.props.part.hasOwnProperty("file") && props.props.part.file.length > 0)
      {
          let newTranslation = getClone(translation);
          newTranslation[props.props.mainId+"_"+props.props.part.id+"_file"] = url + '/uploads/intervention/' + mediaLibrary.chosen_image;
          dispatch(setTranslation(newTranslation));
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.hasOwnProperty("images") && props.props.part.images.length > 0)
      {
        let imageKey = -1;
        props.props.part.images.forEach((image, index) => {
          if (mediaLibrary.index === image.id) {
            imageKey = index;
          }
        });
        if (imageKey > -1)
        {
          let newTranslation = getClone(translation);
          newTranslation[props.props.mainId+"_"+props.props.part.id+"_"+props.props.part.images[imageKey].id+"_image"] = url + '/uploads/intervention/' + mediaLibrary.chosen_image;
          dispatch(setTranslation(newTranslation));

        }
      }
      else if (typeof props.props.part !== 'undefined' && props.props.part.hasOwnProperty("items") && props.props.part.items.length > 0 && !props.props.part.hasOwnProperty("file"))
      {
        let imageKey = -1;
        props.props.part.items.forEach((item, index) => {
          if (mediaLibrary.index === item.id) {
            imageKey = index;
          }
        });
        if (imageKey > -1)
        {
          let newTranslation = getClone(translation);
          newTranslation[props.props.mainId+"_"+props.props.part.id+"_"+props.props.part.items[imageKey].id+"_image"] = url + '/uploads/intervention/' + mediaLibrary.chosen_image;
          dispatch(setTranslation(newTranslation));

        }
      }
      else if (typeof props.alternative_menu_image !== 'undefined' && mediaLibrary.chosen_image !== 'undefined')
      {
        let newTranslation = getClone(translation);
        newTranslation["alternative_menu_image_"+props.lesson_id] = url + '/uploads/intervention/' + mediaLibrary.chosen_image;
        dispatch(setTranslation(newTranslation));
        mediaLibrary.chosen_image = void 0;
      }

    }

  }, [mediaLibrary])

  return (
    <div>
      {
        (props.props.hasOwnProperty("part") && props.props.part.hasOwnProperty("image") && props.props.part.image.length > 0) ?
          <span>
            <br />
            <label>{t("Afbeelding")}</label><br />
            <div className="clearfix">
              <div className="original">
                <img src={props.props.part.image} />
              </div>
              <div className="translation editor_holder">
                <AddImage image={typeof translation[props.props.mainId+"_"+props.props.part.id+"_image"] !== 'undefined' ? translation[props.props.mainId+"_"+props.props.part.id+"_image"] : ''} showMediaLibrary={showMediaLibrary} index={props.props.part.id} deleteImage={deleteImage} />
              </div>
            </div>
          </span>
        : (props.props.hasOwnProperty("part") && props.props.part.hasOwnProperty("images") && props.props.part.images.length > 0) ?
          <span>
            {
              props.props.part.images.map((image, index) => {
                return (
                  <span>
                    <label>{t("afbeelding")}</label><br />
                    <div className="clearfix">
                      <div className="original">
                        {image.url != "" ? <img src={image.url} /> : t("Afbeelding ontbreekt")}

                      </div>
                      <div className="translation editor_holder">
                        <AddImage image={typeof translation[props.props.mainId+"_"+props.props.part.id+"_"+image.id+"_image"] !== 'undefined' ? translation[props.props.mainId+"_"+props.props.part.id+"_"+image.id+"_image"] : ''} showMediaLibrary={showMediaLibrary} index={image.id} deleteImage={deleteImage} />
                      </div>
                    </div>
                    {props.props.part.images.length - 1 != index ? <br/>:''}
                  </span>
                )
              })
            }
          </span>
        : (props.props.hasOwnProperty("part") && props.props.part.hasOwnProperty("items") && props.props.part.items.length > 0 && !props.props.part.hasOwnProperty("file")) ?
            <span>
              {
                props.props.part.items.map((item, index) => {
                  if (item.hasOwnProperty("image") && item.image.length > 0)
                  {
                    return (
                      <span>
                        <br />
                        <label>{t("Afbeelding")}</label><br />
                        <div className="clearfix">
                          <div className="original">
                            <img src={item.image} />
                          </div>
                          <div className="translation editor_holder">
                            <AddImage image={typeof translation[props.props.mainId+"_"+props.props.part.id+"_"+item.id+"_image"] !== 'undefined' ? translation[props.props.mainId+"_"+props.props.part.id+"_"+item.id+"_image"] : ''} showMediaLibrary={showMediaLibrary} index={item.id} deleteImage={deleteImage} />
                          </div>
                        </div>
                      </span>
                    )
                  }
                })
              }
            </span>
        : (props.props.hasOwnProperty("part") && props.props.part.hasOwnProperty("file") && props.props.part.file.length > 0) ?
        <div>
          <label>{t("Bestand")}</label><br />
          <div className="clearfix">
            <div className="original">
              <a href={url + "/uploads/intervention/" + props.props.part.file} target="_blank">{props.props.part.file}</a>
            </div>
            <div className="translation editor_holder">
              <AddFile file={typeof translation[props.props.mainId+"_"+props.props.part.id+"_file"] !== 'undefined' ? translation[props.props.mainId+"_"+props.props.part.id+"_file"] : ''} showMediaLibrary={showMediaLibrary} index={props.props.part.id} deleteImage={deleteImage} />
            </div>
          </div>
        </div>
        : (typeof props.alternative_menu_image !== 'undefined') ?
        <div className="translation_item">
          <label>{t("Afbeelding alternatief menu")}</label><br />
          <div className="clearfix">
            <div className="original">
              <img src={props.alternative_menu_image} />
            </div>
            <div className="translation editor_holder">
              <AddImage image={typeof translation["alternative_menu_image_"+props.lesson_id] !== 'undefined' ? translation["alternative_menu_image_"+props.lesson_id] : ''} showMediaLibrary={showMediaLibrary} index={"alternative_menu_image_"+props.lesson_id} deleteImage={deleteImage} />
            </div>
          </div>
        </div>
        : <></>
      }
      <MediaLibrary
          mediaLibraryVisible={mediaLibraryVisible}
          setMediaLibraryVisible={setMediaLibraryVisible}
          filterTypes={filterTypes}
        />
    </div>
  )
}

export default TranslateImages;
