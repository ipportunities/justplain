import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { useSelector } from "react-redux";
import t from "../translate";

const Addgroup = forwardRef((props, ref) => {

  const intervention = useSelector(state => state.intervention);
  
  const [groupName, setGroupName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const onChange = (e) => {
    setErrorMessage('')
    setGroupName(e.target.value)
  }

  useImperativeHandle(ref, () => ({
    cancelHandler(){
      props.closeModal('', intervention.id);
    },
    submitHandler() {

      if (groupName.length < 1) {
        setErrorMessage("Geef een naam op voor deze nieuwe groep!")
      } else {
        props.saveNewGroup(intervention.id, groupName, setErrorMessage)
      }
    }
  }))

  return (
    <>
      <>
      {
        errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">{errorMessage}</div> 
          : <></>
      }
      </>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="new"
          placeholder={t("Geef een naam op voor de nieuwe groep")}
          value={groupName}
          onChange={e => onChange(e)}
        />
      </div>
    </>
  )
});

export default Addgroup
