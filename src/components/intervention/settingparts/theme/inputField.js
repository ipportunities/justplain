import React from "react";
import ContentEditable from 'react-contenteditable'

const InputField = props => {

  function update(value){
    if(props.updateField == 'modules' || props.updateField == 'coach' || props.updateField == 'stress' || props.updateField == 'objectives' || props.updateField == 'journal' || props.updateField == 'homework' || props.updateField == 'livechat'){
      if(typeof props.intervention.settings.menu == "undefined"){
        props.intervention.settings.menu = {}
      }
      props.intervention.settings.menu[props.updateField] = value;
    } else {
      props.intervention.settings[props.updateField] = value;
    }

    props.saveTheme(props.intervention);
  }

  return(
    <div className="themeInput">
      <table>
        <tbody>
          <tr>
            <td>
              {props.label}
            </td>
            <td>
              <ContentEditable
                html={props.html}
                disabled={false}
                onChange={(e) => update(e.target.value)}
                placeholder={props.label}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  )
}

export default InputField
