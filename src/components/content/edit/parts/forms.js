import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import t from "../../../translate";

const Forms = (props) => {

  const [chosenFormId, setChosenFormId] = useState(false);

  const intervention = useSelector(state => state.intervention);

  //////////////////////
  ///On init
  useEffect(() => {
    if(typeof props.part.form_id != "undefined")
    {
      setChosenFormId(props.part.form_id)
    }
  }, []);

  function updateChosenForm(form_id){
    props.updatePart(props.index, 'form_id', form_id)
    setChosenFormId(form_id)
  }

  return(
    <div className="forms center">
      <select onChange={(e) => updateChosenForm(e.target.value)} value={chosenFormId}>
        <option>{t("Selecteer vragenlijst")}</option>
        {intervention.settings.questionnaires.map((questionnaire, index) =>
          <option key={index} value={questionnaire.id}>Vragenlijst : {questionnaire.title}</option>
        )}
      </select>
    </div>
  )
}
export default Forms
