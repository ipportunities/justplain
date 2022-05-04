import React from "react";
import { useSelector } from "react-redux";
import t from "../translate";
//import { setSavingStatus } from "../../actions";

const Saved = props => {

  const savingStatus = useSelector(state => state.savingStatus);

  return(
    <div className={savingStatus + ' saveStatus'}>
      {t('Saved')}
    </div>
  )
}

export default Saved;
