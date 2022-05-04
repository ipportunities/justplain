import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getClone } from "../../utils";
import apiCall from "../../api";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";

const ListItemSettings = props => {
  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [goal, setGoal] = useState(false)
  const [lessons, setLessons] = useState([])

  const [chosenReleaseAfter, setChosenReleaseAfter] = useState('')
  const [chosenLogOff, setChosenLogOff] = useState('')
  const [skipFirstPage, setSkipFirstPage] = useState('')
  const [chosenPDF, setChosenPDF] = useState('')
  const [directAccessSubLessons, setDirectAccessSubLessons] = useState('')
  const [feedbackQuestionnaireInLesson, setFeedbackQuestionnaireInLesson] = useState('')
  const [progressionQuestionnaireInLesson, setProgressionQuestionnaireInLesson] = useState('')
  const [checkAnswerQuestionnaireInLesson, setCheckAnswerQuestionnaireInLesson] = useState('')
  const [lockAnswersAfterFinishQuestionnaireInLesson, setLockAnswersAfterFinishQuestionnaireInLesson] = useState('')

  /// er wordt hier nog veel op undefined gecheckt daar kan nog iets beter denk ik

  useEffect(() => {
    if(intervention.id > 0){
      if(props.type == "questionnaire"){
        if(intervention.settings.questionnaires[props.index]){
          if(intervention.settings.questionnaires[props.index].settings){
            if(intervention.settings.questionnaires[props.index].settings.feedbackQuestionnaireInLesson){
              setFeedbackQuestionnaireInLesson(intervention.settings.questionnaires[props.index].settings.feedbackQuestionnaireInLesson)
            }
            if(intervention.settings.questionnaires[props.index].settings.progressionQuestionnaireInLesson){
              setProgressionQuestionnaireInLesson(intervention.settings.questionnaires[props.index].settings.progressionQuestionnaireInLesson)
            }
            if(intervention.settings.questionnaires[props.index].settings.checkAnswerQuestionnaireInLesson){
              setCheckAnswerQuestionnaireInLesson(intervention.settings.questionnaires[props.index].settings.checkAnswerQuestionnaireInLesson)
            }
            if(intervention.settings.questionnaires[props.index].settings.lockAnswersAfterFinishQuestionnaireInLesson){
              setLockAnswersAfterFinishQuestionnaireInLesson(intervention.settings.questionnaires[props.index].settings.lockAnswersAfterFinishQuestionnaireInLesson)
            }
          }
        }
      } else {
        let tempLessons = []
        for(let i = 0 ; i < intervention.settings.selfhelp.lessons.length ; i++){
          if(intervention.settings.selfhelp.lessons[i].parent_id == 0){
            tempLessons.push(intervention.settings.selfhelp.lessons[i])
          }
        }
        setLessons(tempLessons)

        if(props.type == "optional_lesson"){
          if(intervention.settings.selfhelp.optionalLessons[props.index]){
            if(intervention.settings.selfhelp.optionalLessons[props.index].settings){
              if(intervention.settings.selfhelp.optionalLessons[props.index].settings.releaseAfterFinished){
                setChosenReleaseAfter(intervention.settings.selfhelp.optionalLessons[props.index].settings.releaseAfterFinished)
              }
              if(intervention.settings.selfhelp.optionalLessons[props.index].settings.printablePDF){
                setChosenPDF(intervention.settings.selfhelp.optionalLessons[props.index].settings.printablePDF)
              }
              if(intervention.settings.selfhelp.optionalLessons[props.index].settings.directAccessSubLessons){
                setDirectAccessSubLessons(intervention.settings.selfhelp.optionalLessons[props.index].settings.directAccessSubLessons)
              }
            }
          }

        }
        if(props.type == "goal"){
          if(intervention.settings.goals[props.index]){
            if(intervention.settings.goals[props.index].settings){
              if(intervention.settings.goals[props.index].settings.releaseAfterFinished){
                setChosenReleaseAfter(intervention.settings.goals[props.index].settings.releaseAfterFinished)
              }
            }
          }
          /// misschien  alleen maar vorige laten zien en laten inspringen
          for(let i = (intervention.settings.goals.length - 1) ; i > 0   ; i--){
            if(intervention.settings.goals[i].id == props.id)
            {
              setGoal(intervention.settings.goals[(i - 1)])

              if(intervention.settings.goals[i].settings && intervention.settings.goals[i].settings.logOff){
                setChosenLogOff(intervention.settings.goals[i].settings.logOff)
              }

              if (intervention.settings.goals[i].settings && intervention.settings.goals[i].settings.skipFirstPage)
              {
                ///2022-2-2 dit deedt het niet hieronder wordt die wel gezet
                ///setSkipFirstPage(intervention.settings.goals[i].settings.skipFirstPage);
              }
              break;
            }
          }
        }
        if(intervention.settings.goals[props.index]){
          if(intervention.settings.goals[props.index].settings){
            if(intervention.settings.goals[props.index].settings.skipFirstPage){
              setSkipFirstPage(intervention.settings.goals[props.index].settings.skipFirstPage)
            }
          }
        }
      }
    }
  }, [props, intervention]);

  function selectChangeReleaseAfter(chosenOption){
    dispatch(setSavingStatus("not_saved"));
    let interventionC = getClone(intervention);
    if(props.type == "goal"){
      interventionC.settings.goals[props.index].settings.releaseAfterFinished = chosenOption
      saveInterventionSettings(interventionC.settings.goals[props.index].settings, interventionC.settings)
    }
    if(props.type == "optional_lesson"){
      interventionC.settings.selfhelp.optionalLessons[props.index].settings.releaseAfterFinished = chosenOption
      saveInterventionSettings(interventionC.settings.selfhelp.optionalLessons[props.index].settings, interventionC.settings)
    }
    setChosenReleaseAfter(chosenOption)

  }
  function selectChangeLogObjectOf(chosenOption){
    dispatch(setSavingStatus("not_saved"));
    let toSave = chosenLogOff == chosenOption ? '':chosenOption
    setChosenLogOff(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.goals[props.index].settings.logOff = toSave
    saveInterventionSettings(interventionC.settings.goals[props.index].settings, interventionC.settings)
  }

  function selectFeedbackQuestionnaireInLesson(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = feedbackQuestionnaireInLesson ? false:true
    setFeedbackQuestionnaireInLesson(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.questionnaires[props.index].settings.feedbackQuestionnaireInLesson = toSave
    saveInterventionSettings(interventionC.settings.questionnaires[props.index].settings, interventionC.settings)
  }

  function selectCheckAnswerQuestionnaireInLesson(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = checkAnswerQuestionnaireInLesson ? false:true
    setCheckAnswerQuestionnaireInLesson(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.questionnaires[props.index].settings.checkAnswerQuestionnaireInLesson = toSave
    saveInterventionSettings(interventionC.settings.questionnaires[props.index].settings, interventionC.settings)
  }

  function selectLockAnswersAfterFinishQuestionnaireInLesson(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = lockAnswersAfterFinishQuestionnaireInLesson ? false:true
    setLockAnswersAfterFinishQuestionnaireInLesson(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.questionnaires[props.index].settings.lockAnswersAfterFinishQuestionnaireInLesson = toSave
    saveInterventionSettings(interventionC.settings.questionnaires[props.index].settings, interventionC.settings)
  }

  function selectProgressionQuestionnaireInLesson(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = progressionQuestionnaireInLesson ? false:true
    setProgressionQuestionnaireInLesson(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.questionnaires[props.index].settings.progressionQuestionnaireInLesson = toSave
    saveInterventionSettings(interventionC.settings.questionnaires[props.index].settings, interventionC.settings)
  }

  function selectChangeSkipFirstPage() {
    dispatch(setSavingStatus("not_saved"));
    let toSave = skipFirstPage ? false:true
    setSkipFirstPage(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.goals[props.index].settings.skipFirstPage = toSave;
    saveInterventionSettings(interventionC.settings.goals[props.index].settings, interventionC.settings);
  }

  function selectChangePDF(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = chosenPDF == true ? '':true
    setChosenPDF(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.selfhelp.optionalLessons[props.index].settings.printablePDF = toSave
    saveInterventionSettings(interventionC.settings.selfhelp.optionalLessons[props.index].settings, interventionC.settings)
  }

  function selectDirectAccessSubLessons(){
    dispatch(setSavingStatus("not_saved"));
    let toSave = directAccessSubLessons == true ? '':true
    setDirectAccessSubLessons(toSave)
    let interventionC = getClone(intervention);
    interventionC.settings.selfhelp.optionalLessons[props.index].settings.directAccessSubLessons = toSave
    saveInterventionSettings(interventionC.settings.selfhelp.optionalLessons[props.index].settings, interventionC.settings)
  }

  function saveInterventionSettings(settings, allSettingsUpdated) {
    ////newPart + removePart maar toevoegen indien nodig voor de check
    if(typeof settings.newPart == "undefined"){
      settings.newPart = false;
    }
    if(typeof settings.removePart == "undefined"){
      settings.removePart = false;
    }

    /// door het cleanen van de settings bij de saveSettings in edit kan ik niks opslaan in de settings via die weg......... gewoon een enkel item saven dan maar
    let action = "save_lesson";
    if(props.type == "goal"){
      action = "save_goal";
    }
    if(props.type == "questionnaire"){
      action = "save_questionnaire";
    }
    apiCall({
      action: action,
      token: auth.token,
      data: {
        id: props.id,
        settings: settings
      }
    }).then(resp => {
      dispatch(setSavingStatus("saved"));
      /// ook dispatchen <= maar dat levert een error op zonder melding....

      dispatch(
        setIntervention(
          intervention.id,
          intervention.organisation_id,
          intervention.title,
          intervention.settings
        )
      );

    });
  }

  function hasLog(){
    if(props.type == "goal"){
      let nextIndex = props.index + 1
      /// bestaat die wel???
      if(nextIndex != intervention.settings.goals.length && intervention.settings.goals[nextIndex] && intervention.settings.goals[nextIndex].settings){
        if(intervention.settings.goals[nextIndex].settings.logOff){
          //// dit is een logitem
          if(intervention.settings.goals[nextIndex].settings.logOff != ""){
            return true
          }
        }
      }
    }
  }

  function prevIsLog(){
    if(props.type == "goal"){
      let prevIndex = props.index - 1
      /// bestaat die wel???
      if(prevIndex != 0){
        if(intervention.settings.goals[prevIndex] && intervention.settings.goals[prevIndex].settings && intervention.settings.goals[prevIndex].settings.logOff){
          //// dit is een logitem
          if(intervention.settings.goals[prevIndex].settings.logOff != ""){
            return true
          }
        }
      }
    }
  }

  return (
    <div>
      {props.type == "goal" && chosenReleaseAfter == "" && goal && !hasLog() && !prevIsLog()  ?
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    {t("Log item van")} {goal.title}
                  </h5>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={chosenLogOff == goal.id ? true:false} onClick={(e) => selectChangeLogObjectOf(goal.id)}/> {chosenLogOff}
                    <span className="slider_switch round" ></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      : <></>}
      {props.type == "goal" && chosenLogOff == "" ?
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    Tussenpagina niet tonen
                  </h5>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={skipFirstPage ? true : false} onClick={(e) => selectChangeSkipFirstPage()}/> {skipFirstPage}
                    <span className="slider_switch round" ></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      : <></>}
      {(props.type == "goal" || props.type == "optional_lesson") && chosenLogOff == "" ?
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    {t("Ontsluiten na voltooien les")}
                  </h5>
                </td>
                <td>
                <select onChange={(e) => selectChangeReleaseAfter( e.target.value)} value={chosenReleaseAfter}>
                  <option value="">Direct benaderbaar</option>
                  {lessons.map((lesson, index) =>
                    <option key={index} value={lesson.id}>{lesson.title}</option>
                  )}
                </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      :''}
      {props.type == "optional_lesson" ?
        <>
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    {t("Pdf met antwoorden downloadbaar")}
                  </h5>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={chosenPDF == true ? true:false} onClick={(e) => selectChangePDF()}/>
                    <span className="slider_switch round" ></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div><div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    {t("Sublessen zijn direct benaderbaar")}
                  </h5>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={directAccessSubLessons == true ? true:false} onClick={(e) => selectDirectAccessSubLessons()}/>
                    <span className="slider_switch round" ></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </>
      :''}
      {props.type == "questionnaire" ?
        <div>
          <div className="part_title">{t("In de les")}</div>
          <table>
            <tbody>
              <tr>
                <td>
                  <h5>
                    {t("Toon feedback scherm einde vragenlijst")}
                  </h5>
                </td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={feedbackQuestionnaireInLesson == true ? true:false} onClick={(e) => selectFeedbackQuestionnaireInLesson()}/>
                    <span className="slider_switch round" ></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          {feedbackQuestionnaireInLesson ?
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>
                      {t("Na afronding zijn antwoorden niet meer aan te passen")}
                    </h5>
                  </td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={lockAnswersAfterFinishQuestionnaireInLesson == true ? true:false} onClick={(e) => selectLockAnswersAfterFinishQuestionnaireInLesson()}/>
                      <span className="slider_switch round" ></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
            :false}
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>
                      {t("Tussentijds checken antwoorden mogelijk")}
                    </h5>
                  </td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={checkAnswerQuestionnaireInLesson == true ? true:false} onClick={(e) => selectCheckAnswerQuestionnaireInLesson()}/>
                      <span className="slider_switch round" ></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>
                      {t("Toon progressie")}
                    </h5>
                  </td>
                  <td>
                    <label className="switch">
                      <input type="checkbox" checked={progressionQuestionnaireInLesson == true ? true:false} onClick={(e) => selectProgressionQuestionnaireInLesson()}/>
                      <span className="slider_switch round" ></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      :''}
    </div>
  )
};

export default ListItemSettings;
