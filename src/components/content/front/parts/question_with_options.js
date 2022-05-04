import React from 'react';
import List from './list.js';
import parse from 'html-react-parser';

const QuestionWithOptions = (props) => {
  return(
    <div className={props.part.type + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          {parse(props.part.question)} {props.part.must?"*":""}
        </div>
      </div>
      <List part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? "true" : "false"} />
    </div>
  )
}

export default QuestionWithOptions;
