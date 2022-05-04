import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import TextareaAutosize from 'react-textarea-autosize';
import t from "../translate";

const SendMessage = props => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [message, setMessage] = useState([])
  const [succesMessage, setSuccesMessage] = useState("");
  const [sendMessages, setSendMessages] = useState([])
  const [showSendMessages, setShowSendMessages] = useState(false)

  useEffect(() => {
    setMessage('')

    if(props.activeGroup.id > 0){
      let apiCallObj = {
        action: "get_send_messages_to_group",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
        }
      };

      apiCall(apiCallObj).then(resp => {
        setSendMessages(resp.sendMessages)
      });
    }
  }, [props.activeGroup]);

  const sendEmail = (e) => {

    let apiCallObj = {
      action: "send_message_to_group",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        group_id: props.activeGroup.id,
        message:message
      }
    };

    apiCall(apiCallObj).then(resp => {
      setSendMessages(resp.sendMessages)
      setMessage('')
      if(resp.error == 0){
        setSuccesMessage(resp.msg)
        setTimeout(() => {
          setSuccesMessage("");
        }, 5000);
      }
    });
  }

  const toggleShow = () => {
    if(showSendMessages){
      setShowSendMessages(false)
    } else {
      setShowSendMessages(true)
    }
  }

  return(
    <div className="sendMessage">
      <h4>{t("Verzend bericht")}</h4>

      <TextareaAutosize
        placeholder={t("Bericht")}
        onChange={e => setMessage(e.target.value)}
        value={message}
      />

      <div
        className={succesMessage.length < 1 ? "alert" : "alert alert-success"}
        role="alert"
      >
        {succesMessage}
      </div>

      <span className="btn btn-primary" onClick={sendEmail}>
        {t("Verzenden")}
      </span>

      {sendMessages.length > 0 ?
        <div className={"sendMesssages" + (showSendMessages ? ' visible':'')}>
          <div className="pointer" onClick={()=>toggleShow()}>
            <h5>{t("Verzonden berichten naar groep")}</h5> <i className="fas fa-chevron-up"></i>
          </div>
          {showSendMessages ?
            <div className="messages">
              {sendMessages.map((message, key) => {
                return (
                  <div className="message" key={key}>
                      {message.content}
                      <div className="sendingTime">
                        {message.sendingTime}
                      </div>
                  </div>
                )
              })}
            </div>
            :<></>}
        </div>
        :<></>}

    </div>
  )
}
export default SendMessage
