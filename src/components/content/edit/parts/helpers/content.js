import React, {useState, useEffect} from 'react';
import Wysiswg from '../wysiwyg.js';
import QuestionRightOrWrong from '../question_right_or_wrong.js';
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
import Matrix from '../matrix.js';
import Slider from '../slider.js';
import CustomElements from '../custom.js';
import Forms from '../forms.js';
import Goals from '../goal.js';
import DatePicker from "../datepicker.js";
import ImportFormWordpress from "../wordpress.js";

const CoursesEditContent = (props) => {
  var dynamicContent = "";

  const [must, setMust] = useState(false);

  useEffect(() => {
    if(typeof props.part.must != "undefined"){
      setMust(props.part.must)
    }
  }, []);

  //////////////////////
  ///Toggle must
  function toggleMust(){
    let toggle = must ? false:true;
    setMust(toggle)
    props.updatePart(props.index, "must",  toggle)
  }

  switch(props.part.type) {
    case "wysiwyg":
      dynamicContent = <Wysiswg index={props.index} part={props.part} updatePart={props.updatePart} showMediaLibrary={props.showMediaLibrary}/>;
      break;
    case "question_open":
      dynamicContent = <QuestionOpen index={props.index} part={props.part} updatePart={props.updatePart} toggleMust={toggleMust} must={must}/>;
      break;
    case "list":
      dynamicContent = <List index={props.index} part={props.part} updatePart={props.updatePart} />;
      break;
    case "matrix":
      dynamicContent = <Matrix index={props.index} part={props.part} updatePart={props.updatePart} toggleMust={toggleMust} must={must}/>;
      break;
    case "select":
    case "question_radio":
    case "question_checkboxes":
      dynamicContent = <QuestionWithOptions index={props.index} part={props.part} parts={props.allPart} updatePart={props.updatePart} toggleMust={toggleMust} must={must}/>;
    break;
    case "video":
      dynamicContent = <Video index={props.index} part={props.part} updatePart={props.updatePart} />;
    break;
    case "question_right_or_wrong":
      dynamicContent = <QuestionRightOrWrong index={props.index} part={props.part} updatePart={props.updatePart} />;
    break;
    case "audio":
      dynamicContent = <Audio index={props.index} part={props.part} updatePart={props.updatePart} showMediaLibrary={props.showMediaLibrary}/>;
    break;
    case "image":
      dynamicContent = <Image index={props.index} part={props.part} updatePart={props.updatePart} showMediaLibrary={props.showMediaLibrary}/>;
    break;
    case "divider":
      dynamicContent = <Divider index={props.index} part={props.part} updatePart={props.updatePart} parts={props.allPart} />;
    break;
    case "quote":
      dynamicContent = <Quote index={props.index} part={props.part} updatePart={props.updatePart}/>;
    break;
    case "special":
      dynamicContent = <Special index={props.index} part={props.part} updatePart={props.updatePart} showMediaLibrary={props.showMediaLibrary}/>;
    break;
    case "feedback":
      dynamicContent = <Feedback index={props.index} interventionSettings={props.interventionSettings} parts={props.allPart} updatePart={props.updatePart} part={props.part} type={props.type}/>;
      break;
    case "chart":
      dynamicContent = <Chart index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
    case "custom":
      dynamicContent = <CustomElements index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
    case "slider":
      dynamicContent = <Slider part={props.part} index={props.index} updatePart={props.updatePart} toggleMust={toggleMust} must={must}
      />;
      break;
    case "form":
      dynamicContent = <Forms index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
    case "goal":
      dynamicContent = <Goals index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
    case "datepicker":
      dynamicContent = <DatePicker index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
    case "wordpress":
      dynamicContent = <ImportFormWordpress index={props.index} part={props.part} updatePart={props.updatePart}/>;
      break;
  }

  return (
    dynamicContent
  )
}
export default CoursesEditContent
