import React, {useState, useEffect} from 'react';
import Ranges from './ranges.js';

const ScoresAndFeedback = (props) => {

  const [range, setRange] = useState({rangeMin:0, rangeMax:0})
  const [feedback, setFeedback] = useState([])

  useEffect(() => {
    /// get min en max score
    if(typeof props.parts != "undefined"){
      let rangeMin = 0;
      let rangeMax = 0;
      let minScore;
      let maxScore;

      for(let i = 0 ; i < props.parts.length ; i++){

        minScore = false;
        maxScore = false;

        /// scores from radio and select
        if(props.parts[i].type == "question_radio" || props.parts[i].type == "select"){
          for(let ii = 0 ; ii < props.parts[i].items.length ; ii++){
            if(typeof props.parts[i].items[ii].value == "undefined" || !Number.isInteger(parseInt(props.parts[i].items[ii].value)) || props.parts[i].items[ii].value == "")
            {
              props.parts[i].items[ii].value = 0;
            }

            let this_value = parseInt(props.parts[i].items[ii].value)

            if(!maxScore){maxScore = this_value}
            if(this_value > maxScore){
              maxScore = this_value;
            }

            if(minScore === false){minScore = this_value}
            if(this_value < minScore){
              minScore = this_value;
            }

            /// als vraag niet verplicht is
            /// en de minScore is groter dan 0
            /// er hoeft geen keuze gemaakt te worden
            if(!props.parts[i].must && minScore > 0){
              minScore = 0;
            }
            /// is de minScore kleiner dan 0 laat deze staan iemand kiest deze wellicht
          }
        //// scores from checkboxes <= deze is wel wat lastiger
        } else if ( props.parts[i].type == "question_checkboxes" ) {

          let lowestScore = false;
          let scoreLowerThanZero = false;

          for(let ii = 0 ; ii < props.parts[i].items.length ; ii++){
            if(typeof props.parts[i].items[ii].value == "undefined" || !Number.isInteger(parseInt(props.parts[i].items[ii].value)))
            {
              props.parts[i].items[ii].value = 0;
            }

            let this_value = parseInt(props.parts[i].items[ii].value)

            /// !!!!!!!!!!!!!!!!!!!!!!!!
            ///wat als min en max op hoeveelheid selecteren....
            /// !!!!!!!!!!!!!!!!!!!!!!!!

            //Alles is te selecteren dus alles bijelkaar optellen voor de maxscore afgezien van de negatieve waardes
            maxScore = maxScore + this_value;

            /// vind de kleinste waarde die je kan kiezen
            if(lowestScore === false){lowestScore = this_value}
            if(this_value < lowestScore){
              lowestScore = this_value;
            }

            /// check of er min scores zijn zo ja dan bepalen zij de minScore
            if(this_value < 0){
              scoreLowerThanZero = true;
              minScore = minScore + this_value;
            }
          }
          /// geen negatieve score pak dan de kleinste die er is
          if(!scoreLowerThanZero){
            minScore = lowestScore
          }

          /// als vraag niet verplicht is
          /// en de minScore is groter dan 0
          /// er hoeft geen keuze gemaakt te worden
          if(!props.parts[i].must && minScore > 0){
            minScore = 0;
          }
        /// scores form matrix
        } else if(props.parts[i].type == "matrix"){
          let minScoreMatrixTable = 0;
          let maxScoreMatrixTable = 0;
          if(props.parts[i].subtype == "radio"){

            /// de values staan in de tablecontent
            /// per row nagaan wat de max en min score is
            /// sla eerste row over hier staan de headers in
            /// sla eerste waarde over deze hier staat de vraag
            for (let ii = 1; ii < props.parts[i].rows ; ii++) {
              let first = true
              minScore = 0;
              maxScore = 0;
              for (let iii = 1; iii < props.parts[i].columns; iii++)
              {
                let this_value = 0;
                if(typeof props.parts[i].tableContent[ii] != "undefined" && Number.isInteger(parseInt(props.parts[i].tableContent[ii][iii])))
                {
                  this_value = parseInt(props.parts[i].tableContent[ii][iii])
                }

                if(first){maxScore = this_value}
                if(this_value > maxScore){
                  maxScore = this_value;
                }

                if(first){
                  minScore = this_value
                }

                if(this_value < minScore){
                  minScore = this_value;
                }

                first = false

                /// als vraag niet verplicht is
                /// en de minScore is groter dan 0
                /// er hoeft geen keuze gemaakt te worden
                if(!props.parts[i].must && minScore > 0){
                  minScore = 0;
                }
                /// is de minScore kleiner dan 0 laat deze staan iemand kiest deze wellicht
              }
              minScoreMatrixTable = minScore + minScoreMatrixTable
              maxScoreMatrixTable = maxScore + maxScoreMatrixTable
            }

            minScore = minScoreMatrixTable
            maxScore = maxScoreMatrixTable
          }
          if(props.parts[i].subtype == "checkbox"){

            /// de values staan in de tablecontent
            /// per row nagaan wat de max en min score is
            /// sla eerste row over hier staan de headers in
            /// sla eerste waarde over deze hier staat de vraag
            for (let ii = 1; ii < props.parts[i].rows ; ii++) {
              let first = true
              let lowestScore = 0;
              let scoreLowerThanZero = false;
              minScore = 0;
              maxScore = 0;
              for (let iii = 1; iii < props.parts[i].columns; iii++)
              {
                let this_value = 0;
                if(typeof props.parts[i].tableContent[ii] != "undefined" && Number.isInteger(parseInt(props.parts[i].tableContent[ii][iii])))
                {
                  this_value = parseInt(props.parts[i].tableContent[ii][iii])
                }

                /// !!!!!!!!!!!!!!!!!!!!!!!!
                ///wat als min en max op hoeveelheid selecteren....
                /// !!!!!!!!!!!!!!!!!!!!!!!!

                //Alles is te selecteren dus alles bijelkaar optellen voor de maxscore afgezien van de negatieve waardes
                if(this_value > 0)
                {
                  maxScore = maxScore + this_value;
                }


                /// vind de kleinste waarde die je kan kiezen
                if(first){lowestScore = this_value}
                if(this_value < lowestScore){
                  lowestScore = this_value;
                }

                /// check of er min scores zijn zo ja dan bepalen zij de minScore
                if(this_value <= 0){
                  scoreLowerThanZero = true;
                  minScore = minScore + this_value;
                }

                first = false

              }
              /// geen negatieve score pak dan de kleinste die er is
              if(!scoreLowerThanZero){
                minScore = lowestScore
              }

              /// als vraag niet verplicht is
              /// en de minScore is groter dan 0
              /// er hoeft geen keuze gemaakt te worden
              if(!props.parts[i].must && minScore > 0){
                minScore = 0;
              }

              minScoreMatrixTable = minScore + minScoreMatrixTable
              maxScoreMatrixTable = maxScore + maxScoreMatrixTable
            }

          }
          minScore = minScoreMatrixTable
          maxScore = maxScoreMatrixTable
        }

        rangeMin = minScore + rangeMin;
        rangeMax = maxScore + rangeMax;
      }

      setRange({rangeMin:rangeMin, rangeMax:rangeMax})
    }
  }, [props.parts]);

  function toggleEditScoresAndFeedback(){
    let toggle = range ? false:true;
    setRange(toggle)
  }

  return (
    <div className="center questionnaireFeedback">
      <div className={"content" + (range ? '':' hide')}>
        <Ranges
          range={range}
          ranges={props.ranges}
          setStateHandler={props.setStateHandler}
          showMediaLibrary={props.showMediaLibrary} />
      </div>
    </div>
  )
}
export default ScoresAndFeedback
