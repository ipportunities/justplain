import React from "react";

export const ConvertTimestamp = (timestamp) => {
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var hour = date.getHours();
  var min = String(date.getMinutes()).padStart(2, "0");
  var sec = date.getSeconds();
  var date = date.getDate();
  var time =  date + '-' + (month + 1) + '-' + year + " " + hour + ':' + min ;

  return time;
}


export const GetDate = (timestamp) => {
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var date = date.getDate();
  var time =  date + '-' + (month + 1) + '-' + year  ;

  return time;
}


export const GetTime = (timestamp) => {
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = date.getMonth();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  var date = date.getDate();
  var time =  hour + ':' + (min < 10 ? '0' : '') + min

  return time;
}
