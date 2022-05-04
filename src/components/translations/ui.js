import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../translate";

const TranslateUI = () => {

  const intervention = useSelector(state => state.intervention);


  return (
    <div>
      <h2>{t("User Interface")}</h2>
      Nog uitwerken...
    </div>
  )

}

export default TranslateUI;