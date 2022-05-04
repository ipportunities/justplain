import React, { useEffect, useState, Fragment } from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import t from "../../translate";
import NotificationBox from "../../../components/alert/notification";

const  StudentDetailsPlanContact = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [contactMoments, setContactMoments] = useState([])
  const [notificationOptions, setNotificationOptions] = useState('');

  useEffect(() => {
    let apiCallObj = {
      action: "get_contact_moments",
      token: auth.token,
      data: {
        student_id: props.studentId,
        intervention_id:intervention.id
      }
    };

    apiCall(apiCallObj).then(resp => {
      setContactMoments(resp.contact_moments)
    });

  }, []);

  const deleteContactMoment = (index, id) => {
    let apiCallObj = {
      action: "delete_contact_moment",
      token: auth.token,
      data: {
        id: id
      }
    };

    apiCall(apiCallObj).then(resp => {
      let tempContactMoments = [...contactMoments]
      tempContactMoments.splice(index, 1);
      setContactMoments(tempContactMoments)
    });
  }

  const sendNotification = (index) => {
    let apiCallObj = {
      action: "send_contact_moment_notification",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        student_id: props.studentId,
        meeting: contactMoments[index].type,
        date: contactMoments[index].date_time,
      }
    };

    apiCall(apiCallObj).then(resp => {
      console.log(123);
      setNotificationOptions({
        show: "true",
        text: "<h4>" + resp.msg + "</h4>",
        confirmText: t("Ok")
      });
    });
  }
  const addContactMoment = () => {
    updateContactMoments({id:0, intervention_id:intervention.id, type:'chat', date_time:''})
  }

  const update = (type, value, index) => {
    let tempContactMoments = [...contactMoments]
    tempContactMoments[index][type] = value
    setContactMoments(tempContactMoments)
    updateContactMoments(tempContactMoments[index])
  }

  const updateContactMoments = (contact_moment) => {
    let apiCallObj = {
      action: "save_contact_moment",
      token: auth.token,
      data: {
        student_id: props.studentId,
        contact_moment:contact_moment
      }
    };

    apiCall(apiCallObj).then(resp => {
      setContactMoments(resp.contact_moments)
    });
  }

  return(
    <div className='contact_moments'>
      <h2>{t("Afspraak inplannen")}</h2>
      {contactMoments.length > 0 ?
        <table className="items">
          <thead>
            <tr>
              <th>

              </th>
              <th>
                {t("Datum")}
              </th>
              <th>
                {t("Type")}
              </th>
              <th>

              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody>
          {contactMoments.map((contactMoment, index) =>
            <Fragment>
              <tr className="item" key={index}>
                <td>
                  <span className="moment">
                    {index + 1}
                  </span>
                </td>
                <td>
                  <Flatpickr
                    options={{ locale: Dutch, dateFormat: "d.m.Y H:i" }}
                    data-enable-time
                    value={contactMoment.date_time}
                    onChange={dateChanged => {
                      update('date_time', dateChanged, index)
                    }}
                  />
                </td>
                <td>
                  <select onChange={(e)=>update('type', e.target.value, index)} value={contactMoment.type}>
                    <option value=''>{t("Selecteer een optie")}</option>
                    <option value='chat'>{t("Chat")}</option>
                    <option value='phone'>{t("Telefonisch")}</option>
                    <option value='face-to-face'>{t("Face-to-face")}</option>
                  </select>
                </td>
                <td>
                  {auth.userType == "coach" ?
                    <>
                      <span className="btn btn-secondary" onClick={()=>sendNotification(index)}>{t("Verstuur notificatie")}</span>
                    </>
                  :""}
                </td>
                <td>
                  <span className="delete btn showOnHover" onClick={(e) => deleteContactMoment(index, contactMoment.id)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                </td>
              </tr>
            </Fragment>
          )}
          </tbody>
        </table>
        :
        false
      }
      <span className="btn btn-primary" onClick={()=>addContactMoment()}>
        {t("Contact moment toevoegen")}
      </span>

      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )
}

export default StudentDetailsPlanContact;
