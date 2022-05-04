import React   from 'react';
import InputTextfield from './input_textfield.js';
import EditorPart from './editor_part.js';
import {componentOptions} from "./helpers/options.js";
import AddImage from "./helpers/addImage";
import { setChosenImage } from "../../../../actions";
import { useSelector, useDispatch } from 'react-redux';
import t from "../../../translate";

const Wysiswg = (props) => {

  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function (option) {
    return (option.title === "Tekst");
  });
  const available_subtypes = this_componentOptions[0].subtypes;
  const heading_text = "";

  const url = useSelector(state => state.url);
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == props.index)
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    props.updatePart(props.index, 'image', url + "/uploads/intervention/" + medialibrary.chosen_image)
  }

  //////////////////////
  ///Delete image
  //////////////////////
  function deleteImage(){
    props.updatePart(props.index, 'image', '')
  }

  //////////////////////
  ///Build heading
  function heading(){
    return (
      <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder="Koptekst" className='header input_no_bg'/>
    );
  }

  //////////////////////
  ///Build paragraaf
  function paragraph(part_content, update_field){
    return (
      <EditorPart index={props.index} updatePart={props.updatePart} part_content={part_content} update_field={update_field} />
    );
  }

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
      <div className={"center text " + props.part.subtype}>
        {props.part.subtype == "koptekst" || props.part.subtype == "paragraaf met koptekst" ? heading():''}
        {props.part.subtype == "paragraaf" || props.part.subtype == "paragraaf met koptekst" || props.part.subtype == "omkaderd tekstblok" ? paragraph(props.part.content, 'content'):''}

        {props.part.subtype == "met afbeelding links" || props.part.subtype == "met afbeelding rechts" || props.part.subtype == "met afbeelding rechts kwart" || props.part.subtype == "met afbeelding links kwart" ?
          <div className="with_image clearfix">
            <AddImage image={typeof props.part.image !== 'undefined'?props.part.image:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={deleteImage} />
            <div className='text'>
              {paragraph(props.part.content, 'content')}
            </div>
          </div>
        :''}

        {props.part.subtype == "twee kolommen" ?
          <div className="columns grid-2 clearfix">
            <div className='column'>
              {paragraph(props.part.content, 'content')}
            </div>
            <div className='column'>
              {paragraph(props.part.content2, 'content2')}
            </div>
          </div>
        :''}
      </div>
    </div>
  );
}

export default Wysiswg;
