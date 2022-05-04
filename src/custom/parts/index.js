import React, {useState, useEffect} from 'react';
import GezinInHuisPlaatsen from './gezin_in_huis_plaatsen';
import MeesteMinsteMoeite from './meeste_minste_moeite';
import MeesteMoeiteMet from './meeste_minste_moeite/meeste_moeite_met.js';
import GekozenMeesteMoeiteMet from './meeste_minste_moeite/gekozen_meeste_moeite_met.js';
import PositieveEigenschappen from './positieve_eigenschappen';
import Netwerk from './netwerk/';
import Netwerk2 from './netwerk/index_2.js';
import t from "../../components/translate";

const CustomParts = (props) => {
  
  const [dynamicContent, setDynamicContent] = useState(<></>)

  useEffect(() => {
    if (typeof props.part !== "undefined" && typeof props.part.custom_id !== "undefined") {
      switch(props.part.custom_id) {
        case "c_1":
          setDynamicContent(<GezinInHuisPlaatsen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />)
          break;
        case "c_4":
          setDynamicContent(<MeesteMinsteMoeite part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />)
          break;
        case "c_5":
          setDynamicContent(<MeesteMoeiteMet part={props.part} answer={props.answer} updateAnswer={props.updateAnswer}/>)
          break;
        case "c_7":
          setDynamicContent(<GekozenMeesteMoeiteMet part={props.part} />)
          break;
        case "c_3":
          setDynamicContent(<PositieveEigenschappen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />)
          break;
  
        ///c_2 en c_6 zijn hetzelfde en mogen hetzelfde blijven maar worden na elkaar ingeladen en dat botste laadt ze apart in enkel naam component is anders
        case "c_2":
          setDynamicContent(<Netwerk part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} title={t("Jouw netwerk")} koppel_id="c_2" />)
          break;
        case "c_6":
          setDynamicContent(<Netwerk2 part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} title={t("Netwerk van je kind")} koppel_id="c_6" />)
          break;
      }
    }
  }, [props.part])

  return (
    <>
      {dynamicContent}
    </>
  )
}

export default CustomParts
