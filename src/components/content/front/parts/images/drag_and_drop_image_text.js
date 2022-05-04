import React, {useState, useEffect} from 'react';
import t from "../../../../translate";
import parse from 'html-react-parser';
import $ from "jquery";

const DragAndDropImageText = (props) => {

  const [textItems, setTextItems] = useState([]);
  const [image, setImage] = useState('');
  const [imageWidth, setImageWidth] = useState('auto');
  const [scaler, setScaler] = useState(1);
  const [dimensionsWidth, setDimensionsWidth] = useState("auto");
  const [dimensionsHeight, setDimensionsHeight] = useState("auto");
  const [positionImage, setPositionImage] = useState({top:"0px", left:"0px"});
  const [fontEmAdd, setFontEmAdd] = useState(0.2);
  const [widthContainer, setWidthContainer] = useState(980);

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part != "")
    {
      if(typeof props.part.dimensions != "undefined"){
        setDimensionsWidth(parseInt(props.part.dimensions.width))
        setDimensionsHeight(parseInt(props.part.dimensions.height))
      }
      if(typeof props.part.images[0] != "undefined"){
        setImage(props.part.images[0].url)

        var img = new Image();
        img.src = props.part.images[0].url;

        img.onload = function() {
          setImageWidth(img.width)
          fitImage()
        }

      }

      setTextItems(props.part.items)

      if(typeof props.part.images[0] != "undefined" && typeof props.part.images[0].position != "undefined"){
        setPositionImage(props.part.images[0].position);
      }
    }

  }, [props.part]);

  useEffect(() => {
    window.addEventListener("resize", resize);
  }, []);


  function resize(){
    clearTimeout(resizeTimer);
    let resizeTimer = setTimeout(function() {
      fitImage()
      if(!$(".lessoncontent.front header.phone").is(":visible")){
        setFontEmAdd(0.2)
      } else {
        setFontEmAdd(0.1)
      }
    }, 250);
  }

  function fitImage(){
    let width_container = $(".lessoncontent.front .right").width() - 40;
    if($(".lessoncontent.front header.phone").is(":visible")){
      width_container = width_container + 40;
    }

    if(width_container > $(".lessoncontent.front .right .content").width()){
      width_container = $(".lessoncontent.front .right .content").width();
    }

    if(widthContainer> width_container){
      let scaler_temp = width_container/widthContainer;
      setScaler(scaler_temp)
      //setDimensions({width:width_container,height:(props.part.dimensions.height * scaler_temp) + 50})
    } else {
      setScaler(1)
    }
  }

  return(
    <>
      {props.subtype == "afbeelding en tekst drag and drop" ?
        <div className="dragAndDrop" style={{height:parseInt(props.part.height ) * scaler}}>
          {(image != "") ?
            <>
              <div className="imageHolder resizable" style={{
                width:(parseInt(dimensionsWidth)/widthContainer) * 100 + "%",
                top:(parseInt(positionImage.top)/(parseInt(props.part.height)))* 100 + "%",
                left:(parseInt(positionImage.left)/widthContainer) * 100 + "%"
              }}>
                <img src={image} className="resizable_image"/>
              </div>
              {textItems.map((item, index) =>
                <div key={index}  style={{
                  height:(parseInt(item.dimensions.height)/(parseInt(props.part.height) * scaler)) * 100 + '%',
                  top:(parseInt(item.position.top)/parseInt(props.part.height)) * 100 + '%',
                  width:(parseInt(item.dimensions.width)/widthContainer) * 100 + '%',
                  left:(parseInt(item.position.left)/widthContainer) * 100 + '%',
                  fontSize:(scaler + fontEmAdd)+"em",
                  marginTop:(50 * scaler)+ "px",
                  //lineHeight:(1.5/widthContainer) * 1000,
                  padding:(10/widthContainer) * 100 + '%',
                }} className="textItem" >
                  {parse(item.content)}
                </div>
              )}
            </>
          : ''}
        </div>
      :''}
    </>
  )
}

export default DragAndDropImageText;
