import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkNestedProperties } from "../utils";
import t from "../translate";
import { getClone } from "../utils";
import GenerateTranslationPart from "./generate_translation_part";
import { setTranslation } from "../../actions";

const Page = (props) => {

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

      (checkNestedProperties(intervention, 'settings', 'pages'))
      ?
        intervention.settings.pages.map((page, index) => {
          return (
          <>
          {
          (parseInt(page.id) === parseInt(props.activePageId)) ?
            <>
            {
              <div key={index}>
                <div key={index} className="translation_item">
                <div className="title">
                  <label>{t("Titel")}</label><br />
                  <div className="clearfix">
                    <div className="original">
                      {page.title}
                    </div>
                    <div className="editor_holder">
                      <input type="text" name={'page_title_'+page.id} onChange={(e) => onChange(e)} value={
                        checkNestedProperties(translation, 'page_title_'+page.id) ? translation['page_title_'+page.id] : page.title } />
                    </div>
                  </div>
                  </div>
                      {
                        (typeof page.settings !== 'undefined' && typeof page.settings.parts !== 'undefined') ?

                          <span>
                          {
                            page.settings.parts.map((part, index) => {

                              return (
                              <GenerateTranslationPart key={index} part={part} index={index} onChange={onChange} onChangeEditor={onChangeEditor} translation={translation} mainId={props.activePageId} />
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

export default Page;
