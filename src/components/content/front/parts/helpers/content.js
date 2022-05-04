import React from 'react';
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
  var dynamicContent = "";
  switch(props.part.type) {
    case "wysiwyg":
      dynamicContent = <Wysiswg part={props.part} />;
      break;
    case "question_open":
      dynamicContent = <QuestionOpen index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>;
      break;
    case "list":
      dynamicContent = <List index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
      break;
    case "select":
      dynamicContent = <Select index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>
      break;
    case "slider":
      dynamicContent = <Slider index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>
      break;
    case "custom":
      dynamicContent = <CustomElement index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} intervention_id={props.intervention_id} pagesHistory={props.pagesHistory} updatePageHistory={props.updatePageHistory}/>;
      break;
    case "form":
      //dynamicContent = <Forms index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} intervention_id={props.intervention_id} type={props.type} currentPageIndex={props.currentPageIndex}  allPart={props.allPart} lastAction={props.lastAction} includeLevel={props.includeLevel} />;
      break;
    case "matrix":
      dynamicContent = <Matrix index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer}/>;
    break;
    case "question_radio":
    case "question_checkboxes":
      dynamicContent = <QuestionWithOptions index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>;
      break;
    case "video":
      dynamicContent = <Video part={props.part}/>;
      break;
    case "audio":
      dynamicContent = <Audio part={props.part}/>;
      break;
    case "image":
      dynamicContent = <Image  part={props.part} />;
      break;
    case "divider":
      dynamicContent = <Divider part={props.part} />;
      break;
    case "quote":
      dynamicContent = <Quote part={props.part}/>;
    break;
    case "special":
      dynamicContent = <Special part={props.part}/>;
      break;
    case "feedback":
      dynamicContent = <Feedback part={props.part} type={props.type} interventionSettings={props.interventionSettings} allAnswers={props.allAnswers}/>;
      break;
    case "chart":
      dynamicContent = <Chart part={props.part}/>;
      break;
    case "datepicker":
      dynamicContent = <DatePicker index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>;
      break;
    case "wordpress":
      dynamicContent = <ImportFormWordpress index={props.index} part={props.part} />;
      break;
  }

  return (
    dynamicContent
  )
}
export default CoursesFrontContent
