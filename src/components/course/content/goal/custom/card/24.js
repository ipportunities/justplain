import React, {useState, useEffect} from "react";
import t from "../../../../../translate";
import {getAnswerById} from "../../../../../helpers/getAnswerById";
import {ChangeFormatDateTime, ChangeFormatDate} from "../../../../../helpers/changeFormatDate";

/// dit is maatwerk => wijzigingen aan de achterkant kunnen gevolgen hebben voor de voorkant
const CustomCard24 = (props) => {

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [relaxLevelBefore, setRelaxLevelBefore] = useState('')
  const [relaxLevelAfter, setRelaxLevelAfter] = useState('')

  useEffect(() => {
    if(props.answer != ""){
      let answers = []
      /// wijze van opslaan verschilt <= zit hem in props.answers structuur van het oude fronte script dat nog gebruikt wordt bij de goals
      if(props.answer.answers.answers){
        answers = props.answer.answers.answers
      } else {
        answers = props.answer.answers
      }

      let dateTime = false
      if(props.answer.goal_id == 24){
        dateTime = getAnswerById("90cafde9-41b6-4fd8-bbbb-add8b5d34220", answers)

        setLocation(getAnswerById("9d6f0a2b-cb13-4a83-abc6-09ae61f92805", answers))
        setRelaxLevelBefore(getAnswerById("3b2ab55a-1466-4fa1-9a18-7d87852e4619", answers))
        setRelaxLevelAfter(getAnswerById("1ba95058-f956-4d65-be1c-64f46454c8e6", answers))
      } else { /// ids zijn gaan verschillen
        dateTime = getAnswerById("473efa0b-0530-4e51-b71a-b3e0e568978f", answers)

        setLocation(getAnswerById("d90bf71c-cdf2-4649-820f-c3947863be8b", answers))
        setRelaxLevelBefore(getAnswerById("54c37d39-7a44-44cd-8567-ff2828c9b8d7", answers))
        setRelaxLevelAfter(getAnswerById("ec7e9e91-ac85-41a3-bf24-877a2ccbd086", answers))
      }

      if(dateTime){
        setTime(ChangeFormatDateTime(dateTime[0]))
        setDate(ChangeFormatDate(dateTime[0]))
      }
    }
  }, [props]);

  return(
    <div key={props.index} className="item">
      <table>
        <tbody>
          <tr className="dateTime">
            <td>
              <i className="fas fa-calendar-week"></i>
              {date}
            </td>
            <td>
              <i className="far fa-clock" ></i>
              {time}
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <i className="far fa-compass" style={{marginRight:"5px"}}></i> {location}
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="relaxLevel">
              {t("Ontspanningsniveau")} <span>{relaxLevelBefore} </span> <i className="fas fa-arrow-right"></i> <span>{relaxLevelAfter} </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CustomCard24
