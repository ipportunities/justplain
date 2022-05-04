import React, {useState, useEffect} from "react";
import Confetti from 'react-confetti'
import t from "../../translate";
import $ from "jquery";
import {appSettings} from "../../../custom/settings";

let animateTimeout = false;
let unloadTimeout = false;

const ConfettiFullScreen = (props) =>{
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [showConfetti, setShowConfetti] = useState(false);
  const [load, setLoad] = useState(true);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  function resize(){
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  const [animated, setAnimated]= useState(false)

  if(!animated){
    clearTimeout(animateTimeout);
    animateTimeout = setTimeout(() => {
      setAnimated(true)
    }, 2000)
  }


  useEffect(() => {
    window.addEventListener("resize", resize);

    setShowConfetti('true')
    $("body").addClass('shake')
  }, [props]);

  function turnOff(){
    $("body").removeClass('shake')
    setShowConfetti(false)

    clearTimeout(unloadTimeout);
    unloadTimeout = setTimeout(() => {
      setLoad(false)
      props.setEndCourse(false)
    }, 500)
  }

  return(
    <div>
      {load ?
        <div className={"confettiHolder" + (showConfetti ? ' show':' fadeOut')}>
          <Confetti
              width={width}
              height={height}
              recycle={showConfetti}
            />
          <div className={"confettiOverlay" + (animated ? '':' animate')}></div>
          <div className={'popup' + (animated ? '':' animate')}>
            <h2>{t('Je hebt de ' + appSettings.interventieName.toLowerCase()+' afgerond,')}</h2>
            <h1>{t('goed gedaan!')}</h1>
            <div>
              {t('Waarom niet even genieten van de confetti, voordat je')}
            </div>
            <span className='btn btn-primary' onClick={()=>turnOff()}>
              {t('de confetti uitzetten')}
            </span>
          </div>
        </div>
      :
        ''
      }
    </div>
  )
}

export default ConfettiFullScreen;
