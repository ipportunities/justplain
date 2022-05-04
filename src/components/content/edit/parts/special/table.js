import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import uuid from "uuid";

const Table = props => {

  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [tableContent, setTableContent] = useState([]);

  useEffect(() => {
    if (props.part.columns !== "") {
      setColumns(props.part.columns);
    }
    if (props.part.rows !== "") {
      setRows(props.part.rows);
    }
    if (props.part.tableContent !== "") {
      //props.part.tableContent = [];
      setTableContent(props.part.tableContent);
    }
  }, []);

  //////////////////////
  ///Get TH
  function getTH() {
    const th = [];
    for (let i = 0; i < columns; i++) {
      th.push(<th key={i}>{getTDContent(0, i)}</th>);
    }
    return th;
  }
  //////////////////////
  ///Get TD
  function getTD(row_i) {
    const td = [];
    for (let i = 0; i < columns; i++) {
      td.push(<td key={i}>{getTDContent(row_i, i)}</td>);
    }
    return td;
  }
  //////////////////////
  ///Get TD content <= mmmmm
  function getTDContent(tr_i, td_i) {
    let tdContent = "";
    if (tableContent.length > 0)
    {
      let trContent = (typeof tableContent[tr_i] !== "undefined" && tableContent[tr_i] !== null) ? tableContent[tr_i] : '';
      tdContent = (typeof trContent[td_i] !== "undefined" && trContent[td_i] !== null) ? trContent[td_i] : "";
    }

    return (
      <ContentEditable
        html={tdContent}
        disabled={false}
        onChange={e => updateTableContent(e.target.value, tr_i, td_i)}
        className=""
        placeholder="Cell content"
      />
    );
  }
  //////////////////////
  ///Get tbody content
  function getTbodyContent() {
    const tbody = [];
    for (let row_i = 1; row_i < rows; row_i++) {
      tbody.push(<tr key={row_i}>{getTD(row_i)}</tr>);
    }
    return tbody;
  }
  //////////////////////
  ///Update table settings
  function updateSettings(value, type) {
    props.updatePart(props.index, type, value);
    if (type === "columns") {
      setColumns(value);
      /// and also update table content anders blijven waardes wellicht staan dat is verwarrend
      if(columns > value)
      {
        let newTableContent = tableContent;
        for(let i = 0 ; i < tableContent.length ; i++)
        {
          newTableContent[i].splice(value, tableContent[i].length)
        }

        setTableContent(newTableContent);
        props.updatePart(props.index, "tableContent", newTableContent);
      }
    }
    if (type === "rows") {
      setRows(value);
      /// and also update table content anders blijven waardes wellicht staan dat is verwarrend
      if(rows > value)
      {
        let newTableContent = tableContent;
        newTableContent.splice(value, newTableContent.length)

        setTableContent(newTableContent);
        props.updatePart(props.index, "tableContent", newTableContent);
      }
    }

  }
  //////////////////////
  ///Update table content
  function updateTableContent(cell_content, row_id, td_id) {
    let newTableContent = tableContent;
    if (typeof newTableContent[row_id] === "undefined") {
      newTableContent[row_id] = [];
    }

    if(parseInt(row_id) !== 0){
      if(typeof newTableContent[row_id][td_id] === "undefined"){
        newTableContent[row_id][td_id] = {};
        newTableContent[row_id][td_id].id = uuid.v4();
      }

      newTableContent[row_id][td_id] = cell_content;
    } else {
      newTableContent[row_id][td_id] = cell_content;
    }


    setTableContent(newTableContent);
    props.updatePart(props.index, "tableContent", newTableContent);
  }

  return (
    <div className="special_table">
      <table className={"columns_" + columns}>
        <thead>
          <tr>
            {getTH()}
          </tr>
        </thead>
        <tbody>{getTbodyContent()}</tbody>
      </table>
      <div className="extraOptions">
        <div className="settings">
          <i className="fas fa-table"></i>
          <input
            type="number"
            value={columns}
            onChange={e => updateSettings(e.target.value, "columns")}
            placeholder="Kolommen"
            min={1}
          />
          x
          <input
            type="number"
            value={rows}
            onChange={e => updateSettings(e.target.value, "rows")}
            placeholder="Rijen"
            min={1}
          />
        </div>
      </div>
    </div>
  );
};
export default Table;
