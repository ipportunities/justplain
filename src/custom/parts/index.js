///////////////
////Zet hier je custom modules buiten de core om
///////////////
import React from 'react';

const CustomParts = (props) => {
  var dynamicContent = "";

  if(props.part.custom_id.split("_")[0] == "c"){
    switch(props.part.custom_id) {
      /*
      case "c_1":
        dynamicContent = <GezinInHuisPlaatsen part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />;
        break;
        */
    }
  }

  return (
    <>
      {dynamicContent}
    </>
  )
}
export default CustomParts
