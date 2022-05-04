import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveHomework, setActiveSubHomework } from "../../../actions";
import {appSettings} from "../../../custom/settings";

const HomeworkMenu = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [mainHomework, setMainHomework] = useState(0);
  const [homeworkList, setHomeworkList] = useState([]);

  const activeHomework = useSelector(state => state.activeHomework);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersHomework);
  const activePart = useSelector(state => state.activePart);

  useEffect(() => {
    let homeworksToUse = intervention.settings.homework

    //homework zoeken
    let homework = homeworksToUse.find((homework) => {
      return parseInt(homework.id) === parseInt(activeHomework)
    });
    //mainHomework bepalen (hoogste in de structuur)
    if (typeof homework !== 'undefined')
    {
      if (parseInt(homework.parent_id) === 0)
      {
        setMainHomework(activeHomework);
      }
      else
      {
        setMainHomework(parseInt(homework.parent_id));
      }
    }
  }, [intervention, activeHomework]);

  //menu items samenstellen
  useEffect(() => {

    if (intervention.id !== 0 && allAnswers.answers.length > 0 && mainHomework !== 0)
    {
      let homeworksToUse = intervention.settings.homework;

      let newHomeworkList = [];
      let aFinishedHomework = false;
      let anActiveHomework = false;
      for (const homework of homeworksToUse) {

        if ((parseInt(homework.id) === parseInt(mainHomework) && parseInt(homework.sub_id) === 0) || (parseInt(homework.parent_id) === parseInt(mainHomework) && (!homework.hasOwnProperty('sub_id') || parseInt(homework.sub_id) === 0)) &&  ( homework.settings.visible != 'hidden') )
        {
          if (homeworkFinished(homework.id))
          {
            homework.status = 'finished';
            aFinishedHomework = true;
          }
          else if (aFinishedHomework && !anActiveHomework)
          {
            homework.status = 'active';
            /// hier redirecten zorgt voor een onnodige reload + je kan niet meer terug naar de eerste pagina van de les => de link van de actieve les wordt nu opgezocht in het dashboard
            //dispatch(setActiveHomework(homework.id));
            //history.push("/course/" + intervention.id + "/homework/" + homework.id);
            anActiveHomework = true;
          }
          else
          {
            homework.status = 'closed';
          }

          newHomeworkList.push(homework);
        }
        else if (parseInt(homework.parent_id) === parseInt(mainHomework) && parseInt(homework.sub_id) > 0)
        {
          //actieve homework zetten voor lessen die uit meerder schermen (sub_id's) bestaan
          if (aFinishedHomework && !anActiveHomework)
          {
            anActiveHomework = true;
          }
        }

      }
      setHomeworkList(newHomeworkList);
    }

  }, [intervention, allAnswers, mainHomework])

  const changeActiveHomework = (homework_id) => {
    dispatch(setActiveHomework(homework_id));
    dispatch(setActiveSubHomework(0));
    history.push("/course/" + intervention.id + "/" + activePart + "/" + homework_id);
  }

  const fakeEmptyFunc = () => {
    //om react tevreden te stellen
  }


  const homeworkFinished = (homework_id) => {
    let currentHomeworkAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(homework_id)
    });
    if (typeof currentHomeworkAnswers !== 'undefined' &&  currentHomeworkAnswers.hasOwnProperty('finished') && currentHomeworkAnswers.finished === true)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  return (
    <>
      {
        homeworkList.map((homework, index) => {
          if (parseInt(homework.id) === parseInt(mainHomework))
          {
            return (
              <div className="parent" key={index}>
                <span onClick={()=>changeActiveHomework(homework.id)}>{homework.title}</span>
              </div>
            )
          }
          else if (parseInt(homework.parent_id) === parseInt(mainHomework))
          {
            return (
              <div className={(homeworkFinished(homework.id) || homework.status == 'active' ?'':'closed ') + (parseInt(activeHomework) === parseInt(homework.id) ? 'part active' : 'part') } key={index}>
                <span onClick={(homework.status === 'finished' || homework.status === 'active') ? ()=>changeActiveHomework(homework.id) : ()=>fakeEmptyFunc()} >
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          {homework.title}
                        </td>
                        <td>
                          {(homeworkFinished(homework.id) && activeHomework !== homework.id ?
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done_no_background.svg')}/>
                          :
                            <div>
                              {activeHomework == homework.id || homework.status == 'active'  ? '' : <img src={require('../../../images/course/standard/lock.png')}/>}
                            </div>
                        )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </span>
              </div>
            )
          }
        })
      }
    </>
  )
}

export default HomeworkMenu;
