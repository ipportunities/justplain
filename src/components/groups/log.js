import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../translate";
import { Editor } from '@tinymce/tinymce-react';
import {appSettings} from "../../custom/settings";
import { setSavingStatus } from "../../actions";
import apiCall from "../api";

let saveSettingsTimeout = null;
let time = 300;

const Log = props => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    ///straks vanuit api ophalen lijkt me
    if(intervention.id > 0){
      let tempLogs = []
      if(!props.activeGroup.logbook){
        for(let i = 0 ; i<parseInt(intervention.settings.chatlessons.length) ; i++){
          tempLogs.push({session:(i+1), text:""})
        };
        setLogs(tempLogs)
      } else {
        setLogs(props.activeGroup.logbook)
      }
    }

  }, [props.activeGroup, intervention.id]);

  const updateLog = (key, logtext) => {
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    let tempLogs = logs;
    tempLogs[key].text = logtext;
    setLogs(tempLogs)

    saveSettingsTimeout = setTimeout(() => {
      let apiCallObj = {
        action: "save_group_log",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
          logs:tempLogs
        }
      };

      apiCall(apiCallObj).then(resp => {
        dispatch(setSavingStatus("saved"));
        //setGroups(resp.groups)
      });
    }, time);
  }



  return(
    <div className="log">
      <h4>{t("Logboek")}</h4>
      <div className="description">
        {t("Beschrijf hieronder per sessie het verloop van de sessie:")}
      </div>
      {logs.map((log, key) => {
        return (
          <div className="logItem" key={key}>
            <div className="session">{t("Sessie ")} {log.session}</div>
            <div className="editor">
              <Editor
                apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                inline
                ///initialValue -> value caret jump opeens 11-08-2021
                value={log.text != '' ? log.text : ''}
                init={{
                  menubar:false,
                  plugins: 'link image code lists advlist',
                  relative_urls : false,
                  remove_script_host : true,
                  document_base_url : appSettings.domain_url,
                  toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | forecolor | link ",
                  setup: editor => {
                    //Keep bg image dark if on focus
                    editor.on('keydown', function(e){
                      if(e.target.nextSibling.classList)
                      {

                        if(e.target.nextSibling.classList.contains('placeholder_editor')){
                          e.target.nextSibling.classList.add("hide")
                        }
                      }
                    });


                  }
                  /*myCustomToolbarButton
                  setup: (editor) => {
                    editor.ui.registry.addButton('myCustomToolbarButton', {
                      text: 'My Custom Button',
                      onAction: () => props.showMediaLibrary()
                    });

                  }  */
                }}
                onEditorChange={(content, editor) => updateLog(key, content)}
                />
                {log.text == "" || typeof log.text == 'undefined' ?
                  <div className="placeholder_editor">
                    {t("Plaats hier uw tekst")}...
                  </div>
                :''}
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default Log
