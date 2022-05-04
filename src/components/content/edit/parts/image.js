import React, { useState, useEffect } from "react";
import uuid from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { componentOptions } from "./helpers/options.js";
import { setChosenImage } from "../../../../actions";
import Carousel from "./images/carousel";
import SetImages from "./images/setimages";
import ImageColumns from "./images/columns";
import SingleImage from "./images/single";
import TextOnImage from "./images/text_on_image";
import DragAndDropImageText from "./images/drag_and_drop_image_text";
import t from "../../../translate";

const Image = props => {

  const domain = useSelector(state => state.url);

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function(option) {
    return option.title === "Afbeelding";
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  //////////////////////
  ///Andere constante
  const [gridColumns, setGridColumns] = useState(0);
  const [chosenImageIndex, setChosenImageIndex] = useState("");
  const [containers, setContainers] = useState([]);
  const [images, setImages] = useState([]);
  const intervention = useSelector(state => state.intervention);

  const [showChosenImages, setShowChosenImages] = useState("false");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //props.part.images = [];

  //////////////////////
  ///Get content
  useEffect(() => {
    if (props.part.images != "") {
      setImages(props.part.images);
    }
    setGridColumnsFunction();
  }, []);

  //////////////////////
  ///Set grid columns funciton + update image array opdat je geen lege elementen hebt
  function setGridColumnsFunction() {
    if (props.part.subtype == "twee afbeeldingen naast elkaar") {
      setGridColumns(2);
    }
    if (props.part.subtype == "drie afbeeldingen naast elkaar") {
      setGridColumns(3);
    }
    if (props.part.subtype == "vier afbeeldingen naast elkaar" ||
    props.part.subtype == "vier afbeeldingen naast elkaar niet als achtergrond") {
      setGridColumns(4);
    }
    if (
      props.part.subtype == "twee afbeeldingen naast elkaar" ||
      props.part.subtype == "drie afbeeldingen naast elkaar" ||
      props.part.subtype == "vier afbeeldingen naast elkaar" ||
      props.part.subtype == "vier afbeeldingen naast elkaar niet als achtergrond"
    ) {
      for (let i = 0; i < 4; i++) {
        if (
          typeof props.part.images[i] === "undefined" ||
          props.part.images[i] == "null"
        ) {
          props.part.images[i] = { url: "", id: uuid.v4(), caption:"" , captionAbove:"" };
        }
      }
    } else {
      for (let i = 0; i < props.part.images.length; i++) {
        if (props.part.images[i].url == "") {
          props.part.images.splice(i, 1);
        }
      }
    }
    setImages(props.part.images);
  }

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if (medialibrary.chosen_image != "" && medialibrary.index == props.index) {
    /// empty chosen image status
    dispatch(setChosenImage(""));
    imageAction(medialibrary.chosen_image);
  }

  //////////////////////
  ///Build image
  function buildImage(url) {
    if (props.part.subtype == "gecentreerd") {
      return <img src={url} />;
    }
    if (
      props.part.subtype == "volle breedte" ||
      props.part.subtype == "carousel"
    ) {
      return (
        <div
          className="imageAsBg"
          style={{ backgroundImage: "url('" + url + "')" }}
        ></div>
      );
    }
  }

  //////////////////////
  ///Set selected image
  function imageAction(chosenImage) {
    let images = props.part.images;
    let url = domain + "/uploads/intervention/" + chosenImage;
    /// is single?

    if (
      props.part.subtype == "gecentreerd" ||
      props.part.subtype == "volle breedte" ||
      props.part.subtype == "afbeelding en tekst drag and drop" ||
      props.part.subtype == "tekst op afbeelding"
    ) {
      if(images[0]){
        images[0].url = url;
      } else {
        images.push({ url: url, id: uuid.v4() });
      }

    } else if (gridColumns > 0) {
      if(images[chosenImageIndex]){
        images[chosenImageIndex].url = url
      } else {
        images[chosenImageIndex] = { url: url, id: uuid.v4() };
      }
    } else {
      images.push({ url: url, id: uuid.v4() });
    }
    setImages(images);
    props.updatePart(props.index, "images", images);
  }
  //////////////////////
  ///Open close set image content carousel
  function editContent() {
    setShowChosenImages("true");
  }
  function closeEditContent() {
    setShowChosenImages("false");
  }
  //////////////////////
  ///Delete image
  function deleteImage(index) {
    let images = props.part.images;
    if (gridColumns > 0) {
      images[index].url = "";
    } else {
      images.splice(index, 1);
    }
    props.updatePart(props.index, "images", images);
  }
  //////////////////////
  ///Delete chosen image based on column index
  function deleteImageAndSetChosenImageIndex(index) {
    deleteImage(index);
    setChosenImageIndex(index);
  }
  //////////////////////
  ///Set chosen image index and open media library
  function showMediaLibraryAndSetChosenImageIndex(index) {
    props.showMediaLibrary(props.index);
    setChosenImageIndex(index);
  }
  //////////////////////
  ///Change subtype
  function changeSubtype(value) {
    props.updatePart(props.index, "subtype", value);
    setGridColumnsFunction();
  }

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  //////////////////////
  ///Caption
  function updateCaption(value, index){
    if(value == "<br>"){value = "";}
    let images_temp = images;
    images_temp[index].caption = value;
    props.updatePart(props.index, 'images', images_temp)
  }
  function updateCaptionAbove(value, index){
    if(value == "<br>"){value = "";}
    let images_temp = images;
    images_temp[index].captionAbove = value;
    props.updatePart(props.index, 'images', images_temp)
  }


  ////////////////////////////////////////////
  /////////Content
  ///////////////////////////////////////////
  return (
    <>
      <div className="image">
        <select
          className="subtypeChanger"
          onChange={e => changeSubtype(e.target.value)}
          value={props.part.subtype}
        >
          {available_subtypes.map((subtype, index) => (
            <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
          ))}
        </select>
        <div
          className={
            props.part.subtype +
            (!(
              props.part.subtype == "volle breedte" ||
              props.part.subtype == "tekst op afbeelding"
            )
              ? " center"
              : "") +
            (showChosenImages == "true" ? " edit" : "")
          }
        >
          <SingleImage
            images={images}
            index={props.index}
            part={props.part}
            buildImage={buildImage}
            showMediaLibrary={props.showMediaLibrary}
            subtype={props.part.subtype}
            updatePart={props.updatePart}
            updateCaption={updateCaption}
            updateCaptionAbove={updateCaptionAbove}
          />

          <Carousel
            buildImage={buildImage}
            part={props.part}
            images={images}
            updateCaption={updateCaption}
            updateCaptionAbove={updateCaptionAbove}
            />

          <SetImages
            updatePart={props.updatePart}
            index={props.index}
            part={props.part}
            showMediaLibrary={props.showMediaLibrary}
            closeEditContent={closeEditContent}
            images={images}
            setImages={setImages}
            deleteImage={deleteImage}
          />

          <TextOnImage
            images={images}
            showMediaLibrary={props.showMediaLibrary}
            buildImage={buildImage}
            index={props.index}
            part={props.part}
            updatePart={props.updatePart}
          />

          <ImageColumns
            images={images}
            gridColumns={gridColumns}
            showMediaLibraryAndSetChosenImageIndex={
              showMediaLibraryAndSetChosenImageIndex
            }
            deleteImageAndSetChosenImageIndex={
              deleteImageAndSetChosenImageIndex
            }
            part={props.part}
            index={props.index}
            updatePart={props.updatePart}
            updateCaption={updateCaption}
            updateCaptionAbove={updateCaptionAbove}
          />

          <DragAndDropImageText
            images={images}
            showMediaLibrary={props.showMediaLibrary}
            index={props.index}
            part={props.part}
            updatePart={props.updatePart}
          />

        </div>
        {props.part.subtype == "carousel" && showChosenImages == "false" ? (
          <span
            className="add btn btn-primary showOnHover"
            onClick={e => editContent()}
          >
            {" "}
            Edit {props.part.subtype} <i className="fa fa-pen"></i>
          </span>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Image;
