import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import apiCall from "../api";
import SortObjectArray from "../helpers/sortObjectArray.js";
import t from "../translate";
import moment from "moment";

const Registrations = () => {

  const history = useHistory()

  const auth = useSelector(state => state.auth)
  const intervention = useSelector(state => state.intervention)

  const [registrations, setRegistrations] = useState([])
  const [openSearch, setOpenSearch] = useState(false)
  const [searchFor, setSearchFor] = useState("")
  const [sort, setSort] = useState("")
  const [sortDirection, setSortDirection] = useState("")

  useEffect(() => {
    if (typeof intervention.id !== "undefined" && intervention.id > 0) {
      getRegistrations()
    }
  }, [intervention.id])

  useEffect(() => {
    let registrionsNew = [...registrations]
    if (sortDirection === "asc") {
      registrionsNew.sort((a, b) => (a[sort] > a[sort]) ? 1 : -1)
    } else {
      registrionsNew.sort((a, b) => (a[sort] < a[sort]) ? 1 : -1)
    }
    setRegistrations(registrionsNew)
  }, [sort, sortDirection])

  const getRegistrations = () => {
    apiCall({
      action: "get_registrations",
      token: auth.token,
      data: {
        intervention_id: intervention.  id,
      }
    }).then(resp => {
      setRegistrations(resp.registrations)
      setSortDirection("asc")
      setSort("date_time_create")
    })
  }

  const searchView = () => {
    //setUserName('');
    setOpenSearch(true)
    //setDetailsVisible(false)
  }

  const changeSort = (type) => {
    if (type == sort) {
      setSortDirection(sortDirection == "asc" ? "desc":"asc")
    } else {
      setSortDirection("asc")
      setSort(type)
    }
  }

  const RegistrationList = () => {
    let registrationss = [...registrations]

    let searchForLowerCase = searchFor.toLowerCase()
    for (let i = 0; i < registrationss.length; i++) {
      let name = registrationss[i].firstname;
      if (!name.toLowerCase().includes(searchForLowerCase)) {
          registrationss[i].hide = 'true'
      } else {
        registrationss[i].hide = 'false'
      }
    }

    if(sort != ""){
      registrationss.sort(SortObjectArray(sort, sortDirection));
    }

    return (
      <>
        {
          registrationss.map((registration, index) => {

            let status = 'Ter beoordeling';
            if (registration.status == 'registration_mini') {
              status = 'In afwachting miniplus';
            }
            if (registration.status == 'registration_waitinglist') {
              status = 'Wachtlijst';
            }
            return (
              <tr className={"rowHover" + (registration.hide == 'true' ? ' hide':'')} key={index} onClick={(e) => {history.push("/dashboard/" + intervention.id + "/registrations/" + registration.id)}} style={{cursor: 'pointer'}}>
                <td>#{registration.id}</td>
                <td>{registration.firstname}</td>
                <td>{registration.group_name}</td>
                <td>{status}</td>
                <td>{moment.unix(registration.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false })}</td>
              </tr>
            )
          })
        }
      </>
    )
  }

  return (
    <div className={"coachInterface registrations students" + (openSearch ? ' openSearch':'')}>
      <br />
      <table className="theIntervention">
        <tbody>
          <tr>
            <td>
              <h2>{t('Aanmeldingen')}</h2>
              {searchFor != "" && !openSearch ?
                <span className="btn btn-secondary filter" onClick={()=>setSearchFor("")}>
                  {searchFor} <i className="fas fa-times"></i>
                </span>
              :''}
            </td>
            <td className="options">
              <i className={"fas fa-search pointer" + (openSearch ? ' hide':' ')} onClick={()=>searchView()}></i>
              <div className="search">
                <input type="text" value={searchFor} placeholder={t("Zoek aanmelding")} onChange={(e) => setSearchFor(e.target.value)}/>
                <i className="far fa-times-circle pointer" onClick={()=>setOpenSearch(false)}></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className={"holder"}>
        <div className="listContent listHidden">
          <div className="registrations">
            <table>
              <thead>
                <tr>
                  <th className="pointer" onClick={() => changeSort("id")}>#</th>
                  <th className="pointer" onClick={() => changeSort("firstname")}>{t("Naam")}</th>
                  <th className="pointer" onClick={() => changeSort("groep_name")}>{t("Groep")}</th>
                  <th className="pointer" onClick={() => changeSort("status")}>{t("Status")}</th>
                  <th className="pointer" onClick={() => changeSort("date_time_create")}>{t("Datum/tijd")}</th>
                </tr>
              </thead>
              <tbody>
                <RegistrationList/>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registrations;
