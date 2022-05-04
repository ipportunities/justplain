import React   from 'react';
import t from "../../../translate";
import List from './list.js';
import InputTextfield from './input_textfield.js';

const QuestionRightOrWrong = (props) => {

  return(
    <div className={props.part.type + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must}/>
        </div>
      </div>
      <List index={props.index} part={props.part} updatePart={props.updatePart} parts={props.parts} must={props.must} toggleMust={props.toggleMust}/>
    </div>
  )
}

export default QuestionRightOrWrong;
