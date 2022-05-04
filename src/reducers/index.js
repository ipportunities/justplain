import urlReducer from "./url";
import authenticatedReducer from "./authenticated";
import userReducer from "./user";
import interventionReducer from "./intervention"; //inhoud vd interventie
import questionnaireReducer from "./questionnaire"; //inhoud ve questionnaire
import medialibraryReducer from "./medialibrary";
import answersLessonsReducer from "./answers_lessons"; //antwoorden
import answersHomeworkReducer from "./answers_homework"; //antwoorden huiswerk
import pageHistoryReducer from "./page_history";
import activeInterventionReducer from "./active_intervention"; //actieve interventie
import activeLessonReducer from "./active_lesson"; //lesson_id igv activePart = lesson
import activeHomeworkReducer from "./active_homework"; //homework_id igv activePart = homework
import activeGoalReducer from "./active_goal"; //lesson_id igv activePart = lesson
import activeSubLessonReducer from "./active_sub_lesson"; //sub_lesson_id -> lessons met dividers
import activeSubHomeworkReducer from "./active_sub_homework"; //sub_homework_id -> homework met dividers
import previousLessonsReducer from "./previous_lessons";
import previousHomeworksReducer from "./previous_homeworks";
import finishedCourseReducer from "./course_finished"; //voor de confetti
import showLeftMenuReducer from "./show_left_menu"; //voor de confetti
import activePartReducer from "./active_part"; //lessons, lesson, goals, stress, chat, settings,
import activeLanguageReducer from "./active_language"; //taal die student actief heeft
import activePageReducer from "./active_page"; //page_id igv activePart = page
import translationReducer from "./translation";
import activeTranslationTabReducer from "./active_translation_tab";
import uiTranslationReducer from "./ui_translation";
import savingReducer from "./saving";
import gamificationReducer from "./gamification";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  url: urlReducer,
  auth: authenticatedReducer,
  user: userReducer,
  intervention: interventionReducer,
  questionnaire: questionnaireReducer,
  mediaLibrary: medialibraryReducer,
  answersLessons: answersLessonsReducer,
  answersHomework: answersHomeworkReducer,
  pageHistory: pageHistoryReducer,
  activeIntervention: activeInterventionReducer,
  activeLesson: activeLessonReducer,
  activeSubLesson: activeSubLessonReducer,
  activeHomework: activeHomeworkReducer,
  activeSubHomework: activeSubHomeworkReducer,
  activePart: activePartReducer,
  activePage: activePageReducer,
  activeGoal: activeGoalReducer,
  finishedCourse: finishedCourseReducer,
  showLeftMenu: showLeftMenuReducer,
  activeLanguage: activeLanguageReducer,
  previousLessons: previousLessonsReducer,
  previousHomeworks: previousHomeworksReducer,
  translation: translationReducer,
  activeTranslationTab: activeTranslationTabReducer,
  uiTranslation: uiTranslationReducer,
  savingStatus: savingReducer,
  gamification: gamificationReducer,
});

const appReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return allReducers(state, action);
};

export default appReducer;
