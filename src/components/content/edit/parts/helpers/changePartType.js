import React, {useEffect} from 'react';
import {componentOptions} from "./options.js";

const ChangePartType = (props) => {
  return (
    <div className='changeSubtype'>
      <select onChange={(e) => props.onChangePartType(props.index, e.target.value)}>
        {props.options.map((option, index) =>
          <option value={option.content.type} selected={props.type == option.content.type ? 'selected':''}>{option.title}</option>
        )}
      </select>
    </div>
  );
}

export default ChangePartType;
