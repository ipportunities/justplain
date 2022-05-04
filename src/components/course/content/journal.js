import React, { useState, useEffect } from "react";
import moment from "moment";
import 'moment/min/moment-with-locales'
import t from "../../translate";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import { getClone } from "../../utils";
import ContentEditable from 'react-contenteditable';
import parse from 'html-react-parser';
import $ from "jquery";
import SortObjectArray from "../../helpers/sortObjectArray.js";
import Typewriter from 'typewriter-effect';
import {appSettings} from "../../../custom/settings";

const Journal = () => {

  const [journalItems, setJournalItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState(appSettings.dagboekTitle);
  const [btnLabel, setBtnLabel] = useState("");
  const [journalIndex, setJournalIndex] = useState(-1);
  const [journalContent, setJournalContent] = useState("");

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);
  const activeIntervention = useSelector(state => state.activeIntervention);
  const language_id = useSelector(state => state.uiTranslation.language_id);

  useEffect(() => {

    if (activeIntervention > 0) {
      apiCall({
        action: "get_journal",
        token: auth.token,
        data: {
          intervention_id: parseInt(activeIntervention)
        }
      }).then(resp => {
        if (resp.error == 0 && resp.content) {

          setJournalItems(resp.content.sort(SortObjectArray("dateTime", "desc")));
        }
      });
    }

  }, []);

  useEffect(() => {
    if(language_id == 1){
      moment.locale('nl',require('moment/locale/nl'))
    } else {
      moment.locale('en')
    }
  }, [language_id]);

  useEffect(() => {
    saveJournal();
  }, [journalItems])

  const showAddItem = () => {
    setJournalIndex(-1);
    setFormTitle("Toevoegen " + appSettings.dagboekItem);
    setBtnLabel("Toevoegen");
    setShowForm(true);
  }

  const showEditItem = (index) => {
    setJournalIndex(index);
    setFormTitle("Wijzig " + appSettings.dagboekItem);
    setBtnLabel("Opslaan");
    setJournalContent(journalItems[index].content);
    setShowForm(true);
  }

  const onChange = (e) => {
    setJournalContent(e.target.value == "<br>" ? '':e.target.value);
  }

  const addEditItem = (e) => {
    e.preventDefault();
    if (journalIndex === -1) //toevoegen
    {

      let newJournalItem = {
        dateTime: Date.now(),
        content: journalContent
      }
      setJournalItems([...journalItems, newJournalItem]);
    }
    else //wijzigen
    {
      let editedJournalItems = [...journalItems];
      editedJournalItems[journalIndex].content = journalContent;
      setJournalItems(editedJournalItems);
    }
    setShowForm(false);
    setJournalContent("");
  }

  const hideForm = () => {
    setShowForm(false);
    setFormTitle(appSettings.dagboekTitle)
  }

  const saveJournal = () => {

    if (journalItems.length > 0)
    {
      apiCall({
        action: "save_journal",
        token: auth.token,
        data: {
          intervention_id: parseInt(activeIntervention),
          content: journalItems
        }
      }).then(resp => {
      });
    }

  }

  return (
    <div className="journal">
      <div className="add">
        <h1 id="typed_1" className="big"><Typewriter options={{delay:40}}
        onInit={(typewriter) => {
          typewriter.typeString(t(formTitle))
            .callFunction(() => {
              if(document.getElementById("typed_1")){
                  document.getElementById("typed_1").className = "finished big"
              }
              //document.getElementById("holderGraph").className = "show"
            })
            //.pauseFor(2500)
            //.deleteAll()
            .start();
        }}
        /></h1>
        {typeof intervention.settings.journalIntro != 'undefined' &&  intervention.settings.journalIntro != '' ?
          <div className="intro">
            {parse(intervention.settings.journalIntro)}
            <br/>
          </div>
        :''}
        <button className={(!showForm) ? 'btn btn-primary' : 'hidden'} onClick={showAddItem}>{t("Voeg item toe")}</button>
      </div>

      {
        (showForm) ?
          <>
            <form>
              <ContentEditable
                  //innerRef={props.focus !== false && typed == false ? focus:false}
                  html={journalContent}
                  placeholder={t("Je " + appSettings.dagboekItem)}
                  onChange={onChange}
                  className="textarea"
                />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button className="btn btn-primary back" onClick={hideForm}>{t("Annuleer")}</button>
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={addEditItem}>{t(btnLabel)}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </>
          :
          <></>
      }
      {journalItems.length > 0 && !showForm ?
        <div className="journal_items">
          <h2>{t(appSettings.dagboekItems)}</h2>
          <div className='items'>
            {
              journalItems.map((item, index) => (
                  <div key={index} className="item" onClick={() => showEditItem(index)}>
                    <table>
                      <tbody>
                        <tr className="dateTime">
                          <td>
                            <i className="fas fa-calendar-week"></i>
                            {moment(item.dateTime).format("LL")}
                          </td>
                          <td>
                            <i className="far fa-clock" ></i>
                            {moment(item.dateTime).format("LT")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {parse(item.content)}
                  </div>
              ))
            }
          </div>
        </div>
        :''}
     </div>
  );
};

export default Journal;
