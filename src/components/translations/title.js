import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkNestedProperties } from "../utils";
import { getClone } from "../utils";
import t from "../translate";
import { setTranslation } from "../../actions";
import parse from 'html-react-parser';

const TranslateTitle = () => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const translation = useSelector(state => state.translation);

  const onChange = (e) => {
    let newTranslation = getClone(translation);
    newTranslation[e.target.name] = e.target.value;
    dispatch(setTranslation(newTranslation));
  }

  return (
    <div className="translation_item">
      <div className="translation_item">
        <label>{t("Titel")}</label><br />
        <div className="clearfix">
          <div className="original">
            {intervention.title}
          </div>
          <div className="editor_holder">
            <input type="text" id="title" name="title" onChange={(e) => onChange(e)} value={
                  checkNestedProperties(translation, 'title') ? translation.title : '' }  />
          </div>
        </div>

        {
          (typeof intervention.settings.subtitle !== 'undefined' && intervention.settings.subtitle.length > 0) ?
            <div>
              <br />
              <label>{t("Subtitel")}</label><br />
              <div className="clearfix">
                <div className="original">
                  {intervention.settings.subtitle}
                </div>

                <div className="editor_holder">
                  <input type="text" name="subtitle" onChange={(e) => onChange(e)} value={
                    checkNestedProperties(translation, 'subtitle') ? translation.subtitle : '' } />
                </div>
              </div>
            </div>
          :
            ''
        }
      </div>
      <div className="translation_item">
        <label>{t("Intro lessen")}</label><br />
        <div className="clearfix">
          <div className="original">
            {parse("'"+intervention.settings.lessonsIntro+"'")}
          </div>
          <div className="editor_holder">
            <input type="text" id="lessonsIntro" name="lessonsIntro" onChange={(e) => onChange(e)} value={
                  checkNestedProperties(translation, 'lessonsIntro') ? translation.lessonsIntro : '' }  />
          </div>
        </div>
      </div>

      <div className="translation_item">
        <label>{t("Intro optionele lessen")}</label><br />
        <div className="clearfix">
          <div className="original">
            {parse("'"+intervention.settings.optionalLessonsIntro+"'")}
          </div>
          <div className="editor_holder">
            <input type="text" id="optionalLessonsIntro" name="optionalLessonsIntro" onChange={(e) => onChange(e)} value={
                  checkNestedProperties(translation, 'optionalLessonsIntro') ? translation.optionalLessonsIntro : '' }  />
          </div>
        </div>
      </div>

      <div className="translation_item">
        <label>{t("Intro doelen")}</label><br />
        <div className="clearfix">
          <div className="original">
            {parse("'"+intervention.settings.goalsIntro+"'")}
          </div>
          <div className="editor_holder">
            <input type="text" id="goalsIntro" name="goalsIntro" onChange={(e) => onChange(e)} value={
                  checkNestedProperties(translation, 'goalsIntro') ? translation.goalsIntro : '' }  />
          </div>
        </div>
      </div>

      <div className="translation_item">
        <label>{t("Intro Stress")}</label><br />
        <div className="clearfix">
          <div className="original">
            {parse("'"+intervention.settings.stressIntro+"'")}
          </div>
          <div className="editor_holder">
            <input type="text" id="stressIntro" name="stressIntro" onChange={(e) => onChange(e)} value={
                  checkNestedProperties(translation, 'stressIntro') ? translation.stressIntro : '' }  />
          </div>
        </div>
      </div>
      
      {intervention.settings.menu ?
        <div className="translation_item">
          <label>{t("Menu opties")}</label><br />
          <div className="clearfix">
            <div className="original">
              {parse(intervention.settings.menu.modules)}
            </div>
            <div className="editor_holder">
              <input type="text" id="menuLessonTitle" name="menuLessonTitle" onChange={(e) => onChange(e)} value={
                    checkNestedProperties(translation, 'menuLessonTitle') ? translation.menuLessonTitle : '' }  />
            </div>
          </div>
          <div className="clearfix">
            <div className="original">
              {parse(intervention.settings.menu.objectives)}
            </div>
            <div className="editor_holder">
              <input type="text" id="menuObjectivesTitle" name="menuObjectivesTitle" onChange={(e) => onChange(e)} value={
                    checkNestedProperties(translation, 'menuObjectivesTitle') ? translation.menuObjectivesTitle : '' }  />
            </div>
          </div>
          {
            (typeof intervention.settings.menu.journal !== 'undefined')
              ?
                <div className="clearfix">
                  <div className="original">
                    {
                    parse(intervention.settings.menu.journal)
                    }
                  </div>
                  <div className="editor_holder">
                    <input type="text" id="menuJournalTitle" name="menuJournalTitle" onChange={(e) => onChange(e)} value={
                          checkNestedProperties(translation, 'menuJournalTitle') ? translation.menuJournalTitle : '' }  />
                  </div>
                </div>
              : <></>
          }
          <div className="clearfix">
            <div className="original">
              {parse(intervention.settings.menu.stress)}
            </div>
            <div className="editor_holder">
              <input type="text" id="goalsIntro" name="menuStressTitle" onChange={(e) => onChange(e)} value={
                    checkNestedProperties(translation, 'menuStressTitle') ? translation.menuStressTitle : '' }  />
            </div>
          </div>
          <div className="clearfix">
            <div className="original">
              {parse(intervention.settings.menu.coach)}
            </div>
            <div className="editor_holder">
              <input type="text" id="menuCoachTitle" name="menuCoachTitle" onChange={(e) => onChange(e)} value={
                    checkNestedProperties(translation, 'menuCoachTitle') ? translation.menuCoachTitle : '' }  />
            </div>
          </div>
        </div>
        :false}
    </div>
  )

}

export default TranslateTitle;
