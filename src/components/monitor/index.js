import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import moment from "moment";
import LeftMenu from "../dashboard/leftmenu";
import t from "../translate";
import { setIntervention } from "../../actions";
import SortObjectArray from "../helpers/sortObjectArray.js";
import { useHistory } from "react-router-dom";
import {GetDate, GetTime} from "../helpers/convertTimestamp.js";

const Monitor = (props) => {

  const auth = useSelector(state => state.auth);

  const [data, setData] = useState({
    users: []
  });
  const program = {14: "Moodpep", 24: "Rel@x"};
  const lang = {1: "Dutch", 2: "English"};

  useEffect(() => {
      apiCall({
        action: "get_monitor_data",
        token: auth.token,
        data: {
        }
      }).then(resp => {
        console.log(resp.data);
        setData(resp.data);
      });
  }, []);

 return (
    <div className="whiteWrapper data">
      <LeftMenu />
      <div className="container dashboard_container">
        <h3>Monitor</h3><br />
        <table className="table striped">
          <thead>
            <tr>
              <th>#id</th>
              <th>date_time_create</th>
              <th>date_time_update</th>
              <th>Name</th>
              <th>E-mail</th>
              <th>Login</th>
              <th>Program</th>
              <th>Coach</th>
              <th>Language</th>
              <th>#registration_id</th>
            </tr>
          </thead>
          <tbody>
          {
            data.users.map((d, index) => {
              console.log(d);
              let language_id = 1;//def dutch
              
              console.log(typeof d.user.preferences);
              if (typeof d.user.preferences !== undefined)
              {
                for (var pref of d.user.preferences) {
                  if (pref.option === 'language_id')
                  {
                    language_id = pref.value;
                    break;
                  }
                }
              }

              let programm = '';
              let intervention_id = 0;
              console.log(typeof d.user.rights);
              if (typeof d.user.rights !== undefined && typeof d.user.rights.interventions !== undefined && typeof d.user.rights.interventions[0] !== undefined && typeof d.user.rights.interventions[0].id !== undefined)
              {
                intervention_id = d.user.rights.interventions[0].id;
              }
              if (intervention_id > 0)
              {
                programm = program[intervention_id];
              }
              
              return (
                <tr key={index}>
                  <td>{d.user.id}</td>
                  <td>{moment.unix(d.user.date_time_create).format("DD-MM-YYYY HH:mm:ss", { trim: false })}</td>
                  <td>{moment.unix(d.user.date_time_update).format("DD-MM-YYYY HH:mm:ss", { trim: false })}</td>
                  <td>{d.user.firstname} {d.user.insertion} {d.user.lastname}</td>
                  <td>{d.user.email}</td>
                  <td>{d.user.login}</td>
                  <td>{programm}</td>
                  <td>{lang[language_id]}</td>
                  <td></td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitor;
