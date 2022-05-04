import React, { useState, useEffect, useCallback } from "react";
import t from "../../../components/translate";
import "./style.scss";
import { useSelector } from "react-redux";
import uuid from "uuid";
import NotificationBox from "../../../components/alert/notification";

const Netwerk = props => {

  const allAnswers = useSelector(state => state.answersLessons);

  const [family, setFamily] = useState(false)
  const [familyNotInCircle, setFamilyNotInCircle] = useState([])
  const [inCircle, setInCircle] = useState([])
  const [inCircleSet, setInCircleSet] = useState(false)
  const [notificationOptions, setNotificationOptions] = useState('');
  const [eventHandlerSet, setEventHandlerSet] = useState(false);

  useEffect(() => {
    if(props.answer && Array.isArray(props.answer.inCircle)){
      setInCircle(props.answer.inCircle)
      handleNextButton(props.answer.inCircle)
    } else {
      setInCircle([])
      handleNextButton([])
    }
    setInCircleSet(true)
  }, [props.answer]);

  useEffect(() => {
    for(let i = 0 ; i < allAnswers.answers.length ; i++){
      for(let ii = 0 ; ii < allAnswers.answers[i].answers.length ; ii++){
        if(allAnswers.answers[i].answers[ii].answer.koppel_id == "c_1"){
          setFamily(allAnswers.answers[i].answers[ii].answer.names);
          break;
        }
      }
    }
  }, [allAnswers]);


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

  const handleNextButton = (tempInCircle) => {
    var next_button = document.getElementsByClassName("next");
    var prev_button = document.getElementsByClassName("prev");

    if(tempInCircle.length == 0){
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
      text: t("Vul het netwerk."),
      confirmText: t("Ok")
    });
    e.stopPropagation()
  });

  ///hier gaan we na laden onnodig doorheen eigenlijk...
  useEffect(() => {
    if(family !== false && inCircleSet){
      let tempInCircle = [...inCircle]
      let tempFamilyNotInCircle = []
      let familyIds = []

      ///ga na wie van de familie nog niet in de cirkel is geplaatst
      for(let i = 0 ; i < family.length ; i++){
        let this_inCircle_obj = tempInCircle.filter(function (inC) {
          return inC.id === family[i].id
        });
        let this_inCircle_obj_index = tempInCircle.indexOf(this_inCircle_obj[0]);

        if(this_inCircle_obj_index == -1){
          tempFamilyNotInCircle.push(family[i])
        } else {
          familyIds.push(family[i].id)
          ///find tempincircle with id
          tempInCircle[this_inCircle_obj_index].type = 'family'
        }
      }
      setFamilyNotInCircle(tempFamilyNotInCircle)

      ///ga na of in circle familie nog wel familie is zo niet verwijder
      for(let i = 0 ; i < inCircle.length ; i++){
        if(inCircle[i].type == "family"){
          let this_family_obj = family.filter(function (member) {
            return member.id === inCircle[i].id
          });
          let this_family_obj_index = family.indexOf(this_family_obj[0]);

          if(this_family_obj_index == -1){
            tempInCircle.splice(i, 1)
          }
        }
      }

      setInCircle(tempInCircle)
    }

  }, [family, inCircleSet]);

  function addFamily(index){
    let tempInCircle = [...inCircle]
    let tempFamilyNotInCircle = [...familyNotInCircle]

    var next_offset = inCircle.length;

    var posx = 5 + (2 * next_offset);
    var posy = 5 + (2 * next_offset);

    tempFamilyNotInCircle[index].type = "family"
    tempFamilyNotInCircle[index].position = [posx, posy]
    tempInCircle[next_offset] = tempFamilyNotInCircle[index];

    tempFamilyNotInCircle.splice(index, 1)

    updateInCircle(tempInCircle);
    setFamilyNotInCircle(tempFamilyNotInCircle);
  }

  function addOther(sex, age)
  {
    let tempInCircle = [...inCircle]

    var next_offset = inCircle.length;

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

  	tempInCircle[next_offset] = {name:"", position:[posx, posy], sex:sex, age:age, id:uuid.v4(), type:"other"};

  	updateInCircle(tempInCircle);
  }

  function updateName(index, value)
  {
    let tempInCircle = [...inCircle]
    tempInCircle[index].name = value
  	updateInCircle(tempInCircle)
  }
  function deleteName(index, name)
  {
  	let tempInCircle = [...inCircle]
    tempInCircle.splice(index, 1);

  	updateInCircle(tempInCircle)

    if(name.type == "family"){
      let tempFamilyNotInCircle = [...familyNotInCircle]
      tempFamilyNotInCircle.push(name)
      setFamilyNotInCircle(tempFamilyNotInCircle)
    }
  }

  const updateInCircle = (tempInCircle) => {
    handleNextButton(tempInCircle)
    props.updateAnswer(props.part.id, {koppel_id:props.koppel_id, inCircle:tempInCircle})
    setInCircle(tempInCircle)
  }

  const [activeIndex, setActiveIndex] = useState(false)
  const [startClientX , setStartClientX] = useState(false)
  const [startClientY , setStartClientY] = useState(false)

  function dragStart(e, index){
    setActiveIndex(index)
    let person_circle_bounds = document.getElementById("person_circle").getBoundingClientRect();
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
    let person_circle_bounds = document.getElementById("person_circle").getBoundingClientRect();
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

    let left = ((clientX - startClientX + member.left - person_circle_bounds.left - 10) / document.getElementById("person_circle").clientHeight) * 100;
    let top = ((clientY - startClientY + member.top - person_circle_bounds.top)  / document.getElementById("person_circle").clientHeight) * 100;

    let tempInCircle = [...inCircle]
    tempInCircle[activeIndex].position = [left, top]
    updateInCircle(tempInCircle)
  }
  function allowDrop(e){
    e.preventDefault()
  }
  function touchMove(e){
    e.preventDefault()
  }

  return(
    <div className="netwerk">
      <h1>{props.title}</h1>
      <div id="person_circle" className="person_circle"
        onDrop={(e)=>drop(e)}
        onDragOver={(e)=>allowDrop(e)}
        onTouchEnd={(e)=>drop(e)}>
        {inCircle.map((name, index) =>
          <div
            id={"member_" + index}
            key={index}
            className={"circle_name " + name.sex + "_" + name.age + " " + name.type}
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
                    {name.type == 'other' ?
                      <input type="text" value={name.name} onChange={(e)=>updateName(index, e.target.value)} />
                      :
                      name.name
                    }
                  </td>
                  <td onClick={()=>deleteName(index, name)}>
                    <i className="fas fa-times" ></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
			</div>
      {familyNotInCircle.length > 0 ?
        <>
          <div className="intro">
            {t("Mijn gezinsleden")}
            <div className="help">
              {t("(klik om in de cirkel te krijgen)")}
            </div>
          </div>
          <div className="family_to_add">
            {familyNotInCircle.map((name, index) =>
              <div
                key={index}
                className={"circle_name member " + name.sex + "_" + name.age}
                onClick={()=>addFamily(index)}>
                <div className="name">
                  {name.name}
                </div>
              </div>
            )}
          </div>
        </>
        :false}
      <div className='intro'>
        {t("Andere mensen")}
        <div className="help">
          {t("(klik om in de cirkel te krijgen)")}
        </div>
      </div>
			<div className="others">
        <div className="member" onClick={()=>addOther('man', 'big')}></div>
        <div className="member woman_big" onClick={()=>addOther('woman', 'big')}></div>
        <div className="member man_small" onClick={()=>addOther('man', 'small')}></div>
        <div className="member woman_small" onClick={()=>addOther('woman', 'small')}></div>
			</div>

      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )
}

export default Netwerk
