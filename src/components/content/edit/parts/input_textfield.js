import React, { useState } from 'react'
import ContentEditable from 'react-contenteditable'

const InputTextfield = (props) => {

  function updateTextField(content)
  {
    if(content == "<br>"){content = ""}
    if(typeof props.updateField === "undefined")
    {
      props.updatePart(props.index, 'question', content) /// dit is de meest gebruikte
    } else {
      props.updatePart(props.index, props.updateField, content)
    }
  }

  function getData()
  {
    if(typeof props.updateField === "undefined")
    {
      return props.part.question
    } else {
      return typeof props.part[props.updateField] !== 'undefined' ? props.part[props.updateField]:''
    }
  }

  return (
    <div>
    <ContentEditable
            html={getData()} // innerHTML of the editable div
            disabled={false}       // use true to disable editing
            onChange={(e) => updateTextField(e.target.value)} // handle innerHTML change
            className={props.className}
            placeholder={props.placeholder}
          />
    </div>
  )
};

/*
<table className="tableInputTypeTextfield">
  <tbody>
    <tr>
      <td>

      </td>
      <td>
        {props.must ? '*':''}
      </td>
    </tr>
  </tbody>
</table>
*/

export default InputTextfield;
