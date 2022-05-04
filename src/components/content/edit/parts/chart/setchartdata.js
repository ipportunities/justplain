import React, {useState, useEffect} from 'react';
import ContentEditable from 'react-contenteditable';
import uuid from "uuid";
import InputTextfield from '../input_textfield.js';
import ReactTooltip from 'react-tooltip'
import t from "../../../../translate";

const SetChartData = (props) => {

  const [draggedElIndex, setDraggedElIndex] = useState('');
  const [droppedElIndex, setDroppedElIndex] = useState('');

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
    let newItems = props.items;
    let element = newItems[e.currentTarget.getAttribute('index')];
    newItems.splice(e.currentTarget.getAttribute('index'), 1);
    newItems.splice(draggedElIndex, 0, element);
    props.setITems(newItems)
    props.setData()
    setDraggedElIndex(e.currentTarget.getAttribute('index'));
    e.stopPropagation();
    e.preventDefault();
  }
  function drop(e){
    props.updatePart(props.index, 'items', props.items)
    removeDropClass()
    for(let i = 0 ; i < props.items.length ; i++)
    {
      var element = document.getElementById("item_" + props.items[i].id);
      element.setAttribute('draggable', "false")
      element.classList.remove("isDragged");
    }
  }
  function removeDropClass()
  {
    for(let i = 0 ; i < props.items.length ; i++)
    {
      var element = document.getElementById("item_" + props.items[i].id);
      element.classList.remove("drop_here");
    }
  }
  function activeDragAndDrop(){
    ReactTooltip.hide()
    for(let i = 0 ; i < props.items.length ; i++)
    {
      var element = document.getElementById("item_" + props.items[i].id);
      element.setAttribute('draggable', "true")
    }
  }

  //////////////////////
  ///Update Item
  function updateItem(index, value, type){
    let items = props.part.items;
    if(type == 'content')
    {
      items[index].content = value;
    } else {
      items[index].value = value;
    }
    props.updatePart(props.index, 'items', items)
    props.setData()
  }
  //////////////////////
  ///Add Item
  function addItem (userInput) {
    let items = props.part.items;
    items.push({content:'', value:'', id:uuid.v4()});
    props.updatePart(props.index, 'items', items)
  }
  //////////////////////
  ///Remove Item
  function removeItem (index) {
    let items = props.part.items;
    items.splice(index, 1);
    props.updatePart(props.index, 'items', items)
  }


  return (
    <div className="setData">

      <i className="fas fa-times close" onClick={() => props.closeChartEditContent()}></i>
      <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Naam chart" className="chart_title"/>
      <br/>
      <table className='label'>
        <tbody>
          <tr>
            <td className="small">
              Label items
            </td>
            <td className="small">
              Label waardes
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td>
              <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Label items"  updateField='label_items'/>
            </td>
            <td>
              <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Label waardes" updateField='label_value'/>
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <br/>
      <table className='label'>
        <tbody>
          <tr>
            <td>
              Items
            </td>
            <td>
              Waardes
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <div className="items">
        {(props.items.length > 0) ? props.items.map((item, index) =>
          <div className="item" id={"item_" + item.id} key={index} onDragStart={(e) => dragStart(e)} onDragEnd={(e) => drop(e)} onDrop={(e) => drop(e)} onDragOver={(e) => dragOver(e)} index={index} onDragEnd={(e) => dragEnd(e)}>
          <table>
            <tbody>
              <tr>
                <td>
                  <ContentEditable
                      html={item.content}
                      placeholder="Label"
                      disabled={false}
                      onChange={(e) => updateItem(index, e.target.value, 'content')}
                      className="input_no_bg"
                      type="number"
                    />
                </td>

                <td>
                  <ContentEditable
                      html={item.value}
                      placeholder="Waarde"
                      disabled={false}
                      onChange={(e) => updateItem(index, e.target.value, 'value')}
                      className="input_no_bg"
                    />
                </td>
                <td>
                <span className="btn handle" data-tip={t("Sorteer")} onMouseDown={e => activeDragAndDrop()}>
                  <i className="fas fa-expand-arrows-alt"></i>
                </span>
                </td>
                <td>
                  <span className="delete btn" onClick={(e) => removeItem(index, e)} data-tip={t("Verwijder item")}><i className="fa fa-minus" ></i></span>
                </td>
              </tr>
            </tbody>
          </table>
          <ReactTooltip place="top" effect="solid" delayShow={200}   />
          </div>
        ):''}
      </div>
      <br/>
      <span className="btn btn-primary add" onClick={() => addItem()}>Add item<i className="fa fa-plus"></i></span>
    </div>
  );
}

export default SetChartData;
