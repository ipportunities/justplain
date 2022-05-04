import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import t from "../../translate";
import parse from "html-react-parser";
import apiCall from "../../api";
import { transformDate } from "../../utils";
import $ from "jquery";

const  StudentDetailsJournal = props => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);
    const [student, setStudent] = useState({
    });
    const [journalItemsSet, setJournalItemsSet] = useState(false);
    const [journalItems, setJournalItems] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        //student info ophalen
        apiCall({
            action: "get_student",
            token: auth.token,
            data: {
              user_id: props.studentId,
              intervention_id: intervention.id
            }
          }).then(resp => {
            setStudent(resp.user);
          });
        //chatdata ophalen
        if (intervention.id > 0) {
          apiCall({
            action: "get_journal",
            token: auth.token,
            data: {
              intervention_id: parseInt(intervention.id),
              student_id: parseInt(props.studentId)
            }
          }).then(resp => {
            if (resp.content) {
                setJournalItemsSet(true)
                setJournalItems(resp.content);
              }
          });
        }
    }, [props.studentId]);

    return (
        <div className="journal">
        {journalItemsSet && journalItems.length == 0 ?
            <div className="empty">
                <h3>{t("Nog geen items geplaatst")}</h3>
                    {t("Indien berichten zijn geplaatst vindt u deze hier terug.")}
                </div>
            :<></>}
          <div className="journal_items">
          <div className='items'>
            {
              journalItems.map((item, index) => (
                  <div key={index} className="item">
                    <table>
                      <tbody>
                        <tr className="dateTime">
                          <td>
                            <i className="fas fa-calendar-week"></i>
                            {moment(item.dateTime).format("LL")}
                          </td>
                          <td>
                            <i className="far fa-clock" ></i>
                            {moment(item.dateTime).format("LT")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {parse(item.content)}
                  </div>
              ))
            }
          </div>
          </div>
        </div>
      )
}

export default StudentDetailsJournal;
