export const increment = () => {
  return {
    type: "INCREMENT"
  };
};

export const decrement = () => {
  return {
    type: "DECREMENT"
  };
};

export const setAuthenticatedFalse = () => {
  return {
    type: "SET_AUTHENTICATED_FALSE"
  };
};
export const setAuthenticatedNull = () => {
  return {
    type: "SET_AUTHENTICATED_NULL"
  };
};

export const login = (user_id, name, token, userType, rights, preferences, profile_pic, email,  gender,  education, date_time_birth,firstname, insertion, lastname) => {
  return {
    type: "LOGIN",
    payload: {
      user_id,
      name,
      token,
      userType,
      rights,
      preferences,
      profile_pic,
      email,
      gender,
      education,
      date_time_birth,
      firstname,
      insertion,
      lastname
    }
  };
};

export const user_reset = () => {
  return {
    type: "USER_RESET"
  };
};

export const user_set = user => {
  return {
    type: "USER_SET",
    payload: {
      user
    }
  };
};

export const setIntervention = (
  intervention_id,
  organisation_id,
  title,
  settings
) => {
  return {
    type: "SET_INTERVENTION",
    payload: {
      intervention_id,
      organisation_id,
      title,
      settings
    }
  };
};

export const setQuestionnaire = (
  questionnaire_id,
  lessons
) => {
  return {
    type: "SET_QUESTIONNAIRE",
    payload: {
      questionnaire_id,
      lessons
    }
  };
};

export const setAnswersLessons = (
  intervention_id,
  answers,
) => {
  return {
    type: "SET_ANSWERS_LESSONS",
    payload: {
      intervention_id,
      answers
    }
  };
};
export const setAnswersHomework = (
  intervention_id,
  answers,
) => {
  return {
    type: "SET_ANSWERS_HOMEWORK",
    payload: {
      intervention_id,
      answers
    }
  };
};

export const setPageHistory = (
  intervention_id,
  pageHistory,
) => {
  return {
    type: "SET_PAGE_HISTORY",
    payload: {
      intervention_id,
      pageHistory
    }
  };
};

export const setActiveIntervention = (intervention_id) => {
  return {
    type: "SET_ACTIVE_INTERVENTION",
    payload: {
      intervention_id
    }
  };
};

export const setActiveLesson = (lesson_id) => {
  return {
    type: "SET_ACTIVE_LESSON",
    payload: {
      lesson_id
    }
  };
};
export const setActiveHomework = (homework_id) => {
  return {
    type: "SET_ACTIVE_HOMEWORK",
    payload: {
      homework_id
    }
  };
};

export const setSavingStatus = (status) => {
  return {
    type: "SET_SAVING_STATUS",
    payload: {
      status
    }
  };
};
export const setGamification = (gamification) => {
  return {
    type: "SET_GAMIFICTION",
    payload: {
      gamification
    }
  };
};

export const setActiveSubLesson = (sub_lesson_id) => {
  return {
    type: "SET_ACTIVE_SUBLESSON",
    payload: {
      sub_lesson_id
    }
  };
};
export const setActiveSubHomework = (sub_homework_id) => {
  return {
    type: "SET_ACTIVE_SUBHOMEWORK",
    payload: {
      sub_homework_id
    }
  };
};

export const setPreviousLessons = (previous_lessons) => {
  return {
    type: "SET_PREVIOUS_LESSONS",
    payload: {
      previous_lessons
    }
  };
};
export const setPreviousHomeworks = (previous_homeworks) => {
  return {
    type: "SET_PREVIOUS_HOMEWORKS",
    payload: {
      previous_homeworks
    }
  };
};

export const setActivePart = (part) => {
  return {
    type: "SET_ACTIVE_PART",
    payload: {
      part
    }
  };
};

export const setActivePage = (page_id) => {
  return {
    type: "SET_ACTIVE_PAGE",
    payload: {
      page_id
    }
  };
};

export const setActiveGoal = (goal_id) => {
  return {
    type: "SET_ACTIVE_GOAL",
    payload: {
      goal_id
    }
  };
};
export const setFinishedCourse = (finished) => {
  return {
    type: "SET_COURSE_FINISHED",
    payload: {
      finished
    }
  };
};
export const setShowLeftMenu = (show) => {
  return {
    type: "SET_SHOW_LEFT_MENU",
    payload: {
      show
    }
  };
};

export const setChosenImage = (chosen_image, index) => {
  return {
    type: "SET_CHOSEN_IMAGE",
    payload: {
      chosen_image,
      index
    }
  };
};

export const setActiveLanguage = (language_id) => {
  return {
    type: "SET_ACTIVE_LANGUAGE",
    payload: {
      language_id
    }
  };
};

export const setTranslation = (translation) => {
  return {
    type: "SET_TRANSLATION",
    payload: {
      translation
    }
  };
};

export const setActiveTranslationTab = (translation_tab) => {
  return {
    type: "SET_ACTIVE_TRANSLATION_TAB",
    payload: {
      translation_tab
    }
  };
};

export const setUiTranslation = (
  language_id,
  translation
) => {
  return {
    type: "SET_UI_TRANSLATION",
    payload: {
      language_id,
      translation
    }
  };
};
