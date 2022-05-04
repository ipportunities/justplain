import React from 'react';
import List from './list.js';
import InputTextfield from './input_textfield.js';
import t from "../../../translate";

const QuestionCheckboxes = (props) => {

  return(
    <div className={props.part.type}>
      <div className="center">
        <div className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must}/>
        </div>
      </div>
      <List index={props.index} part={props.part} updatePart={props.updatePart} parts={props.parts} must={props.must} toggleMust={props.toggleMust}/>
    </div>
  )
}

export default QuestionCheckboxes;
