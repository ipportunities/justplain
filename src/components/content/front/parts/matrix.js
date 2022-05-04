import React, { useState, useEffect } from "react";
import t from "../../../translate";
import parse from 'html-react-parser';

const Matrix = props => {

  const [valuesOn, setValuesOn] = useState(false);
  const [valuesOptions, setValuesOptions] = useState([]);
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(3);
  const [tableContent, setTableContent] = useState([]);
  const [chosenAnswers, setChosenAnswers] = useState([]); /// deze zijn gekozen radio checkbox

  useEffect(() => {
    if (typeof props.part.columns != "undefined" && props.part.columns != "") {
      setColumns(parseInt(props.part.columns));
    }
    if (typeof props.part.rows != "undefined" && props.part.rows != "") {
      setRows(parseInt(props.part.rows));
    }

    if (typeof props.part.tableContent != "undefined" && props.part.tableContent != "") {
      setTableContent(props.part.tableContent);
    }
    let chosenAnswersUpdated = [];

    for (let row_i = 1; row_i < props.part.rows; row_i++) {
      let answers = [];
      let chosenAnswersRowAnswers = [];
      if (props.answer != '') {
        //schonen van null...
        var propsanswer = props.answer.filter(function (el) {
          return el != null;
        });
        //
        let chosenAnswersRow = propsanswer.filter(function (answer) {
          return answer.id === props.part.tableContent[(row_i)][0].id
        });
        if (typeof chosenAnswersRow !== 'undefined' && chosenAnswersRow.length > 0 && typeof chosenAnswersRow[0].answers !== 'undefined')
        {
          chosenAnswersRowAnswers = chosenAnswersRow[0].answers;
        }
      }

      for (let i = 0; i < props.part.columns - 1; i++) {
        /// check if is niet checked
        if(props.answer != ''){
          answers[i] = chosenAnswersRowAnswers[i]
          //answers[i] = 0
        } else {
          answers[i] = 0;
        }
      }

      chosenAnswersUpdated[row_i] = {
        id:props.part.tableContent[(row_i)][0].id,
        answers:answers
      }
    }

    setChosenAnswers(chosenAnswersUpdated);

  }, [props]);

  //////////////////////
  ///Get TH
  function getTH() {
    const th = [];
    for (let i = 0; i < columns; i++) {
      th.push(<th key={'th_'+i}><span>{getTHContent(i)}</span></th>);
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
        parse(tdContent)
      );
    }
  }
  //////////////////////
  ///Get TD
  function getTD(row_i) {
    const td = [];
    for (let i = 0; i < columns; i++) {
      td.push(<td key={'td_'+i}>{getTDContent(row_i, i)}</td>);
    }
    return td;
  }
  //////////////////////
  ///Get TD content <= mmmmm
  function getTDContent(tr_i, td_i) {
    let trContent = typeof tableContent[tr_i] !== "undefined" ? tableContent[tr_i]:'';
    let tdContent = typeof trContent[td_i] !== "undefined" ? trContent[td_i].cell_content : "";

    let checked = false;

    if(chosenAnswers.length > 0){
      let chosenAnswersRow = chosenAnswers.filter(function (answer) {
        return answer.id === trContent[0].id
      });

      let chosenAnswersRowAnswers = chosenAnswersRow[0].answers
      checked = chosenAnswersRowAnswers[td_i - 1] == 1 ? true:false;
    }
    if(td_i == 0)
    {
      // vertaling aangepast zou nu goed moeten gaan
      if(typeof tdContent !== 'undefined'){
        return (
          parse(tdContent)
        );
      }
    } else {
      return (
        <table className="auto">
          <tbody>
            <tr>
            <td>
              <input type={props.part.subtype} checked={checked ? 'checked':''} /><label onClick={e=>toggleAnswer(td_i, trContent[0].id)}><span className="phone">{getTHContent(td_i)}</span></label>
            </td>
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
      tbody.push(<tr key={'tr_'+row_i}>{getTD(row_i)}</tr>);
    }
    return tbody;
  }


  /// TODO ID IS DENK IK TOCH WEL NODIG ZODAT JE LATER DE VOLGORDE VAN DE VRAGEN KAN WIJZIGEN ID PER ANTWOORD IS NIET ECHT NODIG DENK IK GEZIEN DE SCHAAL

  //////////////////////
  ///Toggle answer
  function toggleAnswer(td_i, id)
  {
    let chosenAnswersUpdated = chosenAnswers
    td_i = td_i - 1

    /// find answers row by id
    let chosenAnswersRow = chosenAnswersUpdated.filter(function (answer) {
      return answer.id === id
    });

    let chosenAnswersRowIndex = chosenAnswersUpdated.indexOf(chosenAnswersRow[0])

    let chosenAnswersRowAnswers = chosenAnswersRow[0].answers

    if(props.part.subtype == "radio"){
      for(let i= 0 ; i < chosenAnswersRowAnswers.length ; i++){
        chosenAnswersRowAnswers[i] = 0
      }
    }
    chosenAnswersRowAnswers[td_i] = chosenAnswersRowAnswers[td_i] == 0 ? 1:0;
    chosenAnswersUpdated[chosenAnswersRowIndex].answers = chosenAnswersRowAnswers

    setChosenAnswers(chosenAnswersUpdated)
    saveAnswers(chosenAnswersUpdated)
  }

  function saveAnswers(chosenAnswers){
    props.updateAnswer(props.part.id, chosenAnswers)
  }

  return (
    <div className={"special_table matrix" + (props.part.must ? ' must':'') + (props.disabled ? ' disabled':'')}>
      <div className="center">
        {
        props.part.question != "" ?
          <div className="question">
            {parse(props.part.question)} {props.part.must?"*":""}
          </div>
        : <></>
        }
        <table className={"columns_" + columns + (props.part.question == "" ? ' no_question':'')}>
          <thead>
            <tr>
              {getTH()}
            </tr>
            </thead>
          <tbody>{getTbodyContent()}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Matrix;
