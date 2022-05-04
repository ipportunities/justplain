import React from 'react';
import { Line } from 'react-chartjs-2';
import {appSettings} from "../../../../../custom/settings";

const ChartGraph = (props) => {

  return (
      <div className="canvas">
        <Line
          data={
          {
            labels: props.labels,
            datasets: [{
              label: "",
              data: props.values,
              fill: 'none',
              backgroundColor: appSettings.chart_color[0],
              pointRadius: 2,
              borderColor: appSettings.chart_color[0],
              borderWidth: 3,
              lineTension: 0
            }]}
        }
        width={100}
        height={500}
        options={{
          legend: {
            display: false
         },
         tooltips: {
           enabled: true
        },
          maintainAspectRatio: false,
          scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: typeof props.part.label_value !== "undefined" ? props.part.label_value : ''
                },
                  ticks: {
                      beginAtZero: true
                  }
              }],
              xAxes : [ {
                scaleLabel: {
                  display: true,
                  labelString: typeof props.part.label_items !== "undefined" ? props.part.label_items : ''

                },
              gridLines : {
                  display : false
              }
          } ]
          }
        }}
        />
    </div>
  );
}

export default ChartGraph;
