import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import t from "../../translate";
import ContentEditable from 'react-contenteditable';
import apiCall from "../../api";

const CloseQuestionnaire = props => {

  const [explanation, setExplanation] = useState('')
  const [chosen, setChosen] = useState(5)

  useEffect(() => {
    positionValueBullet(5, 9)
  }, []);

  const save = () =>{
    props.setShowCloseQuestionnaire(false)
    props.setChatSesssionID(false)
    ///nog opslaan ergens
  }

  const [offsetLeft, setOffsetLeft] = useState(0)

  function positionValueBullet(value, rangeMaxx) {
    let tempOffsetLeft = (((value - 1)/rangeMaxx) * (document.getElementById("range_0").offsetWidth - 22)) + 'px';
    setOffsetLeft(tempOffsetLeft)
  }

  function updateSliderAnswer(value){
    setChosen(value)
    positionValueBullet(value, 9)
  }


  return (
    <div className="popup fullscreen">
      <div className="content">
        <h1>{t("De groupschat is beëindigd")}</h1>
        <h2>{t("Wat vond je van deze chatsessie?")}</h2>

        <span className="rs-label" style={{'left':offsetLeft}}>{chosen}</span>
        <input id='range_0' type="range" min="1" max="10" onChange={(e) => updateSliderAnswer(e.target.value)}  value={chosen} />

        <b>{t("Toelichting")}</b>
        <ContentEditable
            html={explanation}
            placeholder={t("Uw bericht")}
            disabled={false}
            onChange={e => setExplanation(e.target.value)}
          />
        <span className="btn btn-primary" onClick={save}>{t('Opslaan')}</span>
      </div>
    </div>
  )
}

export default CloseQuestionnaire
