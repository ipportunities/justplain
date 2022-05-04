import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../translate";
import Questionnaire from "./questionnaire";

const TranslateQuestionnaires = () => {

  const intervention = useSelector(state => state.intervention);

  const [activeQuestionnaireId, setActiveQuestionnaireId] = useState(0);

  useEffect(() => {
    if(intervention.settings.questionnaires[0]){
      setActiveQuestionnaireId(intervention.settings.questionnaires[0].id);
    }

  }, [intervention.settings.questionnaires[0]])

  const selectQuestionnaire = (e) => {
    setActiveQuestionnaireId(e.target.value);
  }

  return (
    <div>
      <select className="custom-select" onChange={(e) => selectQuestionnaire(e)}>
      {
        intervention.settings.questionnaires.map((questionnaire, index) => {
          return (
            <option key={index} value={questionnaire.id}>
              {
                parseInt(questionnaire.parent_id) === 0 ? '' : ' - - - - - - '
              }
              {questionnaire.title}
            </option>
          )
        })
      }
      </select>
      <br /><br />
      <Questionnaire activeQuestionnaireId={activeQuestionnaireId} />

    </div>
  )

}

export default TranslateQuestionnaires;
