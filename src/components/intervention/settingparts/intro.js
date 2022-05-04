import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import ContentEditable from 'react-contenteditable';

let saveSettingsTimeout = null;

const Intro = props => {
  const [intro, setIntro] = useState('');

  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);


  useEffect(() => {
    if(props.type == "lessons"){
      setIntro(typeof intervention.settings.lessonsIntro != 'undefined' ? intervention.settings.lessonsIntro:'')
    }
    if(props.type == "optional-lessons"){
      setIntro(typeof intervention.settings.optionalLessonsIntro != 'undefined' ? intervention.settings.optionalLessonsIntro:'')
    }
    if(props.type == "goals"){
      setIntro(typeof intervention.settings.goalsIntro != 'undefined' ? intervention.settings.goalsIntro:'')
    }
    if(props.type == "stress"){
      setIntro(typeof intervention.settings.stressIntro != 'undefined' ? intervention.settings.stressIntro:'')
    }
    if(props.type == "journal"){
      setIntro(typeof intervention.settings.journalIntro != 'undefined' ? intervention.settings.journalIntro:'')
    }
    if(props.type == "homework"){
      setIntro(typeof intervention.settings.homeworkIntro != 'undefined' ? intervention.settings.homeworkIntro:'')
    }
    if(props.type == "courseIntro"){
      setIntro(typeof intervention.settings.courseIntro != 'undefined' ? intervention.settings.courseIntro:'')
    }
  }, [intervention]);

  const onChange = e => {
    let intro = e.target.value == "<br>" ? "":e.target.value;

    setIntro(intro)
    if(props.type == "lessons"){
      intervention.settings.lessonsIntro = intro;
    }
    if(props.type == "goals"){
      intervention.settings.goalsIntro = intro;
    }
    if(props.type == "optional-lessons"){
      intervention.settings.optionalLessonsIntro = intro;
    }
    if(props.type == "stress"){
      intervention.settings.stressIntro = intro;
    }
    if(props.type == "journal"){
      intervention.settings.journalIntro = intro;
    }
    if(props.type == "homework"){
      intervention.settings.homeworkIntro = intro;
    }
    if(props.type == "courseIntro"){
      intervention.settings.courseIntro = intro;
    }

    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        intervention.settings
      );
    }, 1500);
  };

  return (
    <div className="intro">
      <ContentEditable
          html={intro}
          placeholder={props.placeholder}
          disabled={false}
          onChange={onChange}
          className="introTextarea"
        />
    </div>
  );
};

export default Intro;
