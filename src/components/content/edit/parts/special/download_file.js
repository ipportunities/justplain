import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChosenImage } from "../../../../../actions";
import AddFile from "../helpers/addFile";

const DownloadFile = props => {
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //////////////////////
  ///Save if chosen file uit bieb is not empty alleen bij overeenkomstige id
  if (medialibrary.chosen_image != "" && medialibrary.index == props.index) {
    /// empty chosen image status
    dispatch(setChosenImage(""));
    props.updatePart(props.index, "file", medialibrary.chosen_image);
  }


  return (
    <div className="download_file">
      <AddFile
        file={
          typeof props.part.file != "undefined" && props.part.file != ""
            ? props.part.file
            : ""
        }
        showMediaLibrary={props.showMediaLibrary}
        index={props.index}
        updatePart={props.updatePart}
        part={props.part}
      />
    </div>
  );
};
export default DownloadFile;
