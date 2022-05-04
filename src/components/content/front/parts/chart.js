import React, {useState, useEffect} from 'react';
import ChartBar from './chart/bar.js';
import ChartPie from './chart/pie.js';
import ChartGraph from './chart/graph.js';
import parse from 'html-react-parser';

const Chart = (props) => {

  const [items, setITems] = useState([]);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part.items !== "") {
      setData();
      setITems(props.part.items);
    }
  }, []);


  const setData = () => {
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

  return (
    <div className={"chart " + props.part.subtype}>
      <div className={"holder center"}>
        <div className="koptekst">
          {parse(props.part.question)}
        </div>
        {getChart()}
      </div>
    </div>
  );
}

export default Chart;
