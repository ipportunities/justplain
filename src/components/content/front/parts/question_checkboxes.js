import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import List from './list.js';
import parse from 'html-react-parser';
import { setActiveIntervention } from '../../../../actions';

const QuestionCheckboxes = (props) => {
  
  //const [empty, setEmpty] = useState('');

  useEffect(() => {
    /*
    if( (typeof props.answer.chosenAnswers != "undefined" && props.answer.chosenAnswers.length == 0 && props.part.must && !props.nextAllowed) || (typeof props.answer.chosenAnswers == "undefined" && !props.nextAllowed)){
      setEmpty(' empty')
    } else {
      setEmpty('')
    }
    */
  }, [props]);

  return(
    <div className={props.part.type + (props.part.must ? ' must':'')}>
      <div className="center">
        <div className="question">
          {parse(props.part.question)}
        </div>
      </div>
      <List part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? "true" : "false"} />
    </div>
  )
}

export default QuestionCheckboxes;
