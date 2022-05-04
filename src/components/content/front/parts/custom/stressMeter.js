import React, { useState, useEffect } from "react";
import t from "../../../../translate";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import apiCall from "../../../../api";
import {appSettings} from "../../../../../custom/settings";

const StressMeter = props => {

  let location = useLocation();
  const [chosenValues, setChosenValues] = useState([]);
  const [chosenDates, setChosenDates] = useState([]);
  const [chosen, setChosen] = useState(false)
  const [firstTime, setFirstTime] = useState(true)
  const [actionDone, setActionDone] = useState(false)

  const auth = useSelector(state => state.auth);
  const intervention_id = useSelector(state => state.activeIntervention);

  let the_id = location.pathname.split("/")[2];
  let page_offset = location.pathname.split("/")[3];


  useEffect(() => {
    /// get chosen values from server and set in chosenvalues en dates
    if (intervention_id > 0) {
      apiCall({
        action: "get_stress",
        token: auth.token,
        data: {
          intervention_id: parseInt(intervention_id)
        }
      }).then(resp => {
        if (resp.error == 0 && resp.content) {
          setChosenValues(resp.content[0].values);
          setChosenDates(resp.content[0].dates);
        }
      });
    }
    if(props.answer != ""){
      setChosen(props.answer)
    }
    /*
    if(!checkIfFirstTime()){
      setFirstTime(false)
    }
    */
  }, [intervention_id, props]);

  function addValue(value) {
    let updateChosenValues = [...chosenValues];
    updateChosenValues.push(value);
    setChosenValues(updateChosenValues);

    let updateChosenDates = [...chosenDates];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    updateChosenDates.push(today);
    setChosenDates(updateChosenDates);

    setChosen(value)

    //// saven in antwoord object om meerdere keren invullen te kunnen blokkeren
    props.updateAnswer(props.part.id, value)

    ///saven /// met de refcode?!
    saveStressContent(updateChosenValues, updateChosenDates);

    if(firstTime && !actionDone){
      setActionDone(true)
      //props.updatePageHistory(page_offset ? page_offset:0)
    }
  }

  function saveStressContent(updateChosenValues, updateChosenDates) {
    apiCall({
      action: "save_stress",
      token: auth.token,
      data: {
        intervention_id: parseInt(intervention_id),
        content: [{ values: updateChosenValues, dates: updateChosenDates }]
      }
    }).then(resp => {
      if (resp.error == 0) {
      }
    });
  }

  function change(){
    let updateChosenValues = [...chosenValues];
    updateChosenValues.pop()
    setChosenValues(updateChosenValues);

    let updateChosenDates = [...chosenDates];
    updateChosenDates.pop()
    setChosenDates(updateChosenDates);

    saveStressContent(updateChosenValues, updateChosenDates);
    setChosen(false)
  }

  /// todo misschien wel een handige functie voor op het hoogste niveau
  function checkIfFirstTime() {
    /*
    let this_page_obj = props.pagesHistory.filter(function (page) {
      return page.the_id === the_id
    });

    if(this_page_obj.length == 0){
      return true
    } else {
      return false
    }
    */

    //bepalen adhv answers??
    return true;
  }

  return (
    <div className="stress">
      <div className={"choose" + (!chosen ? '':' chosen')}>
        <h2>{typeof appSettings.questionStress != "undefined" ? t(appSettings.questionStress):t("Hoe voel je je?")}</h2>
        <div id="options">
          <img src={require('../../../../../images/course/standard/stress_1.png')} onClick={e => addValue(0)} className={parseInt(chosen) == 0 ? 'this':''}/>
          <img src={require('../../../../../images/course/standard/stress_2.png')} onClick={e => addValue(1)} className={parseInt(chosen) == 1 ? 'this':''}/>
          <img src={require('../../../../../images/course/standard/stress_3.png')} onClick={e => addValue(2)} className={parseInt(chosen) == 2 ? 'this':''}/>
          <img src={require('../../../../../images/course/standard/stress_4.png')} onClick={e => addValue(3)} className={parseInt(chosen) == 3 ? 'this':''}/>
          <img src={require('../../../../../images/course/standard/stress_5.png')} onClick={e => addValue(4)} className={parseInt(chosen) == 4 ? 'this':''}/>
        </div>
      </div>
    </div>
  );
};

export default StressMeter;
