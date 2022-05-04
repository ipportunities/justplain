import React, {useEffect, useState} from 'react';
import t from "../../../translate";
import {appSettings} from "../../../../custom/settings";

const CustomElements = (props) => {

  const [customEls, setCustomEls] = useState([]);
  const [chosenCustomElId, setChosenCustomElId] = useState(false);

  //////////////////////
  ///On init
  useEffect(() => {
    if(typeof props.part.custom_id != "undefined")
    {
      setChosenCustomElId(props.part.custom_id)
    }
    /// TODO nog ophalen uit database denk ik...
    setCustomEls(appSettings.customModules)
  }, []);

  function updateChosenEl(el_id){
    props.updatePart(props.index, 'custom_id', el_id)
    setChosenCustomElId(el_id)
  }

  return(
    <div className="Custom center">
      <select onChange={(e) => updateChosenEl(e.target.value)} value={chosenCustomElId}>
        <option>{t("Selecteer custom element")}</option>
        {customEls.map((customEl, index) =>
          <option key={index} value={customEl.id}>{t(customEl.title)}</option>
        )}
      </select>
    </div>
  )
}
export default CustomElements
