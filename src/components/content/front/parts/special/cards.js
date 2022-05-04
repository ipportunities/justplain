import React, { useState, useEffect } from "react";
import List from '../list.js';

const Cards = props => {

  return(
    <div className='cards'>
      <List index={props.index} part={props.part} updateAnswer={props.updateAnswer} answer={props.answer} nextAllowed={props.nextAllowed}/>
    </div>
  )
}

export default Cards;
