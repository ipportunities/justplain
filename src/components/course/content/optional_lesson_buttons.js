import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../translate";
import { getClone } from "../../utils";
import { setActivePart, setActiveLesson, setActiveSubLesson, setAnswersLessons, setFinishedCourse, setPreviousLessons, setPreviousSubLesson } from "../../../actions";
import apiCall from "../../api";

const Buttons = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const activeLesson = useSelector(state => state.activeLesson);
  const activeSubLesson = useSelector(state => state.activeSubLesson);
  const previousLessons = useSelector(state => state.previousLessons);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);

  const [prevLesson, setPrevLesson] = useState(false);
  const [prevSubLesson, setPrevSubLesson] = useState(0);
  const [nextLesson, setNextLesson] = useState(false);
  const [nextSubLesson, setNextSubLesson] = useState(0);
  const [closeLesson, setCloseLesson] = useState(false);

  useEffect(() => {

    setPrevLesson(false);
    setNextLesson(false);
    setCloseLesson(false);

    //vaststellen welke buttons getoond mogen worden onderaan de pagina
    if (activeLesson !== 0 && intervention.settings.selfhelp.optionalLessons.length > 0)
    {
      //lesson zoeken
      let lesson = intervention.settings.selfhelp.optionalLessons.find((lesson) => {
        return parseInt(lesson.id) === parseInt(activeLesson) && parseInt(lesson.sub_id) === parseInt(activeSubLesson)
      });
      //key vd betreffende les bepalen
      let lessonKey = -1;
      for (const [index, lesson] of intervention.settings.selfhelp.optionalLessons.entries()) {
        if (parseInt(lesson.id) === parseInt(activeLesson) && parseInt(lesson.sub_id) === parseInt(activeSubLesson))
        {
          lessonKey = index;
          break;
        }
      }
      //is er een vorige pagina in deze les
      if (!(parseInt(lesson.parent_id) === 0 && parseInt(lesson.sub_id) === 0) && lessonKey !== 0)
      {
        if (previousLessons.length < 1)
        {
          setPrevLesson(intervention.settings.selfhelp.optionalLessons[lessonKey - 1].id);
          setPrevSubLesson(intervention.settings.selfhelp.optionalLessons[lessonKey - 1].sub_id);
        }
        else
        {
          //ivm routing naar vorig bezochte pagina
          setPrevLesson(previousLessons[previousLessons.length -1][0]);
          setPrevSubLesson(previousLessons[previousLessons.length -1][1]);
        }
      }
      //is er een volgende pagina?
      if (parseInt(lesson.parent_id) === 0)
      {
        //is huidige les parent vd volgende?
        if (typeof intervention.settings.selfhelp.optionalLessons[lessonKey + 1] !== 'undefined' && (parseInt(lesson.id) === parseInt(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].parent_id) || parseInt(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].sub_id) > 0))
        {
          setNextLesson(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].id);
          setNextSubLesson(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].sub_id);
        }
        else
        {
          setCloseLesson(true);
        }
      }
      else
      {
        if (typeof intervention.settings.selfhelp.optionalLessons[lessonKey + 1] !== 'undefined')
        {
          //heeft volgende les dezelfde parent als huidige
          if (parseInt(lesson.parent_id) === parseInt(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].parent_id))
          {
            setNextLesson(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].id);
            setNextSubLesson(intervention.settings.selfhelp.optionalLessons[lessonKey + 1].sub_id);
          }
          else
          {
            setCloseLesson(true);
          }
        }
        else
        {
          setCloseLesson(true);
        }
      }
      //generateRoutingTable();
    }
  }, [intervention, activeLesson, activeSubLesson]);

  //activeLesson op finished zetten
  const endLesson = () => {

    //stond les niet all op afgerond?
    let currentLessonAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(activeLesson)
    });
    let finished = false;
    if (typeof currentLessonAnswers === 'undefined')
    {
      //als de les niet voor komt in allAnswers dan toevoegen...
      let newAllAnswers = getClone(allAnswers);
      newAllAnswers.answers.push({
        the_id: activeLesson,
        answers: [],
        finished: false
      });
      dispatch(setAnswersLessons(newAllAnswers.intervention_id, newAllAnswers.answers));
    }
    else
    {
      if (currentLessonAnswers.hasOwnProperty("finished") && currentLessonAnswers.finished === true)
      finished = true
    }


    if (!finished) // of altijd tbv logging?
    {
      //// check if is last lesson course..... yes then confetti <= bij optionele lessen niet nodig denk ik
      //if(intervention.settings.selfhelp.optionalLessons[intervention.settings.selfhelp.optionalLessons.length - 1].id == activeLesson ){
        //dispatch(setFinishedCourse(true));
      //}

      //nee? dan doorzetten
      apiCall({
        action: "end_lesson",
        token: auth.token,
        data: {
          the_id: activeLesson
        }
      }).then(resp => {
        let indexKey = allAnswers.answers.findIndex((answer) => {
          return parseInt(answer.the_id) === parseInt(activeLesson)
        });
        let newAllAnswers = getClone(allAnswers);
        newAllAnswers.answers[indexKey].finished = true;
        dispatch(setAnswersLessons(newAllAnswers.intervention_id, newAllAnswers.answers));



      })
    }

  }

  const requiredFieldsChecked = () => {

    let lessonRequiredQuestions = [];
    let scrollIntoView = true;
    //huidige les bepalen
    let currentLesson = intervention.settings.selfhelp.optionalLessons.find((lesson) => {
      return parseInt(lesson.id) === parseInt(activeLesson) && parseInt(lesson.sub_id) === parseInt(activeSubLesson)
    });
    //bevat deze verplichte velden
    for (const part of currentLesson.settings.parts) {
      if (part.hasOwnProperty('must') && part.must === true)
      {
        lessonRequiredQuestions.push({
          id: part.id,
          type: part.type
        });
      }
    }
    //verplichte vragen gevonden?
    if (lessonRequiredQuestions.length > 0)
    {
      //
      let requiredAnswersAnswered = true;
      //les bevat verplichte velden, checken of deze beantwoord zijn...
      let lessonAnswers = allAnswers.answers.find((lesson) => {
        return parseInt(lesson.the_id) === parseInt(activeLesson)
      });
      if (typeof lessonAnswers !== 'undefined')
      {
        //loop door verplichte vragen
        for (const part of lessonRequiredQuestions) {
          let answered = false;
          //door de antwoorden loopen om te kijken of vraag beantwoord is
          for (const answer of lessonAnswers.answers) {
            if (answer.id === part.id)
            {
              if (part.type === 'slider' || part.type === 'question_open')
              {
                if (answer.hasOwnProperty('answer') && answer.answer.trim().length > 0)
                {
                  answered = true;
                }
              }
              else if (part.type === 'select' || part.type === 'question_checkboxes' || part.type === 'question_radio') //matrix??
              {
                if (answer.hasOwnProperty('answer') && answer.answer.hasOwnProperty('chosenAnswers') && answer.answer.chosenAnswers.length > 0)
                {
                  answered = true;
                }
              }
              else if (part.type === 'matrix')
              {
                let matrix_answered = true;
                if (answer.hasOwnProperty('answer') && typeof answer.answer !== 'undefined')
                {
                  for (const [index, answ] of answer.answer.entries()) {
                    if (index > 0)
                    {
                      let row_answered = false;
                      answ.answers.forEach(element => {
                        if (parseInt(element) === 1)
                        {
                          row_answered = true;
                        }
                      });
                      if (!row_answered)
                      {
                        matrix_answered = false;
                        break;
                      }
                    }
                  }
                }
                else
                {
                  matrix_answered = false;
                }

                if (matrix_answered)
                {
                  answered = true;
                }
              }
              else if (part.type === 'datepicker')
              {
                if (answer.hasOwnProperty('answer') && toString(answer.answer).length > 0) //wat gebeurt hier?
                {
                  answered = true;
                }
              }
            }
          }
          //verplichte vraag is niet beantwoord, class required aan component holder toevoegen
          if (!answered)
          {
            //bordertje rond niet ingevulde...
            document.getElementById("cph_"+part.id).getElementsByClassName('must')[0].classList.add("empty");
            //als het de eerste niet beantwoorde vraag vd les (pagina) is, dan scrollIntoView dit element
            if (scrollIntoView)
            {
              document.getElementById("cph_"+part.id).scrollIntoView();
              scrollIntoView = false;
            }
            requiredAnswersAnswered = false;
          }
        }
      }
      else
      {
        //deze conditie zou niet voor moeten kunnen komen...
        requiredAnswersAnswered = false;
      }
      //zijn alle verplichte velden beantwoord?
      if (requiredAnswersAnswered)
      {
        endLesson();
        return true;
      }
      else
      {
        return false;
      }
    }
    else
    {
      //les bevat geen verplichte velden
      endLesson();
      return true;
    }

  }

  const getRouting = (currentLessonKey) => {
    let route_id = '';
    if (typeof currentLessonKey !== 'undefined') //zou nooit undefined moeten kunnen zijn...
    {

      //bevat de huidige les een routing (routing in einde les divider)
      if (typeof intervention.settings.selfhelp.optionalLessons[currentLessonKey].routing !== 'undefined' && intervention.settings.selfhelp.optionalLessons[currentLessonKey].routing.length > 0)
      {
        route_id = intervention.settings.selfhelp.optionalLessons[currentLessonKey].routing;
      }
      else
      {
        //door alle parts van les heen loopen, bevat deze een radio of ee select vraag?
        intervention.settings.selfhelp.optionalLessons[currentLessonKey].settings.parts.forEach(part => {
          if (part.type === 'question_radio' || part.type === 'select')
          {
            //bevat deze radio vraag ook routing elementen?
            part.items.forEach(item => {
              if (item.hasOwnProperty('routing') && item.routing.length > 0)
              {
                //is dit antwoord gegeven, zo ja dan route_id instellen?
                let lessonAnswers = allAnswers.answers.find(answer => {
                  return parseInt(answer.the_id) === parseInt(activeLesson)
                })
                if (typeof lessonAnswers !== 'undefined')
                {
                  lessonAnswers.answers.forEach(answer => {
                    if (answer.id === part.id && answer.answer.hasOwnProperty("chosenAnswers"))
                    {
                      answer.answer.chosenAnswers.forEach(answer_id => {
                        if (answer_id === item.id)
                        {
                          if (route_id.length < 1) //twee routing vragen op een pagina gaat niet....
                          {
                            route_id = item.routing;
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    }
    return route_id;
  }

  const changeLesson = (lesson_id, lesson_sub_id, direction, check_required) => {

    if (!check_required || requiredFieldsChecked())
    {
      if (direction === 'next' && parseInt(activeLesson) === parseInt(lesson_id))
      {
        //checken of huidige pagina routing vraag bevat
        //ndexkey van huidige les bepaleb
        let currentLessonKey = intervention.settings.selfhelp.optionalLessons.findIndex(lesson => {
          return parseInt(lesson.id) === parseInt(activeLesson)
          && parseInt(lesson.sub_id) === parseInt(activeSubLesson)
        })
        const route_id = getRouting(currentLessonKey);
        if (route_id.length > 0)
        {
          //huidige pagina bevat routingvraag, op basis hiervan bepalen naar welke les we springen
          //les met dit part_id zoeken...
          intervention.settings.selfhelp.optionalLessons.forEach(lesson => {
            if (parseInt(lesson.id) === parseInt(activeLesson))
            {
              if (parseInt(lesson.sub_id) > parseInt(activeSubLesson))
              {
                lesson.settings.parts.forEach(part => {
                  if (route_id === part.id)
                  {
                    lesson_sub_id = lesson.sub_id;
                  }
                })
              }
            }
          })
        }
      }

      //eerst de huidige les opslaan voor de zekerheid
      props.saveImmediately();

      //previousLessons tbv routing bij terugbladeren zetten
      if (lesson_id !== 0)
      {
        if (parseInt(activeLesson) !== 0)
        {
          let newPreviousLessons = previousLessons;
          if (direction === 'next')
          {
            //previousLessons aanvullen
            newPreviousLessons.push([activeLesson, activeSubLesson]);
          }
          else
          {
            if (newPreviousLessons.length > 0)
            {
              newPreviousLessons.pop();
            }
          }
          dispatch(setPreviousLessons(newPreviousLessons));
       }
        dispatch(setActiveLesson(lesson_id));
        dispatch(setActiveSubLesson(lesson_sub_id));
        history.push("/course/" + intervention.id + "/optional-lesson/" + lesson_id + "/" + lesson_sub_id);
      }
      else
      {
        dispatch(setActiveLesson(0));
        dispatch(setActiveSubLesson(0));
        dispatch(setPreviousLessons([]));
        dispatch(setActivePart('lessons'));
        history.push("/course/" + intervention.id + "/lessons");
      }
    }
    else
    {
      //melden dat verplichte velden niet zijn gevuld...
      alert(t("Je hebt niet alle verplichte velden ingevuld"));
    }
  }

  return (
    <div className="center pageControls">
      {
        prevLesson ? <span className="btn btn-primary prev" onClick={() => changeLesson(prevLesson, prevSubLesson, 'prev', false)}>{t("Vorige")}</span> : ''
      }
      {
        nextLesson ? <span className="btn btn-primary next" onClick={() => changeLesson(nextLesson, nextSubLesson, 'next',  true)}>{t("Volgende")}</span> : ''
      }
      {
        closeLesson ? <span className="btn btn-primary next" onClick={() => changeLesson(0, 0, '', true)}>{t("Sluit les")}</span> : ''
      }
    </div>
  )


}

export default Buttons;
