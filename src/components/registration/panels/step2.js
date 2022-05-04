import React, { useState, useEffect } from 'react';
import { validateEmail } from "../../utils";
import apiCall from "../../api";
import { getClone } from "../../utils";
import t from '../../translate';
import {text, getText} from './text/';
import { Cookies, useCookies } from 'react-cookie';
import Universities from "./universities.js";
import LanguageSwitch from './languageSwitch';
import NotificationBox from "../../alert/notification";
import Logo1 from "../../../images/logos/leiden.png";
import Logo2 from "../../../images/logos/maastricht.png";
import Logo3 from "../../../images/logos/uu.png";
import Logo4 from "../../../images/logos/vu.png";

const Step2 = (props) => {
  const informedConsent = {
    1: `<h3>Proefpersoneninformatie voor deelname aan onderzoek</h3>
        <br />
        <strong>Caring Universities Zelfhulpprogramma's</strong><br />
        <br />
        <strong>Inleiding</strong><br />
        Beste (PhD) student,<br />
        Wij vragen je vriendelijk om mee te doen aan een wetenschappelijk onderzoek. Meedoen is vrijwillig. Om mee te doen is wel jouw digitale toestemming nodig.<br />
        <br />
        Dit onderzoek wordt uitgevoerd door het Caring Universities consortium bestaande uit de Vrije Universiteit Amsterdam, de Universiteit van Leiden, de Universiteit van Maastricht en de Universiteit van Utrecht. De VU treedt op als verwerkingsverantwoordelijke voor deze gegevensverwerking. Vragen, opmerkingen en klachten over de manier waarop jouw gegevens worden verwerkt, kunnen worden gericht aan de verantwoordelijke VU-onderzoekers en aan de Functionaris Gegevensbescherming van de VU, of de Autoriteit Persoonsgegevens, zoals aangegeven in onderdeel 5 van deze informatiebrief. De toetsingscommissie van de METc van VUmc heeft beoordeeld dat dit onderzoek niet onder de Wet medisch-wetenschappelijk onderzoek met mensen (WMO) valt. Voordat je beslist of je wilt meedoen aan dit onderzoek, krijg je uitleg over wat het onderzoek inhoudt. Lees deze informatie rustig door en vraag de onderzoeker uitleg als je vragen hebt. Je kunt er ook over praten met jouw partner, vrienden of familie.<br />
        <br />
        <strong>1.	Doel van het onderzoek</strong><br />
        Middels dit onderzoek willen we achterhalen of het haalbaar is om vier verschillende zelfhulpprogramma’s aan te bieden via het internet aan studenten en PhD studenten met mentale problemen: Moodpep, Rel@x, GetStarted en de OplosShop (voor Coronakwaaltjes). Deze e-health interventies richten zich respectievelijk op een sombere stemming, stress klachten, uitstelgedrag en omgaan met de gevolgen van de COVID-19 pandemie. Je kunt zelf kiezen aan welk programma je zou willen beginnen. We willen onderzoeken of deelnemers tevreden zijn over dit programma en wat hun mening is over de toepasbaarheid van dit programma met verschillende korte vragenlijsten die worden aangeboden na afloop van het programma. Tevens willen we onderzoeken of het programma invloed heeft op psychische klachten en de kwaliteit van leven van deelnemers. Om dit te kunnen doen zullen we je eerst screenen op stressklachten en stemmingsklachten.<br />
        <br />
        <strong>2.	Wat meedoen inhoudt</strong><br />
        We verzoeken je om vragenlijsten in te vullen op drie meetmomenten: aan het begin van de programma’s, aan het einde en 6 maanden na het einde van de studie. Je zal eventueel via de mail en/of telefonisch worden herinnerd aan het invullen van de vragenlijsten. Deelname betekent verder dat je actief werkt aan het zelfhulpprogramma. Elk programma bevat meerdere modules waaraan je tussen de 20 en 50 minuten werkt. We adviseren je om aan 1 of 2 modules per week te werken, afhankelijk van het programma dat je hebt gekozen. Je wordt hier verder over geïnformeerd tijdens het programma.<br />
        <br />
        Alle programma’s zijn gebaseerd op wetenschappelijk onderzoek, ontworpen door experts op het gebied van online zelfhulpprogramma’s in samenwerking met experts op het gebied van de klinische psychologie. Tevens wordt er bij de programma’s begeleiding aangeboden door e-coaches. Deze coaches zijn getrainde psychologie studenten (derde jaar bachelor of master) welke worden gesuperviseerd door klinisch psychologen. De e-coaches zullen begeleiding bieden door feedback te geven op alle opdrachten die je doet tijdens de programma’s. Al het contact is digitaal en anoniem als jij dat wilt.<br />
        <br />
        <strong>3.	Mogelijke voor- en nadelen</strong><br />
        Een mogelijk voordeel van het meedoen aan dit onderzoek is dat de zelfhulpprogramma's 24 uur per dag beschikbaar zijn. Je kunt eraan werken in je eigen tempo. Een gevolg van het werken met deze programma's is dat mogelijk dat je symptomen verbeteren en dat je kwaliteit van leven omhoog zal gaan. Daarnaast verwachten we dat jouw deelname bij zal dragen aan kennis over de programma's en zullen we meer te weten komen over de praktische voordelen van de programma's. We verwachten niet dat het meedoen aan dit onderzoek enige risico's met zich meebrengt. Echter, het is in principe mogelijk dat je ongemak ervaart tijdens het invullen van de vragenlijsten. Daarnaast kost deelname aan dit onderzoek enige tijd en moeite. Op dit moment is het alleen mogelijk om de zelfhulpprogramma's te gebruiken in het kader van wetenschappelijk onderzoek. In de nabije toekomst is het streven om deze ook zonder wetenschappelijk onderzoek aan te bieden. <br />
        <br />
        <strong>4.	Als je niet wilt meedoen of wilt stoppen met het onderzoek</strong><br />
        Je beslist zelf of je meedoet aan het onderzoek. Deelname is vrijwillig. Doe je mee aan het onderzoek? Dan kan je je altijd bedenken. Je mag tijdens het onderzoek stoppen. Je hoeft niet te zeggen waarom je stopt. Wel moet je dit direct melden aan de onderzoeker. De gegevens die tot dat moment zijn verzameld, worden gebruikt voor het onderzoek. <br />
        <br />
        <strong>5. 	Gebruik en bewaren van jouw gegevens</strong><br />
        Om dit onderzoek te kunnen uitvoeren, moeten we jouw persoonsgegevens verzamelen en verwerken. Wij bewaren identificerende gegevens zoals naam en contactgegevens apart van alle andere gegevens die we over jou verzamelen. Elke deelnemer krijgt een ID-code toegewezen waaraan de verzamelde gegevens worden gekoppeld. Deze ID-code wordt afzonderlijk bewaard en is slechts toegankelijk voor de onderzoeker indien dit noodzakelijk is voor de koppeling van gegevens ten behoeve van contact of toestemming. De ‘gecodeerde' gegevens zullen binnen het onderzoek worden geanalyseerd.<br />
        <br />
        Alle gegevens worden opgeslagen en verwerkt conform alle regels en richtlijnen van de AVG op een goed beveiligde manier. <br />
        <br />
        Indien de onderzoekers de gegevens op een later moment willen benutten ten behoeve van vervolgonderzoek en/of wetenschappelijk onderwijs, of als tussentijdse interventies vereisen dat nieuwe gegevens worden verwerkt of in andere manieren gebruikt dan waarvoor ze oorspronkelijk verzameld zijn, dan wordt dit aan de deelnemers gecommuniceerd en wordt hiervoor, zo vaak als redelijkerwijs mogelijk, opnieuw toestemming gevraagd.<br />
        <br />
        <strong>Uitwisseling van gegevens binnen Caring Universities</strong><br />
        Voor het onderzoek worden jouw onderzoeksgegevens gecodeerd gedeeld met de Vrije Universiteit Amsterdam. De onderzoeksgegevens zijn bij publicatie niet te herleiden naar jou. Als je de toestemmingsverklaring ondertekent, geef je toestemming voor het verzamelen, bewaren en inzien van jouw persoonsgegevens. De onderzoeker bewaart jouw gegevens 15 jaar. Daarna worden de persoonsgegevens vernietigd. <br />
        <br />
        <strong>Ipportunities B.V.</strong><br />
        De gegevens worden tevens met dezelfde (beveiligings-)maatregelen opgeslagen op de servers van VIP Internet door Ipportunities B.V. Met deze instelling heeft Caring Universities een overeenkomst. Zij beheren het platform waarop de interventies gebruikt kunnen worden. <br />
        <br />
        <strong>FAIR science</strong><br />
        Het streven is om de data van het Caring Universities project Findable, Accessible, Interoperable en Reusable (FAIR) te maken. Hierbij zullen schriftelijke verzoeken voor het delen van data met erkende instellingen met een specifieke vraagstelling in overweging worden genomen. Indien over wordt gegaan op het delen van data zal dit enkel worden gedaan met meerdere waarborgen zoals pseudonymisering, versleuteling en beveiligingsmaatregelen. <br />
        <br />
        Meer informatie over jouw rechten bij verwerking van gegevens<br />
        Je kan de onderzoeker vragen om een elektronische kopie van gegevens die je hebt aangeleverd of die direct bij jou gemeten zijn. Indien je ontevreden bent over hoe wordt omgegaan met jouw privacy dan kan je een klacht indienen bij de Functionaris Gegevensbescherming van de VU via functionarisgegevensbescherming@vu.nl. Ook kan je zelf terecht bij de Functionaris Gegevensbescherming van jouw universiteit en de Autoriteit Persoonsgegevens via <a href="https://autoriteitpersoonsgegevens.nl/" target="_blank">autoriteitpersoonsgegevens.nl</a>.<br />
        <br />
        <strong>5. Geen vergoeding voor meedoen</strong><br />
        Voor het meedoen aan dit onderzoek krijg je geen onkostenvergoeding. <br />
        <br />
        <strong>6. Heb je vragen?</strong><br />
        Bij vragen kan je contact opnemen met het onderzoeksteam.<br />
        <br />
        <u>Contactgegevens</u><br />
        Het Caring Universities Onderzoeksteam<br />
        t.a.v. dr. S.Y. Struijs<br />
        VU Amsterdam, Sectie Klinische Psychologie,<br />
        Van der Boechorststraat, Kamer: A-516,<br />
        1081 BT Amsterdam<br />
        Email: <a href="mailto:caring.universities@vu.nl">caring.universities@vu.nl</a> <br />
        <br />
        <br />
        <ul>
          <li>Ik heb de informatiebrief gelezen. Ook kon ik vragen stellen. Mijn vragen zijn voldoende beantwoord. Ik had genoeg tijd om te beslissen of ik meedoe.</li>
          <li>Ik weet dat meedoen vrijwillig is. Ook weet ik dat ik op ieder moment kan beslissen om toch niet mee te doen of te stoppen met het onderzoek. Daarvoor hoef ik geen reden te geven.</li>
          <li>Ik geef toestemming voor het verzamelen en gebruiken van mijn gegevens op de manier en voor de doelen die in de informatiebrief staan. </li>
          <li>Ik geef toestemming om mijn gegevens nog 15 jaar na dit onderzoek te bewaren.</li>
          <li>Ik wil meedoen aan dit onderzoek.</li>
      </ul><br />`,
    2: `

      <h3>Caring Universities Self-help Program</h3>
      <br />
      <strong>General information</strong><br />
      Dear (PhD) student,<br />
      We kindly ask you to participate in a scientific study. Participation is voluntary. Your digital permission is required in order to participate. <br />
      <br />
      This research is conducted by the Caring Universities consortium which includes the Vrije Universiteit Amsterdam, Leiden University, Maastricht University and Utrecht University. The VU is end-responsible for the data processing. Questions, comments or complaints concerning the way your data is handled can be addressed to the responsible VU researchers, Data Protection Officer of the VU, or the Data Protection Authority, as is described in section 4 of this information letter. The assessment committee of the Medical Ethics Committee of VUmc has assessed that this research does not fall under the Medical-Scientific Research with People Act (WMO). Before you decide whether you want to participate in this study, you will be given an explanation about what the study involves. Please read this information carefully and ask the research team for an explanation if you have any questions. You may also discuss it with your partner, friends or family.<br />
      <br />
      <strong>1.	Purpose of the study</strong><br />
      The purpose of this study is to investigate the feasibility and acceptability of four Internet-based self-help programmes for university students with mental health complaints: Moodpep, Rel@x, GetStarted and the SolutionShop (for corona issues). These e-health interventions target sad mood, increased levels of stress, procrastination and the negative consequences of the COVID-19 pandemic respectively. You can choose which e-health programma you would like to use. We aim to investigate your opinion about this programme with regard to your satisfaction level and usability of this programme. Also, as part of this goal, we wish to examine whether your stress levels, mood and quality of life change during the course of the programme. To be able to do this, we first screen you in terms of stress and mood complaints.<br />
      <br />
      <strong>2.	What participation involves</strong><br />
      We kindly ask you to complete questionnaires at three time points: before the start of the self-help programme, after finishing the self-help programme and 6 months after completing the programme. Participation further entails that you follow the self-help programme. Each self-help programme consists of several (5-8) weekly modules lasting between 20 and 50 minutes, including short weekly assessments. We advise you to work on one or two modules per week, depending on the programme you chose. You'll be informed of the details during the programme.<br />
      <br />
      All self-help programmes are evidence-based, created by experts in the field of internet-based self-help programmes and in collaboration with experts in the field of clinical psychology. They also include guidance by e-coaches. These e-coaches are master or third year bachelor students Clinical Psychology from the Vrije Universiteit (VU). They are extensively trained for e-coaching by licensed psychologists and guide you by giving feedback on the assignments you complete in the programme. All contact is digital and anonymous, and all e-coaches operate under supervision of a licensed psychologist.<br />
      <br />
      <strong>3.	Possible advantages and disadvantages</strong><br />
      Advantages are that these programmes are available 24 hours per day and you can work on them at your own pace. As a result of working on these programmes, it is possible that your symptoms will reduce and your quality of life will improve. Moreover, your participation may contribute to increased knowledge about the programmes and help us in determining its feasibility and usability for college students with elevated levels of stress and/or sad mood. We expect that participation in this study does not entail any risks. However, it is possible that you may experience some stress when filling out the questionnaires during screening and at the end of the intervention. In addition, participating costs some time and effort. As of this moment it's only possible to use the programmes in the context of a scientific study. In the near future we strive to offer these programmes outside of a scientific context as well. <br />
      <br />
      <strong>4.	If you do not want to participate or you want to stop participating in the study</strong><br />
      Participation is completely voluntary and only with your digital permission. You are free to stop the survey at any time and do not need to give a reason. However, you do need to notify the researcher if you decide to stop. The data collected until that time will still be used for the study unless you withdraw consent.<br />
      <br />
      <strong>5. 	Usage and storage of your data</strong><br />
      In order to carry out this research, we must collect and process your personal data. We store identifying information such as name and contact information separately from all other information we collect about you. Each research participant is assigned an ID code to which the collected data is linked. This ID code is stored separately and is only accessible to the researcher if this is necessary for linking data for contact or permission. The "coded" data will be analyzed within the study.<br />
      <br />
      All data is stored and processed in accordance with all rules and guidelines of the GDPR in a well-secured manner.
      <br />
      <br />
      If the researchers want to use the data at a later time for further research and/or scientific education, or if interim interventions require new data to be processed or used in other ways than for which they were originally collected, this will be communicated to the participants and permission is asked again, as often as reasonably possible.<br />
      <br />
      <strong>Exchange of data within Caring Universities</strong><br />
      Your research data will be coded and shared with the VU University Amsterdam. The research data cannot be traced back to you upon publication. When you sign the declaration of consent, you consent to the collection, storage and viewing of your personal data. The researcher stores your data for 15 years. After this period of time, the personal data will be destroyed.<br />
      <br />
      <strong>Ipportunities B.V.</strong><br />
      The data is also stored by Ipportunities B.V. on the servers of VIP internet with the same (security) measures. Caring Universities has an agreement with Ipportunities B.V. They manage the platform on which the interventions can be used.<br />
      <br />
      <strong>FAIR science</strong><br />
      The aim is to make the data of the Caring Universities project Findable, Accessible, Interoperable and Reusable (FAIR). Written requests for data sharing from recognized institutions with specific questions will be considered. If we agree to share data, this will only be done with multiple safeguards such as pseudonymisation, encryption and security measures.<br />
      <br />
      <strong>More information about your rights when processing data</strong><br />
      You can ask the researcher for an electronic copy of data that you have supplied or that have been measured directly with you. If you are dissatisfied with how your privacy is handled, you can submit a complaint to the VU Data Protection Officer via functionarisgegevensbescherming@vu.nl.You can also contact the Data Protection Officer of your university and the Dutch Data Protection Authority via <a href="https://autoriteitpersoonsgegevens.nl" target="_blank">autoriteitpersoonsgegevens.nl</a>.<br />
      <br />
      <strong>5. No compensation for participation</strong><br />
      You will not be paid for your participation in this study.<br />
      <br />
      <strong>6. Any questions?</strong> <br />
      If you have any questions, please contact the study team. <br />
      <br />
      <u>Contact information</u><br />
      The Caring Universities Research Team<br />
      On behalf of S.Y. Struijs, PhD<br />
      VU Amsterdam, Section Clinical Psychology<br />
      Van der Boechorststraat, Room: A-516,<br />
      1081 BT Amsterdam<br />
      Email: <a href="mailto:caring.universities@vu.nl">caring.universities@vu.nl</a> <br />
      <br />
      <br />
      <ul>
        <li>I have read all the information in the previous page. I was also able to ask questions. My questions have been answered to my satisfaction. I had enough time to decide whether to participate.</li>
        <li>I know participation is voluntary. I know that I may decide at any time not to participate after all or to withdraw from the study. I do not need to give a reason for this.</li>
        <li>I consent to my data being used in the way and for the purpose stated in the information page.</li>
        <li>I consent to my data being stored at the research location for another 15 years after this study.</li>
        <li>I want to participate in this study.</li>
      </ul>
      <br />`,
  }

  const registrationExists = {
    1: "Er is een eerdere registratie aangetroffen met dit e-mailadres, je kunt je maar één maal registreren.",
    2: "We have found a previous registration with this email address. You can only register once."
  }
  const wrongUni = {
    1: `<strong>Jouw emailadres lijkt niet overeen te komen met één van deze universiteiten.:</strong><br /><br />
          <table border="0">
            <tr>
              <td><image src="`+Logo1+`" width="30%"></td>
              <td><image src="`+Logo2+`" width="30%"></td>
            </tr>
            <tr>
              <td><image src="`+Logo3+`" width="30%"></td>
              <td><image src="`+Logo4+`" width="30%"></td>
            </tr>
          </table>
          <br />
        Alleen studenten van deze universiteiten kunnen de programma's volgen. <br />
        <ul>
          <li>Als je wel naar één van deze universiteiten gaat, vul dan je universiteitsemailadres in.</li>
          <li>Als je niet ingeschreven staat bij één van deze universiteiten maar alsnog behoefte hebt aan hulp, neem dan contact op met je huisarts, studentenpsycholoog van je school, of iemand anders die je vertrouwt.</li>
        </ul>`,
    2: `<strong>It seems as if your email address doesn't match one of these universities:</strong><br />
        <table border="0">
          <tr>
            <td><image src="`+Logo1+`" width="45%"></td>
            <td><image src="`+Logo2+`" width="45%"></td>
          </tr>
          <tr>
            <td><image src="`+Logo3+`" width="45%"></td>
            <td><image src="`+Logo4+`" width="45%"></td>
          </tr>
        </table>
        <br />
        Only students from these universities can do the programmes. <br />
        <ul>
          <li>If you go to one of these universities, please enter your university email address.</li>
          <li>If you do not go to one of these universities but still feel like you need help, please reach out to your G.P., school psychologist or another person you trust.</li>
        </ul>`,

  }



  const maildomains = ["student.vu.nl", "student.acta.nl", "umail.leidenuniv.nl", "students.uu.nl", "uu.nl", "student.maastrichtuniversity.nl", "maastrichtuniversity.nl", "ippo.nl", "vu.nl", "arch.leidenuniv.nl", "fsw.leidenuniv.nl", "hum.leidenuniv.nl", "fgga.leidenuniv.nl", "law.leidenuniv.nl", "science.leidenuniv.nl", "lumc.nl", "umcutrecht.nl", "acta.nl"];

  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [iamastudent, setIamastudent] = useState(false);
  const [followUp, setFollowUp] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  useEffect(() => {
    setAgree(props.registrationData.agree);
    setIamastudent(props.registrationData.iamastudent);
    setFollowUp(props.registrationData.followUp);
    setEmail(props.registrationData.email);
  }, []);

  const changeEmail = (e) => {
    setEmail(e.target.value);
  }

  const changeAgree = (e) => {
    setAgree(!agree);
  }

  const changeIamaStudent = (e) => {
    setIamastudent(!iamastudent);
  }

  const changeFollowUp = (e) => {
    setFollowUp(!followUp);
  }

  const [notificationOptions, setNotificationOptions] = useState('');

  const goToStep = (step) => {

    if (step === 3)
    {
      //check email
      if (validateEmail(email)) {
        let mailparts = email.split("@");
        if (maildomains.indexOf(mailparts[1]) > -1) {
          if (agree) {
            if (iamastudent)
            {
              updateRegistrationData(agree, iamastudent, followUp, email);
              if (!cookies.hasOwnProperty("token"))
              {
                newRegistration(3);
              }
              else
              {
                updateRegistration(cookies.token, 3);
              }
            }
            else
            {
              setNotificationOptions({
                show: "true",
                text: t("Alleen wanneer je een student of PhD student bent op een van de volgende universiteiten: Universiteit Leiden, Maastricht University, Universiteit Utrecht, Vrije Universiteit Amsterdam, kun je deelnemen aan dit programma."),
                confirmText: t("Ok")
              });
            }
          } else {
            setNotificationOptions({
              show: "true",
              text: t("Om deel te nemen dien je onderaan het formulier aan te geven dat je akkoord gaat met de op deze pagina beschreven voorwaarden voor deelname."),
              confirmText: t("Ok")
            });

          }
        } else {
          setNotificationOptions({
            show: "true",
            text: wrongUni[props.language_id],
            confirmText: t("Ok")
          });
        }
      } else {
        setNotificationOptions({
          show: "true",
          text: t("Geef een geldig e-mailadres op!"),
          confirmText: t("Ok")
        });
      }
    }
    else
    {
      //naar step 1
      if (validateEmail(email)) {
        let mailparts = email.split("@");
        if (maildomains.indexOf(mailparts[1]) > -1) {
          updateRegistrationData(agree, iamastudent, followUp, email);
          if (agree) {
            if (!cookies.hasOwnProperty("token"))
            {
              newRegistration(1);
            }
            else
            {
              updateRegistration(cookies.token, 1);
            }
          } else {
            props.setStep(1);
          }
        } else {
          props.setStep(1);
        }
      }
      else
      {
        props.setStep(1);
      }

    }
  }

  const newRegistration = (step) => {

    let follow_up_research = false;
    if (followUp) {
      follow_up_research = true;
    }

    apiCall({
      action: "new_registration",
      data: {
        email,
        qualtrics_id: props.qualtrics_id,
        intervention_id: props.intervention_id,
        language_id: props.language_id,
        follow_up_research
      }
    }).then(resp => {
      if (resp.msg === "OK")
      {
        props.setToken(resp.token);
        //cookie met token zetten tbv reload...
        let now = new Date();
        let time = now.getTime();
        let expireTime = time + 1000*3600*24;
        now.setTime(expireTime);
        setCookie('token', resp.token, { path: '/registration/', expires: now });
        props.setStep(step);
      }
      else
      {
        alert(registrationExists[props.language_id]);
      }
    });

  }

  const updateRegistration = (token, step) => {

    let follow_up_research = false;
    if (followUp) {
      follow_up_research = true;
    }

    apiCall({
      action: "update_registration",
      data: {
        step: 2,
        nextStep: step,
        token,
        email,
        follow_up_research
      }
    }).then(resp => {
      props.setStep(step);
    });

  }

  const updateRegistrationData = (agree, iamastudent, followUp, email) => {
    let newRegistrationData = getClone(props.registrationData);
    newRegistrationData.agree = agree;
    newRegistrationData.iamastudent = iamastudent;
    newRegistrationData.followUp = followUp;
    newRegistrationData.email = email;
    props.setRegistrationData(newRegistrationData);
  }

  return (
    <div className="step2">
      <button type="button" className="btn prev" onClick={() => goToStep(1)}>{t("Terug naar alle programma's")}</button>
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      {text ?
        <div className="container">
          <div className="step">
            <b>{t("stap 2")}</b> {t("informed consent")}
          </div>
          <br />
          <div className="intro">
            <h2>{t(getText(props.intervention_id, "step_2_title"))}</h2>
            {/*<h3>{t("Over dit programma")}</h3>*/}
            {t(getText(props.intervention_id, "description_part1"))}
            <br/><br/>
            {t(getText(props.intervention_id, "description_part2"))}
            <br/><br/>
            {t(getText(props.intervention_id, "description_part3"))}
          </div>
          <div className="informedConsent">
            <div className="content" dangerouslySetInnerHTML={{__html: informedConsent[props.language_id]}}></div>
            <div className="form-group bigLabel">
              <input
                className="form-check-input"
                type="checkbox"
                id="agree"
                onChange={changeAgree}
                checked={agree || ''}
              />
              <label className="form-check-label" htmlFor="agree">
                {t("Ik geef toestemming om deel te nemen aan dit onderzoek.")}
              </label>
              <br/>
              <br/>
              <input
                className="form-check-input"
                type="checkbox"
                id="iamastudent"
                onChange={changeIamaStudent}
                checked={iamastudent || ''}
              />
              <label className="form-check-label" htmlFor="iamastudent">
                {t("Ik ben een student of PhD student op een van de volgende universiteiten: Universiteit Leiden, Maastricht University, Universiteit Utrecht, Vrije Universiteit Amsterdam")}
              </label>
              <br/>
              <br/>
              <input
                className="form-check-input"
                type="checkbox"
                id="follow-up-research"
                onChange={changeFollowUp}
                checked={followUp || ''}
              />
              <label className="form-check-label" htmlFor="follow-up-research">
                {t("Ik geef toestemming om benaderd te worden voor vervolgonderzoek.")}
              </label>

            </div>
          </div>

          <div className="form-group">
            {t("Vul hier je universiteitsemaildres in")}
            <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="email"
                placeholder={t("Typ hier")}
                value={email || ''}
                onChange={changeEmail}
            />
          </div>
          <Universities step={props.step}/>
          <div className="navigation">
              <button type="button" className="btn btn-primary next" onClick={() => goToStep(3)}>{t("Doorgaan")}</button>
            </div>

        </div>
        :''}

        <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )

}

export default Step2;
