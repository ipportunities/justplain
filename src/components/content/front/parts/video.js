import React from 'react';
import parse from 'html-react-parser';

const Video = (props) => {
  return (
    <div className={'center ' + (props.part.subtype)}>
      {props.part.subtype == "video rechts tekst links" ?
        <div className="text video">
          {parse(props.part.content)}
        </div>
      :false}
      <div className="video">
        <div className={"embed " + (props.part.url == "" ? 'emtpy':'')}>
          <iframe src={props.part.url}></iframe>
        </div>
      </div>
      {props.part.subtype == "video links tekst rechts" ?
        <div className="text video">
          {parse(props.part.content)}
        </div>
      :false}
      {props.part.subtype == "twee videos naast elkaar" ?
        <div className="video">
          <div className={"embed " + (props.part.url_two == "" ? 'emtpy':'')}>
            <iframe src={props.part.url_two}></iframe>
          </div>
        </div>
      :false}
    </div>
  );
}

export default Video;
