import React, {useState, useEffect} from "react";
import { useSelector } from 'react-redux';
import { stripTags } from '../../../utils/';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import $ from "jquery";

const Audio = (props) => {

  const url = useSelector(state => state.url);

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part.file != ""){
      if(document.getElementById('audio_' + props.index))
      {
        let audio = document.getElementById('audio_' + props.index);
        audio.onloadeddata = function() {
          setDuration(secondstotime(audio.duration))
          setCurrentTime(secondstotime(audio.currentTime))
        };
        audio.addEventListener('timeupdate', (event) => {
          setCurrentTime(secondstotime(audio.currentTime))
          getProgress()
        });

      }
    }
  }, []);

  function secondstotime(secs)
  {
      var t = new Date(1970,0,1);
      t.setSeconds(secs);
      var s = t.toTimeString().substr(0,8);
      if(secs > 86399)
          s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
      return s;
  }

  function getProgress(){
    let audio = document.getElementById('audio_' + props.index);
    if(audio){
      let tempProgress = (audio.currentTime/audio.duration) * 100
      setProgress(tempProgress)
    } else {
      /// misschien nog extra stoppen
    }
  }

  function pauze(){
    let audio = document.getElementById('audio_' + props.index);
    audio.pause();
    setPlaying(false)
  }
  function play(){
    let audio = document.getElementById('audio_' + props.index);
    audio.play();
    setPlaying(true)
    $('body').addClass('hideMenuMobile')
    //setFullscreen(true)
  }

  function closeFullscreen(){
    $('body').removeClass('hideMenuMobile')
    //setFullscreen(false)
    pauze()
  }

  return (
    <div className={'audio file ' + (props.part.question != "" ?'':' no_text') + (fullscreen ? ' fullscreen':'')}>
        {fullscreen ?
          <span onClick={() => closeFullscreen()}><i className="fas fa-chevron-left"></i></span>
        :''}
        <div className="contentAudio">
        {props.part.question != "" ?
          <div className="question">
            {stripTags(props.part.question)}
          </div>
          :''}
          {(typeof props.part.file !== "undefined" &&  props.part.file != "") ?
            <div className="audioHolder">
              <CircularProgressbar value={progress} text="" strokeWidth='4'/>

              {
                props.part.file.indexOf(url + "/uploads/intervention/") === -1 ?
                  <audio id={"audio_" + props.index} src={url + "/uploads/intervention/" + props.part.file} controls/>
                  :
                  <audio id={"audio_" + props.index} src={props.part.file} controls/>
              }

              <div className="customControls">
                {!playing ?
                  <span onClick={()=>play()}><i className="fas fa-play"></i></span>
                  :
                  <span onClick={()=>pauze()}><i className="fas fa-pause"></i></span>
                }
              </div>
              <div className="time">
                {currentTime} / {duration}
              </div>
            </div>
          :
            ''
          }
        </div>
    </div>
  );
}

export default Audio;
