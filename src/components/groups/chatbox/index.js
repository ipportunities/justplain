import React, {useState, useEffect, useRef} from "react";
import { useSelector } from "react-redux";
import t from "../../translate";
import { ConvertTimestamp } from "../../helpers/convertTimestamp";
import Users from "./users";
import InfoTexts from "./infotexts";
import Texts from "./texts";
import CloseQuestionnaire from "./closeQuestionnaire";
import parse from 'html-react-parser';
import NotificationBox from "../../alert/notification";
import ContentEditable from 'react-contenteditable';
import apiCall from "../../api";
import {appSettings} from "../../../custom/settings";
import Picker from 'emoji-picker-react';

let getDataInterval = null;

const Chatbox = props => {

  const auth = useSelector(state => state.auth);

  const messagesEndRef = useRef(null)

  const [groupChatActive, setGroupChatActive] = useState(false);
  const [newMessage, setNewMessage] = useState('')
  const [nrMessages, setNrMessages] = useState(0)
  const [activeInfoScreen, setActiveInfoScreen] = useState(false)
  const [userHasTimeout, setUserHasTimeout] = useState(false)
  const [notificationOptions, setNotificationOptions] = useState('');
  const [activeScreen, setActiveScreen] = useState('chat');

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setNewMessage(newMessage + '<span data-emoji-code="'+emojiObject.unified+'">'+emojiObject.emoji+'</span>')
  };

  ///SCROLL TO BOTTOM
  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }

  ///CHECK IF USER HAS TIMEOUT
  useEffect(() => {
    for(let i = 0 ; i<props.groupchatUsers.length ; i++){
      if(props.myRefCode == props.groupchatUsers[i].refCode){
        if(props.groupchatUsers[i].disabled == 1){
          setUserHasTimeout(true)
        } else {
          setUserHasTimeout(false)
        }
      }
    }
  }, [props.groupchatUsers]);

  ///CHECK IF NR MESSAGE CHANGED
  useEffect(() => {
    if(nrMessages != props.chatContent.length){
      setNrMessages(props.chatContent.length)
      setTimeout(function(){scrollToBottom()}, 200);
    }
  }, [props.chatContent]);

  ///CHECK IF INTERVAL IS NEEDED
  useEffect(() => {
    if(props.setStartGetDataInterval && props.chatSesssionID){
      getDataInterval = setInterval(function(){
        getData();
      }, 1000)

    } else {
      clearInterval(getDataInterval)
    }
  }, [props.setStartGetDataInterval, props.chatSesssionID]);

  ///INTERVAL FUNCTION TO GET GROUPCHATDATA
  const getData = () => {
    let apiCallObj = {
      action: "get_groupchat_data",
      token: auth.token,
      data: {
        chat_session_id: props.chatSesssionID,
      }
    };
    apiCall(apiCallObj).then(resp => {
      // stop the interval if there is a error...
      if(resp.error == 1){
        clearInterval(getDataInterval)
        props.closeChatScreen();
      } else if(resp.chatIsFinished == true) {
        props.closeChatScreen();
        clearInterval(getDataInterval)
      } else {
        props.setChatContent(resp.chatContent)
        props.setGroupchatUsers(resp.users)
        if(resp.active_info_screen != activeInfoScreen){
          setActiveInfoScreen(resp.active_info_screen)
        }
      }
    });
  }

  function getLogin(refCode){
    let login = '';
    let usertype = '';
    ///get coach id this intervention
    let this_user_obj = props.groupchatUsers.filter(function (user) {
      return user.refCode === refCode
    });
    if(this_user_obj.length != 0){
      login = this_user_obj[0].login;
      if(this_user_obj[0].usertype == "coach"){
        usertype = " ("+this_user_obj[0].usertype+")";
      }

    }
    return login + usertype ;
  }

  ////CAL ACTION SEND + EMPTY TYPED TEXT
  const sendNewMessage = () => {
    if(newMessage != "" || quote != ""){
      let tempNewMessage = quote + newMessage;
      send(tempNewMessage)
      setNewMessage('')
      setQuote('')
      setAdjustedHeight('')
    }
  }

  ////SEND MESSAGE
  const send = (text) => {
    if(!userHasTimeout){
      clearInterval(getDataInterval);
      let apiCallObj = {
        action: "add_groupchat_text",
        token: auth.token,
        data: {
          message: text,
          chat_session_id: props.chatSesssionID,
        }
      };
      apiCall(apiCallObj).then(resp => {
        props.setChatContent(resp.chatContent)
        props.setGroupchatUsers(resp.users)
        scrollToBottom()
        getDataInterval = setInterval(() => {
          getData();
        }, 1000);
      });
    } else {
      setNotificationOptions({
        show: "true",
        text: t("Je hebt een timeout. Je kunt momenteel geen berichten plaatsen."),
        confirmText: t("Ok")
      });
    }
  }

  ///GET COLOR KEY MESSAGE
  const getColorKey = (refCode) =>{
    let this_user_obj = props.groupchatUsers.filter(function (user) {
      return user.refCode === refCode
    });
    if(this_user_obj.length != 0){
      return props.groupchatUsers.indexOf(this_user_obj[0]) % 7
    }
  }

  const closeChatScreen = () =>{
    clearInterval(getDataInterval);
    props.closeChatScreen()
  }

  const downloadPDF = (chatSessionID) =>{
    window.open( appSettings.domain_url + '/api/download/groupchat/chat.php?token='+auth.token+'&chatSessionID='+chatSessionID );
  }

  const [emoticonsPickerVisible, setEmoticonsPickerVisible] = useState(false)

  const toggleEmoticonsPicker = () =>{
    if(emoticonsPickerVisible){
      setEmoticonsPickerVisible(false)
    } else {
      setEmoticonsPickerVisible(true)
    }
  }

  const [adjustedHeight, setAdjustedHeight] = useState("")

  const [quote, setQuote] = useState("")

  const quoteText = (key) => {
    let tekst = props.chatContent[key].message;

    setQuote('<div class="quote"><div class="login">'+ getLogin(props.chatContent[key].refCode) + ':</div> '+ tekst + '<span class="end"></span></div>')

    adjustContentHeight()
  }

  const updateNewMessage = (message) => {
    setNewMessage(message)
    adjustContentHeight()
  }
  const adjustContentHeight = () => {
    setTimeout(function(){
      let new_message_box = document.getElementById('newChat').offsetHeight;

      setAdjustedHeight('calc(100vh - '+ new_message_box +'px)');
    }, 100)

  }

  return (
    <div className={"groupchat " + (props.type) + " show_" + activeScreen}>
      {auth.userType == "student" ?
        <div className="chat_menu_mobile">
          <i className={"fas fa-users" + (activeScreen == 'users' ? ' active':'')} onClick={()=>setActiveScreen('users')}></i>
          <i className={"far fa-comments"  + (activeScreen == 'chat' ? ' active':'')} onClick={()=>setActiveScreen('chat')}></i>
          {!props.archiveMode ?
            <i className={"fas fa-file-alt"  + (activeScreen == 'texts' ? ' active':'')} onClick={()=>setActiveScreen('texts')}></i>
            :
            <></>
          }
        </div>
        :
        <></>
      }
      <i className="fas fa-times" onClick={closeChatScreen}></i>
      <div className="holder">
        <div className="right">
          <Users groupchatUsers={props.groupchatUsers} myRefCode={props.myRefCode} archiveMode={props.archiveMode} chatSesssionID={props.chatSesssionID}/>
          {typeof props.sessionTexts != "undefined" && !props.archiveMode ?
            <Texts sessionTexts={props.sessionTexts} setNewMessage={setNewMessage}/>
          :<></>}
          {props.archiveMode ?
            <div className="archive_functions">
              <span className="btn btn-primary" onClick={()=>downloadPDF(props.chatSesssionID)}>
                {t("Download als pdf")}
              </span>
            </div>
            :<></>
          }
        </div>
        <div className="chatbox">
          <div className="content_holder" ref={messagesEndRef} style={{height:adjustedHeight}}>
            <div className="content">
              {props.chatContent.map((message, key) => {
                return (
                  <div key={key} className={"message color-" + getColorKey(message.refCode) + (props.myRefCode == message.refCode ? ' itsme':'') } onClick={() => quoteText(key)}>
                    <div className="sender">
                      {getLogin(message.refCode)}
                    </div>
                    {parse(message.message)}
                    <div className="date">
                      {props.archiveMode ? <>{ConvertTimestamp(message.date_time_send)}</>:<>{ConvertTimestamp(message.date_time_create)}</>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {!props.archiveMode ?
            <div id="newChat" className="new">
              {emoticonsPickerVisible ?
                <>
                  <i class="fas fa-dizzy" onClick={()=>toggleEmoticonsPicker()}></i>
                  <Picker onEmojiClick={onEmojiClick} />
                </>
                :
                <i className="far fa-smile-beam" onClick={()=>toggleEmoticonsPicker()}></i>
              }
              <div className="message_holder">
                {quote != "" ?
                  <div className="quoted">
                    <i className="far fa-times-circle" onClick={()=>{setQuote('');adjustContentHeight();}}></i>
                    {parse(quote)}
                  </div>
                  :<></>
                }
                <div className="message">
                <ContentEditable
                    html={newMessage}
                    placeholder={t("Uw bericht")}
                    disabled={false}
                    onChange={e => updateNewMessage(e.target.value)}
                  />
                </div>
              </div>
              <i className="far fa-paper-plane" onClick={sendNewMessage}></i>
            </div>
            :<></>}
        </div>


          {!props.archiveMode ?
            <div className="left">
              <InfoTexts chosenSession={props.chosenSession} chatSesssionID={props.chatSesssionID} activeInfoScreen={activeInfoScreen}/>
            </div>
              :<></>
          }
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  );
}

export default Chatbox;
