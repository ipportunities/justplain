import React, {useEffect, useState} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import apiCall from "../api"
import t from "../translate"
import moment from "moment"
import Content from '../students/studentDetails/items/content'
import TextareaAutosize from 'react-textarea-autosize'

const Registration = ({registration_id}) => {

  const history = useHistory()

  const auth = useSelector(state => state.auth)
  const intervention = useSelector(state => state.intervention)

  const [items, setItems] = useState([])
  const [answers, setAnswers] = useState([])
  const [groups, setGroups] = useState([])
  const [showRegistrationQuestionnaire, setShowRegistrationQuestionnaire] = useState(false)
  const [beoordeling, setBeoordeling] = useState("")
  const [toelichting, setToelichting] = useState("")
  const [group_id, setGroup_id] = useState(0)
  const [message, setMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom"]

  const [registration, setRegistration] = useState({
    date_time_create: 0,
    email: '',
    firstname: '',
    gender: '',
    group_id_1: 0,
    login: '',
    phonenumber: '',
    region: '',
    status: '',
  })

  useEffect(() => {
    if (typeof registration_id !== 'undefined' && Number.isInteger(registration_id) && registration_id > 0) {
      apiCall({
        action: "get_registration_chatcourse",
        token: auth.token,
        data: {
          registration_id
        }
      }).then(resp => {
        setRegistration(resp.registration)
        setGroup_id(resp.registration.group_id_1)
        console.log(resp.registration)
        setGroups(resp.groups)
        setAnswers(resp.allAnswers)
        console.log("allAnswers", resp.allAnswers)

        let questionnaires_filtered = []
        let questionnaires = intervention.settings.questionnaires;
          //aantekenen welke lessen invul oefeninen bevatten
          questionnaires.map((item, index) => {
              questionnaires[index]["hasFillinParts"] = false;
              questionnaires[index]["fillInOnce"] = true;
              questionnaires[index].settings.parts.map(part => {

                  if (typesWeNeed.indexOf(part.type) > -1)
                  {
                      questionnaires[index]["hasFillinParts"] = true;
                  }
              })
          })
        resp.allAnswers.map(a => {
          questionnaires.map(qs => {
            if (parseInt(qs.id) === parseInt(a.the_id)) {
              questionnaires_filtered.push(qs)
            }
          })
        })
        setItems(questionnaires_filtered)
        console.log("items", questionnaires_filtered)
      })
    }
  }, [])

  const processRegistration = () => {
    setMessage("")
    setErrorMessage("")
    apiCall({
      action: "process_registration",
      token: auth.token,
      data: {
        registration_id,
        beoordeling,
        toelichting,
        group_id
      }
    }).then(resp => {
      if (resp.processRegistration) {
        setMessage(resp.msg)
        setTimeout(() => {
          history.push('/dashboard/' + intervention.id + '/registrations/')
        }, 1500)
      } else {
        setErrorMessage(resp.msg)
      }
    })
  }

  const toListView = () => {
    history.push("/dashboard/" + intervention.id + "/registrations/");
  }

  return (
    <div className="coachInterface students registration">
      <br />
      <i className="fas fa-angle-left backToList" onClick={()=>toListView()}></i><h2 className="inline">{t('Aanmelding')}</h2>
      <h3 className="between_header">{t("Personalia")}</h3>
      <div className="box">

        <span className="registration_date">Geregistreerd op {moment.unix(registration.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false })}</span><br /><br/>
        <div className="personalia">
          {/*<h5>{t("Persoonlijke gegevens")}</h5>*/}
          {registration.firstname} ({registration.gender})<br />
          {registration.region}<br />
          {registration.email}<br />
          {registration.phonenumber}<br />
        </div>
      </div>
      <h3 className="between_header">{t("Aanmeldvragenlijst")}</h3>
      <div className="box">
      <button type="button" className="btn btn-primary" onClick={(e) => setShowRegistrationQuestionnaire(!showRegistrationQuestionnaire)}>{showRegistrationQuestionnaire ? 'Sluit aanmeldingsvragenlijst' : 'Toon aanmeldingsvragenlijst'}</button>
      {
        showRegistrationQuestionnaire ?
          <div className="questionnaire_content">
            <Content itemKey={0} items={items} answers={answers} type="questionnaire" />
          </div>
          : <></>
      }
      </div>
      

        <h3 className="between_header">{t("Beoordelen aanmelding")}</h3>
        <div className='box last'>
        {
          registration.status === 'registration_waitinglist' ?
            <p>
              {t("Deze aanmelding is eerder al goedgekeurd en op de wachtlijst geplaatst.")}
            </p> : <></>
        }
        {
          message.length > 0 ?
          <div className="alert alert-success" role="alert">
            <span dangerouslySetInnerHTML={{ __html: message }} />
          </div>
          : <></>
        }
        {
          errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">
            <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
          </div>
          : <></>
        }
        <form>
          {
            registration.status !== 'registration_waitinglist' ?
              <>
                <div className="form-row align-items-center">
                  <div className="col">
                    <div className="label">Beoordeling</div>
                    <input
                      type="radio"
                      className="form-control"
                      id="beoordeling_pos"
                      name="beoordeling"
                      aria-describedby="beoordeling"
                      value="pos"
                      onChange={() => setBeoordeling('pos')}
                      checked={beoordeling === 'pos'}
                    /> <label htmlFor="beoordeling_pos">{t("Aanmelding goedkeuren")}</label>
                    <br />
                    <input
                      type="radio"
                      className="form-control"
                      id="beoordeling_neg"
                      name="beoordeling"
                      aria-describedby="beoordeling"
                      value="neg"
                      onChange={(e) => setBeoordeling('neg')}
                      checked={beoordeling === 'neg'}
                      /> <label htmlFor="beoordeling_neg">{t("Aanmelding afkeuren")}</label>
                  </div>
                </div>
                <br />
                <div className="form-row align-items-center">

                  <div className="row">
                    <div className="col-12">
                      <div className="label">{t("Toelichting (wordt ingevoegd in e-mail)")}</div>
                      <TextareaAutosize
                        placeholder={t("Je toelichting")}
                        onChange={(e) => setToelichting(e.target.value) }
                        value={toelichting}
                      />
                    </div>
                  </div>
                </div>
              </>
            : <></>
          }
          <br />
          <div className="form-group select-group">
            <div className="label">{t("Indelen in groep")} &nbsp; </div>
            <select
            id="group_id"
            name="group_id"
            value={group_id}
            onChange={(e) => setGroup_id(e.target.value)}
            className="form-control"
            style={{width: 'auto'}}
            >
              <option value="-1">{t("Selecteer een optie")}</option>
              {
                registration.status !== 'registration_waitinglist' ?
                  <option value="0">Wachtlijst</option> : <></>
              }
              {
                groups.map((group, index) => {
                  return (
                  <option key={index} value={group.id}>{group.title}</option>
                  )
                })
              }
            </select>
          </div>
              <br />
          <div className="button_holder">
            <button type="button" className="btn btn-primary" onClick={() => processRegistration()}>{t("Beoordeling verwerken")}</button>
          </div>

        </form>

      </div>
    </div>
  )

}

export default Registration