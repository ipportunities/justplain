import React, { useState, useEffect } from "react";
import t from "../../../components/translate";
import "./style.scss";
import uuid from "uuid";

const GezinInHuisPlaatsen = props => {

  const [names, setNames] = useState([])

  //////////////////////
  ///On init
  useEffect(() => {
    if(props.answer && Array.isArray(props.answer.names)){
      setNames(props.answer.names)
    }
  }, []);

  const updateNames = (tempNames) => {
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

  function dragStart(e, index){
    setActiveIndex(index)
    let house_bounds = document.getElementById("house").getBoundingClientRect();
    let member = document.getElementById("member_" + index).getBoundingClientRect();
    setStartClientX(e.clientX)
    setStartClientY(e.clientY)
  }

  function drop(e){
    let house_bounds = document.getElementById("house").getBoundingClientRect();
    let member = document.getElementById("member_" + activeIndex).getBoundingClientRect();

    let left = ((e.clientX - startClientX + member.left - house_bounds.left - 10) / document.getElementById("house").clientHeight) * 100;
    let top = ((e.clientY - startClientY + member.top - house_bounds.top)  / document.getElementById("house").clientHeight) * 100;

    let tempNames = [...names]
    tempNames[activeIndex].position = [left, top]
    updateNames(tempNames)
  }
  function allowDrop(e){
    e.preventDefault()
  }

  return (
    <div className="gezin_in_huis">
      <div id="house" className="circle" onDrop={(e)=>drop(e)} onDragOver={(e)=>allowDrop(e)}>
        {names.map((name, index) =>
          <div
            id={"member_" + index}
            key={index}
            className={"circle_name dcn_cursor " + name.sex + "_" + name.age}
            draggable="true"
            onDragStart={(e) => dragStart(e, index)}
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
    </div>
  );
};

export default GezinInHuisPlaatsen;
