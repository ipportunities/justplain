import React, { useEffect, useState } from 'react'
import apiCall from '../../../api'
import moment from 'moment'
import { Cookies, useCookies } from 'react-cookie'
import t from '../../../translate'

const Step1 = ({token, setToken, setStep, intervention_id, language_id}) => {

  const [errorMessage, setErrorMessage] = useState("")
  const [openGroups, setOpenGroups] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies(['token'])

  const [registrationData, setRegistrationData] = useState({
    intervention_id,
    language_id, //default dutch voor nu...
    firstname: '',
    gender: '',
    region: '',
    age: '',
    phonenumber: '06',
    email: '',
    group_id: 0,
    username: ''
  })

  const provincies = ['Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen', 'Limburg', 'Noord-Brabant', 'Noord-Holland', 'Overijssel', 'Utrecht', 'Zeeland', 'Zuid-Holland'];

  useEffect(() => {

    //indien reload of back dan registratie data ophalen
    if (cookies.hasOwnProperty("token")) {
      setToken(cookies.token)
      apiCall({
        action: "get_registration_chatcourse_data",
        data: {
          token: cookies.token
        }
      }).then(resp => {
        setRegistrationData({...registrationData, ...resp.registrationData})
      })
    }
    //openstaande groepen ophalen
    apiCall({
      action: "get_open_chatcourse_groups",
      data: {
        token,
        intervention_id
      }
    }).then(resp => {
      setOpenGroups(resp.groups)
    })
  }, [])

  const onChange = (e) => {
    let regData = {...registrationData}
    regData[e.target.name] = e.target.value
    setRegistrationData(regData)
  }

  const submit = (e) => {
    apiCall({
      action: "save_registration_chatcourse",
      data: {
        token,
        step: 1,
        registrationData
      }
    }).then(resp => {
      if (resp.msg === 'OK') {
        //cookie met token zetten tbv reload...
        let now = new Date();
        let time = now.getTime();
        let expireTime = time + 1000*3600*24;
        now.setTime(expireTime);
        setCookie('token', resp.token, { path: '/registration', expires: now });
        setToken(resp.token)
        setStep(2)
      } else {
        setErrorMessage(resp.msg)
      }
    })
  }

  return(
    
    <div className="step6"><div className="container">
      <div className="step">
          <b>{t("stap 1")}</b> {t("Aanmelding")}
        </div>
      {
      !openGroups ?
        <div>{t("Formulier wordt geladen...")}</div>
        :
        <>
        {
          openGroups.length < 1 ? 
            <div>{t("Er staan op dit moment geen groepen gepland, je kunt je daardoor nu helaas niet registreren.")}</div>
            :
            <>
              <h1>{t("Aanmelden chatcursus")}</h1>
              <p>{t("Aanmelden doe je door een aantal vragenlijsten in te vullen. Aan de hand van deze vragenlijsten wordt samen met jou bekeken of de cursus iets voor je is. Hierna kan je een uitnodiging ontvangen om samen met de chatbegeleiders nog een vragenlijst in te vullen. Als de cursusleiders denken dat cursus jou iets kan bieden, worden je inlognaam en een wachtwoord geactiveerd. Daarmee kan je inloggen in de chatbox waar de online cursus wordt gegeven. Je ontvangt een lijstje met de data en uren waarop jouw groep bij elkaar komt in de chatbox. De huiswerkopdrachten kan je online maken en dienen als voorbereiding voor elke sessie.")}</p>
              <form>
                <div className="form-row align-items-center">
                  <div className="col-auto col-100 form-label-group">
                    <input
                      type="text"
                      className="form-control"
                      id="firstname"
                      name="firstname"
                      aria-describedby="firstname"
                      placeholder=""
                      value={registrationData.firstname}
                      onChange={onChange}
                    />
                    <label htmlFor="firstname">{t("Voornaam*")}</label>
                  </div>
                </div>  

                <div className="form-row align-items-center">
                  <div className="col">
                  <div style={{fontSize: '12px',color: '#777', display: 'block', marginBottom: '10px'}}>Gender*</div>
                    <input
                      type="radio"
                      className="form-control"
                      id="gender_f"
                      name="gender"
                      aria-describedby="gender"
                      value="F"
                      onChange={onChange}
                      checked={registrationData.gender === 'F'}
                    /> <label htmlFor="gender_f">{t("Vrouw")}</label>
                    <input
                      type="radio"
                      className="form-control"
                      id="gender_m"
                      name="gender"
                      aria-describedby="gender"
                      value="M"
                      onChange={onChange}
                      checked={registrationData.gender === 'M'}
                      /> <label htmlFor="gender_m">{t("Man")}</label>
                      <input
                      type="radio"
                      className="form-control"
                      id="gender_x"
                      name="gender"
                      aria-describedby="gender"
                      value="X"
                      onChange={onChange}
                      checked={registrationData.gender === 'X'}
                      /> <label htmlFor="gender_x">{t("Anders")}</label>
                  </div>
                </div>

                <div className="form-row align-items-center">
                  <div className="col-auto col-100 form-label-group">
                    <input
                      type="number"
                      min="10"
                      max="99"
                      className="form-control"
                      id="age"
                      name="age"
                      aria-describedby="age"
                      placeholder=""
                      value={registrationData.age}
                      onChange={onChange}
                    />
                    <label htmlFor="region">{t("Leeftijd*")}</label>
                  </div>
                </div>

                <div className="form-group select-group">
                  {/* <input
                    type="text"
                    className="form-control"
                    id="region"
                    name="region"
                    aria-describedby="region"
                    placeholder=""
                    value={registrationData.region}
                    onChange={onChange}
                  /> */}
                  <label htmlFor="region">{t("Provincie*")}</label>
                  <select
                    id="region"
                    name="region"
                    value={registrationData.region}
                    onChange={onChange}
                    className="form-control"
                    >
                      <option value=""></option>
                      {
                        provincies.map((provincie, index) => {
                          return (
                          <option key={index} value={provincie}>{provincie}</option>
                          )
                        })
                      }
                    </select>
                </div> 
                      <br />
                <div className="form-row align-items-center">
                  <div className="col-auto col-100 form-label-group">
                    <input
                      type="text"
                      className="form-control"
                      id="phonenumber"
                      name="phonenumber"
                      aria-describedby="phonenumber"
                      placeholder=""
                      value={registrationData.phonenumber}
                      onChange={onChange}
                    />
                    <label htmlFor="region">{t("Telefoonnummer* (tbv sms reminders).")}</label>
                  </div>
                </div>  

                <div className="form-row align-items-center">
                  <div className="col-auto col-100 form-label-group">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      aria-describedby="email"
                      placeholder=""
                      value={registrationData.email}
                      onChange={onChange}
                    />
                    <label htmlFor="region">{t("E-mailadres*")}</label>
                  </div>
                </div>  

                <div className="form-row align-items-center">
                  <div className="col-auto col-100 form-label-group">
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      name="username"
                      aria-describedby="username"
                      placeholder=""
                      value={registrationData.username}
                      onChange={onChange}
                    />
                    <label htmlFor="region">{t("Gebruikersnaam* (nickname voor in de chat).")}</label>
                  </div>
                </div>  

                <div className="form-group select-group">
                  <label htmlFor="group_id">{t("Voorkeur startdatum")}</label>
                  <select
                  id="group_id"
                  name="group_id"
                  value={registrationData.group_id}
                  onChange={onChange}
                  className="form-control"
                  >
                    <option value="0"></option>
                    {
                      openGroups.map((group, index) => {
                        return (
                        <option key={index} value={group.id}>{moment.unix(group.timestamp_groupchat).format("DD-MM-YYYY HH:mm", { trim: false })}</option>
                        )
                      })
                    }
                  </select>
                </div>

                {
                  errorMessage.length > 0 ?
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle"></i> &nbsp;
                      <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
                    </div>
                  : <></>
                }
                <div className="button_holder">
                  <button type="button" className="btn btn-primary" onClick={() => submit()}>{t("Ga verder")}</button>
                </div>
              </form>
            </>
        }
        </>
      }
    </div></div>
  )
}

export default Step1