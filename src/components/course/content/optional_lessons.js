import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getClone } from "../../utils";
import { setActivePart, setActiveLesson } from "../../../actions";
import DownloadPDFButton from "../download_button_pdf_php.js";
import {appSettings} from "../../../custom/settings";
import parse from 'html-react-parser';

const OptionalLessons = (props) => {

  const [optionalLessonList, setOptionalLessonList] = useState([])
  const [showList, setShowList] = useState(false)
  const activeIntervention = useSelector(state => state.activeIntervention);
  const dispatch = useDispatch();
  const history = useHistory();

  const intervention = useSelector(state => state.intervention);
  const answersLessons = useSelector(state => state.answersLessons.answers);

  const changeActiveLesson = (lesson_id, status) => {
    if(status != "closed"){
      dispatch(setActivePart("optional-lesson"));
      dispatch(setActiveLesson(lesson_id));
      history.push("/course/" + intervention.id + "/optional-lesson/" + lesson_id);
    }
  }

  //status bepalen
  useEffect(() => {
    if(intervention.id > 0 && answersLessons.length > 0 && activeIntervention == intervention.id){
      setShowList(true)
    }

  }, [intervention, answersLessons]);

  //status bepalen
  useEffect(() => {
    let newlessonList = [];

    for (const lesson of intervention.settings.selfhelp.optionalLessons) {
      if (parseInt(lesson.parent_id) === 0 && parseInt(lesson.sub_id) === 0) //les op hoofdniveau
      {

        if(typeof lesson.settings.releaseAfterFinished == "undefined" || lesson.settings.releaseAfterFinished == ""){
          lesson.status = 'open'
        } else {
          lesson.status = checkStatusParentLesson(lesson.settings.releaseAfterFinished)
        }
        newlessonList.push(lesson)
      }
    }
    setOptionalLessonList(newlessonList)
  }, [props]);

  function checkStatusParentLesson(id){
    let lesson_obj = props.lessonList.filter(function (lesson) {
      return lesson.id === id
    });
    if(lesson_obj.length > 0){
      return lesson_obj[0].status
    }
  }

  //// en wat als een les geen vragen heeft?
  function checkIfOptionalLessonIsFinished(the_id){
    let answer_obj = answersLessons.filter(function (answersLesson) {
      return answersLesson.the_id === the_id
    });
    if(answer_obj.length > 0){
      return answer_obj[0].finished
    }
  }

  return(
    <div>
      {optionalLessonList.length > 0 && showList ?
        <div className='optional-lessons'>
          <div className="intro">
            <h2>Extra modules</h2>
            {typeof intervention.settings.optionalLessonsIntro != 'undefined' &&  intervention.settings.optionalLessonsIntro != '' ?
              <div className="description">
                {parse(intervention.settings.optionalLessonsIntro)}
              </div>
            :''}
          </div>
          <div className={'items clearfix' + (props.allLessonsFinished != 'true' ? ' closed':'')}>
            {
              optionalLessonList.map((lesson, index) => {
                return (
                <div key={index} className={'item ' + (lesson.status != 'active' ? lesson.status:'')}  >
                  <table onClick={()=>changeActiveLesson(lesson.id, lesson.status)}>
                    <tbody>
                      <tr>
                        <td>
                        {(lesson.status == "finished" || lesson.status == "open" ?
                          <div>
                            {!checkIfOptionalLessonIsFinished(lesson.id) ?
                              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/active.svg')}/>
                              :
                              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done.svg')}/>}
                          </div>
                          :
                          <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/locked.svg')}/>
                        )}
                        </td>
                        <td>
                          <span>
                            {lesson.title}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {lesson.settings.printablePDF && checkIfOptionalLessonIsFinished(lesson.id) ?
                    <div className="options">
                      <DownloadPDFButton
                        id={lesson.id}
                        type="optional-lesson"
                      />
                    </div>
                    :''}
                </div>)
              })
            }
          </div>
        </div>
        : <></>}
    </div>
  )
}

export default OptionalLessons;
