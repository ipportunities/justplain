import React   from 'react';
import { Editor } from '@tinymce/tinymce-react';
import InputTextfield from './input_textfield.js';
import {componentOptions} from "./helpers/options.js";
import ReactTooltip from 'react-tooltip'
import CodeSet from "./helpers/codeSet.js";
import t from "../../../translate";

const QuestionOpen = (props) => {

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Open vraag");
  });
  const available_subtypes = this_componentOptions[0].subtypes;
  const text_text = "";

  props.part.question = props.part.question == "" ? text_text : props.part.question

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return (
    <div className="question_open">
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>

      <div className="center">
        <div className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must}/>
        </div>
        {props.part.subtype == "tekstvlak" ? <textarea readOnly></textarea>:''}
        {props.part.subtype == "tekstveld" ? <input type="text" value='' readOnly />:''}
      </div>
      <ReactTooltip place="top" effect="solid" delayShow={200}   />

      <div className="extraOptions showOnHover">
        <CodeSet updatePart={props.updatePart} index={props.index} part={props.part} />
        <span className={"btn grey" + (props.must == true ? ' active':' hide')} onClick={e=>props.toggleMust()} data-tip={t("Verplicht")}>
          <i className="fas fa-asterisk"></i>
        </span>
      </div>
    </div>
  );
}

export default QuestionOpen;
