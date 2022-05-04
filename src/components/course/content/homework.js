import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import GetPart from '../../content/front/get_part.js';
import Buttons from './homework_buttons.js';
import HomeworkHeaderMobile from './homework_header_mobile.js';
import { getClone } from "../../utils/index.js";
import { setAnswersHomework } from "../../../actions";
import apiCall from "../../api";
import { useHistory } from "react-router-dom";

let saveTimeOut = null;

const Homework = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const activeHomework = useSelector(state => state.activeHomework);
  const activeSubHomework = useSelector(state => state.activeSubHomework);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersHomework);

  const [homework, setHomework] = useState({
    id: 0,
    title: "",
    settings: {
      parts: []
    },
  });

  //// start or resume???


   useEffect(() => {

    //homework zoeken
    let newHomework = intervention.settings.homework.find((homework) => {
      return parseInt(homework.id) === parseInt(activeHomework) && parseInt(homework.sub_id) === parseInt(activeSubHomework)
    });
    if (typeof newHomework !== 'undefined')
    {
      setHomework(newHomework);
    }
  }, [intervention, activeHomework, activeSubHomework]);

  //auto update -> const updateAnswer dispatched allAnswers en daarop wordt onderstaande getriggerd
  useEffect(() => {

    clearTimeout(saveTimeOut);

    saveTimeOut = setTimeout(() => {
      saveHomeworkAnswers();
    }, 3000);//getest en ook als je binnen deze tijd naar een andere pagina gaat wordt deze uitgestelde functie nog uitgevoerd!

  }, [allAnswers]);

  const saveImmediately = () => {

    //wordt aangeroepen vanuit component Buttons...
    if (saveTimeOut !== null)
    {
      clearTimeout(saveTimeOut);
      saveHomeworkAnswers();
    }
  }

  const saveHomeworkAnswers = () => {

    //answers van deze les zoeken in allAnswers
    let answers = allAnswers.answers.find((homework) => {
      return parseInt(homework.the_id) === parseInt(activeHomework)
    });

    if (answers !== undefined) //om te voorkomen dat bij initialisatie van component er een leeg object gesaved wordt
    {

      //evt nog include gegevens invoegen:
      /*
      let theHomework = intervention.settings.homework.find((homework) => {
        return parseInt(homework.id) === parseInt(activeHomework)
      })
      */

      /// er kunnen meerdere lessen zijn met hetzelfde id.....
      /// alle opties doorlopen lost dat het save probleem op? lijkt wel.....
      let theHomeworks = intervention.settings.homework.filter(function (homework) {
        return homework.id === activeHomework
      });

      if(theHomeworks.length > 0){
        answers.answers.forEach((answer, aIndex) => {
          for(let i = 0 ; i < theHomeworks.length ; i++){
            theHomeworks[i].settings.parts.forEach((part, pIndex) => {
              if (part.id === answer.id && part.hasOwnProperty('parentType'))
              {
                answers.answers[aIndex].parentType = part.parentType;
                answers.answers[aIndex].parentId = part.parentId;
                answers.answers[aIndex].include_id = part.include_id;
              }
            })
          }
        })
      }

      /*
      if (typeof theHomework !== 'undefined')
      {
        answers.answers.forEach((answer, aIndex) => {
          theHomework.settings.parts.forEach((part, pIndex) => {
            if (part.id === answer.id && part.hasOwnProperty('parentType'))
            {
              answers.answers[aIndex].parentType = part.parentType;
              answers.answers[aIndex].parentId = part.parentId;
              answers.answers[aIndex].include_id = part.include_id;
            }
          })
        })
      }
      */

      let homework = {
        id: activeHomework,
        answers
      }

      apiCall({
        action: "save_homework_answers",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          homework
        }
      }).then(() => {
        saveTimeOut = null;
      })
    }
    else
    {
      saveTimeOut = null;
    }

  }

  //antwoord ophalen van betreffend part
  const getPartAnswer = (part_id) => {
    let homeworkAnswers = allAnswers.answers.find((homework) => {
      return parseInt(homework.the_id) === parseInt(activeHomework)
    });
    if (typeof homeworkAnswers !== 'undefined')
    {
      let partAnswer = homeworkAnswers.answers.find((answer) => {
        return answer.id === part_id
      });
      if (typeof partAnswer !== 'undefined')
      {
        return partAnswer.answer;
      }
      else
      {
        return "";
      }
    }
    else
    {
      return "";
    }
  }

  //////////////////////
  ///Update answers
  const updateAnswer = (part_id, part_answer) => {

    //eventuele rode border bij verplicht veld verwijderen
    if (document.getElementById("cph_"+part_id).getElementsByClassName('must').length > 0)
    {
      document.getElementById("cph_"+part_id).getElementsByClassName('must')[0].classList.remove("empty");
    }

    let homeworkKey = -1;
    for (const [index, homework] of allAnswers.answers.entries()) {
      if (parseInt(homework.the_id) === parseInt(activeHomework))
      {
        homeworkKey = index;
        break;
      }
    }
    if (homeworkKey > -1)
    {
      let partKey = -1;
      for (const [index, answer] of allAnswers.answers[homeworkKey].answers.entries()) {
        if (answer.id === part_id)
        {
          partKey = index;
          break;
        }
      }
      let newAllAnswers = getClone(allAnswers);
      if (partKey > -1)
      {
        //update anwers
        newAllAnswers.answers[homeworkKey].answers[partKey].answer = part_answer;
      }
      else
      {
        //add answers, vraag was nog niet eerder beantwoord...
        newAllAnswers.answers[homeworkKey].answers.push({
          id: part_id,
          answer: part_answer //parentType, parentId en includeId laten we hier even weg...
        });
      }
      dispatch(setAnswersHomework(newAllAnswers.intervention_id, newAllAnswers.answers));
      //deze dispatch triggered useEffect functie hierboven die antwoorde saved.
    }

  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <HomeworkHeaderMobile homework={homework}/>
      <div className="center">
        <table className='titleHolder'>
          <tbody>
            <tr>
              <td>
                <h1 id="title">{parse(homework.title)}</h1>
              </td>
              {
                (homework.settings.image != '' && typeof homework.settings.image !== "undefined") ?
                <td>
                  <div className="illustration" style={{ backgroundImage: "url('"+ homework.settings.image + "')" }}>

                  </div>
                </td>
                  : <></>
              }
            </tr>
          </tbody>
        </table>
      </div>
      {
        homework.settings.parts.map((part, index) => {
          return (
            <div key={index} className="component_holder" id={'cph_'+part.id} >
              <GetPart
                index={index}
                part={part}
                type="homework"
                answer={getPartAnswer(part.id)}
                updateAnswer={updateAnswer}
                />
          </div>
          )
        })
      }
      <Buttons saveImmediately={saveImmediately} />
    </form>
  )

}

export default Homework;
