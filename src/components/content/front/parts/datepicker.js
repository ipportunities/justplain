import React, { useState, useEffect } from "react";
import uuid from "uuid";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import parse from 'html-react-parser';
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import {ChangeFormatDateTime, ChangeFormatDate} from "../../../helpers/changeFormatDate";
import {getQuestion} from "./helpers/functions.js";

const DatePicker = props => {


  const [date, setDate] = useState('')
  /// hij kan volgens mij niet leeg zijn
  //const [empty, setEmpty] = useState('')

  useEffect(() => {
    /// nog checken of dit nog goed gaat wellicht gaat het hier mis
    if (props.answer != "") {
      setDate(props.answer);
    } else {
      /// deze snap ik even niet meer dus maar even uit
      /*
      if(props.part.id != '' && props.answer == '')
      {
        props.updateAnswer(props.part.id, date)
      }
      */
      /// set default date als is leeg
      let defaultDate = new Date();
      let year = defaultDate.getFullYear();
      let month = defaultDate.getMonth() + 1;
      month = (month < 10 ? "0" + month:month);
      let hour = defaultDate.getUTCHours();
      hour = (hour < 10 ? "0" + hour:hour);
      let min = defaultDate.getMinutes();
      min = (min < 10 ? "0" + min:min);
      let sec = defaultDate.getSeconds();
      sec = (sec < 10 ? "0" + sec:sec);
      let date = defaultDate.getDate();
      defaultDate = year + '-' + month  + '-' + date  + "T" + hour + ':' + min + ':' + sec + ".000Z";
      //setDate(new Date());
      //props.updateAnswer(props.part.id, [new Date()])
    }
    /*
    if(props.answer == '' && props.part.must && !props.nextAllowed){
      setEmpty(' empty')
    } else {
      setEmpty('')
    }
    */
  }, [props.answer]);

  function updateDate(dateChanged){
    setDate(dateChanged)
    props.updateAnswer(props.part.id, dateChanged)
  }

  return(
    <div className={"date center" + (props.part.must ? ' must':'')}>
      <div className="center">
        {props.part.question != "" ?
        <div className="question">
          {getQuestion(props.part)}
        </div>
        :''}
        {props.hasOwnProperty("disabled") && props.disabled === "true" ?
          <div>
            {date ?
              <div className="showDate">
                <i className="fas fa-calendar-week"> </i>{ChangeFormatDate(date[0])}
                <i className="far fa-clock" ></i>
                {ChangeFormatDateTime(date[0])}
              </div>
            :''}
          </div>
        :
          <Flatpickr
            options={{ locale: Dutch, dateFormat: "d.m.Y H:i" }}
            data-enable-time
            value={date}
            onChange={dateChanged => {
              updateDate(dateChanged)
            }}
          />
        }
      </div>
    </div>
  )
}

export default DatePicker;
