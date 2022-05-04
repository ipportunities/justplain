import React from "react";
import Wysiswg from './parts/wysiwyg.js';
import List from './parts/list.js';
import Quote from './parts/quote.js';
import Audio from './parts/audio.js';
import Video from './parts/video.js';
import Image from './parts/image.js';
//import QuestionCheckboxes from './parts/question_checkboxes.js';
import QuestionOpen from './parts/question_open.js';
import Select from './parts/select.js';
import Slider from './parts/slider.js';
import CustomElement from './parts/custom.js';
import Matrix from './parts/matrix.js';
import QuestionWithOptions from './parts/question_with_options.js';
import Special from './parts/special.js';
import Feedback from './parts/feedback.js';
import FeedbackQuestionnaire from './parts/feedback_questionnaire.js';
import Chart from './parts/chart.js';
import DatePicker from './parts/datepicker.js'
import Divider from './parts/divider.js';
import ImportFormWordpress from './parts/wordpress.js'

const GetPart = (props) => {

  let dynamicContent = "";

  switch(props.part.type) {
    case "wysiwyg":
      dynamicContent = <Wysiswg part={props.part} />;
      break;
    case "list":
      dynamicContent = <List part={props.part} answer={props.answer} updateAnswer={props.updateAnswer} />;
      break;
    case "quote":
      dynamicContent = <Quote part={props.part}/>;
    break;
    case "video":
      dynamicContent = <Video part={props.part}/>;
      break;
    case "audio":
      dynamicContent = <Audio part={props.part} index={props.index}/>;
      break;
    case "image":
      dynamicContent = <Image  part={props.part} />;
      //dynamicContent = test(props.part);
      break;
    case "question_open":
      dynamicContent = <QuestionOpen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
      break;
    //onderstaande nog testen
    case "select":
      dynamicContent = <Select part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />
      break;
    case "slider":
      dynamicContent = <Slider part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />
      break;
    case "custom":
      dynamicContent = <CustomElement part={props.part} updateAnswer={props.updateAnswer} answer={props.answer } />;
      break;
    case "matrix":
      dynamicContent = <Matrix part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
    break;
    case "question_checkboxes":
    case "question_radio":
      dynamicContent = <QuestionWithOptions part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
      break;
    case "special":
      dynamicContent = <Special part={props.part} index={props.index} part={props.part}/>;
      break;
    case "feedback":
      dynamicContent = <Feedback part={props.part} type={props.type} interventionSettings={props.interventionSettings} allAnswers={props.allAnswers} />;
      break;
    case "feedback_questionnaire":
      dynamicContent = <FeedbackQuestionnaire part={props.part} type={props.type} />;
      break;
    case "chart":
      dynamicContent = <Chart part={props.part} />;
      break;
    case "datepicker":
      dynamicContent = <DatePicker part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
      break;
    case "divider":
      dynamicContent = <Divider part={props.part} />;
      break;
    case "wordpress":
      dynamicContent = <ImportFormWordpress index={props.index} part={props.part} />;
      break;
  }

  return (
    <>
      {props.part.type != "form" ?
        <div className={"component" + (typeof props.part.padding == "undefined" || props.part.padding == "normal" ? '':' minimal-padding')}>
          {dynamicContent}
        </div>
        :false
      }
    </>

  )

}

export default GetPart;
