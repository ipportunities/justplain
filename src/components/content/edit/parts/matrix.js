import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import uuid from "uuid";
import InputTextfield from './input_textfield.js';
import t from "../../../translate";
import CodeSet from "./helpers/codeSet.js";
import {componentOptions} from "./helpers/options.js";

const Matrix = props => {

  const [valuesOn, setValuesOn] = useState(false);
  const [valuesOptions, setValuesOptions] = useState([]);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [tableContent, setTableContent] = useState([]);

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Matrix");
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  useEffect(() => {
    if (typeof props.part.columns != "undefined" && props.part.columns != "") {
      setColumns(props.part.columns);
    }
    if (typeof props.part.rows != "undefined" && props.part.rows != "") {
      setRows(props.part.rows);
    }
    if (typeof props.part.tableContent != "undefined" && props.part.tableContent != "") {
      //props.part.tableContent = [];
      //props.part.tableContent[0] = [];
      //props.part.tableContent[0][0] = '';
      setTableContent(props.part.tableContent);
    }
  }, []);

  //////////////////////
  ///Get TH
  function getTH() {
    const th = [];
    for (let i = 0; i < columns; i++) {
      th.push(<th>{getTHContent(i)}</th>);
    }
    return th;
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
        <ContentEditable
          html={tdContent}
          disabled={false}
          onChange={e => updateTableContent(e.target.value, 0, td_i)}
          className=""
          placeholder="Cell content"
        />
      );
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
    let tdContent = typeof trContent[td_i] !== "undefined" ? trContent[td_i].cell_content : "";

    if(td_i == 0)
    {
      return (
        <ContentEditable
        html={tdContent}
        disabled={false}
        onChange={e => updateTableContent(e.target.value, tr_i, td_i)}
        className=""
        placeholder="Cell content"
        />
      );
    } else {
      return (
        <table className={(valuesOn == true ? 'auto center':'')}>
          <tbody>
            <tr>
            <td>
              <input type={props.part.subtype}/>
              {props.part.subtype != "text" ?
                <label></label>
              :false}
            </td>
            {valuesOn == true ?
              <td>
                <div className="values">
                  <input type='text'
                     value={tdContent}
                     placeholder="Waarde"
                     onChange={(e) =>  updateTableContent(e.target.value, tr_i, td_i)}
                     />
                </div>
              </td>
              :false}

          </tr>
        </tbody>
      </table>)
    }
  }
  //////////////////////
  ///Get tbody content
  function getTbodyContent() {
    const tbody = [];
    for (let row_i = 1; row_i < rows; row_i++) {
      tbody.push(<tr>{getTD(row_i)}</tr>);
    }
    return tbody;
  }
  //////////////////////
  ///Update table settings
  function updateSettings(value, type) {
    props.updatePart(props.index, type, value);
    if (type == "columns") {
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
    if (type == "rows") {
      setRows(value);

      let newTableContent = tableContent;
      /// and also update table content anders blijven waardes wellicht staan dat is verwarrend
      if(rows > value)
      {
        newTableContent.splice(value, newTableContent.length)

        setTableContent(newTableContent);
        props.updatePart(props.index, "tableContent", newTableContent);
      } else {
        ///voeg iig id toe als die niet bestaat leeg item zorgt anders voor error
        if(typeof newTableContent[value - 1] === "undefined"){
          newTableContent[value - 1] = []
          newTableContent[value - 1].push({id:uuid.v4(), cell_content:""});

          setTableContent(newTableContent);
          props.updatePart(props.index, "tableContent", newTableContent);
        }
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

    if(row_id != 0){
      if(typeof newTableContent[row_id][td_id] === "undefined"){
        newTableContent[row_id][td_id] = {};
        newTableContent[row_id][td_id].id = uuid.v4();
      }

      newTableContent[row_id][td_id].cell_content = cell_content;
    } else {
      newTableContent[row_id][td_id] = cell_content;
    }

    setTableContent(newTableContent);
    props.updatePart(props.index, "tableContent", newTableContent);
  }

  console.log(tableContent);

  //////////////////////
  ///Toggle wrong right answer
  function toggleValueEdit(){
    let toggle = valuesOn ? false:true;
    setValuesOn(toggle)
  }

  return (
    <div className={"special_table matrix" + props.part.subtype}>
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{t(subtype.niceName)}</option>
        )}
      </select>
      <div className="center">


        <div className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must}/>
        </div>
        <table className={"columns_" + columns}>
          <thead>{getTH()}</thead>
          <tbody>{getTbodyContent()}</tbody>
        </table>
      </div>
      <div className="extraOptions showOnHover">
        <div className="settings">
          <i className="fas fa-table"></i>
          <input
            type="number"
            value={columns}
            onChange={e => updateSettings(e.target.value, "columns")}
            placeholder="Kolommen"
            min={(props.part.subtype == "text" ? 2:3)}
          />
          x
          <input
            type="number"
            value={rows}
            onChange={e => updateSettings(e.target.value, "rows")}
            placeholder="Rijen"
            min={2}
          />
        </div>
        <CodeSet updatePart={props.updatePart} index={props.index} part={props.part} />
        <span className={"btn grey" + (props.must == true ? ' active':' hide')} onClick={e=>props.toggleMust()} data-tip={t("Verplicht")}>
          <i className="fas fa-asterisk"></i>
        </span>
        <span className={"btn grey" + (valuesOn == true ? ' active':' hide')} onClick={e=>toggleValueEdit()} data-tip={t("Waardes antwoorden")}>
          <i className="fas fa-sort-numeric-up-alt"></i>
        </span>
      </div>
    </div>
  );
};
export default Matrix;
