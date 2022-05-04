import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkNestedProperties } from "../utils";
import t from "../translate";
import { getClone } from "../utils";
import GenerateTranslationPart from "./generate_translation_part";
import { setTranslation } from "../../actions";
import TranslateImages from "./translate_images";

const Lesson = (props) => {

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
    
      (checkNestedProperties(intervention, 'settings', 'selfhelp', 'lessons'))
      ?
        intervention.settings.selfhelp.lessons.map((lesson, index) => {
          return (
          <>
          {
          (parseInt(lesson.id) === parseInt(props.activeLessonId)) ?
            <>
            {
              <div key={index}>
                <div key={index} className="translation_item">

                {
                  (parseInt(lesson.parent_id) === 0 && (typeof intervention.settings.selfhelp.alternative_menu !== 'undefined' && intervention.settings.selfhelp.alternative_menu === true)) ?

                    <TranslateImages alternative_menu_image={lesson.alternative_menu_image} translation={translation} lesson_id={lesson.id} onChange={onChange} props={{}} />

                  :
                  <></>
                }

                <div className="title">
                  <label>{t("Titel")}</label><br />
                  <div className="clearfix">
                    <div className="original">
                        {lesson.title}
                    </div>
                    <div className="editor_holder">
                    <input  type="text" name={'lesson_title_'+lesson.id} onChange={(e) => onChange(e)} value={
                        checkNestedProperties(translation, 'lesson_title_'+lesson.id) ? translation['lesson_title_'+lesson.id] : lesson.title } />
                    </div>
                  </div>
                </div>
                      {
                        (typeof lesson.settings !== 'undefined' && typeof lesson.settings.parts !== 'undefined') ?

                          <span>
                          {
                            lesson.settings.parts.map((part, index) => {

                              return (
                              <GenerateTranslationPart key={index} part={part} index={index} onChange={onChange} onChangeEditor={onChangeEditor} translation={translation} mainId={props.activeLessonId} />
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
            <></>
            }
          </>
          )
        })
      :
      <></>

  )
}

export default Lesson;
