import React, { useEffect, useState } from "react";
import Matrix from "../../../content/front/parts/matrix.js";
import QuestionOpen from "../../../content/front/parts/question_open.js";
import QuestionWithOptions from '../../../content/front/parts/question_with_options.js';
import Select from "../../../content/front/parts/select.js";
import Slider from "../../../content/front/parts/slider.js";
import DatePicker from "../../../content/front/parts/datepicker.js";

const DynamicContent = (props) => {

    const [answers, setAnswers] = useState([]);

    useEffect(() => {
      setAnswers(props.answers)
    }, [props.answers])

    //////////////////////
    ///Get answer based on id
    const getAnswer = (id) => {
      let answer = answers.filter(function (answer) {
        return answer.id === id
      });

      if(Object.keys(answer).length)
      {
          return answer[0].answer
      } else {
        /// ze moeten leeg door indien leeg
        /// misschien andere opties ook nog anders
        if(props.part.type == "question_checkboxes" || props.part.type == "question_radio"){
          return{customAnswers:[],chosenAnswers:[],otherAnswers:[]}
        } else {
          return '';
        }

      }
    }

    const fakeUpdate = () => {}

    let dynamicContent = "";
    const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom", "datepicker"];

    if (typesWeNeed.indexOf(props.part.type) > -1)
    {
        switch (props.part.type) {
            case "datepicker":
                dynamicContent = <DatePicker index={props.part.id} part={props.part} updateAnswer={fakeUpdate} toggleMust="" must="false" disabled="true" answer={getAnswer(props.part.id)} />;
                break;
            case "question_open":
                dynamicContent = <QuestionOpen index={props.part.id} part={props.part} updatePart={fakeUpdate} toggleMust="" must="false" disabled="true" answer={getAnswer(props.part.id)} />;
                break;
            case "slider":
                dynamicContent =  <Slider part={props.part} index={props.part.id} updatePart={fakeUpdate} disabled="true" answer={getAnswer(props.part.id)} resetSetWasEmpty="true"/>;
                break;
            case "question_radio":
            case "question_checkboxes":
                dynamicContent = <QuestionWithOptions index={props.part.id} part={props.part} updateAnswer={fakeUpdate} answer={getAnswer(props.part.id)} disabled="true" />;
                break;
            case "select":
                dynamicContent = <Select index={props.part.id} part={props.part} updateAnswer={fakeUpdate} answer={getAnswer(props.part.id)} disabled="true" nextAllowed={false}/>
                break;
            case "matrix":
               dynamicContent = <Matrix index={props.part.id} part={props.part} updateAnswer={fakeUpdate} answer={getAnswer(props.part.id)} disabled="true" nextAllowed={false}/>
                break;

        }
    }

    return dynamicContent;

}

export default DynamicContent
