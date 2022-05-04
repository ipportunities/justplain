import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DynamicContent from "./dynamicContent.js";
import {GetDate, GetTime} from "../../../helpers/convertTimestamp.js";
import t from "../../../translate";
import apiCall from "../../../api";
import $ from "jquery";
import {appSettings} from "../../../../custom/settings";

const Content = (props) => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);

    const [Content, setContent] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [answersSet, setAnswersSet] = useState(false);
    const [noAnswersMessage, setNoAnswersMessage] = useState('');

    useEffect(() => {

        if (props.itemKey > -1 && props.items.length > 0)
        {

            //newContent is array met de key van de opgevraagde les +
            //alle keys van lessen die hieronder hangen
            let newContent = [];
            newContent.push(parseInt(props.itemKey));
            let item_id = props.items[props.itemKey].id

            props.items.map((item, index) => {
               //structuur optionele lessen is anders
               if(item.optional){
                 if(index > props.itemKey && item.id === props.items[props.itemKey].id){
                   newContent.push(index);
                 }
               } else {
                  if (index > props.itemKey && ((item.parent_id === props.items[props.itemKey].id) || (parseInt(item.parent_id) === 0 && item.id === props.items[props.itemKey].id)))
                  {

                      newContent.push(index);
                  }

               }
               return true; //?
            })
            setContent(newContent)
        }
        if(props.answers !== "")
        {
            if(props.type === "goal"){
                setAnswers(props.answers[props.itemKey])
                setAnswersSet(true)
            } else {
                setAnswers(props.answers)
                setAnswersSet(true)
                filledIn()
            }
        }
    }, [props.itemKey, props.items, props.answers])

    const filledIn = () => {
      if(props.type === "questionnaire"){
        if(typeof props.answers[props.itemKey] !== 'undefined' && typeof props.answers[props.itemKey].noResults !== 'undefined' && props.answers[props.itemKey].noResults){
          setAnswersSet(false)
          setNoAnswersMessage("Nog niet ingevuld")
        } else {
          setAnswersSet(true)
        }
      } else if(props.type === "lesson"){
        if(typeof props.items[props.itemKey] !== 'undefined' && typeof props.items[props.itemKey].id !== 'undefined' && lessonFinished(props.items[props.itemKey].id)){
          setAnswersSet(true)
          //loggen dat coach de les heeft bekeken
          logLessonSeen(props.items[props.itemKey].id);
        } else {
          setAnswersSet(false)
          setNoAnswersMessage("Nog niet ingevuld")
        }
      }
    }

    const lessonFinished = (lesson_id) => {
      let currentLessonAnswers = props.answers.find((answer) => {
        return parseInt(answer.the_id) === parseInt(lesson_id)
      });
      if (typeof currentLessonAnswers !== 'undefined' &&  currentLessonAnswers.hasOwnProperty('started') && currentLessonAnswers.started === true)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    const logLessonSeen = (lesson_id) => {

      apiCall({
        action: "log_lesson_seen",
        token: auth.token,
        data: {
            intervention_id: intervention.id,
            lesson_id: props.items[props.itemKey].id,
            student_id: props.studentId,
        }
      })

    }

    function checkPrintablePdf(lesson_id){
      let this_lesson_obj = intervention.settings.selfhelp.optionalLessons.filter(function (optionalLesson) {
        return optionalLesson.id === lesson_id
      });

      if(this_lesson_obj.length != 0){
        if(this_lesson_obj[0].settings.printablePDF){
          return true;
        } else {
          return false;
        }
      }
    }

    function downloadPdf(type, id, studentId){
      window.open( appSettings.domain_url + '/api/download/results.php?token='+auth.token+'&id='+id+'&type='+type+'&studentId='+studentId );
    }

    //// alleen maar laten zien dat wat content heeft lijkt me...
    const getContent = (part, itemKey, answerId) => {
        let searchId = props.items[itemKey].id
        if(props.type === "goal"){
            searchId = answerId
        }
        let partContent = null;
        if (props.type === 'questionnaire')
        {
          partContent = <DynamicContent key={part.id} part={part} answers={getAnswers(itemKey)} />
        }
        else
        {
          partContent = <DynamicContent key={part.id} part={part} answers={getAnswers(searchId)} />
        }

      let doNotShow = ["wysiwyg", "divider", "custom", "feedback", "special", "quote", "list", "video", "audio", "image", "chart", "form"]

      /// meerdere content zijn leeg maar komen wel terug.....?
      if(partContent !== "" && doNotShow.indexOf(part.type) === -1){
        return(<div className="part" key={part.id + "_" + itemKey}>
          {partContent}
        </div>)
      }
    }
    const toggleView = (id) => {
      if(!$("#" + id).hasClass("hideContent")){
        $("#" + id).addClass("hideContent")
      } else {
        $("#" + id).removeClass("hideContent")
        positionSliderBullet(id) // de functie in de slider component werkt niet indien verborgen <= de resize werkt wel
      }
    }

    const positionSliderBullet = (id) => {
      if($("#" + id + " .slider").length !== 0){
        $("#" + id + " .slider .rs-label").each(function(){
          $(this).css({left:($(this).next().val()/$(this).next()[0].max) * ($(this).next()[0].offsetWidth - 22)})
        })
      }
    }
    const getAnswers = (id) => {

      if (props.type === 'questionnaire')
      {
        let answer = answers[id];
        if(typeof answer !== undefined && Object.keys(answer).length)
        {
            if(answer.answers.answers)/// er zijn twee opslaan scripts <=> de oude slaat het dieper op
            {
              return answer.answers.answers
            }
            else
            {
              return answer.answers
            }

        } else {
            return [];
        }
      }
      else
      {
        let answer = answers.filter(function (answer) {
            /// bij goal is de weergave op basis van de antwoorden <=> goals zijn meerdere malen in te voeren <= bij vragenlijsten zal dat straks ook het geval zijn lijkt me
            if(props.type === "goal"){
              return answer.id === id
            } else {
              return answer.the_id === id
            }
        });
        if(typeof answer !== undefined && Object.keys(answer).length)
        {
            if(answer[0].answers.answers)/// er zijn twee opslaan scripts <=> de oude slaat het dieper op
            {
              return answer[0].answers.answers
            }
            else
            {
              return answer[0].answers
            }

        } else {
            return [];
        }
      }
    }

    console.log(answers);

    return (
        <div className="the_content_holder">
            {props.type === "goal" ?
                <div>
                  {(typeof answers === 'undefined' || answers.length === 0) && answersSet ?
                    <div className="noResultsYet">
                      {t("Nog geen resultaten")}
                    </div>
                    :''}
                    {
                    typeof answers !== 'undefined' ?
                    <>
                    {
                      answers.map((answer, index) => (
                          <div>
                          {
                              Content.map(itemKey => {
                                  return (
                                      <div key={index + "_" + itemKey} className="listStyle">

                                          {
                                              props.items[itemKey].hasFillinParts ?
                                              <div key={itemKey} id={"item_" + index + "_" + itemKey} className="item hideContent" onClick={()=>toggleView("item_" + index + "_" + itemKey)}>
                                                  <div className="heading">
                                                  <h5>
                                                    {GetDate(answer.date_time_create)} &nbsp;
                                                    {GetTime(answer.date_time_create)}
                                                    </h5>
                                                  <i className="fas fa-chevron-down"></i>
                                                  </div>
                                                  <div className="the_content">

                                                    {props.items[itemKey].settings.parts.map((part, index) => {
                                                        return (
                                                            getContent(part, itemKey, answer.id)
                                                        )
                                                    })}
                                              </div>
                                              </div>

                                              :
                                              ''
                                          }
                                      </div>
                                  )
                              })
                          }
                          </div>
                      ))
                    }
                    </> : <></>
                    }
                </div>
            :
                <div>
                {!answersSet ?
                  <div className="noResultsYet">
                    {noAnswersMessage !== '' ? noAnswersMessage:''}
                  </div>
                  :
                  <div>
                  {typeof props.items[props.itemKey] != "undefined" ?
                    <>
                      {checkPrintablePdf(props.items[props.itemKey].id) ?
                      <div className="download_options">
                        <span className="btn btn-primary" onClick={()=>downloadPdf(props.type, props.items[props.itemKey].id, props.studentId)}>
                          {t("Download pdf")} <i className="fas fa-file-pdf"></i>
                        </span>
                      </div>
                      :''}
                    </>
                  :''}
                  {
                      Content.map(itemKey => {
                          return (
                              <div key={itemKey}>
                                  {
                                      props.items[itemKey].hasFillinParts ?
                                      <div key={itemKey}>
                                          <h5>{props.items[itemKey].title}</h5>
                                          <div className="the_content">
                                      {props.items[itemKey].settings.parts.map((part, index) => {
                                          return (
                                              getContent(part, itemKey)
                                          )
                                      })}
                                      </div>
                                      </div>

                                      :
                                      ''
                                  }
                              </div>
                          )
                      })
                  }
                  </div>
                }
                </div>
            }

        </div>
    )
}

export default Content
