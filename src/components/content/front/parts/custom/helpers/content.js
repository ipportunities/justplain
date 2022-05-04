import React, { useState, useEffect } from 'react';
import StressMeter from '../stressMeter.js';
import CustomParts from '../../../../../../custom/parts/';

const CustomContent = (props) => {
  
  const [dynamicContent, setDynamicContent] = useState(<></>)

  useEffect(() => {
    if (typeof props.part !== "undefined") {
      switch(props.part.custom_id) {
        case "1":
          setDynamicContent(<StressMeter part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />)
          break;
      }
    }
  }, [props.part])

  return (
    <>
      {dynamicContent}
      <CustomParts part={props.part} updateAnswer={props.updateAnswer} answer={props.answer}/>
    </>
  )
}
export default CustomContent
