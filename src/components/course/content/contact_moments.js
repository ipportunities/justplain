import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ChangeFormatDateTime, ChangeFormatDate, getTimeStamp, isToday } from "../../helpers/changeFormatDate.js";
import t from "../../translate";
import { setActivePart } from "../../../actions/";
import { useDispatch } from "react-redux";

const ContactMoments = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

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

  const goToLiveChat = () =>{
    dispatch(setActivePart("live-chat"));
    //dispatch(setShowLeftMenu(false));
    history.push("/course/"+intervention.id+"/live-chat");
  }

  return(
    <>
      {contactMoments.length > 0 ?
        <div className="contact_moments">
          <div className="intro">
            <h2>{t("Contact momenten")}</h2>
          </div>
          <div className="items">
            {contactMoments.map((contact_moment, index) =>
              <div className={"item " + contact_moment.type + (getTimeStamp(contact_moment.date_time) < Date.now() / 1000 ? " in_the_past":'') + (isToday(contact_moment.date_time) ? ' active':'')} key={index} onClick={(contact_moment.type == "chat" && isToday(contact_moment.date_time) ? ()=>goToLiveChat():false)}>
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
