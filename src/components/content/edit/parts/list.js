import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import ContentEditableComponent from './contentEditable'
import ContentEditable from 'react-contenteditable';
import uuid from "uuid";
import { setChosenImage } from "../../../../actions";
import { useSelector, useDispatch } from 'react-redux';
import {componentOptions} from "./helpers/options.js";
import CodeSet from "./helpers/codeSet.js";
import t from "../../../translate";
import ReactTooltip from 'react-tooltip'
import Routing from "./helpers/routing.js";
import InputTextfield from './input_textfield.js';
import AddImage from "./helpers/addImage";

const List = (props) => {

  const [focusIndex, setFocusIndex] = useState(-1);

  //////////////////////
  ///values en routing
  const [valuesOn, setValuesOn] = useState(false);
  const [routingAvailable, setRoutingAvailable] = useState(false);
  const [routingOn, setRoutingOn] = useState(false);
  const [routingIsUsed, setRoutingIsUsed] = useState(false);

  //////////////////////
  ///Sorting
  const [draggedElIndex, setDraggedElIndex] = useState('');
  const [droppedElIndex, setDroppedElIndex] = useState('');
  const [items, setITems] = useState([]);

  //////////////////////
  ///Is select
  const [select, setSelect] = useState(false);
  const [listEdit, setListEdit] = useState(true);

  ///For the mediaLibrary
  const url = useSelector(state => state.url);
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(false);

   //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part.items != ""){

      ///fallback voor bug leeg kaartje oorzaak wellicht door microsoft 365 omgeving edge?!
      if(props.part.subtype == 'cards')
      {
        for(let i = 0 ; i < props.part.items.length ; i++)
        {
          if(props.part.items[i] === null){
              /// is een item null vul hem dan met leeg object
              props.part.items[i] = {content:"", id:uuid.v4(), content2:'', flip:'front', buttonText:'', visible:false, image:''}
          }
        }
      }
      
      //cleanen v evt lege items
      /* console.log(props.part.items)
      let cleanItems = []
      for (let i=0;i<props.part.items.length;i++) {
        if (props.part.items[i] !== null) {
          cleanItems.push(props.part.items[i])
        }
      }  */

      setITems(props.part.items)

      checkIfRoutedItems()
    }
    if(props.part.type == "select")
    {
      setSelect(true)
      setListEdit(false)
    }
  }, []);

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == props.index)
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    imageAction(medialibrary.chosen_image);
  }

  //////////////////////
  ///Image actions
  function imageAction(chosen_image){
    if(activeItem != false){
      let items = props.part.items;
      let activeItemSplit = activeItem.split("_")

      if(activeItemSplit[0] == "front"){
        items[activeItemSplit[1]].image = url + "/uploads/intervention/" + chosen_image
      } else {
        items[activeItemSplit[1]].imageBack = url + "/uploads/intervention/" + chosen_image
      }

      props.updatePart(props.index, 'items', items)
    }

  }
  function deleteImage(index, backFront){
    let items = props.part.items;

    if(backFront == "front"){
      items[index].image = ''
    } else {
      items[index].imageBack = ''
    }

    props.updatePart(props.index, 'items', items)
  }

  //////////////////////
  ///Drag and drop list items
  function dragEnd(e){
    e.target.classList.remove("isDragged");
  }
  function dragStart(e){
    setDraggedElIndex(e.target.getAttribute('index'));
    e.target.classList.add("isDragged")
  }
  function dragOver(e){
    if(droppedElIndex != e.currentTarget.getAttribute('index'))
    {
      setDroppedElIndex(e.currentTarget.getAttribute('index'));
      removeDropClass()

      e.currentTarget.classList.add("drop_here")
    }

    e.stopPropagation();
    e.preventDefault();
  }
  function drop(e){
    let newItems = items;
    let element = newItems[draggedElIndex];

    newItems.splice(draggedElIndex, 1);
    newItems.splice(droppedElIndex, 0, element);

    setITems(newItems)
    setDraggedElIndex(e.currentTarget.getAttribute('index'));

    props.updatePart(props.index, 'items', newItems)
    removeDropClass()
    for(let i = 0 ; i < newItems.length ; i++)
    {
      var el = document.getElementById("item_" + newItems[i].id);
      el.setAttribute('draggable', "false")
      el.classList.remove("isDragged");
      if(i == droppedElIndex)
      {
        el.classList.add("hovered");
      } else {
        el.classList.remove("hovered");
      }
    }
  }
  function activeDragAndDrop(){
    ReactTooltip.hide()
    for(let i = 0 ; i < items.length ; i++)
    {
      var element = document.getElementById("item_" + items[i].id);
      element.setAttribute('draggable', "true")
    }
  }
  function removeDropClass()
  {
    for(let i = 0 ; i < props.part.items.length ; i++)
    {
      var element = document.getElementById("item_" + items[i].id);
      element.classList.remove("drop_here");
    }
  }

  //////////////////////
  ///Update Item
  function updateItem(index, value){
    let items = props.part.items;
    items[index].content = value;
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Update Back content Item
  function updateContent2(index, value){
    let items = props.part.items;
    items[index].content2 = value;
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Update Back content Item
  function updateButtonText(index, value){
    let items = props.part.items;
    items[index].buttonText = value;
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Add Item
  function addItem (index, userInput) {
    let items = props.part.items;
    let insertIndex = index + 1;
    items.splice(insertIndex, 0, {content:userInput == "" ? '':userInput, id:uuid.v4(), content2:'', flip:'front', buttonText:'', visible:false, image:''});
    setFocusIndex(insertIndex)

    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Remove Item
  function removeItem (index) {
    ReactTooltip.hide()
    let items = props.part.items;
    items.splice(index, 1);
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Build input
  function buildInput (){
    if(props.part.type == "question_checkboxes"){return <input type="checkbox" value='' />;}
    if(props.part.type == "question_radio"){return <input type="radio" value=''/>;}
    if(props.part.type == "select"){return <span class='bull'>&bull;</span>;}
  }
  //////////////////////
  ///If is select list
  function ifIsSelect () {
    if(select)
    {
      return <select className={listEdit ? 'hide':''}>
          <option>{t("Selecteer een optie")}</option>
            {props.part.items.map((item, index) =>
              <option>{item.content.replace(/^\s*<br\s*\/?>|<br\s*\/?>\s*$/g,'')}</option>
            )}
        </select>
    }
  }

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  //////////////////////
  ///Subtype changer
  function subTypeChanger () {
    if(props.part.type == "list" )
    {
      let checkAgainst;
      if(props.part.type == "list"){checkAgainst = "List"}
      if(props.part.type == "question_checkboxes"){checkAgainst = "Checkboxes"}
      if(props.part.type == "question_radio"){checkAgainst = "Radio"}

      const this_componentOptions = componentOptions.filter(function (option) {
        return option.title === checkAgainst
      });
      const available_subtypes = this_componentOptions[0].subtypes;

      return <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>
    }
  }

  //////////////////////
  ///Toggle select edit
  function toggleListEdit(){
    let toggle = listEdit ? false:true;
    setListEdit(toggle)
  }
  //////////////////////
  ///Toggle type checkbox other or nomaal
  function toggleCheckboxType(index)
  {
    let items = props.part.items;
    items[index].type = items[index].type == 'other' ? 'normal':'other';
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Update value
  function updateValue(id, value){
    updateItemContentById(id, value, 'value')
  }
  //////////////////////
  ///Toggle wrong right answer
  function toggleValueEdit(){
    let toggle = valuesOn ? false:true;
    setValuesOn(toggle)
  }
  //////////////////////
  ///Update routing
  function updateRouting(routing, id){
    updateItemContentById(id, routing, 'routing')
    document.getElementById("item_"+id).classList.remove("hovered") /// firefox
    checkIfRoutedItems()
  }
  //////////////////////
  ///check if routing is used
  function checkIfRoutedItems(){
    let used = false;
    for(let i = 0 ; i < props.part.items.length ; i++)
    {
      if(props.part.items[i] !== null && typeof props.part.items[i].routing !== "undefined" && props.part.items[i].routing !== "")
      {
        used = true;
      }
    }
    setRoutingIsUsed(used)
  }

  //////////////////////
  ///Update item content function
  function updateItemContentById(id, content, key){
    let this_item_obj = items.filter(function (item) {
      return item.id === id
    });
    let this_item_obj_index = items.indexOf(this_item_obj[0]);

    items[this_item_obj_index][key] = content;
    props.updatePart(props.index, 'items', items)
  }


  //////////////////////
  ///Toggle wrong right answer
  function toggleRoutingEdit(){
    let toggle = routingOn ? false:true;
    setRoutingOn(toggle)
  }
  //////////////////////
  ///Toggle wrong right answer
  function toggleWrongRight(index)
  {
    let items = props.part.items;
    items[index].correct = items[index].correct == 'true' ? 'false':'true';
    props.updatePart(props.index, 'items', items)
  }

  function addHoverStatus(e, id){
    document.getElementById(id).classList.add("hovered")
  }
  function removeHoverStatus(e, id){
    if (e.target.nodeName.toLowerCase() == "select") { /// firefox bug select sluit anders meteen weer
      return;
    }
    document.getElementById(id).classList.remove("hovered")
  }

  function flipCard(index){
    let items = props.part.items;
    let side = items[index].flip == 'front' ? 'back':'front'
    items[index].flip = side;
    props.updatePart(props.index, 'items', items)
  }

  return (
    <div className={"list " + (props.part.type == "list" ? props.part.subtype:"")}>
      {subTypeChanger()}
      <div className="content center">
      {props.part.subtype == "nummers" || props.part.subtype == "ongenummerde lijst" || props.part.subtype == "aanvulbare lijst" ?
        <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} updateField="content" placeholder="Koptekst" className='header input_no_bg'/>
      :false}
      {ifIsSelect()}
      <div className={"options" + (listEdit ? '':' hide')}>
        <ul>
          {items.map((item, index) =>
            <li key={item.id} id={"item_" + item.id} index={index} onDragStart={(e) => dragStart(e)} onDrop={(e) => drop(e)} onDragOver={(e) => dragOver(e)} onDragEnd={(e) => dragEnd(e)} onMouseOver={(e)=>addHoverStatus(e, "item_" + item.id)} onMouseOut={(e)=>removeHoverStatus(e, "item_" + item.id)}  className={typeof item.flip != "undefined" ? item.flip:''}>
              <table>
                <tbody>
                  <tr>
                  <td>
                  {props.part.type == "list"  ?
                    <span className="before btn">{props.part.subtype == "nummers" ? (index + 1):''}</span>:''}
                  </td>
                    <td>
                        {props.part.type == "question_radio" || props.part.type == "question_checkboxes" || props.part.type == "select" ?
                          <table className="radio_holder">
                            <tbody>
                              <tr>
                                <td>
                                  {buildInput()}
                                  <label className={item.type == "other" ? "other":''}>
                                    <ContentEditableComponent
                                      focus={focusIndex == index ? true:false}
                                      html={item.content}
                                      placeholder={t("Plaats hier uw tekst")}
                                      updateItem={updateItem}
                                      index={index}
                                    />
                                  </label>

                                  {item.type == "other" && (props.part.subtype == "checkboxes" || props.part.subtype == "radio") ? <input type="text" className='other' placeholder={t("anders namelijk")}/>:''}
                                </td>
                                <td>
                                  <Routing routingOn={routingOn} updateRouting={updateRouting} parts={props.parts} index={props.index} setRoutingAvailable={setRoutingAvailable} item_id={item.id} routing={typeof item.routing == "undefined"?"":item.routing}/>
                                </td>
                                <td>
                                  <div className={"values" + (valuesOn == true ? '':' hide')}>
                                    <input type='text'
                                       value={typeof item.value == "undefined" ? '':item.value}
                                       placeholder="Waarde"
                                       onChange={(e) => updateValue(item.id, e.target.value)}
                                       />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        :
                        <div>
                          {buildInput()}
                          {props.part.subtype == 'cards' && item.flip == 'front' ?
                            <div onClick={e=>setActiveItem("front_" + index)}>
                              <AddImage image={typeof item.image != 'undefined' && item.image != '' ? item.image:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={e => deleteImage(index, "front")}/>
                            </div>
                            :''
                          }
                          <label className={item.type == "other" ? "other":''}>
                            <ContentEditableComponent
                                focus={focusIndex == index ? true:false}
                                html={item.content}
                                placeholder={t("Plaats hier uw tekst")}
                                updateItem={updateItem}
                                index={index}
                              />
                            </label>

                            {props.part.subtype == 'cards' ?
                              <div>
                                {item.flip == 'back' ?
                                  <div onClick={e=>setActiveItem("back_" + index)}>
                                    <AddImage image={typeof item.imageBack != 'undefined' && item.imageBack != '' ? item.imageBack:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={e => deleteImage(index, "back")} />
                                  </div>
                                :''}
                                <div className='backText'>
                                  <ContentEditableComponent
                                    focus={focusIndex == index ? true:false}
                                    html={item.content2}
                                    placeholder={t("Plaats hier uw tekst voor de achterkant van de kaart")}
                                    updateItem={updateContent2}
                                    index={index}
                                  />
                                </div>
                                <div className='alignCenter'>
                                  <div className='buttonText btn btn-primary'>
                                    <ContentEditableComponent
                                      focus={focusIndex == index ? true:false}
                                      html={item.buttonText}
                                      placeholder="Button text"
                                      updateItem={updateButtonText}
                                      index={index}
                                    />
                                  </div>
                                </div>
                              </div>
                            :''}

                            {item.type == "other" && (props.part.subtype == "checkboxes" || props.part.subtype == "radio") ? <input type="text" className='other' placeholder="anders namelijk"/>:''}

                        </div>
                        }
                    </td>

                    <td>
                      <table className='itemOptions'>
                        <tbody>
                          <tr>
                            {props.part.subtype == 'cards' ?
                              <td>
                                <span className={"btn flip showOnHover "+ item.flip + (item.flip == 'front' ? ' yellow':' lightgrey')} data-tip={t("Bewerk andere kant van de kaart")} onClick={(e)=>flipCard(index)}>
                                  <i className="fas fa-toggle-on"></i>
                                </span>
                              </td>
                              :
                             <td></td>
                            }
                            <td>
                              <span className="btn handle showOnHover" onMouseDown={e => activeDragAndDrop()} data-tip={t("Sorteer")}>
                                <i className="fas fa-expand-arrows-alt"></i>
                              </span>

                              {props.part.subtype == "checkboxes" || props.part.subtype == "checkboxes goed of fout" || props.part.subtype == "radio" || props.part.subtype == "radio goed of fout" || props.part.type == "select" || props.part.type == "question_right_or_wrong" ?
                              <span className='checkbox_wrong_right showOnHover' onClick={() => toggleWrongRight(index)} data-tip={t("Goed of fout antwoord")}>
                                <span className={"btn correct" + (item.correct == "true" ? " right":"")} >
                                  <i className="fas fa-check"></i>
                                </span>
                                <ReactTooltip place="top" effect="solid" delayShow={200}   />
                              </span>

                              :''}
                              {(props.part.subtype == "checkboxes" || props.part.subtype == "checkboxes goed of fout" || props.part.subtype == "radio" || props.part.subtype == "radio goed of fout")  ?
                              <span className='checkbox_type showOnHover' onClick={() => toggleCheckboxType(index)}>
                                <span className={"btn edit" + (item.type == "other" ? "":" disabled")} data-tip={t("Anders namelijk")}>
                                  <i className="fas fa-pen"></i>
                                </span>
                              </span>
                              :''}

                            </td>

                            <td>
                              <span className="addd btn showOnHover grey" onClick={(e) => addItem(index, '')} data-tip={t("Voeg item toe")}><i className="fa fa-plus"></i></span>
                            </td>
                            <td>
                              {(items.length > 1 && props.part.subtype != "aanvulbare lijst") || (props.part.subtype == "aanvulbare lijst" && items.length > 0) ?
                                <span className="delete btn showOnHover" onClick={(e) => removeItem(index, e)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                                :''}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ReactTooltip place="top" effect="solid" delayShow={200}   />
            </li>
          )}
          {props.part.subtype == "aanvulbare lijst" ?
            <li className='gu-unselectable'>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div className="btn before"></div>
                    </td>
                    <td>

                      <label>
                        <ContentEditable
                            id={"addItem_" + props.part.index}
                            html={props.part.addItemText}
                            placeholder="Plaats tekst optie item toevoegen"
                            disabled={false}
                            className="input_no_bg"
                            onChange={(e) => props.updatePart(props.index, 'addItemText', e.target.value)}
                          />
                        </label>
                    </td>
                    <td>

                    </td>
                    <td>
                    <div className="btn edit" data-tip={t("Cursist kan zelf een item toevoegen middels deze knop")}>
                      <i className="fas fa-plus"></i>
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          :''}
        </ul>
        </div>
      </div>
      {props.part.type == "question_radio" || props.part.type == "question_checkboxes" || props.part.type == "select" ?
         <div className="extraOptions showOnHover">
           <CodeSet updatePart={props.updatePart} index={props.index} part={props.part} />
           <span className={"btn grey" + (props.must == true ? ' active':' hide')} onClick={e=>props.toggleMust()} data-tip={t("Verplicht")}>
             <i className="fas fa-asterisk"></i>
           </span>
          <span className={"btn grey" + (valuesOn == true ? ' active':' hide')} onClick={e=>toggleValueEdit()} data-tip={t("Waardes antwoorden")}>
            <i className="fas fa-sort-numeric-up-alt"></i>
          </span>
          {routingAvailable && (props.part.type == "question_radio" || props.part.type == "select") ?
            <span>
              <span data-tip={t("Routing")} className={"btn grey" + (routingOn == true ? ' active':' hide') + (routingIsUsed ? ' isRouting':'')} onClick={e=>toggleRoutingEdit()} >
                <i className="fas fa-route"></i>
              </span>
              <ReactTooltip place="top" effect="solid" delayShow={200}   />
            </span>
            :''}
          {select?
            <span className={"btn grey" + (listEdit ? ' active':'')} onClick={() => toggleListEdit()}  data-tip={t("Edit antwoorden")}>
              <i className="fas fa-pen"></i>
            </span>
            :''}
         </div>
      :''}
    </div>
  );
}

export default List;
