import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import ContentEditable from 'react-contenteditable';
import TextareaAutosize from 'react-textarea-autosize';
import { setSavingStatus } from "../../actions";
import t from "../translate";

const SendSMS = props => {

  const dispatch = useDispatch();

  const lengthSMS = 160;

  const [smsText, setSMStext] = useState('')

  useEffect(() => {
    setSMStext('')
  }, [props.activeGroup]);

  const sendSMS = (e) => {
    alert(smsText);
    setSMStext('')
  }
  const updateSms = (sms) => {
    setSMStext(sms.substring(0,lengthSMS))
  }

  return(
    <div className="sendSMS">
      <h4>{t("SMS verzenden naar groep")}</h4>
      <span className="description">max 160 tekens</span>
      <div className="the_sms">
        <TextareaAutosize
          placeholder={t("Sms bericht")}
          disabled={false}
          value={smsText}
          onChange={(e) => updateSms(e.target.value)}
          />
      </div>
      {smsText.length - 1 > lengthSMS ?
        <div className="error">
          {t("Sms bericht is te lang.")}
        </div>
        :<></>}
      <span className="btn btn-primary" onClick={sendSMS}>
        {t("Verzend SMS")}
      </span>
    </div>
  )
}
export default SendSMS
