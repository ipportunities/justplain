import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiCall from "../api";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import t from "../translate";
import "react-big-calendar/lib/css/react-big-calendar.css";

const AgendaChatcourse = props => {

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [groups, setGroups] = useState([])
  const [myEventsList, setMyEventlist] = useState([]);
  const language_id = useSelector(state => state.uiTranslation.language_id);

  const localizer = momentLocalizer(moment)

  useEffect(() => {
    if(language_id == 1){
      moment.locale('nl',require('moment/locale/nl'))
    } else {
      moment.locale('en')
    }
  }, [language_id]);

  useEffect(() => {
    if(intervention.id > 0){
      let apiCallObj = {
        action: "get_groups_and_archived_groups_coach",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
        }
      };

      apiCall(apiCallObj).then(resp => {
        let tempMyEventsList = [];
        setGroups(resp.groups)
        for(let i = 0 ; i < resp.groups.length ; i++){
          if(resp.groups[i]){
            for(let ii = 0 ; ii < resp.groups[i].agenda.length ; ii++){
              tempMyEventsList.push({ start: new Date(resp.groups[i].agenda[ii].date), end: new Date(resp.groups[i].agenda[ii].date), title: resp.groups[i].title + " " + t("sessie") + " " +  resp.groups[i].agenda[ii].session})
            }
          }
        }
        setMyEventlist(tempMyEventsList)
      });
    }
  }, [intervention.id]);

  return (
    <div className="agenda_chatcourse coachInterface students">
      <div className="list listHidden">
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                <h2>{t("Planning")}</h2>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="calendar_holder">
          <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            messages={{
                   next: ">",
                   previous: "<",
                   today: t("Vandaag"),
                   month: t("Maand"),
                   week: t("Week"),
                   day: t("Dag")
                 }}
            style={{ height: 500 }}
          />
        </div>
     </div>

   </div>
  )
}

export default AgendaChatcourse;
