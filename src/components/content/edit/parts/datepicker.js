import React, { useState, useEffect } from "react";
import uuid from "uuid";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import InputTextfield from './input_textfield.js';
import t from "../../../translate";

const DatePicker = props => {

  const [date, setDate] = useState(new Date())

  useEffect(() => {
    if (props.part.content != "") {
      setDate(props.part.content);
    }
  }, []);

  return(
    <div className="center">
      <div className="question">
        <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must} />
      </div>
      <Flatpickr
        options={{ locale: Dutch }}
        data-enable-time
        value={date}
      />
    </div>
  )
}

export default DatePicker;
