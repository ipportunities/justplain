import React, {useState} from "react";
import t from "../../translate";

const Texts = props => {

  const [open, setOpen] = useState(false);

  const toggle = () =>{
    if(open){
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  return (
    <div className={"texts " + (open ? 'open':'closed')}>
      <h4 onClick={toggle}>{t("Snelteksten")} <i className="fas fa-chevron-down"></i></h4>
      <div className="items">
        {props.sessionTexts.map((sessionText, key) => {
          return (
            <div className="text" onClick={()=>props.setNewMessage(sessionText.text)}>
              {sessionText.text}
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default Texts;
