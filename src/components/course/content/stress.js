import React, { useState, useEffect } from "react";
import t from "../../translate";
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import Typewriter from 'typewriter-effect';
import parse from 'html-react-parser';
import $ from "jquery";
import {appSettings} from "../../../custom/settings";

const Stress = () => {

  const [chosenValues, setChosenValues] = useState([]);
  const [chosenDates, setChosenDates] = useState([]);
  const [chosen, setChosen] = useState(false)

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);
  const activeIntervention = useSelector(state => state.activeIntervention);

  useEffect(() => {
    /// get chosen values from server and set in chosenvalues en dates
    if (activeIntervention > 0) {
      apiCall({
        action: "get_stress",
        token: auth.token,
        data: {
          intervention_id: parseInt(activeIntervention)
        }
      }).then(resp => {
        if (resp.error == 0 && resp.content) {
          setChosenValues(resp.content[0].values);
          setChosenDates(resp.content[0].dates);
          resizeLineGraph() // extra aanroep resize hopelijk zorgt dit voor de juiste vormgeving op mobiel
        }
      });
    }
    ///6-10-2021 fix animate scroll werkte door van chat
    $("html, body").stop().animate({ scrollTop: 0 }, "fast");
    window.addEventListener('resize', resizeLineGraph)
    resizeLineGraph()
  }, []);

  const [heightGraph, setHeightGraph] = useState(500)

  function resizeLineGraph(){
    if($("#holderGraph").length != 0){
      if($(window).width() > 768){
        setHeightGraph(500)
      } else {
        setHeightGraph(250)
      }
    }
  }

  const addValue = (value) => {
    let updateChosenValues = [...chosenValues];
    updateChosenValues.push(value);
    setChosenValues(updateChosenValues);

    let updateChosenDates = [...chosenDates];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    updateChosenDates.push(today);
    setChosenDates(updateChosenDates);

    setChosen(value)

    ///saven /// met de refcode?!
    saveStressContent(updateChosenValues, updateChosenDates);
  }

  const saveStressContent = (updateChosenValues, updateChosenDates) => {
    apiCall({
      action: "save_stress",
      token: auth.token,
      data: {
        intervention_id: parseInt(activeIntervention),
        content: [{ values: updateChosenValues, dates: updateChosenDates }]
      }
    }).then(resp => {

      if (resp.error == 0) {
      }
    });
  }

  const change = () => {
    let updateChosenValues = [...chosenValues];
    updateChosenValues.pop()
    setChosenValues(updateChosenValues);

    let updateChosenDates = [...chosenDates];
    updateChosenDates.pop()
    setChosenDates(updateChosenDates);

    saveStressContent(updateChosenValues, updateChosenDates);
    setChosen(false)
  }

  return (
    <div className="stress">
      <h1 id="typed_1" className="big"><Typewriter options={{delay:40}}
      onInit={(typewriter) => {
        typewriter.typeString(typeof appSettings.titleStress != "undefined" && appSettings.titleStress != '' ? t(appSettings.titleStress):t("Jouw stemming"))
          .callFunction(() => {
            if(document.getElementById("typed_1")){
                document.getElementById("typed_1").className = "finished big"
            }
            if(document.getElementById("options")){
                document.getElementById("options").className = "show"
            }
            //document.getElementById("holderGraph").className = "show"
          })
          //.pauseFor(2500)
          //.deleteAll()
          .start();
      }}
      /></h1>

      {typeof intervention.settings.stressIntro != 'undefined' &&  intervention.settings.stressIntro != '' ?
        <div className="intro">
          {parse(intervention.settings.stressIntro)}
        </div>
      :''}

      {!chosen && chosen !== 0 ?
        <div className="choose">
          <h1>{typeof appSettings.questionStress != "undefined" && appSettings.questionStress != '' ? t(appSettings.questionStress):t("Hoe voel je je?")}</h1>
          <div id="options" className="show">
            <img src={require('../../../images/course/standard/stress_1.png')} onClick={e => addValue(0)}/>
            <img src={require('../../../images/course/standard/stress_2.png')} onClick={e => addValue(1)}/>
            <img src={require('../../../images/course/standard/stress_3.png')} onClick={e => addValue(2)}/>
            <img src={require('../../../images/course/standard/stress_4.png')} onClick={e => addValue(3)}/>
            <img src={require('../../../images/course/standard/stress_5.png')} onClick={e => addValue(4)}/>
          </div>
        </div>
        :
        <div className='choose'>
          <table>
            <tbody>
              <tr>
                <td>
                  <h1 id="typed_2"><Typewriter
                  onInit={(typewriter) => {
                    typewriter.typeString((typeof appSettings.filledInStress != "undefined" && appSettings.filledInStress != '' ? t(appSettings.filledInStress):t("Ik voelde me net")))
                      .callFunction(() => {
                        document.getElementById("typed_2").className = "finished"
                        document.getElementById("felt").className = "show"
                        document.getElementById("change").className = "show"
                      })
                      .changeDelay(50)
                      //.pauseFor(2500)
                      //.deleteAll()
                      .start();
                  }}
                  /></h1>
                </td>
                <td id="felt">
                  <img src={require('../../../images/course/standard/stress_'+(chosen + 1)+'.png')}/>
                </td>
                <td id="change">
                  <span className='btn' onClick={()=>change()}>
                    {t("Wijzig")}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      }
      {chosenValues.length > 0 ?
        <div id='holderGraph' className="show">
          <div className='holderGraph'>
            <h1>{typeof appSettings.graphStress != "undefined" ? t(appSettings.graphStress):t("Je stemming van de afgelopen 30 dagen")}</h1>
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

              <div style={{height:heightGraph}}>
              <Line
                data={{
                  labels: chosenDates,
                  datasets: [
                    {
                      label: "",
                      data: chosenValues,
                      fill: true,
                      backgroundColor: appSettings.stress_graph_color,
                      pointRadius: 8,
                      borderColor: appSettings.stress_graph_color,
                      pointBackgroundColor: "#fff",
                      borderWidth: 1,
                      lineTension: 0
                    }
                  ]
                }}
                width={100}
                options={{
                  legend: {
                    display: false
                  },
                  tooltips: {
                    enabled: true
                  },
                  responsive: true,
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
            <div className="gradientEffect"></div>
          </div>
        </div>
        :''}
    </div>
  );
};

export default Stress;
