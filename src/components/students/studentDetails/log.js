import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";


const  StudentDetailsLog = props => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);

    const [log, setLog] = useState([]);

    useEffect(() => {
        //student info ophalen
        apiCall({
            action: "get_student_log",
            token: auth.token,
            data: {
              user_id: props.studentId,
              intervention_id: intervention.id
            }
          }).then(resp => {
            setLog(resp.log);
          });
    }, [props.studentId]);


    return (
        <div>
            <h2>log user #{props.studentId}</h2>
            <table className="table striped">
                <tr>
                    <th>#id</th>
                    <th>date/time</th>
                    <th>action</th>
                    <th>description</th>
                </tr>
                {
                    log.map((l, index) => (
                        <tr>
                            <td>{l.id}</td>
                            <td>{l.date_time_create}</td>
                            <td>{l.action}</td>
                            <td>{l.object}</td>
                        </tr>
                    ))
                }
            </table>
        </div>
    )
}

export default StudentDetailsLog;
