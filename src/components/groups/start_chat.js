import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../translate";
import Chatbox from "./chatbox";
import apiCall from "../api";

const StartChat = props => {

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [startGetDataInterval, setStartGetDataInterval] = useState(false)
  const [groupchatUsers, setGroupchatUsers] = useState([])
  const [activeChatChecked, setActiveChatChecked] = useState(false)
  const [activeChat, setActiveChat] = useState(false)
  const [chosenSession, setChosenSesssion] = useState(false)
  const [agendaSessions, setAgendaSesssions] = useState([])
  const [chatSesssionID, setChatSesssionID] = useState(false)
  const [chat, setChat] = useState(false)
  const [chatContent, setChatContent] = useState([])
  const [sessionTexts, setSessionTexts] = useState([])
  const [myRefCode, setMyRefCode] = useState(false)

  ///CHECK IF GROUPCHAT IS AVAILABLE
  useEffect(() => {
    if(intervention.id > 0){
      let apiCallObj = {
        action: "is_groupchat_available",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
        }
      };
      apiCall(apiCallObj).then(resp => {
        if(resp.session_id != false){
          setActiveChat(true)
          setChosenSesssion(resp.session)
          setChatSesssionID(resp.session_id)
        }
        let tempAgendaSessions = []
        for(let i = 0 ; i<parseInt(intervention.settings.chatlessons.length) ; i++){
          tempAgendaSessions.push({session:(i+1)})
        };
        setAgendaSesssions(tempAgendaSessions)

        setActiveChatChecked(true)
      });
    }
  }, [intervention.id]);

  ///START GROUPCHAT
  const startChat = (e) => {
    let apiCallObj = {
      action: "start_groupchat",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        group_id: props.activeGroup.id,
        session: chosenSession,
      }
    };
    apiCall(apiCallObj).then(resp => {
      setChatContent(resp.chatContent)
      setChat(true)
      setActiveChat(true)
      setChatSesssionID(resp.session_id)
      setGroupchatUsers(resp.users)
      setSessionTexts(resp.texts)
      setMyRefCode(resp.myRefCode)
      setStartGetDataInterval(true)
      });
  }

  ///INTERVAL FUNCTION TO GET GROUPCHATDATA
  const getData = () => {
    let apiCallObj = {
      action: "get_groupchat_data",
      token: auth.token,
      data: {
        chat_session_id: chatSesssionID,
      }
    };
    apiCall(apiCallObj).then(resp => {
      setChatContent(resp.chatContent)
      setGroupchatUsers(resp.users)
    });
  }

  ////CLOSE CHAT SCREEN
  const closeChatScreen = () => {
    setChat(false)
    setStartGetDataInterval(false)
  }

  ////END CHAT SESSION
  const endChat = (e) => {
    let apiCallObj = {
      action: "end_groupchat",
      token: auth.token,
      data: {
        chat_session_id: chatSesssionID,
      }
    };
    apiCall(apiCallObj).then(resp => {
      setChat(false)
      setSessionTexts([])
      setChatSesssionID(false)
      setActiveChat(false)
      setChosenSesssion(false)
      setStartGetDataInterval(false)
      });
  }

  return(
    <>
    {!chat && !activeChat && activeChatChecked ?
      <div className="start_chat">
        <h4>{t("Chatsessie starten")}</h4>
        <select onChange={(e)=>setChosenSesssion(e.target.value)}>
          <option value="">{t("Selecteer sessie")}</option>
          {agendaSessions.map((agendaSession, key) => {
            return (
              <option value={agendaSession.session}>{t("Sessie")} {agendaSession.session}</option>
            )
          })}
        </select>
        {chosenSession ?
          <span className="btn btn-primary" onClick={startChat}>
            {t("Chatsessie")} {chosenSession} {t("starten")}
          </span>
          :<></>}
      </div>
      :<></>}
    {activeChat ?
      <div className="resume_chat">
        <h4>{t("Chatsessie hervatten")}</h4>
        <span className="btn btn-primary" onClick={startChat}>
          {t("Hervat chat sessie")} {chosenSession}
        </span>
        <span className="btn btn-secondary" onClick={endChat}>
          {t("Beeindig chat sessie")} {chosenSession}
        </span>
      </div>
      :<></>}
    {chat ?
      <Chatbox
        type="coach"
        chosenSession={chosenSession}
        chatSesssionID={chatSesssionID}
        chatContent={chatContent}
        setChatContent={setChatContent}
        groupchatUsers={groupchatUsers}
        setGroupchatUsers={setGroupchatUsers}
        myRefCode={myRefCode}
        closeChatScreen={closeChatScreen}
        sessionTexts={sessionTexts}
        myRefCode={myRefCode}
        setStartGetDataInterval={setStartGetDataInterval}
        startGetDataInterval={startGetDataInterval}
        archiveMode={false}
        />
      :<></>}
    </>
  )
}
export default StartChat
