import React from 'react';
import t from "../../../../translate";

const AddPart = props => {

  return(
    <div className="addComponent center">
      <div className="components">
        <ul>
          {props.options.map((option, index) =>
            <li key={index} onClick={() => props.addPart(false, JSON.parse(JSON.stringify(option.content)))}>
              <div className="icon">
                <i className={option.icon}></i>
              </div>
              {t(option.niceName)}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default AddPart;
