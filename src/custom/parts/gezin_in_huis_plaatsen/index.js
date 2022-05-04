import React, { useState, useEffect, useCallback } from "react";
import t from "../../../components/translate";
import "./style.scss";
import uuid from "uuid";
import NotificationBox from "../../../components/alert/notification";

const GezinInHuisPlaatsen = props => {

  const [names, setNames] = useState([])
  const [notificationOptions, setNotificationOptions] = useState('');
  const [eventHandlerSet, setEventHandlerSet] = useState(false);

  //////////////////////
  ///On init
  useEffect(() => {
    if(props.answer && Array.isArray(props.answer.names)){
      setNames(props.answer.names)
      handleNextButton(props.answer.names)
    } else {
      handleNextButton([])
    }
  }, []);

  ///hiermee wordt de next button afgevang het lijkt te werken....
  useEffect(() => {
    var next_button = document.getElementsByClassName("next");

    if(next_button.length > 0){
      if(eventHandlerSet){
        next_button[0].addEventListener('click', showNotification, true)
      } else {
        next_button[0].removeEventListener("click", showNotification, true)
      }
    }

    return () => next_button[0].removeEventListener("click", showNotification, true)
  }, [eventHandlerSet]);

  const handleNextButton = (tempNames) => {
    var next_button = document.getElementsByClassName("next");
    var prev_button = document.getElementsByClassName("prev");

    let parent = false;
    let child = false;

    ////check of er een gezin is opgegeven
    for(let i = 0 ; i < tempNames.length ; i++){
      if(tempNames[i].age == "small"){
        child = true;
      }
      if(tempNames[i].age == "big"){
        parent = true;
      }
    }

    if(!parent || !child){
      if(!eventHandlerSet){
        setEventHandlerSet(true)
      }
    } else {
      setEventHandlerSet(false)
    }

    if(prev_button.length > 0){
      prev_button[0].addEventListener('click', function(e){
        next_button[0].removeEventListener("click", showNotification, true)
      }, false)
    }
  }

  const showNotification = useCallback((e) => {
    setNotificationOptions({
      show: "true",
      text: t("Plaats je gezin in het huis."),
      confirmText: t("Ok")
    });
    e.stopPropagation()
  });

  const updateNames = (tempNames) => {
    handleNextButton(tempNames)
    props.updateAnswer(props.part.id, {koppel_id:"c_1", names:tempNames})
    setNames(tempNames)
  }

  // creates a new text box to fill in
  function add(sex, age)
  {
    let tempNames = [...names]

    var next_offset = names.length;
    /*
  	var max_names = 12;
  	if(next_offset >= max_names)
  	{
  		alert("Je kunt maximaal " + max_names + " personen invullen.");
  		return false;
  	}
    */

  	var posx = 5 + (2 * next_offset);
  	var posy = 5 + (2 * next_offset);

  	tempNames[next_offset] = {name:"", position:[posx, posy], sex:sex, age:age, id:uuid.v4()};

  	updateNames(tempNames);
  }

  function updateName(index, value)
  {
    let tempNames = [...names]
    tempNames[index].name = value
  	updateNames(tempNames)
  }
  function deleteName(index)
  {
  	let tempNames = [...names]
    tempNames.splice(index, 1);
  	updateNames(tempNames)
  }

  const [activeIndex, setActiveIndex] = useState(false)
  const [startClientX , setStartClientX] = useState(false)
  const [startClientY , setStartClientY] = useState(false)

  ////////////drag and drop mobile heeft nog aandacht nodig
  function dragStart(e, index){
    setActiveIndex(index)
    let house_bounds = document.getElementById("house").getBoundingClientRect();
    let member = document.getElementById("member_" + index).getBoundingClientRect();

    if ( e.type === "touchstart") {
      let touch = e.touches[0] || e.changedTouches[0];
      e.preventDefault();
      setStartClientX(touch.pageX)
      setStartClientY(touch.pageY)
    } else {
      setStartClientX(e.clientX)
      setStartClientY(e.clientY)
    }

  }

  function drop(e){
    let house_bounds = document.getElementById("house").getBoundingClientRect();
    let member = document.getElementById("member_" + activeIndex).getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ( e.type === "touchend") {
      let touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.pageX
      clientY = touch.pageY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    let left = ((clientX - startClientX + member.left - house_bounds.left - 5) / document.getElementById("house").clientHeight) * 100;
    let top = ((clientY - startClientY + member.top - house_bounds.top)  / document.getElementById("house").clientHeight) * 100;

    let tempNames = [...names]
    tempNames[activeIndex].position = [left, top]
    updateNames(tempNames)
  }
  function allowDrop(e){
    e.preventDefault()
  }
  function touchMove(e){
    e.preventDefault()
  }

  return (
    <div className="gezin_in_huis">
      <div id="house" className="circle"
        onDrop={(e)=>drop(e)}
        onDragOver={(e)=>allowDrop(e)}
        onTouchEnd={(e)=>drop(e)}
        >
        {names.map((name, index) =>
          <div
            id={"member_" + index}
            key={index}
            className={"circle_name dcn_cursor " + name.sex + "_" + name.age}
            draggable="true"
            onDragStart={(e) => dragStart(e, index)}
            onTouchStart={(e) => dragStart(e, index)}
            onTouchMove={(e) => touchMove(e, index)}
            style={{
              left:name.position[0] + "%",
              top:name.position[1] + "%"
            }}>
            <table className="name">
              <tbody>
                <tr>
                  <td>
                    <input type="text" value={name.name} onChange={(e)=>updateName(index, e.target.value)} />
                  </td>
                  <td>
                    <i className="fas fa-times" onClick={()=>deleteName(index)}></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="tdnames_list">
        <div className="intro">
          {t("Klik op het poppetje om het in het kader te krijgen.")}
        </div>
        <div className="options">
          <div className="add" onClick={()=>add('man', 'big')}>
            <img src={require('./images/family_man_big.png')} alt="volwassene man"/>
          </div>
          <div className="add" onClick={()=>add('woman', 'big')}>
            <img src={require('./images/family_woman_big.png')} alt="volwassene vrouw" />
          </div>
          <div className="add" onClick={()=>add('man', 'small')}>
            <img src={require('./images/family_man_small.png')} alt="volwassene man" />
          </div>
          <div className="add" onClick={()=>add('woman', 'small')}>
            <img src={require('./images/family_woman_small.png')} alt="volwassene vrouw" />
          </div>
        </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  );
};

export default GezinInHuisPlaatsen;
