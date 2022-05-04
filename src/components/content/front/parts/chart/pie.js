import React from 'react';
import { Pie } from 'react-chartjs-2';
import {appSettings} from "../../../../../custom/settings";

const ChartPie = (props) => {

  return (
      <div>
        <Pie
          data={
          {
            labels: props.labels,
            datasets: [{
              label: "data sety",
              data: props.values,
              fill: 'none',
              backgroundColor: appSettings.chart_color,
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
                position: 'right',
                labels: {
                  fontSize:20,
                    boxWidth: 20,
                    padding: 20
                }
            },
         tooltips: {
           enabled: true
        },
          maintainAspectRatio: false,

        }}
        />
    </div>
  );
}

export default ChartPie;
