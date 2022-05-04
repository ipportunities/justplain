import React from "react";
import {GetDate, GetTime} from "../../../../../helpers/convertTimestamp.js";

//// hier wordt nu de date time create van het antwoord gepakt... <= maar ja heb je daar wat aan.... <= zou mooi zijn als kaartje via cms zetbaar is
const StandardCard = (props) => {

  return(
    <div key={props.index} className={props.className + ' item'} onClick={props.onClick}>
      <table style={{"width":"100%"}}>
        <tbody>
          <tr className="dateTime">
            <td>
              <i className="fas fa-calendar-week"></i>
              {GetDate(props.answer.date_time_create)}
            </td>
            <td>
              <i className="far fa-clock"></i>
              {GetTime(props.answer.date_time_create)}
            </td>
            <td style={{"textAlign":"right"}}>
              <i className="fas fa-arrow-alt-circle-right" style={{"float":"right"}}></i><br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StandardCard
