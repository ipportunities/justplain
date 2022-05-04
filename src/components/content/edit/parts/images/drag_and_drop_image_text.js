import React, {useState, useEffect} from 'react';
import t from "../../../../translate";
import ContentEditable from 'react-contenteditable'
import uuid from "uuid";
import { getClone } from "../../../../utils";
import {appSettings} from "../../../../../custom/settings";

const DragAndDropImageText = (props) => {

  const [textItems, setTextItems] = useState([]);
  const [dimensions, setDimensions] = useState({width:"auto", height:"auto"});
  const [dimensionsImage, setDimensionsImage] = useState({width:"50px", height:"50px"});
  const [positionImage, setPositionImage] = useState({top:"0px", left:"0px"});
  const [drag, setDrag] = useState(false);
  const [image, setImage] = useState('');
  const [typing, setTyping] = useState(false);
  const [coordX, setCoordX] = useState(false);
  const [coordY, setCoordY] = useState(false);
  const [offsetX, setOffsetX] = useState(false);
  const [offsetY, setOffsetY] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [target, setTarget] = useState(false);
  const [uniqueId, setUniqueId] = useState(uuid.v4());
  const [heightHolder, setHeightHolder] = useState("450px");

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part != "")
    {
      if(typeof props.part.height != "undefined"){
        setHeightHolder(props.part.height)
      }
      if(typeof props.part.dimensions != "undefined"){
        setDimensions(props.part.dimensions)
      }

      setTextItems(props.part.items)

      if(typeof props.part.images[0] != "undefined" && typeof props.part.images[0].position != "undefined"){
        setPositionImage(props.part.images[0].position);
      }
      if(props.images != "")
      {
        setImage(props.images[0].url)
      }
    }
  }, [props]);

  useEffect(() => {
    if(parseInt(dragged) >= 0){
        document.getElementById("text_item_" + uniqueId + '_' + dragged).addEventListener('mousemove', dragTextItem);
    }
  }, [dragged]);

  //////////////////////
  ///Position image
  function startDragImage(e) {
    if(dragged != "image"){return false;}
  	// determine event object
  	if (!e) {
  		var e = window.event;
  	}
    if(e.preventDefault) e.preventDefault();

  	// IE uses srcElement, others use target
  	var targ = e.target ? e.target : e.srcElement;
    targ = targ.parentElement
    if (!(targ.classList.contains('dragme'))) {
      return
    };

    setTarget(targ)

  	// calculate event X, Y coordinates
  		setOffsetX(e.clientX);
  		setOffsetY(e.clientY);

  	// assign default values for top and left properties
  	if(!targ.style.left) { targ.style.left='0px'};
  	if (!targ.style.top) { targ.style.top='0px'};

  	// calculate integer values for top and left
  	// properties
  	setCoordX(parseInt(targ.style.left));
  	setCoordY(parseInt(targ.style.top));
    setDrag(true)

  	// move div element
  		document.onmousemove=dragImage;
            return false;

  }
  function dragImage(e) {
  	if (!drag) {return};
  	if (!target) {return};

  	// move div element
  	target.style.left=coordX+e.clientX-offsetX+'px';
  	target.style.top=coordY+e.clientY-offsetY+'px';
  	return false;
  }
  function stopDrag(e) {
    setDimensionsDiv(e)

    if (!target) {return};
    setDrag(false)
    setDragged(false)

    let tempPositionImage = {top:target.style.top, left:target.style.left};
    setPositionImage(tempPositionImage)

    let clonedPart = getClone(props.part);
    clonedPart.images[0].position = tempPositionImage;

    props.updatePart(props.index, 'images', clonedPart.images)

    /*
    if(targ.classList.contains('fa-expand-arrows-alt')){
      targ = e.target.parentElement.parentElement.parentElement ? e.target.parentElement.parentElement.parentElement : e.srcElement.parentElement.parentElement.parentElement;

      let clonedPart = getClone(props.part);
      clonedPart.items[parseInt(targ.id.replace("text_item_", ""))].position = {top:targ.style.top, left:targ.style.left};
      props.updatePart(props.index, 'items', clonedPart.items)
    }
    */

    setTarget(false)


  }

  //////////////////////
  ///Position textitem
  function startdragTextItem(e, index){
    if(index !== dragged){
      setDragged(index)
    }
    e.stopPropagation()
  }
  function dragTextItem(e, index){
    //if(index == dragged){setDragged(false)}
    if(dragged === false || dragged == "image"){return false;}
    //if(index != dragged){return false;}

    let textItem = document.getElementById("text_item_" + uniqueId + '_' + dragged);
    let parent = textItem.parentElement;


    textItem.style.left=e.clientX-(parent.getBoundingClientRect().left) - 20 +'px';
  	textItem.style.top=e.clientY-(parent.getBoundingClientRect().top) - 20 +'px';

    e.stopPropagation()
  }
  function stopDragTextItem(e){
    document.getElementById("text_item_" + uniqueId + '_' + dragged).removeEventListener('mousemove', dragTextItem);

    let textItem = document.getElementById("text_item_" + uniqueId + '_' + dragged);
    let clonedPart = getClone(props.part);
    clonedPart.items[dragged].position = {top:textItem.style.top, left:textItem.style.left};
    props.updatePart(props.index, 'items', clonedPart.items)

    setDragged(false)
  }

  //////////////////////
  ///Resize holder div
  function setHeightHolderDiv(e){
    if(dragged == false){
      let targ = e.target ? e.target : e.srcElement;
      ///resizen vond soms ook plaats op andere elementen.... dit maar voor de zekerheid
      if(targ.classList.contains('dragAndDrop')){
        setHeightHolder(e.target.offsetHeight + "px");

        props.updatePart(props.index, 'height', e.target.offsetHeight + "px")
      }
    }
  }
  function setDimensionsDiv(e){
    let targ = document.getElementById("imageHolder_" + uniqueId)
    ///resizen vond soms ook plaats op andere elementen.... dit maar voor de zekerheid
    let tempDimensions = {width:targ.offsetWidth + 'px', height:targ.offsetHeight + 'px'};
    setDimensions(tempDimensions);

    props.updatePart(props.index, 'dimensions', tempDimensions)
  }
  function setDimensionsTextItem(e, index){
    if(dragged == false){
      let targ = e.target ? e.target : e.srcElement;
      ///resizen vond soms ook plaats op andere elementen.... dit maar voor de zekerheid
      if(targ.classList.contains('textItem')){
        let clonedPart = getClone(props.part);
        clonedPart.items[index].dimensions = {width:e.target.offsetWidth, height:e.target.offsetHeight};
        props.updatePart(props.index, 'items', clonedPart.items)
      }
    }
  }

  //////////////////////
  ///Resize holder div
  function addTextItem(){
    let clonedPart = getClone(props.part);
    let insertIndex = clonedPart.items.length;
    clonedPart.items.splice(insertIndex, 0, {content:"",checked:false, id:uuid.v4(),position:{top:"0px",left:"0px"},dimensions:{width:"auto",height:"auto"}});
    //setFocusIndex(insertIndex)

    props.updatePart(props.index, 'items', clonedPart.items)
  }
  function updateText(text, index){
    let clonedPart = getClone(props.part);
    clonedPart.items[index].content = text;
    props.updatePart(props.index, 'items', clonedPart.items)
  }
  function deleteTextItem(index){
    let clonedPart = getClone(props.part);
    clonedPart.items.splice(index, 1);
    props.updatePart(props.index, 'items', clonedPart.items)
  }

  return(
    <>
      {props.part.subtype == "afbeelding en tekst drag and drop" ?
        <>
          <div className="dragAndDrop resizable" style={{height:heightHolder}} onMouseUp={setHeightHolderDiv}>
            {(image != "") ?
              <>
                <div id={"imageHolder_" + uniqueId} onMouseOut={stopDrag} style={{width:dimensions.width,height:dimensions.height,top:positionImage.top,left:positionImage.left}} className={(dragged =="image" ? "dragme":"") + " imageHolder resizable"} onDragStart={(e) => startDragImage(e)} onMouseDown={() => setDragged("image")} onMouseMove={dragImage} onMouseUp={stopDrag}>
                  <img src={image} className="resizable_image"/>
                </div>
                {textItems.map((item, index) =>
                  <div key={index} id={"text_item_" + uniqueId + '_' + index} style={{top:item.position.top,left:item.position.left,width:item.dimensions.width,height:item.dimensions.height}} className="textItem" onMouseUp={(e) => setDimensionsTextItem(e, index)} >
                    <div className="actionsText" onDragStart={(e) => {return false}} >
                      <span className="btn handle" onMouseDown={(e) => startdragTextItem(e, index)} onMouseUp={(e)=>stopDragTextItem()} >
                        <i className="fas fa-expand-arrows-alt"></i>
                      </span>
                      <span className="btn delete" onClick={(e) => deleteTextItem(index)}>
                        <i className="fa fa-minus"></i>
                      </span>
                    </div>
                    <ContentEditable
                        html={item.content}
                        disabled={false}
                        onChange={(e) => updateText(e.target.value, index)} // handle innerHTML change
                        placeholder={t("Plaats hier uw tekst")}
                      />
                  </div>
                )}
              </>
            :
            <div className="empty center">
              <span className="btn btn-primary" onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer afbeelding")} <i className="fa fa-plus"></i></span>
            </div>
            }
          </div>
          <div className="actionsBottom showOnHover">
            <span className="btn btn-primary" onClick={() => addTextItem()}>{t("Voeg tekst toe")} <i className="fa fa-plus"></i>
            </span>
            <span className="btn btn-primary" onClick={() => props.showMediaLibrary(props.index)}>{t("Selecteer andere afbeelding")} <i className="fa fa-plus"></i>
            </span>
          </div>
        </>
      :''}
    </>
  )
}

export default DragAndDropImageText;
