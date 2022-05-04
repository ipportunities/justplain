import React from 'react';
import Typewriter from 'typewriter-effect';
import parse from 'html-react-parser';

const Speechballoon = (props) => {

  return(
    <div className="speech_balloon clearfix">
      <div className='image'>
        <img src={props.part.image} />
      </div>
      <div className="text">
      <Typewriter
        options={{
          strings: props.part.question,
          autoStart: true,
          loop: false,
          delay:40,
          deleteAll:false
        }}
        />
        <div className="dummy">{parse(props.part.question)}</div>
      </div>
    </div>
  )
}
export default Speechballoon
