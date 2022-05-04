import React from 'react';
import List from './list.js';
import {getQuestion} from "./helpers/functions.js";

const QuestionWithOptions = (props) => {

  return(
    <div className={props.part.type + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          {getQuestion(props.part)}
        </div>
      </div>
      <List part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? "true" : "false"} />
    </div>
  )
}

export default QuestionWithOptions;
