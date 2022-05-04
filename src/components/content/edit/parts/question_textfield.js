import React from 'react';
import InputTextfield from './input_textfield.js';
import t from "../../../translate";

const QuestionTextfield = (props) => {
  return (
    <div>
      <h4>Vraag</h4>
      <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} />

      <input type="text" value="" disabled/>
    </div>
  );
}

export default QuestionTextfield;
