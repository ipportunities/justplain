import React from 'react';
import StressMeter from '../stressMeter.js';
import CustomParts from '../../../../../../custom/parts/';

const CustomContent = (props) => {
  var dynamicContent = "";

  if(props.part.custom_id.split("_")[0] != "c"){
    switch(props.part.custom_id) {
      case "1":
        dynamicContent = <StressMeter part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
        break;
    }
  }

  return (
    <>
      {dynamicContent}
      <CustomParts part={props.part} updateAnswer={props.updateAnswer} answer={props.answer}/>
    </>
  )
}
export default CustomContent
