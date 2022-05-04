import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import moment from "moment";
import LeftMenu from "../dashboard/leftmenu";
import t from "../translate";
import { setIntervention } from "../../actions";
import { useLocation } from "react-router-dom";
import SortObjectArray from "../helpers/sortObjectArray.js";
import { useHistory } from "react-router-dom";
import {GetDate, GetTime} from "../helpers/convertTimestamp.js";
import {appSettings} from "../../custom/settings";
import CustomDataUsers from "../../custom/data/users.js";

const Data = (props) => {

  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

  useEffect(() => {
    let intervention_id = location.pathname.split("/")[3];
    if (intervention.id === 0 && intervention_id !== intervention.id) {
      apiCall({
        action: "get_intervention_settings",
        token: auth.token,
        data: {
          intervention_id,
          language_id: uiTranslation.language_id
        }
      }).then(resp => {
        dispatch(
          setIntervention(
            resp.intervention_id,
            resp.organisation_id,
            resp.title,
            resp.settings
          )
        );
      });
    }
  }, []);

  function downloadUsersCSV(){
    //api aanroepen
    apiCall({
      action: "get_students",
      token: auth.token,
      data: {
        intervention_id: intervention.id
      }
    }).then(resp => {

      //setRegistrations(resp.registrations)
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = 'id;date_time_create;firstname;insertion;lastname;email\n';
      var dataString = '';

      resp.students.forEach(function(r, index) {
        if (r.date_time_create > 0)
        {
          r.date_time_create = moment.unix(r.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false });
        }

        dataString += r.id +";"+ r.date_time_create+";"+r.firstname+";"+r.insertion+";"+r.lastname+";"+r.email+";"+"\n";
        //csvContent += index < registrations.length ? dataString + '\n' : dataString;

      });
      csvContent += dataString;

      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          /// hier loopt die vast maar is misschien ook niet nodig
          //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }

      download(csvContent, intervention.title+'_'+resp.title + '_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');
    });
  }

  function downloadRegistrationsCSV() {

    //api aanroepen
    apiCall({
      action: "get_registrations",
      token: auth.token,
      data: {
        intervention_id: intervention.id
      }
    }).then(resp => {

      //setRegistrations(resp.registrations)
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = 'id;date_time_create;date_time_update;email;intervention_id;language_id;follow_up_research;age;gender;qualtricsLongerThen1WeekAgo;t0_started;t0_finished;PHQ9P_total_score;PHQ9P_item9_score;G10_score;G11_score;included;nationality;university;faculty;account_created;account_activated;user_id\n';
      var dataString = '';
      var scores = '';
      resp.registrations.forEach(function(r, index) {
        if (r.t0_started > 0)
        {
          r.t0_started = moment.unix(r.t0_started).format("DD-MM-YYYY HH:mm:ss", { trim: false });
        }
        if (r.t0_finished > 0)
        {
          r.t0_finished = moment.unix(r.t0_finished).format("DD-MM-YYYY HH:mm:ss", { trim: false });
        }
        let PHP9P_total_score = 0;
        let PHP9P_item9_score = 0;
        let G10_score = 0;
        let G11_score = 0;
        if (typeof r.t0_scores !== 'undefined' && typeof r.t0_scores.PHP9P_total_score !== 'undefined')
        {

          PHP9P_total_score = r.t0_scores.PHP9P_total_score;
          PHP9P_item9_score = r.t0_scores.PHP9P_item9_score;
          G10_score = r.t0_scores.G10_score;
          G11_score = r.t0_scores.G11_score;
        }
        if (r.account_created > 0)
        {
          r.account_created = moment.unix(r.account_created).format("DD-MM-YYYY HH:mm:ss", { trim: false });
        }
        if (r.account_activated > 0)
        {
          r.account_activated = moment.unix(r.account_activated).format("DD-MM-YYYY HH:mm:ss", { trim: false });
        }
        dataString += r.id +";"+ moment.unix(r.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false })+ moment.unix(r.date_time_update).format("DD-MM-YYYY HH:mm:ss", { trim: false })+";"+r.email+";"+";"+ intervention.id +";"+ r.language_id +";"+r.follow_up_research+";"+r.age+";"+r.gender+";"+r.qualtricsLongerThen1WeekAgo+";"+r.t0_started+";"+r.t0_finished+";"+PHP9P_total_score+";"+PHP9P_item9_score+";"+G10_score+";"+G11_score+";"+r.included+";"+r.nationality+";"+r.university+";"+r.faculty+";"+r.account_created+";"+r.account_activated+";"+r.user_id+"\n";
        //csvContent += index < registrations.length ? dataString + '\n' : dataString;

      });
      csvContent += dataString;
      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          /// hier loopt die vast maar is misschien ook niet nodig
          //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }

      download(csvContent, t('download registraties ') + intervention.title + '.csv', 'text/csv;encoding:utf-8');
    });

  }

  function downloadQualtricsRegistrationsCSV() {

    //api aanroepen
    apiCall({
      action: "get_qualtrics_registrations",
      token: auth.token,
      data: {
      }
    }).then(resp => {

      //setRegistrations(resp.registrations)
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = 'id;date_time_create;date_time_update;qualtrics_id;status;registration_id;\n';
      var dataString = '';
      var scores = '';
      resp.registrations.forEach(function(r, index) {

        dataString += r.id +";"+ moment.unix(r.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false }) +";"+ moment.unix(r.date_time_update).format("DD-MM-YYYY HH:mm:ss", { trim: false }) +";"+ r.qualtrics_id +";"+ r.status +";"+r.registration_id+"\n";

      });
      csvContent += dataString;
      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          /// hier loopt die vast maar is misschien ook niet nodig
          //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }

      download(csvContent, 'qualtrics_registrations_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');
    });

  }

  const downloadResultsCSV = (id, type) => {
    let action = false;
    if(type == "questionnaire"){action = "get_questionnaire_csv_rows";}
    if(type == "lesson"){action = "get_lesson_csv_rows";}
    if(type == "goal"){action = "get_goal_csv_rows";}

    if(action){
      apiCall({
        action: action,
        token: auth.token,
        data: {
          id
        }
      }).then(resp => {

        //setRegistrations(resp.registrations)
        // Building the CSV from the Data two-dimensional array
        // Each column is separated by ";" and new line "\n" for next row
        var csvContent = '';
        for (var header of resp.headers) {
          ////<br> komt mee door contenteditable denk ik
          csvContent += header.replace(/<br\s*[\/]?>/gi, " ")+';';
        }
        csvContent += '\n';
        var dataString = '';
        for (var row of resp.rows) {
          for (let i=0;i<row.length;i++) {
            if (i == 1 || i == 2)
            {
              dataString += moment.unix(row[i]).format("DD-MM-YYYY HH:mm:ss", { trim: false }) +";";
            }
            else
            {
              dataString += row[i]+";";
            }
          }
          dataString += '\n';
        }

        ////<br> komt mee door contenteditable denk ik
        csvContent += dataString.replace(/<br\s*[\/]?>/gi, " ");
        // The download function takes a CSV string, the filename and mimeType as parameters
        // Scroll/look down at the bottom of this snippet to see how download is called
        var download = function(content, fileName, mimeType) {
          var a = document.createElement('a');
          mimeType = mimeType || 'application/octet-stream';

          if (navigator.msSaveBlob) { // IE10
            navigator.msSaveBlob(new Blob([content], {
              type: mimeType
            }), fileName);
          } else if (URL && 'download' in a) { //html5 A[download]
            a.href = URL.createObjectURL(new Blob([content], {
              type: mimeType
            }));
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            /// hier loopt die vast maar is misschien ook niet nodig
            //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
          }
        }

        download(csvContent, intervention.title+'_'+resp.title + '_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');

      });
    }

  }

  const downloadUserActivityCSV = (intervention_id) => {
    apiCall({
      action: "get_user_activity_csv",
      token: auth.token,
      data: {
        intervention_id
      }
    }).then(resp => {

      //setRegistrations(resp.registrations)
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = '';
      for (var header of resp.headers) {
        csvContent += header+';';
      }
      csvContent += '\n';
      var dataString = '';
      for (var row of resp.rows) {
        for (let i=0;i<row.length;i++) {
          dataString += row[i]+";";
        }
        dataString += '\n';
      }

      csvContent += dataString;
      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          /// hier loopt die vast maar is misschien ook niet nodig
          //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }

      download(csvContent, intervention.title+'_user_activity_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');

    });
  }

  const downloadWaitingListCSV = () => {
    //api aanroepen
    apiCall({
      action: "get_waitinglist",
      token: auth.token,
      data: {
      }
    }).then(resp => {

      //setRegistrations(resp.registrations)
      // Building the CSV from the Data two-dimensional array
      // Each column is separated by ";" and new line "\n" for next row
      var csvContent = 'id;date_time_create;interestedin;email;\n';
      var dataString = '';
      var scores = '';
      resp.waitinglist.forEach(function(r, index) {

        dataString += r.id +";"+ moment.unix(r.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false }) +";"+ r.interestedin + ";" + r.email+"\n";

      });
      csvContent += dataString;
      // The download function takes a CSV string, the filename and mimeType as parameters
      // Scroll/look down at the bottom of this snippet to see how download is called
      var download = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([content], {
            type: mimeType
          }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([content], {
            type: mimeType
          }));
          a.setAttribute('download', fileName);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          /// hier loopt die vast maar is misschien ook niet nodig
          //location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
      }

      download(csvContent, 'waitinglist_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');
    });
  }

  function backToDash(){
    history.push("/")
  }

  function toggleVisibility(target){
    if (target.parentNode.classList.contains('open')) {
      target.parentNode.classList.remove("open");
    } else {
      target.parentNode.classList.add("open");
    }
  }

  return (
    <div className="data">
      <nav className="navbar navbar-expand-lg navbar-light">
        <h2>
          <span className="pointer" onClick={()=>history.push("/intervention/edit/" + intervention.id + "/general/")}>{" " + intervention.title + " "} </span>
        </h2>
        <h2 className="noPadding">
          &nbsp; > {t("Data")}
        </h2>
      </nav>
      <LeftMenu />
      <div className="container dashboard_container">
      <h3>{t("Exporteer data")}</h3><br />
      {
        /*
        <span className='btn btn-primary download' onClick={()=>downloadWaitingListCSV()}>
          {t("Download wachtlijst als csv")} <i className="fas fa-download"></i>
        </span>
        <br />
        <br />
        */
      }
      {
        /*
        <span className='btn btn-primary download' onClick={()=>downloadQualtricsRegistrationsCSV()}>
          {t("Download qualtrics registraties als csv")} <i className="fas fa-download"></i>
        </span>
        <br />
        <br />
        */
      }

        <div className="download_group">
          <h5 onClick={e=>toggleVisibility(e.target)}><i className="fas fa-chevron-up"></i>{t("Deelnemers")} </h5>
          {appSettings.exportDataRegistrations == true ?
            <div className="download_options">
              <div className="download_option">
                {t("Registraties")}
                <span className='btn btn-primary download' onClick={()=>downloadRegistrationsCSV()}>
                  {t("csv")} <i className="fas fa-download"></i>
                </span>
              </div>
            </div>
            :<></>}
            {/* <div className="download_options">
              <div className="download_option">
                {t("Naam + Email Deelnemers")}
                <span className='btn btn-primary download' onClick={()=>downloadUsersCSV()}>
                  {t("csv")} <i className="fas fa-download"></i>
                </span>
              </div>
            </div> */}
            <CustomDataUsers />
        </div>
      {
        /*
        <span className='btn btn-primary download' onClick={()=>downloadUserActivityCSV(intervention.id)}>
          {t("Download useractivity als csv")} <i className="fas fa-download"></i>
        </span>
        <br /><br />
        */
      }
      {intervention.settings.selfhelp.lessons.length > 0 ?
        <div className="download_group">
          <h5 onClick={e=>toggleVisibility(e.target)}>
            <i className="fas fa-chevron-up"></i>{t("Lessen")}
          </h5>
          <div className="download_options">
            {
              intervention.settings.selfhelp.lessons.map((l, index) => {
                if (typeof l.settings.visible === 'undefined' || (l.settings.visible !== 'undefined') && l.settings.visible !== 'hidden')
                {
                  return (
                    <div key={index} className={"download_option" + (l.parent_id != 0 ? ' child child_' + l.parent_id:'')}>
                      {l.title.charAt(0).toUpperCase() + l.title.slice(1)}
                      <span className='btn btn-primary download' onClick={()=>downloadResultsCSV(l.id, 'lesson')}>
                         {"csv"} <i className="fas fa-download"></i>
                      </span>
                    </div>
                  )
                }
              })
            }
            </div>
          </div>
        :<></>}
      {intervention.settings.selfhelp.optionalLessons.length > 0 ?
        <div className="download_group">
          <h5 onClick={e=>toggleVisibility(e.target)}>
            <i className="fas fa-chevron-up"></i>{t("Optionele lessen")}
          </h5>
          <div className="download_options">
            {
              intervention.settings.selfhelp.optionalLessons.map((l, index) => {
                if (typeof l.settings.visible === 'undefined' || (l.settings.visible !== 'undefined') && l.settings.visible !== 'hidden')
                {
                  return (
                    <div key={index} className="download_option">
                      {l.title.charAt(0).toUpperCase() + l.title.slice(1)}
                      <span className='btn btn-primary download' onClick={()=>downloadResultsCSV(l.id, 'lesson')}>
                         {"csv"} <i className="fas fa-download"></i>
                      </span>
                    </div>
                  )
                }
              })
            }
            </div>
          </div>
        :<></>}
        {intervention.settings.goals.length > 0 ?
          <div className="download_group">
            <h5 onClick={e=>toggleVisibility(e.target)}>
              <i className="fas fa-chevron-up"></i>{t("Doelen")}
            </h5>
            <div className="download_options">
              {
                intervention.settings.goals.map((g, index) => {
                  if (typeof g.settings.visible === 'undefined' || (g.settings.visible !== 'undefined') && g.settings.visible !== 'hidden')
                  {
                    return (
                      <div key={index} className="download_option">
                        {g.title.charAt(0).toUpperCase() + g.title.slice(1)}
                        <span className='btn btn-primary download' onClick={()=>downloadResultsCSV(g.id, 'goal')}>
                           {"csv"} <i className="fas fa-download"></i>
                        </span>
                      </div>
                    )
                  }
                })
              }
              </div>
            </div>
          :<></>}
      {intervention.settings.questionnaires.length > 0 ?
        <div className="download_group">
          <h5 onClick={e=>toggleVisibility(e.target)}>
            <i className="fas fa-chevron-up"></i>{t("Vragenlijsten")}
          </h5>
          <div className="download_options">
            {
              intervention.settings.questionnaires.map((q, index) => {
                if (typeof q.settings.visible === 'undefined' || (q.settings.visible !== 'undefined') && q.settings.visible !== 'hidden')
                {
                  return (
                    <div key={index} className="download_option">
                      {q.title.charAt(0).toUpperCase() + q.title.slice(1)}
                      <span className='btn btn-primary download' onClick={()=>downloadResultsCSV(q.id, "questionnaire")}>
                         {"csv"} <i className="fas fa-download"></i>
                      </span>
                    </div>
                  )
                }
              })
            }
          </div>
        </div>
        :<></>}

      </div>
    </div>
  );
};

export default Data;
