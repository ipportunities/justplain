import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChangeFormatDateTime, ChangeFormatDate, getTimeStamp, isToday } from "../../helpers/changeFormatDate.js";
import t from "../../translate";

const ContactMoments = (props) => {

  const [contactMoments, setContactMoments] = useState([])

  const intervention = useSelector(state => state.intervention);

  useEffect(() => {
    if(intervention.id > 0){
      let tempContactMoments = []

      ///checken of er wel een datum gezet is
      for(let i = 0 ; i < intervention.settings.contactMoments.length ; i++){
        if(intervention.settings.contactMoments[i].date_time != ""){
          tempContactMoments.push(intervention.settings.contactMoments[i])
        }
      }

      setContactMoments(tempContactMoments)
    }
  }, [intervention]);

  const getIcon = (type) =>{
    if(type == "chat"){
      return "fas fa-comment"
    }
    if(type == "phone"){
      return "fas fa-phone"
    }
    if(type == "face-to-face"){
      return "fas fa-user"
    }
  }
  const getTypeText = (type) =>{
    if(type == "chat"){
      return t("via de chat")
    }
    if(type == "phone"){
      return t("via de telefoon")
    }
    if(type == "face-to-face"){
      return t(type)
    }
    /*
    if(type == ""){
      return t("nog nader te bepalen")
    }
    */
  }

  return(
    <>
      {contactMoments.length > 0 ?
        <div className="contact_moments">
          <h2>{t("Contact momenten")}</h2>
          <div className="items">
            {contactMoments.map((contact_moment, index) =>
              <div className={"item" + (getTimeStamp(contact_moment.date_time) < Date.now() / 1000 ? " in_the_past":'') + (isToday(contact_moment.date_time) ? ' active':'')} key={index}>
                <table>
                <tbody>
                  <tr>
                    <td>
                      <span className="icon_holder">
                        <i className={getIcon(contact_moment.type)}></i>
                      </span>
                    </td>
                    <td>
                      {t("Op")} {ChangeFormatDate(contact_moment.date_time)} {t("om")} {ChangeFormatDateTime(contact_moment.date_time)} {getTypeText(contact_moment.type)}
                    </td>
                  </tr>
                </tbody>
                </table>

              </div>
            )}
          </div>
        </div>
        :false}
    </>

  )
}

export default ContactMoments;
