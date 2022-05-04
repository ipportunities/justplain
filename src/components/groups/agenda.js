import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import t from "../translate";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import { setSavingStatus } from "../../actions";
import apiCall from "../api";
import {ChangeFormatDateTime, ChangeFormatDate} from "../helpers/changeFormatDate";

let saveSettingsTimeout = null;
let time = 300;

const Agenda = props => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [agenda, setAgenda] = useState([])

  useEffect(() => {
    /// dit straks maar in 1 keer ophalen via api
    if(intervention.id > 0 && props.activeGroup){
      let apiCallObj = {
        action: "get_groupchat_agenda",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
        }
      };

      apiCall(apiCallObj).then(resp => {
        setAgenda(resp.agenda)
      });

    }
  }, [intervention.id, props.activeGroup]);

  const updateDate = (dateChanged, key) => {
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    let tempAgenda = agenda;
    tempAgenda[key].date = dateChanged;
    setAgenda(tempAgenda)

    saveSettingsTimeout = setTimeout(() => {
      let apiCallObj = {
        action: "save_groupchat_agenda",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
          agenda:tempAgenda
        }
      };

      apiCall(apiCallObj).then(resp => {
        dispatch(setSavingStatus("saved"));
        //setGroups(resp.groups)
      });
    }, time);

  }

  return(
    <div className="agenda">
      <h4>{t("Agenda")}</h4>
      {agenda.length > 0 ?
        <table>
          <thead>
            <tr>
              <th>
                Sessie
              </th>
              <th>
                Datum
              </th>
            </tr>
          </thead>
            <tbody>
            {agenda.map((agendaSession, key) => {
              return (
                <tr key={key}>
                  <td>
                    {agendaSession.session}
                  </td>
                  <td>
                    <Flatpickr
                      options={{ locale: Dutch, dateFormat: "d.m.Y H:i" }}
                      data-enable-time
                      value={agendaSession.date}
                      onChange={dateChanged => {
                        updateDate(dateChanged, key)
                      }}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        :<></>}
    </div>
  )
}
export default Agenda
