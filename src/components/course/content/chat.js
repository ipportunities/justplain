import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../../translate";
import ContentEditable from "react-contenteditable";
import parse from "html-react-parser";
import apiCall from "../../api";
import { transformDate } from "../../utils";
import $ from "jquery";
import standardAvatar from "../../../images/course/standard/avatar.png";

let scrollDown = false;

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [widthChatContent, setWidthChatContent] = useState(0);
  const history = useHistory();

  const activeIntervention = useSelector(state => state.activeIntervention);
  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);

  const [coachName, setcoachName] = useState(t("Coach"));
  const [coachBio, setcoachBio] = useState('');
  const [coachPic, setcoachPic] = useState('');
  const [bgCoach, setBgCoach] = useState('');

  //// de header van de chat heeft position:fixed deze functie maakt de header even breed als zijn parent
  function resizeHeaderChat(){
    if($("#chatContent")){
      if($("#chatContent").width() != widthChatContent){
        setWidthChatContent($("#chatContent").width())
      }
    }
  }

  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if(intervention.settings.coachPhoto && intervention.settings.coachPhoto != ""){
      setBgCoach(intervention.settings.coachPhoto)
    }
  },[intervention.settings.coachPhoto])
  useEffect(() => {
    /// get chosen values from server and set in chosenvalues en dates
    if (activeIntervention > 0) {
      apiCall({
        action: "get_chat",
        token: auth.token,
        data: {
          intervention_id: parseInt(activeIntervention)
        }
      }).then(resp => {
        if (resp.data) {
          setcoachName(resp.coach_name);
          setcoachBio(resp.coach_bio);
          if(resp.coach_pic != ''){
            setcoachPic(url + resp.coach_pic);
          } else {
            setcoachPic(standardAvatar);
          }


          setMessages(resp.data);
          setTimeout(() => {
            resizeHeaderChat();
            if(document.getElementById('chatFrame'))
            {
              document.getElementById('chatFrame').scrollTop = document.getElementById('chatFrame').scrollHeight;
            }

            window.addEventListener('resize', resizeHeaderChat)
            /// TODO deze werkt nog door op andere schermen
            clearTimeout(scrollDown)

            scrollDown = setTimeout(() => {
                if($(".chat .chatContent").length != 0){
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
              }
            }, 0)


          }, 500);
        }
      });
    }

  }, []);

  const updateNewMessage = (value, keyCode) => {
    setNewMessage(value);
  }

  ///TODO echt saven en ophalen
  const sendNewMessage = () => {

     apiCall({
      action: "save_chat",
      token: auth.token,
      data: {
        intervention_id: parseInt(activeIntervention),
        content: newMessage
      }
    }).then(resp => {
      if (resp.data) {
        setMessages(resp.data);
        setNewMessage("");
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
      }
    });
  }

  const [showInfoCoach, setShowInfoCoach] = useState(false);

  function closeExtraInfo(e){
    e.stopPropagation()
    setShowInfoCoach(false)
  }

  function goBack(e){
    e.stopPropagation()
    history.goBack()
  }

   return (
     <div className={"chat" + (showInfoCoach ? ' extraInfo':'')}>
       <div className="illustration" style={{width: widthChatContent, backgroundImage:"url("+bgCoach+")"}}>
       </div>
       <div className="chatContent" id="chatContent">
         <header
           style={{width: widthChatContent}}
           onClick={()=>setShowInfoCoach(true)}
           >
           <table className="pointer">
             <tbody>
               <tr>
                 <td className="phone">
                   <span onClick={(e) => goBack(e)}><i className="fas fa-chevron-left"></i></span>
                 </td>
                 <td>
                   <div className='image' style={{backgroundImage:"url("+coachPic+")"}}></div>
                 </td>
                 <td>
                   <div className="aboutCoach" >
                     <i className="fas fa-times" onClick={(e)=>closeExtraInfo(e)}></i>
                     <h2>{coachName}</h2>
                     {coachBio}
                   </div>
                   <div className='coach'>
                     {coachName}
                   </div>
                 </td>
               </tr>
             </tbody>
           </table>
         </header>

         {(showInfoCoach ? <div className="overlay"></div>:'')}

         <div className="messages" id="chatFrame">
           {messages.map((message, index) => (
             <div key={index} className={"message " + message.type}>
               <div className="name">{(message.type === 'received') ? message.name : ''}</div>
               <div className="content">{parse(message.content)}</div>
               <div className="sendingTime">
                {transformDate(message.sendingTime)}
              </div>
             </div>
           ))}
         </div>
         <div className="newMessageHolder">
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
             <i className="far fa-paper-plane"></i>
           </span>
         </div>

       </div>
     </div>
  );
};

export default Chat;
