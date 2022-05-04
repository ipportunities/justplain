import React from 'react';
import {componentOptions} from "./helpers/options.js";
import t from "../../../translate";
import EditorPart from './editor_part.js';

const Video = (props) => {

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Video");
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return (
    <div>
      <select className="subtypeChanger" onChange={(e) => props.updatePart(props.index, 'subtype', e.target.value)} value={props.part.subtype}>
        {available_subtypes.map((subtype, index) =>
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        )}
      </select>
      <div className={'center ' + (props.part.subtype)}>
        {props.part.subtype == "video rechts tekst links" ?
          <div className="video text">
            <EditorPart index={props.index} updatePart={props.updatePart} part_content={props.part.content} update_field='content' />
          </div>
        :false}
        <div className='video'>
          <div className={"embed " + (props.part.url == "" ? 'emtpy':'')}>
            <iframe src={props.part.url}></iframe>
            <div className="embedCode showOnHover">
              <input
                type="text"
                name={`part_${props.index}`}
                label=""
                placeholder="Embed url e.g. https://www.youtube.com/embed/8Bkwp0ZCsdfrdw"
                defaultValue={props.part.url}
                onChange={(e) => props.updatePart(props.index, 'url', e.target.value)}
                />
            </div>
          </div>
        </div>
        {props.part.subtype == "video links tekst rechts" ?
          <div className="video text">
            <EditorPart index={props.index} updatePart={props.updatePart} part_content={props.part.content} update_field='content' />
          </div>
        :false}
        {props.part.subtype == "twee videos naast elkaar" ?
          <div className='video'>
            <div className={"embed " + (props.part.url_two == "" ? 'emtpy':'')}>
              <iframe src={props.part.url_two}></iframe>
              <div className="embedCode showOnHover">
                <input
                  type="text"
                  name={`part_${props.index}`}
                  label=""
                  placeholder="Embed url e.g. https://www.youtube.com/embed/8Bkwp0ZCsdfrdw"
                  defaultValue={props.part.url_two}
                  onChange={(e) => props.updatePart(props.index, 'url_two', e.target.value)}
                  />
              </div>
            </div>
          </div>
        :false}
      </div>
    </div>
  );
}

export default Video;
