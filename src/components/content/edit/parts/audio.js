import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChosenImage } from "../../../../actions";
import InputTextfield from './input_textfield.js';
import t from "../../../translate";

const Audio = (props) => {

  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //////////////////////
  ///Save file uit bieb is not empty alleen bij overeenkomstige id
  if (medialibrary.chosen_image != "" && medialibrary.index == props.index) {
    /// empty chosen image status
    dispatch(setChosenImage(""));
    props.updatePart(props.index, "file", medialibrary.chosen_image);
  }

  //////////////////////
  ///Show media library
  function showMediaLibrary(){
    props.showMediaLibrary(props.index, ['mp3']);
  }

  //////////////////////
  ///Delete File
  function deleteFile() {
    props.updatePart(props.index, "file", "");
  }

  return (
    <div className='audio file center'>
        <div className="question">
          <InputTextfield index={props.index} part={props.part} updatePart={props.updatePart} placeholder={"... "+t("hier de vraag")} must={props.must}/>
        </div>
        {(typeof props.part.file !== "undefined" &&  props.part.file != "") ?
          <div className='ImageHolderRelative'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <audio src={props.part.file} controls/>
                  </td>
                  <td>
                    <span className='actionsImage showOnHover'>
                      {props.part.file.split("/").pop()}
                      <span className='btn btn-primary  ' onClick={() => showMediaLibrary()}><i className="fas fa-pen"></i></span>
                      <span className='btn btn-danger ' onClick={() => deleteFile(props.part.index)}><i className="fa fa-trash"></i></span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        :
          <span className='btn btn-primary ' onClick={() => showMediaLibrary()}>{t("Selecteer audiobestand")} <i className="fa fa-image"></i></span>
        }
    </div>
  );
}

export default Audio;
