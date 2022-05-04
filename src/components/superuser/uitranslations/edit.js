import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../../utils";
import LeftMenu from "../../dashboard/leftmenu";
import t from "../../translate";
import ContentEditable from 'react-contenteditable';

let saveTimer = null;

const EditTranslation = () => {

  const history = useHistory();

  const auth = useSelector(state => state.auth);

  const [languageId, setLanguageId] = useState(0);
  const [translation, setTranslation] = useState({});
  const [translationStrings, setTranslationStrings] = useState([]);
  const [timesSaved, setTimesSaved] = useState(0);

  useEffect(() => {

    let querystring = window.location.href.split("/");
    if (typeof querystring[5] === 'undefined' || !Number.isInteger(parseInt(querystring[5])) || parseInt(querystring[5]) < 2)
    {
      //geen geldige language id?
      history.push("/translations");
    }
    else
    {
      setLanguageId(parseInt(querystring[5]));
    }

  }, [])

  useEffect(() => {

    if (languageId !== 0)
    {
      //getTranslation
      apiCall({
        action: "get_ui_translation",
        token: auth.token,
        data: {
          language_id: languageId
        }
      }).then(resp => {
        setTranslation(resp.translation);
        //alle strings vd ui ophalen
        apiCall({
          action: "get_ui_translation_strings",
          token: auth.token,
          data: {}
        }).then(resp => {
          setTranslationStrings(resp.translationStrings);
        });
      });
    }

  }, [languageId])

  useEffect(() => {

    if (Object.keys(translation).length > 0 && timesSaved > 2)
    {
      clearTimeout(saveTimer);

      saveTimer = setTimeout(() => {
        apiCall({
          action: "update_ui_translation",
          token: auth.token,
          data: {
            language_id: languageId,
            translation: translation,
            active: 1
          }
        }).then(resp => {
        });
      }, 3000)
    }
    else
    {
      let newTimesSaved = timesSaved + 1;
      setTimesSaved(newTimesSaved);
    }

  }, [translation])

  const getTranslation = (id) => {

    let translationKey = 'trans_'+id;

    if (typeof translation[translationKey] !== 'undefined')
    {
      return translation[translationKey];
    }
    else
    {
      return '';
    }
  }

  const onChange = (e) => {
    let newTranslation = getClone(translation);
    newTranslation[e.currentTarget.id] = e.target.value;
    setTranslation(newTranslation);
  }

  return (
    <div className="whiteWrapper uitranslations">
      <LeftMenu />
      <div className="container dashboard_container">
        <h2><i className="fas fa-language"></i> {t("UI Vertaling")}</h2>

        {
          translationStrings.map((item, index) => {
            let translationKey = 'trans_'+item.id;
            return (
              <div key={index} className="translation_item clearfix">
                <div className="original">
                  {item.translation_string}
                </div>
                <div className="translation">
                  <ContentEditable
                      html={getTranslation(item.id)}
                      id={'trans_'+item.id}
                      onChange={(e) => onChange(e)}
                      className="textarea"
                      placeholder={t("Vertaling")}
                    />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )

}

export default EditTranslation;
