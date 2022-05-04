import React, { useState, useEffect } from "react";
import InputTextfield from '../input_textfield.js';
import ContentEditable from "react-contenteditable";
import t from "../../../../translate";

const Slider = props => {

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);

  //////////////////////
  ///Get content
  //////////////////////
  useEffect(() => {

    if(props.part.min != "")
    {
      setMin(props.part.min);
    }
    if(props.part.max != "")
    {
      setMax(props.part.max);
    }
  }, []);

  function updateMin(min){
    if(!isNaN(min)){
      setMin(min)
      props.updatePart(props.index, "min", min);
    }

  }
  function updateMax(max){
    if(!isNaN(max)){
      setMax(max)
      props.updatePart(props.index, "max", max);
    }
  }
  function chosenValue(chosen){
    props.updatePart(props.index, "chosen", chosen);
  }


  return(
    <div className="slider">

      <div className="question">
        <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} />
      </div>
      <table className="min_max">
        <tbody>
          <tr>
            <td>
              <ContentEditable
                html={min}
                disabled={false}
                onChange={e => updateMin(e.target.value)}
                className=""
                placeholder="Min"
              />
            </td>
            <td>
              <ContentEditable
                html={max}
                disabled={false}
                onChange={e => updateMax(e.target.value)}
                className=""
                placeholder="Max"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <input type="range" min={min} max={max} onChange={e => chosenValue(e.target.value)}/>
    </div>
  )
}

export default Slider
