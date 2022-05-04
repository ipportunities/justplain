import React, {useEffect, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import uuid from "uuid"
import InputTextfield from './input_textfield.js';
import {componentOptions} from "./helpers/options.js";
import parse from 'html-react-parser';
import t from "../../../translate";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../../../custom/settings";

const Feedback = (props) => {

  let location = useLocation();

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Koppel terug");
  });
  const available_subtypes = this_componentOptions[0].subtypes;
  const lesson_id = location.pathname.split("/")[3];

  const [filteredParts, setFilteredParts] = useState([]);
  const [feedbackPart, setFeedbackPart] = useState('');

  let questions_feedback = ["question_checkboxes", "question_radio", "select"];
  let questions_repeat = ["question_checkboxes", "question_radio", "question_open", "matrix", "list"];

  //////////////////////
  ///Get feedback questions
  useEffect(() => {
    if(props.type == "lesson"){
      //// get all previous
      if(props.interventionSettings != ""){
        getFeedbackPartLesson(props.part.refererId)
      }
    } else {
      /// bij doelen en vragenlijsten nog enkel uitgaan van de huidige
      if(props.parts != "")
      {
        getFeedbackPartMultiple(props.part.refererId)
      }
    }

  }, [props]);

  function getFeedbackPartMultiple(refererId){
    let questions = [];
    if(props.part.subtype == "feedback"){questions = questions_feedback}
    if(props.part.subtype == "herhaal antwoord"){questions = questions_repeat}

    let tempFilteredParts = [];
    for(let i = 0 ; i < props.parts.length ; i++)
    {
      //////////////////////
      ///Alleen vragen die al geweest zijn
      if(i < props.index){
        if(questions.indexOf(props.parts[i].type) !== -1){
          if(props.parts[i].type == "list"){
            if(props.parts[i].subtype == "aanvulbare lijst"){
              props.parts[i].question = props.parts[i].content;
              //// also save lesson id
              tempFilteredParts.push({content:props.parts[i], lesson_id:lesson_id});
            }
          } else {
            //// also save lesson id
            tempFilteredParts.push({content:props.parts[i], lesson_id:lesson_id});
          }

        }
        if(refererId == props.parts[i].id)
        {
          setFeedbackPart(props.parts[i]);
        }
      }
    }
    setFilteredParts(tempFilteredParts);
  }
  function getFeedbackPartLesson(refererId){
    let questions = [];
    if(props.part.subtype == "feedback"){questions = questions_feedback}
    if(props.part.subtype == "herhaal antwoord"){questions = questions_repeat}

    let allLessons = props.interventionSettings.selfhelp.lessons
    //check of niet optional lesson zo ja zet dan optionallessons als zoekgebied
    if(props.interventionSettings.selfhelp.optionalLessons.filter(e => e.id === lesson_id).length > 0){
      allLessons = props.interventionSettings.selfhelp.optionalLessons
    }
    let thisLesson = allLessons.filter(function (lesson) {
      return lesson.id === lesson_id
    });
    let thisLessonIndex = allLessons.indexOf(thisLesson[0])

    if(thisLessonIndex == -1){
      return;
    }
    allLessons[thisLessonIndex].settings.parts = props.parts

    let tempFilteredParts = [];

    for(let i = 0 ; i < allLessons.length ; i++){
      /// for alle lessons parts
      for(let ip = 0 ; ip < allLessons[i].settings.parts.length ; ip++)
      {
        if(questions.indexOf(allLessons[i].settings.parts[ip].type) !== -1){
          if(allLessons[i].settings.parts[ip].type == "list"){
            if(allLessons[i].settings.parts[ip].subtype == "aanvulbare lijst"){
              allLessons[i].settings.parts[ip].question = allLessons[i].settings.parts[ip].content;
              //// also save lesson id
              tempFilteredParts.push({content:allLessons[i].settings.parts[ip], lesson_id:allLessons[i].id});
            }
          } else {
            //// also save lesson id
            tempFilteredParts.push({content:allLessons[i].settings.parts[ip], lesson_id:allLessons[i].id});
          }
        }
        if(refererId == allLessons[i].settings.parts[ip].id)
        {
          setFeedbackPart(allLessons[i].settings.parts[ip]);
        }

        if(i == thisLessonIndex){
          /// justin untill current question
          if(ip == props.index){
            break;
          }
        }
      }
      /// alleen tot huidige les
      if(i >= thisLessonIndex){
        break;
      }
    }
    setFilteredParts(tempFilteredParts);
  }

  //////////////////////
  ///Update selected question
  function selectQuestion(value){
    props.updatePart(props.index, 'refererId', value)

    if(value != "")
    {
      let filterdPart = filteredParts.filter(function(part) {
        return part.content.id == value;
      });
      props.updatePart(props.index, 'refererIdInLesson', filterdPart[0].lesson_id)
      if(props.type == "lesson"){
        getFeedbackPartLesson(value)
      } else {
        getFeedbackPartMultiple(value)
      }
    } else {
      setFeedbackPart('');
    }
  }

  //////////////////////
  ///Update feedback
  function updateFeedback(id, content){
    let items = props.part.items;
    let itemToUpdate = items.filter(function(item, i) {
        return item.refererId === id
    })[0];
    let indexItemToUpdate = items.indexOf(itemToUpdate);

    if(typeof itemToUpdate === 'undefined'){
      items.push({id:uuid.v4(), refererId:id, content:content})
    } else {
      items[indexItemToUpdate].content = content
    }
    props.updatePart(props.index, 'items', items)
  }

  //////////////////////
  ///Get feedback based on id
  function getFeedbackItem(id){
    let item = props.part.items.filter(function(item) {
      return item.refererId == id;
    });
    if(item.length != 0){
      return item[0].content
    } else {
      return 'De feedback'
    }
  }

  //////////////////////
  ///Select subtype
  function selectSubtype(type){
    props.updatePart(props.index, 'subtype', type)
  }

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return(
    <div className='feedback'>
      <select className="subtypeChanger" onChange={(e) => selectSubtype(e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>
      <div className="center">
        <h3 className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"Koptekst"}/>
        </h3>
        {filteredParts.length == 0 ?
          <div>{t("Er zijn nog geen vragen waar je feedback op kan geven")}</div>
        :
          <div>
            <select onChange={(e) => selectQuestion(e.target.value)} value={props.part.refererId}>
              <option value=''>{t("Selecteer een vraag")}</option>
              {filteredParts.map((part, index) =><option key={index} value={part.content.id}>{parse(part.content.question.replace(/(<([^>]+)>)/ig," "))}</option>)}
            </select>
            {feedbackPart != "" && props.part.subtype == "feedback" ?
              <div className="feedbackOptions">
                {feedbackPart.items.map((item, index) =>
                  <div key={index} className='option'>
                    {feedbackPart.subtype == "checkboxes goed of fout" || feedbackPart.subtype == "radio goed of fout" ?
                      <div className="">
                        <span className={"btn correct" + (item.correct == "true" ? " right":"")}>
                          <i className="fas fa-check"></i>
                        </span>
                      </div>
                    :''}
                    <div className='question'>
                      {t("Feedback op")} : {parse(item.content)}
                    </div>
                    <Editor
                      apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                      inline
                      //initialValue='Feedback'
                      ///initialValue -> value caret jump opeens 11-08-2021 + overschrijft...
                      value={getFeedbackItem(item.id)}
                      //value={getFeedbackItem(item.id)}
                      //placeholder={getFeedbackItem(item.id) == '' ?  'feedback':''}
                      init={{
                        menubar:false,
                        plugins: 'link image code lists advlist',
                        relative_urls : false,
                        remove_script_host : true,
                        document_base_url : appSettings.domain_url,
                        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | link "
                      }}
                      onEditorChange={(content, editor) => updateFeedback(item.id, content)}
                      />
                  </div>
                )}
              </div>
            :
            ''}
            {feedbackPart != "" && props.part.subtype == "herhaal antwoord" ?
              <div className="repeat">
                {feedbackPart.type == "question_open" ?
                  typeof feedbackPart.answer !== "undefined" && feedbackPart.answer != "" ? feedbackPart.answer:""
                :''}
              </div>
            :
            ''}
          </div>
        }
      </div>
    </div>
  )
}

export default Feedback;
