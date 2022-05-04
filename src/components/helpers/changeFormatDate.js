import React from "react";
import {GetTime, GetDate} from "./convertTimestamp";

export const getTimeStamp= (date) => {
  let timestamp = Date.parse(date);

  return timestamp/1000;
}

export const isToday= (date) => {
  let today = GetDate(Date.now()/1000);
  date = ChangeFormatDate(date);

  if(today == date){
    return true;
  }
}

export const ChangeFormatDateTime= (date) => {
  let timestamp = Date.parse(date);

  ///zonder deze tussen stap is de tijd 2 uur off
  timestamp = timestamp/1000;

  return GetTime(timestamp);
}
export const ChangeFormatDate= (date) => {
  let timestamp = Date.parse(date);

  ///zonder deze tussen stap is de tijd 2 uur off
  timestamp = timestamp/1000;

  return GetDate(timestamp);
}
