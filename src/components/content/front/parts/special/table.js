import React, { useState, useEffect } from "react";
import parse from 'html-react-parser';

const Table = props => {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(4);
  const [tableContent, setTableContent] = useState([]);

  useEffect(() => {
    if (props.part.columns != "") {
      setColumns(props.part.columns);
    }
    if (props.part.rows != "") {
      setRows(props.part.rows);
    }
    if (props.part.tableContent != "") {
      //props.part.tableContent = [];
      setTableContent(props.part.tableContent);
    }
  }, [props]);

  //////////////////////
  ///Get TH
  function getTH() {
    const th = [];
    for (let i = 0; i < columns; i++) {
      th.push(<th index={"th_" + i}>{getTDContent(0, i)}</th>);
    }
    return th;
  }
  //////////////////////
  ///Get TD
  function getTD(row_i) {
    const td = [];
    for (let i = 0; i < columns; i++) {
      td.push(<td index={"td_" + i}>{getTDContent(row_i, i)}</td>);
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

    if(td_i == 0 || tr_i == 0)
    {
      return (
        <div className='td'>
          {parse(tdContent)}
        </div>
      );
    } else {
      return (
        <div className='td'>
          <div className="phone block">{getTHContent(td_i)}</div>
          {parse(tdContent)}
        </div>
      );
    }


  }
  //////////////////////
  ///Get TH content <= mmmmm
  function getTHContent(td_i){
    let trContent = typeof tableContent[0] !== "undefined" ? tableContent[0]:'';
    let tdContent = typeof trContent[td_i] !== "undefined" ? trContent[td_i] : "";
    if(td_i == 0)
    {
      return('')
    } else {
      return (
        parse(tdContent)
      );
    }
  }
  //////////////////////
  ///Get tbody content
  function getTbodyContent() {
    const tbody = [];
    for (let row_i = 1; row_i < rows; row_i++) {
      tbody.push(<tr index={"tr_" + row_i}>{getTD(row_i)}</tr>);
    }
    return tbody;
  }

  return (
    <div className="special_table">
      <table className={"columns_" + columns}>
        <thead>{getTH()}</thead>
        <tbody>{getTbodyContent()}</tbody>
      </table>
    </div>
  );
};
export default Table;
