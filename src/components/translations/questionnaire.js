import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkNestedProperties } from "../utils";
import t from "../translate";
import { getClone } from "../utils";
import GenerateTranslationPart from "./generate_translation_part";
import { setTranslation } from "../../actions";

const Questionnaire = (props) => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const translation = useSelector(state => state.translation);

  const onChange = (e) => {
    let newTranslation = getClone(translation);
    newTranslation[e.target.name] = e.target.value;
    dispatch(setTranslation(newTranslation));
  }

  const onChangeEditor = (indexKey, updatefield, content) => {
    let newTranslation = getClone(translation);
    newTranslation[updatefield] = content;
    dispatch(setTranslation(newTranslation));
  }

  return (
    <>
      {

      (checkNestedProperties(intervention, 'settings', 'questionnaires'))
      ?
        intervention.settings.questionnaires.map((questionnaire, index) => {

          return (
          <>
          {
          (parseInt(questionnaire.id) === parseInt(props.activeQuestionnaireId)) ?
            <>
            {
              <div key={index}>
                <div key={index} className="translation_item">
                  <div className="title">
                    <label>{t("Titel")}</label><br />
                    <div className="clearfix">
                      <div className="original">
                          {questionnaire.title}
                      </div>
                      <div className="editor_holder">
                      <input type="text" name={'questionnaire_title_'+questionnaire.id} onChange={(e) => onChange(e)} value={
                          checkNestedProperties(translation, 'questionnaire_title_'+questionnaire.id) ? translation['questionnaire_title_'+questionnaire.id] : questionnaire.title } />
                      </div>
                    </div>
                  </div>

                      {
                        (typeof questionnaire.settings !== 'undefined' && typeof questionnaire.settings.parts !== 'undefined') ?

                          <span>
                          {
                            questionnaire.settings.parts.map((part, index) => {
                              return (
                              <GenerateTranslationPart key={index} part={part} index={index} onChange={onChange} onChangeEditor={onChangeEditor} translation={translation} mainId={props.activeQuestionnaireId} />
                              )
                            })
                          }
                          </span>
                        : ''
                      }
                </div>
                <br />
              </div>
            }
            </>
            :
            ''
            }
          </>
          )
        })
      :
      ''
      }
    </>
  )
}

export default Questionnaire;
