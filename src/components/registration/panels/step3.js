import React, { useState, useEffect } from 'react';
import apiCall from "../../api";
import { Cookies, useCookies } from 'react-cookie';
import { getClone, nationalitieslist } from "../../utils";
import t from '../../translate';
import NotificationBox from "../../alert/notification";


const Step3 = (props) => {

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [nationalities, setNationalities] = useState([]);
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [notificationOptions, setNotificationOptions] = useState({
    show: false,
    text: "",
    confirmText: t("Ok"),
  });

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  useEffect(() => {
    setGender(props.registrationData.gender);
    setAge(props.registrationData.age);
    setNationality(props.registrationData.nationality);
    setUniversity(props.registrationData.university);
    if (props.registrationData.university.length > 0)
    {
      let options = [];
        faculteiten.forEach(f => {
          if (f.name_nl === props.registrationData.university)
          {
            if (props.language_id === 1) {
              options =  ["", ...f.faculteiten_nl];
            } else {
              options = ["", ...f.faculteiten_eng];
            }
          }
        })
        setFacultyOptions(options);
    }
    setFaculty(props.registrationData.faculty);
    setNationalities(nationalitieslist[props.language_id]);
  }, []);

  const errorMessages = [
    {
      nl: 'Leeftijd is een verplicht veld.',
      eng: 'Age is a required field.',
    },
    {
      nl: 'Geslacht is een verplicht veld.',
      eng: 'Gender is a required field.',
    },
    {
      nl: 'Nationaliteit is een verplicht veld.',
      eng: 'Nationality is a required field.',
    },
    {
      nl: 'Universiteit is een verplicht veld.',
      eng: 'University is a required field.',
    },
    {
      nl: 'Faculteit is een verplicht veld.',
      eng: 'Faculty is a required field.',
    }
  ]

  const onChangeGender = (e) => {
    setGender(e.target.value);
  }
  const onChangeAge = (e) => {
    setAge(e.target.value);
  }
  const onChangeNationality = (e) => {
    setNationality(e.target.value);
  }
  const onChangeFaculty = (e) => {
    setFaculty(e.target.value);
  }

  const onChangeUniversity = (e) => {
    //opties van faculty vullen?
    if (e.target.name === 'university')
    {
      if (e.target.value.length > 0)
      {
        let options = [];
        faculteiten.forEach(f => {
          if (f.name_nl === e.target.value)
          {
            if (props.language_id === 1) {
              options =  ["", ...f.faculteiten_nl];
            } else {
              options = ["", ...f.faculteiten_eng];
            }
          }
        })
        setFacultyOptions(options);
      }
      else
      {
        setFacultyOptions([]);
      }
    }
    setUniversity(e.target.value);
  }

  const goToStep = (step) => {
    
    setErrorMessage("");

    let nextStep = 4;
    if (parseInt(step) === 4)
    {
      /* if (!cookies.hasOwnProperty("qualtrics"))
      {
        nextStep = 4;
      }
      else
      {
        nextStep = 99;
      } */
      //sprint nov 2020: ook als men de qualtrics survey heeft ingevuld dan vult men alsnog de gehele T0 in.
      //dus panel 3a overslaan
      nextStep = 4;
    }
    else
    {
      nextStep = 2;
    }

    apiCall({
      action: "update_registration",
      data: {
        language_id: props.language_id,
        token: props.token,
        step: 3,
        nextStep,
        age: parseInt(age),
        gender: gender,
        nationality,
        university,
        faculty
      }
    }).then(resp => {
      if (resp.msg === 'OK')
      {
        updateRegistrationData(gender, age, nationality, university, faculty);
        props.setStep(nextStep);
      }
      else
      {
        let errorMessage = errorMessages[parseInt(resp.msg)-1].nl;
        if (props.language_id === 2)
        {
          errorMessage = errorMessages[parseInt(resp.msg)-1].eng;
        }
        //alert(errorMessage);
        
        setNotificationOptions({
          show: true,
          text: errorMessage,
          confirmText: t("Ok"),
        });
        
        
      }
    });

  }

  const updateRegistrationData = (gender, age, nationality, university, faculty) => {
    let newRegistrationData = getClone(props.registrationData);
    newRegistrationData.gender = gender;
    newRegistrationData.age = age;
    newRegistrationData.nationality = nationality;
    newRegistrationData.university = university;
    newRegistrationData.faculty = faculty;
    props.setRegistrationData(newRegistrationData);
  }

  const faculteiten = [
    {
      name_nl: 'Vrije Universiteit Amsterdam',
      name_eng: 'Vrije Universiteit Amsterdam',
      faculteiten_nl: ["Bètawetenschappen","Geesteswetenschappen", "Gedrags- en Bewegingswetenschappen", "Religie en Theologie", "Rechtsgeleerdheid", "Sociale Wetenschappen", "Tandheelkunde - ACTA", "Geneeskunde - VUmc School of Medical Sciences", "School of Business and Economics"],
      faculteiten_eng: ["Science","Humanities","Behavioural and Movement Sciences","Religion and Theology","Law","Social Sciences","Dentistry","Medical Sciences","School of Business and Economics"]
    },
    {
      name_nl: 'Universiteit Leiden',
      name_eng: 'Leiden University',
      faculteiten_nl: ["Archeologie","  Geesteswetenschappen","  Geneeskunde/LUMC","  Governance and Global Affairs","  Rechtsgeleerdheid","  Sociale Wetenschappen","  Wiskunde en Natuurwetenschappen"],
      faculteiten_eng: ["Archaeology","Humanities","Medicine","Governance and Global Affairs","Law","Social and Behavioural Sciences","Science"]

    }
    ,
    {
      name_nl: 'Universiteit Utrecht',
      name_eng: 'Utrecht University',
      faculteiten_nl: ["Bètawetenschappen","Diergeneeskunde","Geesteswetenschappen","Geneeskunde","Geowetenschappen","Recht, Economie, Bestuur en Organisatie","Sociale Wetenschappen"],
      faculteiten_eng: ["Science","Veterinary Medicine","Humanities","Medicine","Geosciences","Law, Economics and Governance","Social and Behavioural Sciences"]
    }
    ,
    {
      name_nl: 'De Universiteit van Maastricht',
      name_eng: 'Maastricht University',
      faculteiten_nl: ["Cultuur- en Maatschappijwetenschappen","Health, Medicine and Life Sciences","Science and Engineering","Rechtsgeleerdheid","Psychology and Neuroscience","School of Business and Economics"],
      faculteiten_eng: ["Arts and Social Sciences","Health, Medicine and Life Sciences","Science and Engineering","Law","Psychology and Neuroscience","School of Business and Economics"]
    }
  ]

  return (
    <div className="step3">
      <button type="button" className="btn prev" onClick={() => props.setStep(2)}>{t("Terug")}</button>
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      <div className="container">
        <div className="step">
          <b>{t("stap 3")}</b> {t("achtergrondinformatie")}
        </div>
        <div className="form-group form-label-group">
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            aria-describedby="age"
            placeholder={t("Je leeftijd")}
            value={age || ''}
            onChange={onChangeAge}
            min="16"
            max="99"
            step="1"
          />
          <label htmlFor="age">{t("Leeftijd")}</label>
        </div>
        <div className="form-row align-items-center bigLabel">
          <div className="col">
            <br />
            <input
              type="radio"
              className="form-control"
              id="gender_f"
              name="gender"
              aria-describedby="gender"
              value="F"
              onChange={onChangeGender}
              checked={gender === 'F'}
            /> <label htmlFor="gender_f">{t("Vrouw")}</label>
            <input
              type="radio"
              className="form-control"
              id="gender_m"
              name="gender"
              aria-describedby="gender"
              value="M"
              onChange={onChangeGender}
              checked={gender === 'M'}
              /> <label htmlFor="gender_m">{t("Man")}</label>
          </div>
        </div>
        <div className="form-group select-group">
          <label htmlFor="nationality">{t("Nationaliteit")}</label>
          <select
          id="nationality"
          name="nationality"
          value={nationality || ''}
          onChange={onChangeNationality}
          className="form-control"
          >
            <option value=""></option>
            {
              nationalities.map((n, index) => {
                return (
                <option key={index} value={index}>{n}</option>
                )
              })
            }
          </select>
        </div>
        <div className="form-group select-group">
          <label htmlFor="university">{t("University")}</label>
          <select
          id="university"
          name="university"
          value={university || ''}
          onChange={onChangeUniversity}
          className="form-control"
          >
            <option value=""></option>
            {
              faculteiten.map((f, index) => {
                return (
                <option key={index} value={f.name_nl}>{(props.language_id === 1) ? f.name_nl : f.name_eng}</option>
                )
              })
            }
          </select>
        </div>
        <div className="form-group select-group">
          <label htmlFor="faculty">{t("Faculteit")}</label>
          <select
          id="faculty"
          name="faculty"
          value={faculty || ''}
          onChange={onChangeFaculty}
          className="form-control"
          >
            {facultyOptions.length == 0 ?
              <option value="">
                {t("Selecteer eerst een universiteit")}
              </option>
              :''}
            {
              facultyOptions.map((f, index) => {
                return (
                  <option key={index} value={f}>{f}</option>
                )
              })
            }
          </select>
        </div>
        <div
          className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
          role="alert"
          >
            <i className="fas fa-exclamation-circle"></i> &nbsp;
            <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
          </div>
        <div className="navigation">
          <button type="button" className="btn btn-primary next" onClick={() => goToStep(4)}>{t("Vervolg de aanmelding")}</button>
        </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )

}

export default Step3;
