import React from "react";

const SubTypeChanger = props => {
  return (
    <select
      className="subtypeChanger"
      onChange={e => props.updatePart(props.index, "subtype", e.target.value)}
    >
      {props.available_subtypes.map((subtype, index) => (
        <option
          key={index}
          value={subtype}
          selected={props.subtype == subtype ? "selected" : ""}
        >
          {subtype}
        </option>
      ))}
    </select>
  );
};

export default SubTypeChanger;
