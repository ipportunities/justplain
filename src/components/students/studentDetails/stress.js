import React, { useState, useEffect } from "react";
import t from "../../translate";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import apiCall from "../../api";

const StudentDetailsStress = props => {

  const [chosenValues, setChosenValues] = useState([]);
  const [chosenDates, setChosenDates] = useState([]);
  const [chosen, setChosen] = useState(false)
  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  useEffect(() => {
    /// get chosen values from server and set in chosenvalues en dates
    apiCall({
      action: "get_stress",
      token: auth.token,
      data: {
        intervention_id: parseInt(intervention.id),
        student_id: parseInt(props.studentId)
      }
    }).then(resp => {
      if (resp.content) {
        setChosenValues(resp.content[0].values);
        setChosenDates(resp.content[0].dates);
      } else {
        setChosenValues([]);
        setChosenDates([]);
      }
    });

  }, [props.studentId]);

  return (
    <div id="holderGraph">
       <div className='holderGraph'>
        {chosenValues.length > 0 ?
          <div>
            <h2>{t("Stressniveaus van de afgelopen 30 dagen")}</h2>
            <div className='imageScale'>
              <div>
                <img src={require('../../../images/course/standard/stress_5.png')}/>
              </div>
              <div>
                <img src={require('../../../images/course/standard/stress_4.png')}/>
              </div>
              <div>
                <img src={require('../../../images/course/standard/stress_3.png')}/>
              </div>
              <div>
                <img src={require('../../../images/course/standard/stress_2.png')}/>
              </div>
              <div>
                <img src={require('../../../images/course/standard/stress_1.png')}/>
              </div>
            </div>
            <div className="graph">
              <div className='borders'>
                <div className='border'></div>
                <div className='border'></div>
                <div className='border'></div>
                <div className='border'></div>
                <div className='border'></div>
              </div>

              <div>
              <Line
                data={{
                  labels: chosenDates,
                  datasets: [
                    {
                      label: "",
                      data: chosenValues,
                      fill: true,
                      backgroundColor: "#F6CDA0",
                      pointRadius: 8,
                      borderColor: "#F6CDA0",
                      pointBackgroundColor: "#fff",
                      borderWidth: 1,
                      lineTension: 0
                    }
                  ]
                }}
                width={100}
                height={400}
                options={{
                  legend: {
                    display: false
                  },
                  tooltips: {
                    enabled: true
                  },
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        scaleLabel: {
                          display: false,
                          labelString: 1
                        },
                        ticks: {
                          display: false,
                          beginAtZero: true,
                          max: 4.25,
                          min: 0,
                          stepSize: 1
                        },
                        gridLines: {
                          display: false,
                          drawBorder: false,
                          showBorder:false
                        }
                      }
                    ],
                    xAxes: [
                      {
                        scaleLabel: {
                          display: false,
                          labelString: 2
                        },
                        ticks: {
                          display: false,

                        },
                        gridLines: {
                          display: false,
                        }
                      }
                    ]
                  }
                }}
              />
              </div>
            </div>
          </div>
          :
          <div className="empty">
            <h3>{t("Nog geen data")}</h3>
            {t("Na het invullen van de stressmeter verschijnt hier de grafiek met het ingevulde.")}
          </div>
          }
        </div>
      </div>
  );
};

export default StudentDetailsStress;
