import React, { useState, useEffect } from 'react'
import ContentEditable from 'react-contenteditable';

const ContentEditableComponent = (props) => {

  const [typed, setTyped] = useState(false);

  let focus = React.createRef()

  useEffect(() => {
    if(props.focus !== false){
      focus.current.focus();
    }
  }, []);

  function update(value){
    if(value == "<br>"){value = ""}
    setTyped(true)
    props.updateItem(props.index, value)
  }

  return(
    <ContentEditable
        innerRef={props.focus !== false && typed == false ? focus:false}
        html={props.html}
        placeholder={props.placeholder}
        disabled={false}
        onChange={(e) => update(e.target.value)}
        className="input_no_bg"
      />
  )
}

export default ContentEditableComponent;
