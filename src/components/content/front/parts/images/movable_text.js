import React, {useState, useEffect} from 'react';
import t from "../../../../translate";
import parse from 'html-react-parser';
import $ from "jquery";

const MovableText = (props) => {

  const subtypesColumns = ["twee afbeeldingen naast elkaar", "drie afbeeldingen naast elkaar", "vier afbeeldingen naast elkaar", "vier afbeeldingen naast elkaar niet als achtergrond"];
  const [textItems, setTextItems] = useState([]);
  const [scaler, setScaler] = useState(1);
  const [scalerCorrectionColumns, setScalerCorrectionColumns] = useState(1);
  const [widthContainer, setWidthContainer] = useState(960);
  const [fontEmAdd, setFontEmAdd] = useState(0.2);

  //////////////////////
  ///Get content
  useEffect(() => {
    if(typeof props.part.images[props.indexImage] != "undefined" && typeof props.part.images[props.indexImage].items != "undefined")
    {
      setTextItems(props.part.images[props.indexImage].items)
    } else {
      setTextItems([])
    }
    getScaler();
  }, [props]);

  useEffect(() => {
    window.addEventListener("resize", resize);
  }, []);

  function resize(){
    clearTimeout(resizeTimer);
    let resizeTimer = setTimeout(function() {
      getScaler()
      if(!$(".lessoncontent.front header.phone").is(":visible")){
        setFontEmAdd(0.2)
      } else {
        setFontEmAdd(0.1)
      }
    }, 250);
  }

  function getScaler(){
    let width_container = $(".lessoncontent.front .right").width() - 40;
    if($(".lessoncontent.front header.phone").is(":visible")){
      width_container = width_container + 40;
    }

    if(width_container > $(".lessoncontent.front .right .content").width()){
      width_container = $(".lessoncontent.front .right .content").width();
    }


    if(subtypesColumns.includes(props.part.subtype)){
      if(props.part.subtype == "twee afbeeldingen naast elkaar"){
        setWidthContainer(480);
      } else if(props.part.subtype == "drie afbeeldingen naast elkaar"){
        setWidthContainer(960/3);
      } else {
        setWidthContainer(960/4);
      }
    } else {
      setWidthContainer(960)
    }
    if(widthContainer > width_container){
      let scaler_temp = width_container/widthContainer;
      setScaler(scaler_temp)
      //setDimensions({width:width_container,height:(props.part.dimensions.height * scaler_temp) + 50})
    } else {
      setScaler(1)
    }

    if($(".lessoncontent.front header.phone").is(":visible") && subtypesColumns.includes(props.part.subtype)){
      if(props.part.subtype == "twee afbeeldingen naast elkaar"){
        setScalerCorrectionColumns(2.25);
      } else if(props.part.subtype == "drie afbeeldingen naast elkaar"){
        setScalerCorrectionColumns(3.50);
      } else {
        setScalerCorrectionColumns(4.75);
      }

    } else {
      setScalerCorrectionColumns(1)
    }
  }

  return(
    <>
      <div className="textItems">
        {textItems.map((item, index) =>
          <div key={index} style={{
            marginTop:50*scaler*scalerCorrectionColumns + "px",
            top:parseInt(item.position.top)*scaler*scalerCorrectionColumns + "px",
            left:(parseInt(item.position.left)/widthContainer) * 100 + '%',
            width:(parseInt(item.dimensions.width)/widthContainer) * 100 + '%',
            height:parseInt(item.dimensions.height)*scaler*scalerCorrectionColumns + "px",
            fontSize:(scaler + fontEmAdd)+"em",
            padding:(10/widthContainer) * 100 + '%',
          }} className="textItem" >
            {parse(item.content)}
          </div>
        )}
      </div>

    </>
  )
}

export default MovableText;
