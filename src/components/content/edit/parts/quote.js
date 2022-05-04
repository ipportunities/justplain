import React   from 'react';
import EditorPart from './editor_part.js';
import InputTextfield from './input_textfield.js';
import {componentOptions} from "./helpers/options.js";
import t from "../../../translate";

const Quote = (props) => {

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Quote");
  });
  const available_subtypes = this_componentOptions[0].subtypes;
  const quoter = "Quoter";

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return (
    <div>
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>
      <div className="center">
        <div className={"quote " + props.part.subtype}>
          <EditorPart index={props.index} updatePart={props.updatePart} part_content={props.part.content} update_field="content" />

          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={quoter} className='input_no_bg quoter'/>
        </div>

      </div>
    </div>
  );
}

export default Quote;
