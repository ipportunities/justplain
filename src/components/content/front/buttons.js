import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveLesson } from "../../../actions";
import { useLocation } from "react-router-dom";

const FrontButtons = (props) => {

  let location = useLocation();

  const activePart = useSelector(state => state.activePart);
  const intervention = useSelector(state => state.intervention);

  const currentPageIndex = 1;
  const pages = [];
  const nextLessonId = 0;
  const goToPrevPage = () => {};

  function checkIfNextIsAllowed(updatedAnswers){
    let nextAllowedNew = true

    for(let i = 0 ; i < currentPage.length ; i++)
    {
      if(currentPage[i].must == true){
        let this_answer_obj = updatedAnswers.answers.filter(function (answer) {
          return answer.id === currentPage[i].id
        });

        if(this_answer_obj.length != 0){

          if(this_answer_obj[0].answer == '' && (currentPage[i].type == "question_open" || currentPage[i].type == "select" || currentPage[i].type == "slider"))
          {
            nextAllowedNew = false;
            break;
          }
          if(currentPage[i].type == "question_checkboxes" || currentPage[i].type == "question_radio"){
            if(this_answer_obj[0].answer.chosenAnswers.length == 0 || typeof this_answer_obj[0].answer.chosenAnswers == "undefined"){
              nextAllowedNew = false;
              break;
            }
          }
        } else {
          nextAllowedNew = false;
          break;
        }
      }
    }

    setNextAllowed(nextAllowedNew)
    return nextAllowedNew
  }

  //////////////////////
  ///Go to nextpage
  function goToNextPage(){
    if(checkIfNextIsAllowed(props.answers)){
      let newPageIndex = checkForRoutingForward(currentPageIndex + 1);
      goToPage(newPageIndex)
    }
  }
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
  const goToPrevPartOfLesson = () => {};

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

  return (

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
  )
}

export default FrontButtons;
