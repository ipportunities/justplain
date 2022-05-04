import React, {useState, useEffect} from 'react';
import Wysiswg from '../wysiwyg.js';
import QuestionWithOptions from '../question_with_options.js';
import QuestionOpen from '../question_open.js';
import List from '../list.js';
import Video from '../video.js';
import Audio from '../audio.js';
import Image from '../image.js';
import Divider from '../divider.js';
import Quote from '../quote.js';
import Special from '../special.js';
import Feedback from '../feedback.js';
import Chart from '../chart.js';
import Select from '../select.js';
import Matrix from '../matrix.js'
import Slider from '../slider.js'
import CustomElement from '../custom.js'
import Forms from '../forms.js'
import DatePicker from '../datepicker.js'
import ImportFormWordpress from '../wordpress.js'

const CoursesFrontContent = (props) => {
  
  const [dynamicContent, setDynamicContent] = useState(<></>)

  useEffect(() => {

    switch(props.part.type) {
      case "wysiwyg":
        setDynamicContent(<Wysiswg part={props.part} />)
        break;
      case "question_open":
        setDynamicContent(<QuestionOpen index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>)
        break;
      case "list":
        setDynamicContent(<List index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />)
        break;
      case "select":
        setDynamicContent(<Select index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>)
        break;
      case "slider":
        setDynamicContent(<Slider index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>)
        break;
      case "custom":
        setDynamicContent(<CustomElement index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} intervention_id={props.intervention_id} pagesHistory={props.pagesHistory} updatePageHistory={props.updatePageHistory}/>)
        break;
      case "form":
        //setDynamicContent(<Forms index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} intervention_id={props.intervention_id} type={props.type} currentPageIndex={props.currentPageIndex}  allPart={props.allPart} lastAction={props.lastAction} includeLevel={props.includeLevel} />)
        break;
      case "matrix":
        setDynamicContent(<Matrix index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer}/>)
      break;
      case "question_radio":
      case "question_checkboxes":
        setDynamicContent(<QuestionWithOptions index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>)
        break;
      case "video":
        setDynamicContent(<Video part={props.part}/>)
        break;
      case "audio":
        setDynamicContent(<Audio part={props.part}/>)
        break;
      case "image":
        setDynamicContent(<Image  part={props.part} />)
        break;
      case "divider":
        setDynamicContent(<Divider part={props.part} />)
        break;
      case "quote":
        setDynamicContent(<Quote part={props.part}/>)
      break;
      case "special":
        setDynamicContent(<Special part={props.part}/>)
        break;
      case "feedback":
        setDynamicContent(<Feedback part={props.part} type={props.type} interventionSettings={props.interventionSettings} allAnswers={props.allAnswers}/>)
        break;
      case "chart":
        setDynamicContent(<Chart part={props.part}/>)
        break;
      case "datepicker":
        setDynamicContent(<DatePicker index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>)
        break;
      case "wordpress":
        setDynamicContent(<ImportFormWordpress index={props.index} part={props.part} />)
        break;
    }

  }, props)

  return (
    dynamicContent
  )
}
export default CoursesFrontContent
