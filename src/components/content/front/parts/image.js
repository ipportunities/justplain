import React, { useState, useEffect } from "react";
import Carousel from "./images/carousel";
import ImageColumns from "./images/columns";
import SingleImage from "./images/single";
import TextOnImage from "./images/text_on_image";
import DragAndDropImageText from "./images/drag_and_drop_image_text";

const Image = props => {

  //////////////////////
  ///Andere constante
  const [gridColumns, setGridColumns] = useState(0);
  const [images, setImages] = useState([]);

  //////////////////////
  ///Get content
  useEffect(() => {
    //if (props.part.images != "") {
      setImages(props.part.images);
    //}
    setGridColumnsFunction();
  }, [props.part.images]);

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
    setImages(props.part.images);
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

  const asBg = true;

  ////////////////////////////////////////////
  /////////Content
  ///////////////////////////////////////////
  return (
    <>
      <div className="image">
        <div
          className={
            props.part.subtype +
            (!(
              props.part.subtype == "volle breedte" ||
              props.part.subtype == "tekst op afbeelding"
            )
              ? " center"
              : "")
              +
            (asBg ? '':' full_image')
          }
        >
          <SingleImage
            images={images}
            index={props.index}
            part={props.part}
            buildImage={buildImage}
            subtype={props.part.subtype}
          />

          <Carousel buildImage={buildImage} part={props.part} images={images} />

          <TextOnImage
            images={images}
            buildImage={buildImage}
            index={props.index}
            part={props.part}
            updatePart={props.updatePart}
          />

          <ImageColumns
            images={images}
            gridColumns={gridColumns}
            index={props.index}
            part={props.part}
          />

          <DragAndDropImageText
            part={props.part}
            subtype={props.part.subtype}
          />
        </div>
      </div>
    </>
  );
};

export default Image;
