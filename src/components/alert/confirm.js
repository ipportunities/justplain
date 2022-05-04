import React, { useState, useEffect } from "react";
import t from "../translate";
import parse from 'html-react-parser';

const ConfirmBox = props => {

  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [confirmAction, setConfirmAction] = useState('')
  const [cancelText, setCancelText] = useState('')

  //////////////////////
  ///Get content
  useEffect(() => {
    if (props.confirmOptions != "") {
      setVisible(props.confirmOptions.show)
      setText(props.confirmOptions.text)
      setConfirmText(props.confirmOptions.confirmText)
      setCancelText(props.confirmOptions.cancelText)
    } else {
      setVisible(false)
    }
  }, [props]);

  function close(){
    props.setConfirmOptions('');
    props.setToDeleteIndex(-1); /// deze stond uit? weer aangezet... 2022-1-14
  }

  function confirm(){
    props.confirmOptions.confirmAction();
    close()
  }

  return(
    <div>
      <div className={"customalert confirm" + (visible ? '':' hide')}>
        <div className="text">
          {parse(""+text+"")}
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="btn  btn-light" onClick={()=>close()}>
                  {cancelText}
                </span>
              </td>
              <td>
              <span className="btn btn-primary" onClick={()=>confirm()}>
                {confirmText}
              </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={"customalert overlay" + (visible ? '':' hide')} onClick={()=>close()}></div>
    </div>
  )
}

export default ConfirmBox;
