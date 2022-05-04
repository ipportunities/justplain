import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import apiCall from "../api";
import t from "../translate";
import ErrorPage from "../error/";
import LoadScreen from "../loadScreen";
import ContentFront from "../content/front/";
import { setIntervention } from "../../actions";
import { useLocation } from "react-router-dom";

const LessonFillOut = () => {

  let location = useLocation();
  const [allAnswers, setAllAnswers] = useState([]);
  const lesson_id = location.pathname.split("/")[2];
  const [answers, setAnswers] = useState({
    the_id:lesson_id,
    answers:[]
  });
  const [content, setContent] = useState("");
  const [treePart, setTreePart] = useState([]);
  const [partsToCombine, setPartsToCombine] = useState([]);
  const [pagesHistory, setPagesHistory] = useState([]);

  const dispatch = useDispatch();
  const intervention_id = useSelector(state => state.intervention.id);

  const [allowed, setAllowed] = useState('loading');
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const auth = useSelector(state => state.auth);

  const getSettings = lesson_id => {
    //api aanroepen
    apiCall({
      action: "get_lesson_answers",
      token: auth.token,
      data: {
        id: lesson_id
      }
    }).then(resp => {
      if(resp.error == 0)
      {
        if (intervention_id == 0) {
          dispatch(
            setIntervention(
              resp.intervention_id,
              resp.organisation_id,
              resp.intervention_title,
              resp.intervention_settings
            )
          );
        }

        if (Object.keys(resp.allAnswers).length != 0) {
          setAllAnswers(resp.allAnswers);

        }

        if (typeof resp.pagesHistory != "undefined" && resp.pagesHistory != null ) {
          setPagesHistory(resp.pagesHistory);
        }

        if (Object.keys(resp.treePart).length != 0) {
          setTreePart(resp.treePart);

          changeLessonContent(resp.treePart, lesson_id, 'treu', resp.allAnswers)

          let tempPartsToCombine = [];
          tempPartsToCombine.push(resp.treePart.id)

          if(resp.treePart.children){
            for(let i = 0 ; i< resp.treePart.children.length ; i++){
              tempPartsToCombine.push(resp.treePart.children[i].id)
            }
          }
          setPartsToCombine(tempPartsToCombine)
        }
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
  };

  const history = useHistory();

  function changeLessonContent(treePart, new_lesson_id, empty = 'false', passAllAnswers = 'false'){

    let this_answer_obj = [];

    /// set answers
    if(passAllAnswers == 'false'){
      this_answer_obj = allAnswers.filter(function (answer) {
        return answer.the_id === new_lesson_id
      });
    } else {
      /// on init
      this_answer_obj = passAllAnswers.filter(function (answer) {
        return answer.the_id === new_lesson_id
      });
    }

    if(this_answer_obj.length != 0){
      setAnswers(this_answer_obj[0])
    } else if(empty == 'true'){
      setAnswers({
        the_id:new_lesson_id,
        answers:[]
      })
      let tempAllAnswers = [...allAnswers]
      tempAllAnswers.push({
        the_id:new_lesson_id,
        answers:[]
      })
      setAllAnswers(tempAllAnswers)
    }

    if(new_lesson_id == treePart.id){
      setContent(treePart.settings)
    } else {
      let childEl = treePart.children.find(child => child.id === new_lesson_id);
      setContent(childEl.settings)
    }
    if(new_lesson_id != lesson_id){
      history.push(
        "/lesson/"+new_lesson_id
      );
    }
  }

  useEffect(() => {
    getSettings(lesson_id);
  }, []);

  return (
    <div>
      {allowed == true ?
        <div>
          <div
            className={message.length < 1 ? "hidden" : "alert alert-success"}
            role="alert"
          >
            {message}
          </div>
          <div
            className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
            role="alert"
          >
            {errorMessage}
          </div>

          <ContentFront
            id={lesson_id}
            content={content}
            allAnswers={allAnswers}
            setAllAnswers={setAllAnswers}
            answers={answers}
            setAnswers={setAnswers}
            treePart={treePart}
            partsToCombine={partsToCombine}
            changeLessonContent={changeLessonContent}
            pagesHistory={pagesHistory}
            type="lesson"
            />
            
        </div>
      :
      <div>
        {allowed == "loading" ? <div><LoadScreen/></div>:<div><ErrorPage/></div>}
      </div>
    }
    </div>
  )
};

export default LessonFillOut;
