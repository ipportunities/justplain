import React, {useEffect}  from "react";
import { useSelector, useDispatch } from "react-redux";
import TranslateTitle from "./title";
import TranslateLessons from "./lessons";
import TranslateOptionalLessons from "./optional_lessons";
import TranslateQuestionnaires from "./questionnaires";
import TranslateGoals from "./goals";
import TranslatePages from "./pages";
import TranslateUI from "./ui";
import { setActiveTranslationTab } from "../../actions";
import { useLocation } from "react-router-dom";


const TranslationsTab = () => {

  let location = useLocation();
  const dispatch = useDispatch();
  const activeTranslationTab = useSelector(state => state.activeTranslationTab);

  useEffect(() => {
    let url_arr = location.pathname.split("/")
    if (url_arr[4] && url_arr[4] != activeTranslationTab)
    {

      dispatch(setActiveTranslationTab(url_arr[4]));
    }
  }, [location.pathname])

  switch (activeTranslationTab) {

    case "title":
      return <TranslateTitle />
      break;
    case "lessons":
      return <TranslateLessons />
      break;
    case "questionnaires":
      return <TranslateQuestionnaires />
      break;
    case "optional-lessons":
      return <TranslateOptionalLessons />
      break;
    case "goals":
      return <TranslateGoals />
      break;
    case "pages":
      return <TranslatePages />
      break;
    case "ui":
      return <TranslateUI />
      break;
  }

}

export default TranslationsTab;
