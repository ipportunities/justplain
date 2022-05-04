import React, {useState} from "react";
import { useSelector } from "react-redux";
import t from "../../translate";
import apiCall from "../../api";

const Users = props => {

  const auth = useSelector(state => state.auth);
  const timeoutChat = 60 * 1;

  const [open, setOpen] = useState(true);

  const toggle = () =>{
    if(open){
      setOpen(false)
    } else {
      setOpen(true)
    }
  }
  const disable = (groupchat_user_id) =>{
    let apiCallObj = {
      action: "disable_groupchat_user",
      token: auth.token,
      data: {
        chat_session_id: props.chatSesssionID,
        groupchat_user_id:groupchat_user_id
      }
    };
    apiCall(apiCallObj).then(resp => {

    });
  }

  return (
    <div className={"users " + (open ? 'open':'closed')}>
      {!props.archiveMode ?
        <>
          {auth.userType == "coach" ?
            <h4 onClick={toggle}>{t("Ingelogd")}<i className="fas fa-chevron-down" onClick={toggle}></i></h4>
          :
            <h4>{t("Ingelogd")}</h4>
          }
        </>
        :
        <h4>{t("Deelnemers")}</h4>
      }
      <div className="items">
      {props.groupchatUsers.map((user, key) => {
        return (
          <div className={"user " + (parseInt(user.timestamp_last_action) + timeoutChat > Math.floor(Date.now() / 1000) || (props.archiveMode && user.timestamp_last_action != 0)  ? 'active':'inactive') + (user.disabled == 1 && !props.archiveMode ? ' disabled':'')}>
            <span className={"color color-" + (key % 7)} style={{backgroundColor:user.bgColor}}></span>
            {user.login} {user.userType == "coach" ? <>({t("Coach")})</>:<></>}
            {auth.userType == 'coach' && user.usertype != 'coach' && !props.archiveMode ?
             <span className='timeout' onClick={()=>disable(user.id)}>
              {user.disabled == 1 ?
                <i className="fas fa-lock"></i>
                :
                <i className="far fa-comment-dots"></i>
              }
             </span>
             :<></>}
          </div>
        )
      })}
      </div>
    </div>
  );
}

export default Users;
