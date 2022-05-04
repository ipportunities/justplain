import React, {useState, useEffect} from 'react';
import {componentOptions} from "./helpers/options.js";
import ChartBar from './chart/bar.js';
import ChartPie from './chart/pie.js';
import ChartGraph from './chart/graph.js';
import SetChartData from './chart/setchartdata.js';
import InputTextfield from './input_textfield.js';
import t from "../../../translate";

const Chart = (props) => {

  const [items, setITems] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part.items != ""){
      setData()
      setITems(props.part.items)
    }
  }, []);

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Charts");
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  //////////////////////
  ///Open close set chart data
  const [showEditChartData, setShowEditChartData] = useState("false");

  function editChartContent(){setShowEditChartData("true");}
  function closeChartEditContent(){setShowEditChartData("false");}

  function setData(){
    let tempLabels = [];
    let tempValues = [];
    for(let i = 0 ; i <  props.part.items.length ; i++)
    {
      tempLabels.push(props.part.items[i].content);
      tempValues.push(parseInt(props.part.items[i].value));
    }
    setValues(tempValues);
    setLabels(tempLabels);
  }

  function getChart()
  {
    var dynamicContent = "";
    switch(props.part.subtype) {
      case "staafdiagram":
        dynamicContent = <ChartBar labels={labels} values={values} part={props.part} />;
      break;
      case "grafiek":
        dynamicContent = <ChartGraph labels={labels} values={values} part={props.part} />;
      break;
      case "cirkeldiagram":
        dynamicContent = <ChartPie labels={labels} values={values} part={props.part} />;
      break;
    }

    return dynamicContent;
  }

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return (
    <div className="chart">
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>
      <div className={"holder center" + (showEditChartData == "true" ? " edit":"")}>
        <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Naam chart" className="koptekst"/>

        {getChart()}

        <SetChartData items={items} index={props.index} part={props.part} updatePart={props.updatePart} closeChartEditContent={closeChartEditContent} setITems={setITems} setData={setData}/>
      </div>
      <span className="add btn btn-primary showOnHover" onClick={(e) => editChartContent()} > Edit {props.part.subtype} <i className="fa fa-pen"></i></span>
    </div>
  );
}

export default Chart;
