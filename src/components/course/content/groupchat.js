import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import t from "../../translate";
import Chatbox from "../../groups/chatbox";
import CloseQuestionnaire from "../../groups/chatbox/closeQuestionnaire";

const Groupchat = (props) => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [startGetDataInterval, setStartGetDataInterval] = useState(false)
  const [chatSesssionID, setChatSesssionID] = useState(false);
  const [groupID, setGroupID] = useState(false);
  const [chatSession, setChatSession] = useState(false);
  const [groupchatUsers, setGroupchatUsers] = useState([])
  const [chatContent, setChatContent] = useState([])
  const [myRefCode, setMyRefCode] = useState(false)

  ///CHECK IF GROUPCHAT IS AVAILABLE
  useEffect(() => {
    if(intervention.settings.intervention_type == "chatcourse"){
      let group_id = false;
      ///zit user in groep?
      let this_intervention_obj = auth.rights.interventions.filter(function (interv) {
        return parseInt(interv.id) === parseInt(intervention.id)
      });
      if(this_intervention_obj.length != 0){
        group_id = this_intervention_obj[0].group_id;
        setGroupID(group_id)
      }
      if(group_id){
        let apiCallObj = {
          action: "is_groupchat_available",
          token: auth.token,
          data: {
            intervention_id: intervention.id,
            group_id: group_id,
          }
        };
        apiCall(apiCallObj).then(resp => {
          if(resp.session_id){
            setChatSesssionID(resp.session_id)
            setChatSession(resp.session)
          }
        });
      }
    } else {
      setChatSesssionID(false)
      setChatSession(false)
    }
  }, [intervention]);

  ///START RESUME GROUPCHAT
  const startChat = (e) => {
    let apiCallObj = {
      action: "start_groupchat",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        group_id: groupID,
        session: chatSession,
      }
    };
    apiCall(apiCallObj).then(resp => {
      props.setChatActive(true)
      setGroupchatUsers(resp.users)
      setChatContent(resp.chatContent)
      setMyRefCode(resp.myRefCode)
      setStartGetDataInterval(true)
    });
  }

  ///INTERVAL FUNCTION TO GET GROUPCHATDATAQ
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

  const [showCloseQuestionnaire, setShowCloseQuestionnaire] = useState(false)

  ///CLOSE CHAT SCREEN
  const closeChatScreen = () => {
    setStartGetDataInterval(false)
    props.setChatActive(false)

    setShowCloseQuestionnaire(true)
  }

  return(
    <>
      {chatSesssionID && !props.chatActive ?
        <div className="groupchat_student">
          <h2>{t("Er is een actieve chat")}</h2>
          <span className="btn btn-primary go_to_chat" onClick={startChat}>
            {t("Naar de chat")}
          </span>

          {showCloseQuestionnaire ?
            <CloseQuestionnaire setShowCloseQuestionnaire={setShowCloseQuestionnaire} setChatSesssionID={setChatSesssionID}/>
            :
            <></>
          }
        </div>
        :
        <>
          {props.chatActive ?
            <Chatbox
              type="student"
              chosenSession={chatSession}
              chatSesssionID={chatSesssionID}
              chatContent={chatContent}
              setChatContent={setChatContent}
              groupchatUsers={groupchatUsers}
              setGroupchatUsers={setGroupchatUsers}
              myRefCode={myRefCode}
              closeChatScreen={closeChatScreen}
              myRefCode={myRefCode}
              setStartGetDataInterval={setStartGetDataInterval}
              startGetDataInterval={startGetDataInterval}
              archiveMode={false}
              />
            :<></>}
        </>}
    </>

  )
}

export default Groupchat;
