import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import apiCall from "../../../api";
import ContentFront from "../index.js";

const Forms = (props) => {
  const [pages, setPages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [allowed, setAllowed] = useState('loading');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const auth = useSelector(state => state.auth);
  //////////////////////
  ///On init
  useEffect(() => {
    apiCall({
      action: "get_questionnaire_answers",
      token: auth.token,
      data: {
        id: props.part.form_id,
        included:props.type,
        include_id:props.part.id
      }
    }).then(resp => {
      if(resp.error == 0)
      {
        if (Object.keys(resp.settings).length != 0) {
          setContent(resp.settings);
          let pages = [];
          let pageCounter = 0;
          pages[pageCounter] = [];

          for(let i = 0 ; i< resp.settings.parts.length; i++ ){
            if(resp.settings.parts[i].subtype == "einde pagina"){
              pageCounter++;
              pages[pageCounter] = [];
            } else {
              pages[pageCounter].push(resp.settings.parts[i]);
            }
          }

          setPages(pages);
          if(props.lastAction == "goToPrevPartOfLesson"){
            setCurrentPageIndex(pages.length - 1 >= 0 ? pages.length-1:0)
          }
        }
        if (Object.keys(resp.answers).length != 0) {
          setAnswers(resp.answers);
        }

        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
  }, []);

  return(
    <div className="forms center">
      <ContentFront
        id={props.part.form_id}
        content={content}
        answers={answers}
        included='true'
        include_id={props.part.id}
        parentType={props.type}
        type="questionnaire"
        includeLevel={props.includeLevel + 1}
        zIndex={props.includeLevel + 1}
        lastAction={props.lastAction}
        currentPageIndex={currentPageIndex}
        />
    </div>
  )
}
export default Forms
