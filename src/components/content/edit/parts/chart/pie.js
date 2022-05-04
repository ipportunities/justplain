import React from 'react';
import { Pie } from 'react-chartjs-2';

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
              backgroundColor: ["#f50","#007bff", "#28a745", "#dc3545", "#ffc107", "#17a2b8", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
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
