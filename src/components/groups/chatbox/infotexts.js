import React, {useState, useEffect} from "react";
import t from "../../translate";
import GetPart from '../../content/front/get_part.js';
import { useSelector } from "react-redux";
import apiCall from "../../api";

const InfoTexts = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);


  const [chatlessons, setChatlessons] = useState([])
  const [infoScreen, setInfoScreen] = useState(false)
  const [activeScreenId, setActiveScreenId] = useState(false)

  useEffect(() => {
    if(props.activeInfoScreen){
      changeInfoscreen(props.activeInfoScreen)
      //alert(props.activeInfoScreen)
      if(activeScreenId != props.activeInfoScreen){
        setActiveScreenId(props.activeInfoScreen)
      }
    }
  }, [props.activeInfoScreen, chatlessons, auth, intervention.id]);

  useEffect(() => {
    if(intervention.id > 0){
      let parents = -1;
      let tempChatLessons = [];
      for(let i = 0 ; i < intervention.settings.chatlessons.length - 1 ; i++){
        if(intervention.settings.chatlessons[i].parent_id == 0){
          parents++;
        }
        if(parents == parseInt(props.chosenSession) - 1){
          tempChatLessons.push(intervention.settings.chatlessons[i]);
        }

      }
      setChatlessons(tempChatLessons);
    }

  }, [intervention.id]);

  const changeInfoscreen = (screen_id) =>{
    if(screen_id > 0){
      let this_chatlesson_obj = chatlessons.filter(function (chatlesson) {
        return chatlesson.id === screen_id
      });
      if(this_chatlesson_obj.length != 0){
        setInfoScreen(this_chatlesson_obj[0])
      } else {
        setInfoScreen(false)
      }
    } else {
      setInfoScreen(false)
    }

    if(auth.userType == "coach"){
      setActiveScreenId(screen_id)
      updateInfoScreen(screen_id)
    }
  }

  const fakeUpdate = () => {}

  ///UPDATE INFO SCREEN
  const updateInfoScreen = (screen_id) => {
    let apiCallObj = {
      action: "save_groupchat_info_screen",
      token: auth.token,
      data: {
        chat_session_id: props.chatSesssionID,
        screen_id: screen_id,
      }
    };
    apiCall(apiCallObj).then(resp => {

    });
  }


  return (
    <div className="infotexts">
      <h4 className="header">{t("Infoteksten")}</h4>
      {auth.userType == "coach" ?
        <select onChange={(e)=>changeInfoscreen(e.target.value)} value={activeScreenId}>
          <option value="0">{t("Selecteer scherm")}</option>
          {chatlessons.map((chatlesson, key) => {
            return(
              <option value={chatlesson.id}>{chatlesson.title}</option>
            )
          })}
        </select>
        :<></>}

      {infoScreen ?
        <>
        {
          infoScreen.settings.parts.map((part, index) => {
            return (
              <div key={index} className="component_holder" id={'cph_'+part.id} >
                <GetPart
                  index={index}
                  part={part}
                  type="lesson"
                  answer=""
                  updateAnswer={fakeUpdate}
                  />
            </div>
            )
          })
        }
        </>
        :<></>}
    </div>
  );
}

export default InfoTexts;
