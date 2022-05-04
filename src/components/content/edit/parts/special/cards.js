import React, { useState, useEffect } from "react";
import List from '../list.js';

const Cards = props => {

  return(
    <div className='cards'>
      <List
        index={props.index}
        part={props.part}
        updatePart={props.updatePart}
        parts={props.parts}
        must={props.must}
        toggleMust={props.toggleMust}
        showMediaLibrary={props.showMediaLibrary}
        />
    </div>
  )
}

export default Cards;
