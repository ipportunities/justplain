import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import t from "../translate";
import { ConvertTimestamp } from "../helpers/convertTimestamp";
import Chatbox from "./chatbox";
import SortObjectArray from "../helpers/sortObjectArray.js";
import apiCall from "../api";
import Typewriter from 'typewriter-effect';
import ConfirmBox from "../alert/confirm";

const ChatArchive = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [archivedGroupchats, setArchivedGroupchats] = useState([]);
  const [checked, setChecked] = useState(false);
  const [myRefCode, setMyRefCode] = useState(false)

  ///CHECK IF NR MESSAGE CHANGED
  useEffect(() => {
    if(props.activeGroup && props.activeGroup.id != '' && intervention.id > 0){
      let apiCallObj = {
        action: "get_archived_groupchats",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id: props.activeGroup.id,
        }
      };
      apiCall(apiCallObj).then(resp => {
        setArchivedGroupchats(resp.archived_chats)
        setChecked(true)
        setMyRefCode(resp.myRefCode)
      });
    }
  }, [props.activeGroup.id, intervention.id]);

  const [chosenSession, setChosenSesssion] = useState(false)
  const [showArchivedChat, setShowArchivedChat] = useState(false);
  const [chatContent, setChatContent] = useState([])
  const [groupchatUsers, setGroupchatUsers] = useState([])

  const seeArchivedChat = (archivedChatSessionID)=>{

    let apiCallObj = {
      action: "get_archived_groupchat_data",
      token: auth.token,
      data: {
        chat_session_id: archivedChatSessionID,
      }
    };
    apiCall(apiCallObj).then(resp => {
      if(props.setChatActive){
          props.setChatActive(true)
      }
      setShowArchivedChat(archivedChatSessionID)
      setChatContent(resp.chatContent)
      setGroupchatUsers(resp.users)
    });


  }

  const [sortDirection, setSortDirection] = useState("asc")

  const sort = (toSort)=>{
    let archivedGroupchatsTemp = [...archivedGroupchats]
    let direction = sortDirection == "asc" ? "desc":"asc"
    setSortDirection(direction)
    archivedGroupchatsTemp.sort(SortObjectArray(toSort, direction));
    setArchivedGroupchats(archivedGroupchatsTemp)
  }
  const closeArchivedChat = (archivedChatSessionID)=>{
    setShowArchivedChat(false)
    if(props.setChatActive){
        props.setChatActive(false)
    }
  }

  const [confirmOptions, setConfirmOptions] = useState({});

  const deleteArchivedChatConfirm = (archivedChatID)=>{
    let confirmOptionsToSet = {
      show: "true",
      text: t("Weet u zeker dat u deze gearchiveerde chat definitief wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deleteArchivedChat(archivedChatID)
    };
    setConfirmOptions(confirmOptionsToSet);
  }

  const deleteArchivedChat = (archivedChatID)=>{
    /*
    let apiCallObj = {
      action: "delete_archived_groupchat",
      token: auth.token,
      data: {
        groupchat_archive_id: archivedChatID,
      }
    };
    apiCall(apiCallObj).then(resp => {

    });
    */
  }



  return (
    <div className="groups-archive">
      {auth.userType == "student" ?
        <h1 id="typed_1" className="big"><Typewriter options={{delay:40}}
        onInit={(typewriter) => {
          typewriter.typeString(t('Chat archief'))
            .callFunction(() => {
              document.getElementById("typed_1").className = "finished big"
            })
            //.pauseFor(2500)
            //.deleteAll()
            .start();
        }}
        /></h1>
        :
        <></>
      }
      {checked && archivedGroupchats.length == 0 ?
        <div className="empty">
          {t("Geen resultaten")}
        </div>
        :
        <>
        {checked ?
          <>
            {auth.userType == "coach" ?
              <h4>{t("Chat archief")}</h4>
              :
              <></>
            }
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => sort("id")}>
                    #
                  </th>
                  <th className="sortable" onClick={() => sort("session")}>
                    {t("Sessie")}
                  </th>
                  <th className="sortable" onClick={() => sort("date_time_started")}>
                    {t("Start")}
                  </th>
                  <th className="sortable" onClick={() => sort("date_time_create")}>
                    {t("Afgerond op")}
                  </th>
                  <th>

                  </th>
                </tr>
              </thead>
              <tbody>
              {archivedGroupchats.map((archivedChat, key) => {
                return (
                  <tr className="item" key={key}>
                    <td onClick={()=>seeArchivedChat(archivedChat.session_id)}>
                      {auth.userType == "student" ?
                        <div className="phone">{t("#")}</div>
                        :<></>
                      }
                      {archivedChat.id}
                    </td>
                    <td>
                      {auth.userType == "student" ?
                        <div className="phone">{t("Sessie")}</div>
                        :<></>
                      }
                      {archivedChat.session}
                    </td>
                    <td onClick={()=>seeArchivedChat(archivedChat.session_id)}>
                      {auth.userType == "student" ?
                        <div className="phone">{t("Gestart op")}</div>
                        :<></>
                      }
                      {ConvertTimestamp(archivedChat.date_time_started)}
                    </td>
                    <td onClick={()=>seeArchivedChat(archivedChat.session_id)}>
                      {auth.userType == "student" ?
                        <div className="phone">{t("Afgerond op")}</div>
                        :<></>
                      }
                      {ConvertTimestamp(archivedChat.date_time_create)}
                    </td>
                    <td>
                      <i className="fas fa-eye" onClick={()=>seeArchivedChat(archivedChat.session_id)}></i>
                      {auth.userType == "coach" ?
                        <i className="fas fa-trash" onClick={()=>deleteArchivedChatConfirm(archivedChat.id)}></i>
                        :
                        <></>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </>
          :<></>}
        </>
      }
      {showArchivedChat ?
        <Chatbox
          type={auth.userType}
          chosenSession={chosenSession}
          chatSesssionID={showArchivedChat}
          chatContent={chatContent}
          setChatContent={setChatContent}
          groupchatUsers={groupchatUsers}
          setGroupchatUsers={setGroupchatUsers}
          myRefCode={myRefCode}
          closeChatScreen={closeArchivedChat}
          sessionTexts={[]}
          setStartGetDataInterval={false}
          startGetDataInterval={false}
          startGetDataInterval={false}
          archiveMode={true}
          />
        :<></>
      }
      <ConfirmBox
        confirmOptions={confirmOptions}
        setConfirmOptions={setConfirmOptions}
      />
    </div>
  )
}

export default ChatArchive;
