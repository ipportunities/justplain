import React, { useState, useEffect } from "react";
import InputTextfield from './input_textfield.js';
import ContentEditable from "react-contenteditable";
import t from "../../../translate";
import CodeSet from "./helpers/codeSet.js";

const Slider = props => {

  const [min, setMin] = useState("0");
  const [max, setMax] = useState("10");
  const [rangeMin, setRangeMin] = useState("0");
  const [rangeMax, setRangeMax] = useState("10");

  //////////////////////
  ///Get content
  //////////////////////
  useEffect(() => {
    if(typeof props.part.min !== "undefined" && props.part.min != "")
    {
      setMin(props.part.min);
    }
    if(typeof props.part.max !== "undefined" && props.part.max != "")
    {
      setMax(props.part.max.toString());
    }
    if(typeof props.part.rangeMin !== "undefined" && props.part.rangeMin != "")
    {
      setRangeMin(props.part.rangeMin);
    }
    if(typeof props.part.rangeMax !== "undefined" &&props.part.rangeMax != "")
    {
      setRangeMax(props.part.rangeMax);
    }
  }, []);

  function updateMin(min){
    setMin(min)
    props.updatePart(props.index, "min", min);
  }
  function updateMax(max){
    setMax(max)
    props.updatePart(props.index, "max", max);
  }
  function chosenValue(chosen){
    //props.updatePart(props.index, "chosen", chosen);
  }

  function updateSettings(value, type) {
    ///todo nog checken of dit een nummer is
    if (type == "min") {
      setRangeMin(value)
      props.updatePart(props.index, "rangeMin", value);
    }
    if (type == "max") {
      setRangeMax(value)
      props.updatePart(props.index, "rangeMax", value);
    }
  }

  return(
    <div className="slider center">

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
      <input type="range" min={rangeMin} max={rangeMax} onChange={e => chosenValue(e.target.value)}/>

      <div className="extraOptions showOnHover">
         <CodeSet updatePart={props.updatePart} index={props.index} part={props.part} />
         <span className={"btn grey" + (props.must == true ? ' active':' hide')} onClick={e=>props.toggleMust()} data-tip={t("Verplicht")}>
           <i className="fas fa-asterisk"></i>
         </span>
        <div className="settings">
          <i className="fas fa-sliders-h"></i>
          <input
            type="number"
            value={rangeMin}
            onChange={e => updateSettings(e.target.value, "min")}
            placeholder="Min"
            min={1}
          />
          x
          <input
            type="number"
            value={rangeMax}
            onChange={e => updateSettings(e.target.value, "max")}
            placeholder="Max"
            min={1}
          />
        </div>
      </div>
    </div>
  )
}

export default Slider
