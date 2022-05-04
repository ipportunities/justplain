import React from 'react';
import { Bar } from 'react-chartjs-2';

const ChartBar = (props) => {
  return (
      <div>
        <Bar
          data={
          {
            labels: props.labels,
            datasets: [{
              label: "",
              data: props.values,
              fill: 'none',
              backgroundColor: "#f50",
              pointRadius: 2,
              borderColor: "#eaeaea",
              borderWidth: 1,
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

export default ChartBar;
