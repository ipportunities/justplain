import React, {useState, useEffect} from 'react';
import ContentEditable from 'react-contenteditable';
import {getQuestion} from "./helpers/functions.js";

const QuestionOpen = (props) => {

  //const [empty, setEmpty] = useState('')

  /*
  useEffect(() => {
    if(props.answer == '' && props.part.must && !props.nextAllowed){
      setEmpty(' empty')
    } else {
      setEmpty('')
    }

  }, [props]);
  */

  return (
    <div className={"question_open" + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          {getQuestion(props.part)}
        </div>
        {props.part.subtype == "tekstvlak" ?
          <ContentEditable
              //innerRef={props.focus !== false && typed == false ? focus:false}
              html={props.answer}
              id={props.part.id}
              placeholder={props.placeholder}
              disabled={props.hasOwnProperty("disabled") && props.disabled === "true" ? true:false}
              onChange={(e) =>   props.updateAnswer(props.part.id, e.target.value)}
              className="textarea"
            />
          :
        ''}
        {props.part.subtype == "tekstveld" ? <input id={props.part.id} type="text" onChange={(e) => props.updateAnswer(props.part.id, e.target.value)} value={props.answer} disabled={props.hasOwnProperty("disabled") && props.disabled === "true" ? true:false}/>:''}
      </div>
    </div>
  );
}

export default QuestionOpen;
