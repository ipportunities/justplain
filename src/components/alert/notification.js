import React, { useState, useEffect } from "react";
import t from "../translate";
import parse from 'html-react-parser';

const NotificationBox = props => {

  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [confirmText, setConfirmText] = useState('')

  //////////////////////
  ///Get content
  useEffect(() => {
    if (props.options != "") {
      setVisible(props.options.show)
      setText(props.options.text)
      setConfirmText(props.options.confirmText)
    } else {
      setVisible(false)
    }
  }, [props]);

  function close(){
    props.setNotificationOptions('');
  }

  return(
    <div>
      <div className={"customalert confirm" + (visible ? '':' hide')}>
        <div className="text">
          {parse(""+text+"")}
        </div>
        <div className="align_center">
          <span className="btn btn-primary" onClick={()=>close()}>
            {confirmText}
          </span>
        </div>
      </div>
      <div className={"customalert overlay" + (visible ? '':' hide')} onClick={()=>close()}></div>
    </div>
  )
}

export default NotificationBox;
