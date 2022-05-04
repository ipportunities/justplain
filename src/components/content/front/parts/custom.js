import React, {useEffect, useState} from 'react';
import CustomContent from "./custom/helpers/content.js";

const CustomElement = (props) => {


  //////////////////////
  ///On init
  useEffect(() => {

  }, []);

  return(
    <div className="custom center">
      <CustomContent part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} />
    </div>
  )
}
export default CustomElement
