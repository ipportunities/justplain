import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LeftMenu from "../dashboard/leftmenu";
import apiCall from "../api";
import { getClone } from "../utils";
import { setActiveIntervention, setIntervention, setTranslation } from "../../actions";
import t from "../translate";
import TranslationsNavBar from "./navbar";
import TranslationsTab from "./translations_tab";
import { useLocation } from "react-router-dom";

let saveTimer = null;
let hasChanged = 0;

const TranslationEdit = () => {

  let location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const intervention_id = useSelector(state => state.intervention.id);
  const intervention = useSelector(state => state.intervention);
  const translation = useSelector(state => state.translation);
  const [translation_id, setTranslationId] = useState(0);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [active, setActive] = useState(false);
  useEffect(() => {
    //translation_id
    if (typeof location.pathname.split("/")[3] !== 'undefined' && Number.isInteger(parseInt(location.pathname.split("/")[3])) && parseInt(location.pathname.split("/")[3]) > 0)
    {
      setTranslationId(location.pathname.split("/")[3]);
    }
  }, [location.pathname])

  useEffect(() => {
    if (parseInt(translation_id) !== 0)
    {
      apiCall({
        action: "get_intervention_translation",
        token: auth.token,
        data: {
          translation_id
        }
      }).then(resp => {
        if (typeof resp.translation !== 'undefined')
        {
          dispatch(setTranslation(resp.translation));
        }
        if (typeof resp.language !== 'undefined')
        {
          setLanguage(resp.language);
        }
        if (typeof resp.code !== 'undefined')
        {
          setCode(resp.code);
        }
        if (typeof resp.active !== 'undefined')
        {
          setActive(parseInt(resp.active));
        }

        //bij een reload van de pagina:
        if (parseInt(intervention_id) === 0 && typeof resp.intervention_id !== 'undefined' && Number.isInteger(parseInt(resp.intervention_id)) && resp.intervention_id > 0)
        {
          dispatch(setActiveIntervention(resp.intervention_id));

          apiCall({
            action: "get_intervention_settings",
            token: auth.token,
            data: {
              intervention_id: resp.intervention_id
            }
          }).then(resp => {
            dispatch(
              setIntervention(
                resp.intervention_id,
                resp.organisation_id,
                resp.title,
                resp.settings
              )
            );
          });
        }
      });
    }

  }, [translation_id])


  useEffect(() => {

    if (hasChanged > 2) //prevent from saving onload
    {
      clearTimeout(saveTimer);

      saveTimer = setTimeout(() => {
        apiCall({
          action: "update_intervention_translation",
          token: auth.token,
          data: {
            translation_id,
            translation,
            active
          }
        }).then(resp => {
          //
        });
      }, 3000)
    }
    else
    {
      hasChanged++;
    }

  }, [translation, active])

  const onChange = (e) => {
    if (active)
    {
      setActive(0);
    }
    else
    {
      setActive(1);
    }
  }

  return (
    <div className="translation-edit">
      <nav className="navbar navbar-expand-lg navbar-light overRule">
        <h2>
          <span className="pointer" onClick={()=>history.push("/intervention/edit/" + intervention.id + "/general/")}>{" " + intervention.title + " "} </span>
        </h2>
        <h2 className="noPadding">
          &nbsp;> <span className="pointer" onClick={()=>history.push("/intervention/edit/" + intervention.id + "/translations/")}>{" " + t("Vertalingen") + " "}</span>
        </h2>
        <h2 className="noPadding">
        &nbsp;> {language}
        </h2>
      </nav>
      <LeftMenu />
      <div className="intervention_edit">
        <div className="container">
          <table className="heading">
            <tbody>
              <tr>
                <td>
                  <h1>{language}</h1>
                </td>
                <td>
                  <div className="live">
                    <label className="switch">
                      <input
                      type="checkbox"
                      value="1"
                      checked={active}  onClick={onChange}/>
                      <span className="slider_switch round"></span>
                    </label>
                    <span className='label'>
                      {active == 1 ? 'Live':'Offline'}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        <TranslationsNavBar translation_id={translation_id}/>

        <TranslationsTab />

        </div>
      </div>
    </div>
  )
}

export default TranslationEdit;
