import React, { useState } from 'react'
import ContentEditable from 'react-contenteditable'
import AddImage from "./helpers/addImage";
import { setChosenImage } from "../../../../actions";
import { useSelector, useDispatch } from 'react-redux';
import t from "../../../translate";

const Title = (props) => {

  function keyDown(e){
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

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
    props.setStateHandler({image: url + "/uploads/intervention/" + medialibrary.chosen_image})
  }

  //////////////////////
  ///Delete image
  //////////////////////
  function deleteImage(){
    props.setStateHandler({image: ''})
  }

  return (
    <div className="center setTitle">
      <table>
        <tbody>
          <tr>
            <td>
            <div className="titleHolder">
                <textarea
                  id="title"
                  value={props.title} // innerHTML of the editable div
                  disabled={false}       // use true to disable editing
                  onChange={(e) => props.updateTitle({title: e.target.value})} // handle innerHTML change
                  placeholder={t("Zet hier de titel")}
                  onKeyDown={(e) => keyDown(e)}
                  maxLength="100"
                  className="input_no_bg center"
                  >
                </textarea>
                <div className="dummy">
                  {props.title}
                </div>
              </div>
            </td>
            {props.type != 'questionnaire' ?
              <td>
                <AddImage image={typeof props.image !== 'undefined'?props.image:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={deleteImage} />
              </td>
              : <td></td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default Title;
