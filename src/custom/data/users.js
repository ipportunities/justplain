import React from 'react';
import t from "../../components/translate";
import apiCall from "../../components/api";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";

const CustomDataUsers = (props) => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const downloadUserActivityCSV = (intervention_id, type) => {
    apiCall({
      action: "get_user_activity_" + type + "_csv",
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

      download(csvContent, intervention.title+'_user_activity_' + type + '_' + moment().format("DD-MM-YYYY HH:mm:ss", { trim: false }) + '.csv', 'text/csv;encoding:utf-8');

    });
  }

  return(
    <>
      <div className="download_options">
        <div className="download_option">
          {t("Activiteit reguliere deelnemers")}
          <span className='btn btn-primary download' onClick={()=>downloadUserActivityCSV(intervention.id, 'regular')}>
            {t("csv")} <i className="fas fa-download"></i>
          </span>
        </div>
      </div>

      <div className="download_options">
        <div className="download_option">
          {t("Activiteit Sinai deelnemers")}
          <span className='btn btn-primary download' onClick={()=>downloadUserActivityCSV(intervention.id, 'sinai')}>
            {t("csv")} <i className="fas fa-download"></i>
          </span>
        </div>
      </div>
    </>
  )
}
export default CustomDataUsers
