import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import t from "../translate"

const Settings = props => {

  const [groupTitle, setGroupTitle] = useState('')
  const [groupStatus, setGroupStatus] = useState('')
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if(typeof props.activeGroup.title !== "undefined") {
      setGroupTitle(props.activeGroup.title)
    }
    if(typeof props.activeGroup.status !== "undefined") {
      setGroupStatus(props.activeGroup.status)
    }
  }, [])

  const changeGroupStatus = (status) => {
    setGroupStatus(status)
    props.updateGroupStatus(status, props.activeGroup.id, setErrorMessage)
  }

  const updateGroupTitle = (title) => {
    setGroupTitle(title)
    props.updateGroupTitle(title, props.activeGroup.id, setErrorMessage)
  }

  return(
    <div className="settings">
      <h4>{t("Settings")}</h4>

      <>
      {
        errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">{errorMessage}</div>
          : <></>
      }
      </>

      {t("Groepsnaam")}
      <input
        type="text"
        className="form-control"
        placeholder={t("Groepsnaam")}
        value={groupTitle}
        onChange={e => updateGroupTitle(e.target.value, props.activeGroup.id)}
      />
      <div className="group_options">
        <div className="question">
          <input type="radio" name="group_is" value="open" id="group_open" onChange={(e) => changeGroupStatus('open')} checked={groupStatus === 'open'}/>
          <label htmlFor="group_open">
            {t("Groep staat open voor inschrijving")}
          </label>
        </div>
        <div className="question">
          <input type="radio" name="group_is" value="closed" id="group_closed" onChange={(e) => changeGroupStatus('closed')} checked={groupStatus === 'closed'} />
          <label htmlFor="group_closed">
            {t("Groep is gesloten")}
          </label>
        </div>
        <div className="question">
          <input type="radio" name="group_is" value="archive" id="group_archive" onChange={(e) => changeGroupStatus('archive')} checked={groupStatus === 'archive'} />
          <label htmlFor="group_archive">
            {t("Archiveer")} <span>({t("Groep wordt verplaatst naar archief")})</span>
          </label>
        </div>
      </div>
    </div>
  )
}
export default Settings
