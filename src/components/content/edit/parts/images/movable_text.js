import React, {useState, useEffect} from 'react';
import t from "../../../../translate";
import ContentEditable from 'react-contenteditable'
import uuid from "uuid";
import { getClone } from "../../../../utils";
import {appSettings} from "../../../../../custom/settings";

const MovableText = (props) => {

  const [textItems, setTextItems] = useState([]);
  const [typing, setTyping] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [uniqueId, setUniqueId] = useState(uuid.v4());

  //////////////////////
  ///Get content
  useEffect(() => {
    if(typeof props.part.images[props.indexImage] != "undefined" && typeof props.part.images[props.indexImage].items != "undefined")
    {
      setTextItems(props.part.images[props.indexImage].items)
    }
  }, [props]);

  useEffect(() => {
    if(parseInt(dragged) >= 0){
        document.addEventListener('mousemove', dragTextItem);
    }
  }, [dragged]);

  //////////////////////
  ///Position textitem
  function startdragTextItem(e, index){
    document.removeEventListener('mousemove', dragTextItem);
    e.stopPropagation()
    setDragged(index)

  }
  function dragTextItem(e, index){
    //if(index == dragged){setDragged(false)}
    if(dragged === false || dragged == "image"){return false;}
    //if(index != dragged){return false;}

    let textItem = document.getElementById("text_item_" + uniqueId + '_' + dragged);
    let parent = textItem.parentElement.parentElement;

    console.log(e.clientX);
    console.log(e.clientY);

    textItem.style.left=e.clientX-(parent.getBoundingClientRect().left) - 20 +'px';
  	textItem.style.top=e.clientY-(parent.getBoundingClientRect().top) - 20 +'px';

    e.stopPropagation()
  }
  function stopDragTextItem(e){
    document.removeEventListener('mousemove', dragTextItem);

    let textItem = document.getElementById("text_item_" + uniqueId + '_' + dragged);
    let clonedPart = getClone(props.part);
    clonedPart.images[props.indexImage].items[dragged].position = {top:textItem.style.top, left:textItem.style.left};
    props.updatePart(props.index, 'images', clonedPart.images)

    console.log(clonedPart);


    setDragged(false)
  }

  function setDimensionsTextItem(e, index){
    if(dragged == false){
      let targ = e.target ? e.target : e.srcElement;
      ///resizen vond soms ook plaats op andere elementen.... dit maar voor de zekerheid
      if(targ.classList.contains('textItem')){
        let clonedPart = getClone(props.part);
        clonedPart.images[props.indexImage].items[index].dimensions = {width:e.target.offsetWidth, height:e.target.offsetHeight};
        props.updatePart(props.index, 'images', clonedPart.images)
      }
    }
  }

  //////////////////////
  ///Resize holder div
  function addTextItem(){
    let clonedPart = getClone(props.part);
    let insertIndex = clonedPart.items.length;
    if(typeof clonedPart.images[props.indexImage].items != "undefined"){
      clonedPart.images[props.indexImage].items.splice(insertIndex, 0, {content:"",checked:false, id:uuid.v4(),position:{top:"0px",left:"0px"},dimensions:{width:"auto",height:"auto"}});
    } else {
      clonedPart.images[props.indexImage].items = [];
      clonedPart.images[props.indexImage].items.push({content:"",checked:false, id:uuid.v4(),position:{top:"0px",left:"0px"},dimensions:{width:"auto",height:"auto"}});
    }

    //setFocusIndex(insertIndex)

    props.updatePart(props.index, 'images', clonedPart.images)
  }
  function updateText(text, index){
    let clonedPart = getClone(props.part);
    clonedPart.images[props.indexImage].items[index].content = text;
    props.updatePart(props.index, 'images', clonedPart.images)
  }
  function deleteTextItem(index){
    let clonedPart = getClone(props.part);
    clonedPart.images[props.indexImage].items.splice(index, 1);
    console.log(clonedPart.items);
    props.updatePart(props.index, 'images', clonedPart.images)
  }

  return(
    <>
      <div className="textItems">
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
      </div>
      {textItems.length > 1 ? '':
        <div className="movableActions showOnHover">
          <span className="btn btn-primary" onClick={() => addTextItem()}>
            <i className="fas fa-plus"></i>
          </span>
        </div>
      }

    </>
  )
}

export default MovableText;
