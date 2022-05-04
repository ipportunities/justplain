import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../../translate";
import ContentEditable from "react-contenteditable";
import parse from "html-react-parser";
import apiCall from "../../api";
import { transformDate } from "../../utils";
import $ from "jquery";
import { ChangeFormatDateTime, ChangeFormatDate, isToday } from "../../helpers/changeFormatDate.js";

let getDataInterval = null;

const  StudentDetailsLiveChat = props => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);
    const [student, setStudent] = useState({
    });
    const [messagesSet, setMessagesSet] = useState(false);
    const [messages, setMessages] = useState([
       //{
       //   content: "Dit is een standaard testbericht van een coach ofzo",
       //   sendingTime: new Date().toLocaleString(),
       //   type: "sent"
       // }
      ]);
    const [firstLoad, setFirstLoad] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [lastCheckedByStudent, setLastCheckedByStudent] = useState(0);

    const [liveChatAvailable, setLiveChatAvailable] = useState(false);
    const [liveChatTime, setLiveChatTime] = useState(false);

    useEffect(() => {
      if(intervention.id > 0){
        ///check of live chat is beschikbaar vandaag
        let apiCallObj = {
          action: "get_contact_moments",
          token: auth.token,
          data: {
            student_id: props.studentId,
            intervention_id:intervention.id
          }
        };

        apiCall(apiCallObj).then(resp => {
            if(typeof intervention.settings !== "undefined" && typeof intervention.settings.selfhelp.guided_selfhelp_live_chat !== "undefined" &&  intervention.settings.selfhelp.guided_selfhelp_live_chat === 1){
              ///gepland of gewoon open
              if(intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1){
                for(let i = 0 ; i < resp.contact_moments.length ; i++){
                  if(resp.contact_moments[i].date_time != "" && isToday(resp.contact_moments[i].date_time) && resp.contact_moments[i].type == "chat"){
                    setLiveChatAvailable(true)
                    setLiveChatTime(resp.contact_moments[i].date_time)
                    break;
                  }
                }
              } else {
                setLiveChatAvailable(true)
              }
        }});
      }
    }, [intervention]);

    useEffect(() => {
        //student info ophalen
        apiCall({
            action: "get_student",
            token: auth.token,
            data: {
              user_id: props.studentId,
              intervention_id: intervention.id
            }
          }).then(resp => {
            setStudent(resp.user);
          });
        //chatdata ophalen
        if (intervention.id > 0) {
            getData(true);
        }

        /// dit is unmounting
        return(() => {
            clearInterval(getDataInterval);
        })
    }, [props.studentId]);

    const getData = (firstLoad = false) => {
        apiCall({
          action: "get_live_chat",
          token: auth.token,
          data: {
            intervention_id: parseInt(intervention.id),
            student_id: parseInt(props.studentId)
          }
        }).then(resp => {
          if (resp.data) {
            setMessagesSet(true);
            setMessages(resp.data);
            setLastCheckedByStudent(resp.lastCheckedByStudent);
            if(firstLoad){
                setTimeout(() => {
                  if(document.getElementById('chatFrame')){
                    $('html,body').animate({scrollTop: document.body.scrollHeight});
                  }

                }, 500);
                clearInterval(getDataInterval);
                getDataInterval = setInterval(function(){
                  getData();
                }, 1000)
            }


            //evt badges niet meer weergeven...
            props.setUnreadMessage(false);
            props.setUnreadMessageMain(props.studentId ,false);
          }
        });
    }

    function updateNewMessage(value, keyCode) {
        setNewMessage(value);
    }

    ///TODO echt saven en ophalen
    function sendNewMessage() {
      clearInterval(getDataInterval);
      apiCall({
        action: "save_live_chat",
        token: auth.token,
        data: {
          intervention_id: parseInt(intervention.id),
          student_id: parseInt(student.id),
          content: newMessage
        }
      }).then(resp => {
        if (resp.data) {
          setMessages(resp.data);
          setNewMessage("");
          getData(true);
        }
      });
    }

    return (
        <div className="chat">
            {liveChatAvailable ?
                <>
                {messagesSet && messages.length == 0 ?
                    <div className="empty">
                        {auth.userType == "coach" ?
                            <><h3>{t("Chat")}</h3>
                            {t("Stuur je student een bericht.")}
                            </>
                        :<>
                        <h3>{t("Nog geen berichten verzonden")}</h3>
                            {t("Indien er communicatie via de chat heeft plaatsgevonden vindt u deze hier terug.")}
                        </>}
                    </div>
                :<></>}
              <div className="chatContent">
                <div className="messages" id="chatFrame">
                  {messages.map((message, index) => (
                     <div key={index} className={"message " + message.type}>
                      <div className="name">
                        {
                        (message.type === 'sent') ?
                          <>
                          {
                            (student.anonymous === 1) ?
                              student.login
                              :
                              student.firstname + ' ' + student.insertion + ' ' + student.lastname
                          }
                          </>
                        : message.name
                        }
                        </div>
                      <div className="content">{parse(message.content)}</div>
                      <div className="sendingTime">
                        {transformDate(message.sendingTime)}
                        {
                          message.type == 'received' ?
                          <>
                            &nbsp;
                            <i className={lastCheckedByStudent > message.sendingTimeUnix ? 'blue fas fa-check' : 'fas fa-check'}></i>
                            <i className={lastCheckedByStudent > message.sendingTimeUnix ? 'blue fas fa-check' : 'fas fa-check'} style={{"margin-left":"-8px"}}></i>
                          </>
                          : <></>
                        }


                      </div>
                    </div>
                  ))}
                </div>



                {auth.userType == "coach" ?
                    <>
                        <div className="newMessage">
                          <ContentEditable
                            //innerRef={props.focus !== false && typed == false ? focus:false}
                            html={newMessage}
                            placeholder={t("Je bericht")}
                            disabled={false}
                            onChange={e => updateNewMessage(e.target.value)}
                            className="input_no_bg"
                          />
                        </div>
                        <span className="btn btn-primary" onClick={e => sendNewMessage()}>
                            {t("Verzend bericht")}
                        </span>
                    </>
                :<></>}
              </div>
                </>
                :
                <div className="no_chat_today">
                    {t("De chat is momenteel gesloten")}
                </div>
            }
        </div>
      )
}

export default StudentDetailsLiveChat;
