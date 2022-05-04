import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../translate";
import { getClone } from "../../utils";
import { setActivePart, setActiveHomework, setActiveSubHomework, setAnswersHomework, setFinishedCourse, setPreviousHomeworks, setPreviousSubHomework } from "../../../actions";
import NotificationBox from "../../alert/notification";
import apiCall from "../../api";

const Buttons = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const activeHomework = useSelector(state => state.activeHomework);
  const activeSubHomework = useSelector(state => state.activeSubHomework);
  const previousHomeworks = useSelector(state => state.previousHomeworks);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersHomework);

  const [prevHomework, setPrevHomework] = useState(false);
  const [prevSubHomework, setPrevSubHomework] = useState(0);
  const [nextHomework, setNextHomework] = useState(false);
  const [nextSubHomework, setNextSubHomework] = useState(0);
  const [closeHomework, setCloseHomework] = useState(false);

  useEffect(() => {

    setPrevHomework(false);
    setNextHomework(false);
    setCloseHomework(false);

    //vaststellen welke buttons getoond mogen worden onderaan de pagina

    if (activeHomework !== 0 && intervention.settings.homework.length > 0)
    {
      //homework zoeken
      let homework = intervention.settings.homework.find((homework) => {
        return parseInt(homework.id) === parseInt(activeHomework) && parseInt(homework.sub_id) === parseInt(activeSubHomework)
      });
      if (typeof homework !== 'undefined') //kan wanneer activeHomework al is geupdate maar activeSubhomework nog niet
      {
        //key vd betreffende les bepalen
        let homeworkKey = -1;
        for (const [index, homework] of intervention.settings.homework.entries()) {
          if (parseInt(homework.id) === parseInt(activeHomework) && parseInt(homework.sub_id) === parseInt(activeSubHomework))
          {
            homeworkKey = index;
            break;
          }
        }
        //is er een vorige pagina in deze les
        if (!(parseInt(homework.parent_id) === 0 && parseInt(homework.sub_id) === 0) && homeworkKey !== 0)
        {
          if (previousHomeworks.length < 1)
          {
            setPrevHomework(intervention.settings.homework[homeworkKey - 1].id);
            setPrevSubHomework(intervention.settings.homework[homeworkKey - 1].sub_id);
          }
          else
          {
            //ivm routing naar vorig bezochte pagina
            setPrevHomework(previousHomeworks[previousHomeworks.length -1][0]);
            setPrevSubHomework(previousHomeworks[previousHomeworks.length -1][1]);
          }
        }
        //is er een volgende pagina?
        if (parseInt(homework.parent_id) === 0)
        {
          //is huidige les parent vd volgende?
          if (typeof intervention.settings.homework[homeworkKey + 1] !== 'undefined' && (parseInt(homework.id) === parseInt(intervention.settings.homework[homeworkKey + 1].parent_id) || parseInt(intervention.settings.homework[homeworkKey + 1].sub_id) > 0))
          {
            setNextHomework(intervention.settings.homework[homeworkKey + 1].id);
            setNextSubHomework(intervention.settings.homework[homeworkKey + 1].sub_id);
          }
          else
          {
            setCloseHomework(true);
          }
        }
        else
        {
          if (typeof intervention.settings.homework[homeworkKey + 1] !== 'undefined')
          {
            //heeft volgende les dezelfde parent als huidige
            if (parseInt(homework.parent_id) === parseInt(intervention.settings.homework[homeworkKey + 1].parent_id))
            {
              setNextHomework(intervention.settings.homework[homeworkKey + 1].id);
              setNextSubHomework(intervention.settings.homework[homeworkKey + 1].sub_id);
            }
            else
            {
              setCloseHomework(true);
            }
          }
          else
          {
            setCloseHomework(true);
          }
        }

      }
    }
  }, [intervention, activeHomework, activeSubHomework]);

  //activeHomework op finished zetten
  const endHomework = () => {
    //stond les niet all op afgerond?
    let currentHomeworkAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(activeHomework)
    });
    let finished = false;
    if (typeof currentHomeworkAnswers === 'undefined')
    {
      ///Hier kom je helemaal niet...
      //als de les niet voor komt in allAnswers dan toevoegen...
      let newAllAnswers = getClone(allAnswers);
      newAllAnswers.answers.push({
        the_id: activeHomework,
        answers: [],
        /// dit was niet de oorzaak van de dubbele lessen
        finished: true
      });
      dispatch(setAnswersHomework(newAllAnswers.intervention_id, newAllAnswers.answers)); /// we gaan door naar de call maar daar dispatchen we ook? deze zou dan weg kunnen.
    }
    else
    {
      if (currentHomeworkAnswers.hasOwnProperty("finished") && currentHomeworkAnswers.finished === true)
      finished = true;
    }

    if (!finished) // of altijd tbv logging?
    {
      let lasthomework = false;
      //// check if is last homework course..... yes then confetti
      if(intervention.settings.homework[intervention.settings.homework.length - 1].id == activeHomework && (typeof intervention.settings.selfhelp.alternative_menu === 'undefined' || intervention.settings.selfhelp.alternative_menu === false)){
        lasthomework = true;
        dispatch(setFinishedCourse(true));
      }
      //nee? dan doorzetten
      apiCall({
        action: "end_homework",
        token: auth.token,
        data: {
          the_id: activeHomework,
          lasthomework
        }
      }).then(resp => {
        let indexKey = allAnswers.answers.findIndex((answer) => {
          return parseInt(answer.the_id) === parseInt(activeHomework)
        });
        let newAllAnswers = getClone(allAnswers);
        newAllAnswers.answers[indexKey].finished = true;
        dispatch(setAnswersHomework(newAllAnswers.intervention_id, newAllAnswers.answers));
      })
    }

  }

  const requiredFieldsChecked = () => {

    let homeworkRequiredQuestions = [];
    let scrollIntoView = true;
    //huidige les bepalen
    let currentHomework = intervention.settings.homework.find((homework) => {
      return parseInt(homework.id) === parseInt(activeHomework) && parseInt(homework.sub_id) === parseInt(activeSubHomework)
    });
    //bevat deze verplichte velden
    for (const part of currentHomework.settings.parts) {
      if (part.hasOwnProperty('must') && part.must === true)
      {
        homeworkRequiredQuestions.push({
          id: part.id,
          type: part.type
        });
      }
    }
    //verplichte vragen gevonden?
    if (homeworkRequiredQuestions.length > 0)
    {
      //
      let requiredAnswersAnswered = true;
      //les bevat verplichte velden, checken of deze beantwoord zijn...
      let homeworkAnswers = allAnswers.answers.find((homework) => {
        return parseInt(homework.the_id) === parseInt(activeHomework)
      });
      if (typeof homeworkAnswers !== 'undefined')
      {
        //loop door verplichte vragen
        for (const part of homeworkRequiredQuestions) {
          let answered = false;
          //door de antwoorden loopen om te kijken of vraag beantwoord is
          for (const answer of homeworkAnswers.answers) {
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
                  answer.answer.chosenAnswers.forEach(chosenAnswer => {
                    if (chosenAnswer.length > 0)
                    {
                      answered = true;
                    }
                  })
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
        if (parseInt(activeHomework) !== parseInt(nextHomework)) {
          endHomework();
        }
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
      if (parseInt(activeHomework) !== parseInt(nextHomework)) {
        endHomework();
      }
      return true;
    }

  }
  const getRouting = (currentHomeworkKey) => {
    let route_id = '';
    if (typeof currentHomeworkKey !== 'undefined') //zou nooit undefined moeten kunnen zijn...
    {

      //bevat de huidige les een routing (routing in einde les divider)
      if (typeof intervention.settings.homework[currentHomeworkKey].routing !== 'undefined' && intervention.settings.homework[currentHomeworkKey].routing.length > 0)
      {
        route_id = intervention.settings.homework[currentHomeworkKey].routing;
      }
      else
      {
        //door alle parts van les heen loopen, bevat deze een radio of ee select vraag?
        intervention.settings.homework[currentHomeworkKey].settings.parts.forEach(part => {
          if (part.type === 'question_radio' || part.type === 'select')
          {
            //bevat deze radio vraag ook routing elementen?
            part.items.forEach(item => {
              if (item.hasOwnProperty('routing') && item.routing.length > 0)
              {
                //is dit antwoord gegeven, zo ja dan route_id instellen?
                let homeworkAnswers = allAnswers.answers.find(answer => {
                  return parseInt(answer.the_id) === parseInt(activeHomework)
                })
                if (typeof homeworkAnswers !== 'undefined')
                {
                  homeworkAnswers.answers.forEach(answer => {
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

  const [notificationOptions, setNotificationOptions] = useState('');

  const changeHomework = (homework_id, homework_sub_id, direction, check_required) => {

    if (!check_required || requiredFieldsChecked())
    {
      if (direction === 'next' && parseInt(activeHomework) === parseInt(homework_id))
      {
        //checken of huidige pagina routing vraag bevat
        //ndexkey van huidige les bepaleb
        let currentHomeworkKey = intervention.settings.homework.findIndex(homework => {
          return parseInt(homework.id) === parseInt(activeHomework) && parseInt(homework.sub_id) === parseInt(activeSubHomework)
        })
        const route_id = getRouting(currentHomeworkKey);
        if (route_id.length > 0)
        {
          //huidige pagina bevat routingvraag, op basis hiervan bepalen naar welke les we springen
          //les met dit part_id zoeken...
          intervention.settings.homework.forEach(homework => {
            if (parseInt(homework.id) === parseInt(activeHomework))
            {
              if (parseInt(homework.sub_id) > parseInt(activeSubHomework))
              {
                homework.settings.parts.forEach(part => {
                  if (route_id === part.id)
                  {
                    homework_sub_id = homework.sub_id;
                  }
                })
              }
            }
          })
        }
      }

      //eerst de huidige les opslaan voor de zekerheid
      props.saveImmediately();

      //previousHomeworks tbv routing bij terugbladeren zetten
      if (homework_id !== 0)
      {
        if (parseInt(activeHomework) !== 0)
        {
          let newPreviousHomeworks = previousHomeworks;
          if (direction === 'next')
          {
            //previousHomeworks aanvullen
            newPreviousHomeworks.push([activeHomework, activeSubHomework]);
          }
          else
          {
            if (newPreviousHomeworks.length > 0)
            {
              newPreviousHomeworks.pop();
            }
          }
          dispatch(setPreviousHomeworks(newPreviousHomeworks));
       }
        dispatch(setActiveHomework(homework_id));
        dispatch(setActiveSubHomework(homework_sub_id));
        history.push("/course/" + intervention.id + "/homework/" + homework_id + "/" + homework_sub_id);
      }
      else
      {
        dispatch(setActiveHomework(0));
        dispatch(setActiveSubHomework(0));
        dispatch(setPreviousHomeworks([]));
        dispatch(setActivePart('homeworks'));
        history.push("/course/" + intervention.id + "/my-homework");
      }
    }
    else
    {
      //melden dat verplichte velden niet zijn gevuld...
      setNotificationOptions({
        show: "true",
        text: t("Je hebt niet alle verplichte velden ingevuld"),
        confirmText: t("Ok")
      });

      //alert(t("Je hebt niet alle verplichte velden ingevuld"));
    }
  }

  return (
    <div className="center pageControls">
      {
        prevHomework ? <span className="btn btn-primary prev" onClick={() => changeHomework(prevHomework, prevSubHomework, 'prev', false)}>{t("Vorige")}</span> : ''
      }
      {
        nextHomework ? <span className="btn btn-primary next" onClick={() => changeHomework(nextHomework, nextSubHomework, 'next',  true)}>{t("Volgende")}</span> : ''
      }
      {
        closeHomework ? <span className="btn btn-primary next" onClick={() => changeHomework(0, 0, '', true)}>{t("Afronden les")}</span> : ''
      }
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )


}

export default Buttons;
