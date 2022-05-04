import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import CoursesFrontContent from "./parts/helpers/content.js";
import ProgressBar from "./parts/helpers/progressBar.js";
import Menu from "./parts/helpers/menu.js";
import parse from 'html-react-parser';
import { getClone } from "../../utils";
import apiCall from "../../api";
import LeftBottom from "../../course/content/leftBottom.js";
import { useHistory } from "react-router-dom";
import { setActivePart, setActiveGoal } from "../../../actions";
import NotificationBox from "../../alert/notification";
import t from "../../translate";
import { useLocation } from "react-router-dom";

let teller = 0; // nog laten staan ivm autosaven
let save = false;
let saveTimeout = false;
let animateTimeout = false;

const ContentFront = props => {

  let location = useLocation();
  const dispatch = useDispatch();

  teller++;

  let timeout = false;
  let goal_result_id = 0;
  let the_id = location.pathname.split("/")[2];
  let page_offset = location.pathname.split("/")[3];
  if(props.type == "goal"){
    the_id = location.pathname.split("/")[4];
    goal_result_id = location.pathname.split("/")[5];
    page_offset = location.pathname.split("/")[6];
  }

  const history = useHistory();

  const [title, setTitle] = useState('');
  const [pages, setPages] = useState([]);
  const [indexActiveLessonPart, setIndexActiveLessonPart] = useState(0);
  const [pagesHistory, setPagesHistory] = useState([]); /// deze nog saven zodat we ook kunnen starten waar we gebleven zijn
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState([]);

  const [nextLessonId, setNextLessonId] = useState(false);
  const [prevLessonId, setPrevLessonId] = useState(false);
  const [prevAction, setPrevAction] = useState(false);
  const [nextAllowed, setNextAllowed] = useState(true)
  const [notificationOptions, setNotificationOptions] = useState('');

  const [save, setSave] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [animated, setAnimated]= useState(false)

  if(!animated){
    clearTimeout(animateTimeout);
    animateTimeout = setTimeout(() => {
      setAnimated(true)
    }, 1000)
  }


  //////////////////////
  ///Get content
  useEffect(() => {

    if (props.pagesHistory != "") {
      setPagesHistory(props.pagesHistory)
    }
    if (props.content != "") {
      setTitle(props.content.title);
      /// divide parts into pages
      let pages = [];
      let pageCounter = 0;
      pages[pageCounter] = [];
      for(let i = 0 ; i< props.content.parts.length; i++ ){
        if(props.content.parts[i].subtype == "einde pagina"){
          pages[pageCounter].push(props.content.parts[i]);
          pageCounter++;
          pages[pageCounter] = [];
        } else {
          pages[pageCounter].push(props.content.parts[i]);
        }
      }

      setPages(pages);

      if(page_offset && page_offset < pages.length){
        /// TODO wat als er routing is en iemand landt op een pagina waar die eigenlijk niet moet zijn <= checken of pagina in history zit?
        setCurrentPageIndex(parseInt(page_offset))
        setCurrentPage(pages[page_offset]);
      } else {
        let currentPageIndexToUse = currentPageIndex
        if(prevAction){
          let indexCurrentLessonId = props.partsToCombine.indexOf(the_id)
          let newPageIndex = pagesHistory[indexCurrentLessonId].trajectory.slice(-1)[0];
          if(typeof pagesHistory[indexCurrentLessonId] != "undefined"){
            history.push(
              "/lesson/"+the_id+"/"+newPageIndex
            );
            setCurrentPageIndex(newPageIndex)
          }
          setPrevAction(false)
        }
        setCurrentPage(pages[currentPageIndexToUse]);
      }

    }

    if(typeof props.partsToCombine != "undefined" && props.partsToCombine != ""){
      let indexCurrentLessonId = props.partsToCombine.indexOf(the_id)
      setIndexActiveLessonPart(indexCurrentLessonId)
      if(indexCurrentLessonId != 0 && props.partsToCombine.length > 1){
        setPrevLessonId(props.partsToCombine[(indexCurrentLessonId - 1)]);
      } else {
        setPrevLessonId(false)
      }
      if(indexCurrentLessonId != (props.partsToCombine.length - 1) && props.partsToCombine.length > 1){
        setNextLessonId(props.partsToCombine[(indexCurrentLessonId + 1)]);
      } else {
        setNextLessonId(false)
      }
    }


  }, [props]);
  function end()
  {
    if(props.type == "goal"){
      apiCall({
        action: "save_goal_answers",
        token: auth.token,
        data: {
          goal_id: the_id,
          answers: props.answers,
          id:location.pathname.split("/")[5]
          //history:pagesHistory,
          //parentId:props.partsToCombine[0]
        }
      }).then(resp => {
        if (resp.error == 0 ) {
            toGoal()
        }
      });

    } else {
      if(checkIfNextIsAllowed(props.answers))
      {
        /// ook nog saven iig ivm progressie
        updatePageHistory(page_offset)

        let endFunction = "end_lesson"
        if(props.type == "questionnaire"){
          endFunction = "end_questionnaire"
        }

        apiCall({
          action: endFunction,
          token: auth.token,
          data: {
            the_id: props.partsToCombine[0] /// dit is de eerste dus de parent
          }
        }).then(resp => {
          if (resp.error == 0 ) {
              history.push("/course/" + intervention.id);
          }
        });
      }

    }
  }

  function checkIfNextIsAllowed(updatedAnswers){
    let nextAllowedNew = true
    let ids = []

    for(let i = 0 ; i < currentPage.length ; i++)
    {
      if(currentPage[i].must == true){
        let this_answer_obj = updatedAnswers.answers.filter(function (answer) {
          return answer.id === currentPage[i].id
        });

        if(this_answer_obj.length != 0){

          if(this_answer_obj[0].answer == '' && (currentPage[i].type == "question_open" || currentPage[i].type == "select" || currentPage[i].type == "slider"))
          {
            ids.push(currentPage[i].id)
          }
          if(currentPage[i].type == "question_checkboxes" || currentPage[i].type == "question_radio"){
            if(this_answer_obj[0].answer.chosenAnswers.length == 0 || typeof this_answer_obj[0].answer.chosenAnswers == "undefined"){
              ids.push(currentPage[i].id)
            }
          }
        } else {
          ids.push(currentPage[i].id)
        }
      }
    }
    if(ids.length > 0){
      nextAllowedNew = false;
      for(let i = 0 ; i < ids.length ; i++){
        document.getElementById("cph_"+ids[i]).getElementsByClassName('must')[0].classList.add("empty");
      }
      setNotificationOptions({
        show: "true",
        text: t("Je hebt niet alle verplichte velden ingevuld"),
        confirmText: t("Ok")
      });
    }

    setNextAllowed(nextAllowedNew)
    return nextAllowedNew
  }

  //////////////////////
  ///Update answers
  function updateAnswer(id, value) {
    let updatedAnswers = [...props.answers.answers];

    if (document.getElementById("cph_"+id).getElementsByClassName('must').length > 0)
    {
      document.getElementById("cph_"+id).getElementsByClassName('must')[0].classList.remove("empty");
    }

    let this_answer_obj = updatedAnswers.filter(function (answer) {
      return answer.id === id
    });
    let this_question_obj = currentPage.filter(function (part) {
      return part.id === id
    });

    let this_answer_obj_index = updatedAnswers.indexOf(this_answer_obj[0]);

    let parentType = typeof this_question_obj[0].parentType != "undefined" ? this_question_obj[0].parentType:''
    let parentId = typeof this_question_obj[0].parentId != "undefined" ? this_question_obj[0].parentId:''
    let include_id = typeof this_question_obj[0].include_id != "undefined" ? this_question_obj[0].include_id:''

    /// als het antwoord object nog neit bestaat
    if(this_answer_obj_index == -1)
    {
      updatedAnswers.push({id:id, answer:value, parentType:parentType, parentId:parentId, include_id:include_id})
    } else { /// het antwoord object bestaat als
      updatedAnswers[this_answer_obj_index].answer = value;
      /// zou eigenlijk niet meer hoeven want dit als het goed is al gezet
      //updatedAnswers[this_answer_obj_index].parentType = parentType;
      //updatedAnswers[this_answer_obj_index].parentId = parentId;
      //updatedAnswers[this_answer_obj_index].include_id = include_id;
    }

    let updatedAnswer = {the_id:the_id, answers:updatedAnswers}

    props.setAnswers(updatedAnswer)
    updateAllAnswers(updatedAnswer)
    saveAnswers(updatedAnswer)
  }

  function updateAllAnswers(updatedAnswer){
    let allAnswers = [...props.allAnswers]
    let this_answer_obj = allAnswers.filter(function (answer) {
      return answer.the_id === the_id
    });
    let this_answer_obj_index = allAnswers.indexOf(this_answer_obj[0])
    allAnswers[this_answer_obj_index] = updatedAnswer
    props.setAllAnswers(allAnswers)
  }
  //////////////////////
  ///Go to page
  function goToPage(newPageIndex){
    setCurrentPageIndex(newPageIndex)

    updatePageHistory(newPageIndex)
    setCurrentPage(pages[newPageIndex])
    window.scrollTo(0, 0);

    if(props.type == "goal"){
      history.push(
        "/course/"+intervention.id+"/goal-edit/"+the_id+"/"+goal_result_id+"/"+newPageIndex
      );
    } else {
      history.push(
        "/"+props.type+"/"+the_id+"/"+newPageIndex
      );
    }
    setNextAllowed(true)
  }

  function updatePageHistory(newPageIndex){
    let history_parts_obj = pagesHistory.filter(function (part) {
      return part.the_id === the_id
    });

    let updatePagesHistory = [...pagesHistory]
    let history_parts_obj_index = 0;
    if(history_parts_obj.length == 0){
      updatePagesHistory.push({the_id:the_id, trajectory:[]})
      history_parts_obj_index = updatePagesHistory.length - 1
    } else {
      history_parts_obj_index = updatePagesHistory.indexOf(history_parts_obj[0]);
    }

    updatePagesHistory[history_parts_obj_index].trajectory.push(currentPageIndex)
    ///setPagesHistory(updatePagesHistory)

    if(props.type == "lesson"){
      apiCall({
        action: "save_lesson_page_history",
        token: auth.token,
        data: {
          parentId:props.partsToCombine[0],
          history:updatePagesHistory,
        }
      }).then(resp => {
        //later dan gaat het tot nu toe goed
        setPagesHistory(updatePagesHistory)
      });
    }
    if(props.type == "goal"){
      setPagesHistory(updatePagesHistory)
      /*
      apiCall({
        action: "save_goal_page_history",
        token: auth.token,
        data: {
          parentId:the_id,
          history:updatePagesHistory,
        }
      }).then(resp => {
        //later dan gaat het tot nu toe goed
        setPagesHistory(updatePagesHistory)
      });
      */
    }
  }
  //////////////////////
  ///Go to prevpage
  function goToPrevPage(){
    let newPageIndex = 0;
    /// find prev index smaller than currentPage op deze manier hoeven we niet backwards te checken op routing. Je pagesHistory bevat je routing
    if(typeof pagesHistory[indexActiveLessonPart] != "undefined"){
      for(let i=(pagesHistory[indexActiveLessonPart].trajectory.length - 1) ; i >= 0  ; i--){
        if(pagesHistory[indexActiveLessonPart].trajectory[i] < currentPageIndex){
          newPageIndex = pagesHistory[indexActiveLessonPart].trajectory[i]
          break;
        }
      }
    }

    goToPage(newPageIndex)
  }
  //////////////////////
  ///Go to nextpage
  function goToNextPage(){
    if(checkIfNextIsAllowed(props.answers)){
      let newPageIndex = checkForRoutingForward(currentPageIndex + 1);
      goToPage(newPageIndex)
    }
  }
  //////////////////////
  ///Is there routing?
  function checkForRoutingForward(goToPageIndex){
    let routedToId = false;
    /// get last routed question
    for(let i=(currentPage.length - 1) ; i >= 0  ; i--)
    {
      if(currentPage[i].type == "question_radio" || currentPage[i].type == "select"){
        /// check for answer for this question
        let this_answer_obj = props.answers.answers.filter(function (answer) {
          return answer.id === currentPage[i].id
        });
        let this_answer_obj_index = props.answers.answers.indexOf(this_answer_obj[0]);

        for(let ii = 0 ; ii < currentPage[i].items.length ; ii++)
        {
          /// get routing if er is een antwoord
          if(this_answer_obj_index != -1 && this_answer_obj[0].answer.chosenAnswers.length != 0){
            let idOfChosenAnswer = this_answer_obj[0].answer.chosenAnswers[0]; /// checkbox kan er maar 1 hebben
            if(idOfChosenAnswer == currentPage[i].items[ii].id && currentPage[i].items[ii].routing != "")
            {
              routedToId = currentPage[i].items[ii].routing
            }
          }
        }
      }
      if(currentPage[i].subtype == "einde pagina"){
        if(typeof currentPage[i].routing != "undefined" && currentPage[i].routing != "")
        {
            routedToId = currentPage[i].routing
        }

      }
    }

    if(routedToId){
      /// find page with question with id
      for(let i = 0 ; i< pages.length; i++ ){
        for(let ii = 0 ; ii< pages[i].length; ii++ ){
          if(pages[i][ii].id == routedToId)
          {
            goToPageIndex = i;
            break;
          }
        }
      }
      return goToPageIndex;
    } else {
      return goToPageIndex;
    }
  }
  //////////////////////
  ///Get answer based on id
  function getAnswer(id){
    if(typeof props.answers.answers != "undefined"){
      let answer = props.answers.answers.filter(function (answer) {
        return answer.id === id
      });

      if(Object.keys(answer).length)
      {
        return answer[0].answer
      } else {
        return '';
      }
    } else {
      return '';
    }

  }

  //////////////////////
  ///Save function after timeout maar niet pas na useEffect
  function saveAnswers(updated_answers){
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      let apiCallObj = {};
      if(props.type == "questionnaire")
      {
        apiCallObj =   {
          action: "save_questionnaire_answers",
          token: auth.token,
          data: {
            questionnaire: {
              id: props.id,
              answers: updated_answers,
              included:props.included && typeof props.parentType != "undefined" ? props.parentType:'',
              include_id:props.included && typeof props.parentType != "undefined" && typeof props.include_id != 'unedefined' ? props.include_id:'',
              parentId:props.partsToCombine[0]
            }
          }
        }
      }
      if(props.type == "lesson")
      {
        apiCallObj =   {
          action: "save_lesson_answers",
          token: auth.token,
          data: {
            lesson: {
              id: props.id,
              answers: updated_answers,
              parentId:props.partsToCombine[0]
            }
          }
        }
      }
      /// goals enkel saven na klik actie
      if(props.type != "goal")
      {
        apiCall(apiCallObj).then(resp => {
          if (resp.error == 99) {
            //sessie verlopen, uitloggen
            window.location.reload();
          }
        });
      }

    }, 100); // als je snel switched dan wordt er niks gesaved bij een les switch...
  }

  function getEndText(){
    if(props.type == "lesson"){return "Einde les"}
    if(props.type == "questionnaire"){return "Einde vragenlijst"}
    if(props.type == "goal"){return t("Opslaan")}
  }

  /*
{pages.length > 1 ? <ProgressBar nrPages={pages.length} currentPageIndex={currentPageIndex}/>:''}
  */

  function goToNextPartOfLesson(){
    if(checkIfNextIsAllowed(props.answers)){
      //// todo onderstaande moet eerste dan de rest of heeft een nieuwe gebruiker er geen last van....
      updatePageHistory(page_offset > 0 ? page_offset:0)
      setCurrentPageIndex(0)
      let updatedIndexActiveLessonPart = indexActiveLessonPart + 1
      setIndexActiveLessonPart(updatedIndexActiveLessonPart)
      props.changeLessonContent(props.treePart, nextLessonId, 'true')
      setNextAllowed(true)
      setCurrentPageIndex(0)
      window.scrollTo(0, 0);
    }
  }
  function goToPrevPartOfLesson(){
    /// get last of the pages of the part to set...
    setPrevAction(true)
    updatePageHistory(page_offset > 0 ? page_offset:0)

    let updatedIndexActiveLessonPart = indexActiveLessonPart - 1
    setIndexActiveLessonPart(updatedIndexActiveLessonPart)
    setCurrentPageIndex(0)
    props.changeLessonContent(props.treePart, prevLessonId, 'true')
    window.scrollTo(0, 0);
  }
  function toGoal() {
    dispatch(setActivePart("goal"));

    //goal met skipFirstPage?
    if(props.content.skipFirstPage !== 'undefined' && props.content.skipFirstPage === true) {
      dispatch(setActivePart("goals"));
      history.push("/course/" + intervention.id + "/goals");
    } else {
      /// check if is not log goal item <= if so find parent
      let go_to_id = the_id;
      if(props.content.logOff && props.content.logOff != ""){
        go_to_id = props.content.logOff
        dispatch(setActiveGoal(go_to_id));
      }
      history.push("/course/" + intervention.id + "/goal/" + go_to_id + "/");
    }
  }

  function loadLeftBottom(part){
    history.push("/course/" + intervention.id + "/" + part + "/");
  }

  return(
    <div className={"dashboard lessoncontent front" + (props.included ? ' included':'')}>
      <div className="holder clearfix">
      {!props.included ?
        <div className="left">
          <div className="content">
            {props.type == "lesson" ?
              <div>
                <Menu pages={pages} treePart={props.treePart} indexLessonId={props.partsToCombine.indexOf(the_id)} the_id={the_id} interventionId={intervention.id} allAnswers={props.allAnswers} changeLessonContent={props.changeLessonContent}
                pagesHistory={pagesHistory}
                />
              </div>
            :''}
            <LeftBottom load={loadLeftBottom}/>
          </div>
        </div>
      :''}
      <div className="right">
        {props.type == 'goal' ?
          <span className="btn btn-primary backToGoal" onClick={e=>toGoal()}>
            Terug naar het overzicht
          </span>
        :''}
        <form>
          {!props.included || props.type == 'goal'  ?
            <div className="center">
              <table className='titleHolder'>
                <tbody>
                  <tr>
                    <td>
                      <h1 id="title">{parse(title)}</h1>
                    </td>
                    {
                      (props.content.image != '' && typeof props.content.image != "undefined") ?
                        <td><img src={props.content.image} className='illustration' /></td>
                        : false
                    }
                  </tr>
                </tbody>
              </table>
            </div>
          :''}
          <div className="component_holder">
            {currentPage.map((part, index) => (
              <div
                key={part.id}
                className="component_holder" id={'cph_'+part.id}
              >
                {part.subtype != "einde pagina" ?
                <div
                  className="component"
                >
                  <CoursesFrontContent
                    index={index}
                    part={part}
                    allPart={currentPage}
                    options={props.options}
                    intervention_id={intervention.id}
                    interventionSettings={intervention.settings}
                    type={props.type}
                    updateAnswer={updateAnswer}
                    allAnswers={props.allAnswers}
                    answers={props.answers}
                    answer={getAnswer(part.id)}
                    nextAllowed={nextAllowed}
                    pagesHistory={pagesHistory}
                    updatePageHistory={updatePageHistory}
                  />
                </div>
                :''}
              </div>
            ))}
          </div>
          <div className="center pageControls">
            {currentPageIndex > 0 ?
              <span className="btn btn-primary prev" onClick={(e)=> goToPrevPage()} style={{zIndex: props.zIndex}}>
                {t("Vorige pagina")}
              </span>
              :''}
            {currentPageIndex < pages.length - 1 ?
              <span className="btn btn-primary next" onClick={(e)=> goToNextPage()} style={{zIndex: props.zIndex}}>
                {t("Volgende pagina")}
              </span>
              :''}
            {nextLessonId && (currentPageIndex == pages.length - 1)?
              <span className="btn btn-primary next" onClick={(e)=> goToNextPartOfLesson()} style={{zIndex: props.zIndex}}>
                {t("Volgende pagina")}
              </span>
              :''}
            {prevLessonId && (currentPageIndex == 0) ?
              <span className="btn btn-primary prev" onClick={(e)=> goToPrevPartOfLesson()} style={{zIndex: props.zIndex}}>
                {t("Vorige pagina")}
              </span>
              :''}
            {(currentPageIndex == pages.length - 1) && !nextLessonId && props.type != 'page'  ?
              <span className="btn btn-primary next" onClick={(e) => end()}>
                {getEndText()}
              </span>
              :''}
          </div>
        </form>
        </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )
}

export default ContentFront;
