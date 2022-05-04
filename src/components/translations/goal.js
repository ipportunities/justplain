import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkNestedProperties } from "../utils";
import t from "../translate";
import { getClone } from "../utils";
import GenerateTranslationPart from "./generate_translation_part";
import { setTranslation } from "../../actions";

const Goal = (props) => {

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

      (checkNestedProperties(intervention, 'settings', 'goals'))
      ?
        intervention.settings.goals.map((goal, index) => {
          return (
          <>
          {
          (parseInt(goal.id) === parseInt(props.activeGoalId)) ?
            <>
            {
              <div key={index}>
                <div key={index} className="translation_item">
                  <div className="title">
                    <label>{t("Goal")}</label><br />
                    <div className="clearfix">
                      <div className="original">
                        {goal.title}
                      </div>
                      <div className="editor_holder">
                        <input  type="text" name={'goal_title_'+goal.id} onChange={(e) => onChange(e)} value={
                            checkNestedProperties(translation, 'goal_title_'+goal.id) ? translation['goal_title_'+goal.id] : goal.title } />
                      </div>
                    </div>
                  </div>
                      {
                        (typeof goal.settings !== 'undefined' && typeof goal.settings.parts !== 'undefined') ?

                          <span>
                          {
                            goal.settings.parts.map((part, index) => {

                              return (
                              <GenerateTranslationPart key={index} part={part} index={index} onChange={onChange} onChangeEditor={onChangeEditor} translation={translation} mainId={props.activeGoalId} />
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

export default Goal;
