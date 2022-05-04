import React from 'react';
import GezinInHuisPlaatsen from './gezin_in_huis_plaatsen';
import MeesteMinsteMoeite from './meeste_minste_moeite';
import MeesteMoeiteMet from './meeste_minste_moeite/meeste_moeite_met.js';
import PositieveEigenschappen from './positieve_eigenschappen';
import Netwerk from './netwerk/';
import t from "../../components/translate";

const CustomParts = (props) => {
  var dynamicContent = "";

  if(props.part.custom_id.split("_")[0] == "c"){
    switch(props.part.custom_id) {
      case "c_1":
        dynamicContent = <GezinInHuisPlaatsen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
        break;
      case "c_4":
        dynamicContent = <MeesteMinsteMoeite part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
        break;
      case "c_5":
        dynamicContent = <MeesteMoeiteMet part={props.part} />;
        break;
      case "c_3":
        dynamicContent = <PositieveEigenschappen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
        break;
      case "c_2":
        dynamicContent = <Netwerk part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} title={t("Jouw netwerk")} />;
        break;
      case "c_6":
        dynamicContent = <Netwerk part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} title={t("Netwerk van je kind")} />;
        break;
    }
  }

  return (
    <>
      {dynamicContent}
    </>
  )
}
export default CustomParts
