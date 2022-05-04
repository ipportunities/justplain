import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import t from "../../translate";
import {ChangeFormatDateTime, ChangeFormatDate} from "../../helpers/changeFormatDate.js"
import apiCall from "../../api";

const GroupchatAgenda = (props) => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);

    const [agenda, setAgenda] = useState([])

    useEffect(() => {
      if(intervention.id > 0 && auth){

        /// find if is in group
        let rightsObject = auth.rights.interventions.filter(function (int) {
          return parseInt(int.id) === parseInt(intervention.id)
        });

        if(rightsObject.length > 0 && typeof rightsObject[0].group_id != "undefined" && rightsObject[0].group_id > 0){
          ///get agenda
          let apiCallObj = {
            action: "get_groupchat_agenda",
            token: auth.token,
            data: {
              intervention_id: intervention.id,
              group_id: rightsObject[0].group_id,
            }
          };

          apiCall(apiCallObj).then(resp => {
            setAgenda(resp.agenda)
          });
        }


      }
    }, [intervention, auth]);

  return(
    <>
    {agenda.length > 0 ?
      <div className="agenda">
        <h2>{t("Agenda groepschat")}</h2>
        {agenda.map((item, index) => {
          return (
            <div className={"item " + (new Date(item.date) < new Date ? "passed":"upcoming")}>
             {t("Sessie ")} {item.session} {item.date == "" ?
              <>
                {t("nog geen datum bekend")}
              </>
              :
              <>
                {t("op")} {ChangeFormatDate(item.date)} {("om")} {ChangeFormatDateTime(item.date)}
              </>
             }

            </div>
          )})
        }
      </div>
      :<></>}
    </>
  )
}
export default GroupchatAgenda;
