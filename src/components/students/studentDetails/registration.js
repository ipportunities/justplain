import React, {useState, useEffect} from "react";
import t from "../../translate";
import moment from "moment";
import { nationalitieslist } from "../../utils";
import { useSelector } from "react-redux";

const  StudentDetailsRegistration = props => {

  const [registrationIntervention, setRegistrationIntervention] = useState('');
  /* const [registrationCoach, setRegistrationCoach] = useState(''); */

  useEffect(() => {
    let chosenIntervention = props.interventions.filter(function (intervention) {
      return intervention.id === props.registration.intervention_id
    });
    if(chosenIntervention.length > 0){
      setRegistrationIntervention(props.interventions[props.interventions.indexOf(chosenIntervention[0])].title)
    }
    let chosenCoach = props.coaches.filter(function (coach) {
      return coach.id === props.registration.coach_chosen
    });
    /* if(chosenCoach.length > 0){
      setRegistrationCoach(props.coaches[props.coaches.indexOf(chosenCoach[0])].firstname + " " + props.coaches[props.coaches.indexOf(chosenCoach[0])].insertion + " " + props.coaches[props.coaches.indexOf(chosenCoach[0])].lastname)
    } */
  }, [props]);

  return(
    <div>
      {props.registration ?
        <div className="registration_data">
          <h2>{t("Aanmeld data")}</h2>
          <table>
            <tbody>
              <tr>
                <td className="left">
                <table>
                  <tbody>
                  <tr>
                    <td>
                      {t("Aanmeld id")}
                    </td>
                    <td>
                      {props.registration.id}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Aangemeld op")}
                    </td>
                    <td>
                      {moment.unix(props.registration.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Survey Caring Universities afgenomen")}
                    </td>
                    <td>
                      {props.registration.qualtrics ? 'Ja':'Nee'}
                    </td>
                  </tr>
                  {props.registration.qualtrics ?
                    <tr>
                      <td>
                        {t("Langer dan een week geleden")}
                      </td>
                      <td>
                        {props.registration.qualtricsLongerThen1WeekAgo == 0 ? 'Nee dus T0_qualtrics':'Ja dus T0 afgenomen'}
                      </td>
                    </tr>
                    : <></>
                  }
                  <tr>
                    <td>
                      {t("T0 gestart")}
                    </td>
                    <td>
                      {moment.unix(props.registration.t0_started).format("DD-MM-YYYY HH:mm:ss", { trim: false })}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("T0 afgerond")}
                    </td>
                    <td>
                      {moment.unix(props.registration.t0_finished).format("DD-MM-YYYY HH:mm:ss", { trim: false })}

                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Account geactiveerd op")}
                    </td>
                    <td>
                      {moment.unix(props.registration.account_activated).format("DD-MM-YYYY HH:mm:ss", { trim: false })}

                    </td>
                  </tr>
                  <tr><td className="no_border"></td></tr>
                <tr>
                  <td>
                    {t("Interventie")}
                  </td>
                  <td>
                    {registrationIntervention}
                  </td>
                </tr>
                {/* <tr>
                  <td>
                    {t("Gekozen coach")}
                  </td>
                  <td>
                    {registrationCoach}
                  </td>
                </tr> */}




                  <tr><td className="no_border"></td></tr>
                  <tr>
                    <td>
                      {t("Follow up research")}
                    </td>
                    <td>
                      {props.registration.follow_up_research == 1 ? t("Mag benaderd worden"):''}
                    </td>
                  </tr>

                  </tbody>
                </table>
              </td>
              <td className="right">

              <table>
                <tbody>

                <tr>
                  <td>
                    {t("Gebruikersnaam")}
                  </td>
                  <td>
                    {props.registration.login}
                  </td>
                </tr>

                  <tr className={parseInt(props.registration.anonymous) === 1 ? 'hidden' : ''}>
                    <td>
                      {t("Voornaam")}
                    </td>
                    <td>
                      {props.registration.firstname}
                    </td>
                  </tr>
                  <tr className={parseInt(props.registration.anonymous) === 1 ? 'hidden' : ''}>
                    <td>
                      {t("Tussenvoegsel")}
                    </td>
                    <td>
                      {props.registration.insertion}
                    </td>
                  </tr>
                  <tr className={parseInt(props.registration.anonymous) === 1 ? 'hidden' : ''}>
                    <td>
                      {t("Achternaam")}
                    </td>
                    <td>
                      {props.registration.lastname}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Geslacht")}
                    </td>
                    <td>
                      {props.registration.gender}
                    </td>
                  </tr>


                  <tr>
                    <td>
                      {t("Leeftijd")}
                    </td>
                    <td>
                      {props.registration.age}
                    </td>
                  </tr>
                  <tr className={parseInt(props.registration.anonymous) === 1 ? 'hidden' : ''}>
                    <td>
                      {t("Email")}
                    </td>
                    <td>
                      {props.registration.email}
                    </td>
                  </tr>
                  <tr className={parseInt(props.registration.anonymous) === 1 ? 'hidden' : ''}>
                    <td>
                      {t("Telefoonnummer")}
                    </td>
                    <td>
                      {props.registration.phonenumber}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {t("Nationaliteit")}
                    </td>
                    <td>
                      {nationalitieslist[1][props.registration.nationality]}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Universiteit")}
                    </td>
                    <td>
                      {props.registration.university}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Faculteit")}
                    </td>
                    <td>
                      {props.registration.faculty}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {t("Taal")}
                    </td>
                    <td>
                      {props.registration.language_id == 1 ? "Nederlands":''}
                      {props.registration.language_id == 2 ? "English":''}
                    </td>
                  </tr>
                </tbody>
              </table>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      :''}
    </div>
  )
}

export default StudentDetailsRegistration;
