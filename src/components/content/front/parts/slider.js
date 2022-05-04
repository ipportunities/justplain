import React, { useState, useEffect } from "react";
import parse from 'html-react-parser';
import {getQuestion} from "./helpers/functions.js";

const Slider = props => {

  const [min, setMin] = useState("0");
  const [max, setMax] = useState("10");
  const [rangeMin, setRangeMin] = useState("0");
  const [rangeMax, setRangeMax] = useState("10");
  const [chosen, setChosen] = useState(0)
  const [wasEmpty, setWasEmpty] = useState(true)
  const [empty, setEmpty] = useState('')

  //////////////////////
  ///Get content
  //////////////////////
  useEffect(() => {

    if(typeof props.part.min !== "undefined" && props.part.min != "")
    {
      setMin(props.part.min);
    }
    if(typeof props.part.max !== "undefined" &&props.part.max != "")
    {
      setMax(props.part.max);
    }
    if(typeof props.part.rangeMin !== "undefined" && props.part.rangeMin != "")
    {
      setRangeMin(props.part.rangeMin);
    }
    if(typeof props.part.rangeMax !== "undefined" && props.part.rangeMax != "")
    {
      setRangeMax(props.part.rangeMax);
      let initialValue = props.answer;
      if(initialValue == "")
      {
        ///halve stappen voorkomen
        initialValue = Math.ceil((props.part.rangeMax - props.part.rangeMin) / 2)
      }
      setChosen(initialValue)
      positionValueBullet(initialValue, props.part.rangeMax, props.part.rangeMin)
    }
    if(props.answer){
      setWasEmpty(false)
    }
    if(props.resetSetWasEmpty && props.answer == ""){
      setWasEmpty(true)
    }

    window.addEventListener('resize', positionValueBulletChosen)
  }, [props]);

  function positionValueBulletChosen(){
    /// check is nodig ander loopt die vast aan de kant van de coach
    if(document.getElementById("range_" + props.index)){
        positionValueBullet(document.getElementById("range_" + props.index).value, rangeMax, rangeMin)
    }

  }

  const [offsetLeft, setOffsetLeft] = useState(0)
  function positionValueBullet(value, rangeMaxx, rangeMinn) {
    let tempOffsetLeft = ((value - rangeMinn)/(rangeMaxx - rangeMinn) * (document.getElementById("range_" + props.index).offsetWidth - 22)) + 'px';
    setOffsetLeft(tempOffsetLeft)
  }

  function updateSliderAnswer(value){
    props.updateAnswer(props.part.id, value)
    setWasEmpty(false)
    setChosen(value)
    setEmpty('')
    positionValueBullet(value, rangeMax)
  }

  return(
    <div className={"slider" + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          {getQuestion(props.part)}
        </div>
        <span className="rs-label" style={{'left':offsetLeft}}>{wasEmpty ? '':chosen}</span>
        <input id={'range_' + props.index} type="range" min={rangeMin} max={rangeMax} onChange={(e) => updateSliderAnswer(e.target.value)} value={chosen}  disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? true : false}/>
        <table className="min_max">
          <tbody>
            <tr>
              <td>
                {parse(min)}
              </td>
              <td>
                {parse(max)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Slider
