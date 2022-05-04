import React, { useState, useEffect } from "react";
import parse from 'html-react-parser';

const Matrix = props => {

  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
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
    for (let i = 1; i <= columns; i++) {
      th.push(<th>{getTHContent(i)}</th>);
    }
    return th;
  }
  //////////////////////
  ///Get TH content <= mmmmm
  function getTHContent(td_i){
    let trContent = typeof tableContent[0] !== "undefined" ? tableContent[0]:'';
    let tdContent = typeof trContent[td_i] !== "undefined" ? trContent[td_i] : "";

    if(td_i != 1)
    {
      return (
        <div>
          {parse(tdContent)}
        </div>
      );
    } else {
      return ('')
    }
  }
  //////////////////////
  ///Get TD
  function getTD(row_i) {
    const td = [];
    for (let i = 0; i < columns; i++) {
      td.push(<td>{getTDContent(row_i, i)}</td>);
    }
    return td;
  }
  //////////////////////
  ///Get TD content <= mmmmm
  function getTDContent(tr_i, td_i) {
    let trContent = typeof tableContent[tr_i] !== "undefined" ? tableContent[tr_i]:'';
    let tdContent = typeof trContent[td_i] !== "undefined" ? trContent[td_i] : "";

    if(td_i == 0)
    {
      return (
        <div>
          {parse(tdContent)}
        </div>
      );
    } else {
      return (<div><input type="radio"/><label></label></div>)
    }


  }
  //////////////////////
  ///Get tbody content
  function getTbodyContent() {
    const tbody = [];
    for (let row_i = 0; row_i < rows; row_i++) {
      tbody.push(<tr>{getTD(row_i)}</tr>);
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
export default Matrix;
