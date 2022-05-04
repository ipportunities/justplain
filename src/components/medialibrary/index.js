import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import t from "../translate";
import { getClone } from "../utils";
import { setChosenImage } from "../../actions";

const MediaLibrary = props => {
  //////////////////////
  ///Constantes
  const [state, setState] = useState({
    images: []
  });
  const appUrl = useSelector(state => state.url);
  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const medialibrary = useSelector(state => state.mediaLibrary);

  const [copied, setCopied] = useState(-1);

  /////////////////////////////////////////////
  ///////Data handling with server
  ////////////////////////////////////////////

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.mediaLibraryVisible == "show")
    {
      getImages();  // TODO nu maakt die elke keer verbinding... misschien 1 keer genoeg en dan filteren in js
    }

  }, [props]);

  //////////////////////
  ///Load content urls from server
  function getImages() {
    let apiMsg = {
      action: "get_all_images",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        filterTypes: props.filterTypes
      }
    };

    apiCall(apiMsg).then(resp => {
      if (false !== resp) {
        if (resp.images) {
          setState({images:resp.images});
        }
      }
    });
  }

  //////////////////////
  ///Upload image to server
  function uploadImage(uploadedFiles) {
    let promises = [];
    let files = [];
    Array.from(uploadedFiles).forEach(uploadFile => {
      let filePromise = new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onload = e => {
          let file = {};
          file.type = uploadFile.type;
          file.name = uploadFile.name;
          file.size = uploadFile.size;
          file.content = e.target.result;
          files.push(file);
          resolve(true);
        };
      });
      promises.push(filePromise);
    });
    Promise.all(promises).then(fileContents => {
      let apiObj = {
        action: "upload_image",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          files: files
        }
      };

      apiCall(apiObj).then(resp => {
        if (resp) {
          let newState = getClone(state);
          resp.urls.forEach(url => {
            newState.images.push(url);
          });
          setState(newState);
        }
      });
    });
  }

  //////////////////////
  ///Delete image from server
  function deleteImage(e, name, index) {
    e.stopPropagation();

    let apiMsg = {
      action: "delete_image",
      token: auth.token,
      data: {
        name,
        index,
        intervention_id: intervention.id
      }
    };

    apiCall(apiMsg).then(resp => {
      if (false !== resp) {
        if (resp.name) {
          let newState = getClone(state);
          newState.images = newState.images.filter(function(image) {
            return image != name;
          });
          setState(newState);
        }
      }
    });
  }

  ////////////////////////////////////////////
  /////////Select action <= store in redux store => empty after action
  ///////////////////////////////////////////
  function selectImage(image) {
    ///set chosen image on hide
    hideMediaLibrary(image);
  }

  ////////////////////////////////////////////
  /////////Hide mediaLibrary
  ///////////////////////////////////////////
  function hideMediaLibrary(image) {
    document.getElementsByTagName('html')[0].style.overflow = "unset";
    props.setMediaLibraryVisible("hide");
    setState({images:[]});

    if (image) {
      image = intervention.id + "/" + image;

      /// place in redux store
      dispatch(setChosenImage(image, medialibrary.index));
    }
  }

  ////////////////////////////////////////////
  /////////Image action
  ///////////////////////////////////////////
  let inputFileRef = React.createRef();
  function triggerInputFile() {
    inputFileRef.current.click();
  }

  ////////////////////////////////////////////
  /////////Copy link
  ///////////////////////////////////////////
  function copyLink(upload, index) {
    let link = appUrl + "/uploads/intervention/" + intervention.id + "/" + encodeURI(upload);

    navigator.clipboard.writeText(link);

    setCopied(index);
  }
  function removeCopied(index){
    if(index == copied){
      setCopied(-1);
    }
  }

  ////////////////////////////////////////////
  /////////Get file
  ///////////////////////////////////////////
  function getFile(upload, index){
    var ext = upload.substr(upload.lastIndexOf('.') + 1);

    if(ext.toLowerCase() == "mp3"){
      return(
        <div
          key={index}
          className="image"
        >
          <div className="notAnImage" title={upload} onClick={e => selectImage(upload)}>
            <i className="fas fa-volume-up"></i>
            <div className="text">
              {upload}
            </div>
          </div>
          <div className={"copy" + (copied == index && copied >= 0 ? ' copied':'')} onMouseEnter={e => removeCopied(index)}>
            <i className="fas fa-link" onClick={e => copyLink(upload, index)}></i>
          </div>
          <i
            className="fas fa-trash"
            onClick={e => deleteImage(e, upload, index)}
          ></i>
        </div>
      )
    }
    else if(ext.toLowerCase() == "pdf"){
      return(
        <div
          key={index}
          className="image"
        >
          <div className="notAnImage" onClick={e => selectImage(upload)}>
            <i className="fas fa-file-pdf"></i>
            <div className="text">
              {upload}
            </div>
          </div>
          <div className={"copy" + (copied == index && copied >= 0 ? ' copied':'')} onMouseEnter={e => removeCopied(index)}>
            <i className="fas fa-link" onClick={e => copyLink(upload, index)}></i>
          </div>
          <i
            className="fas fa-trash"
            onClick={e => deleteImage(e, upload, index)}
          ></i>
        </div>
      )
    }
    else if(ext.toLowerCase() == "docx" || ext.toLowerCase() == "doc"){
      return(
        <div
          key={index}
          className="image"

        >
          <div className="notAnImage" title={upload} onClick={e => selectImage(upload)}>
            <i className="fas fa-file-word"></i>
            <div className="text">
              {upload}
            </div>

          </div>
          <div className={"copy" + (copied == index && copied >= 0 ? ' copied':'')} onMouseEnter={e => removeCopied(index)}>
            <i className="fas fa-link" onClick={e => copyLink(upload, index)}></i>
          </div>
          <i
            className="fas fa-trash"
            onClick={e => deleteImage(e, upload, index)}
          ></i>
        </div>
      )
    } else {
      return(
        <div
          key={index}
          className="image"
        >
          <div
            className="bg"
            style={{
              backgroundImage:
                "url(\""+appUrl+"/uploads/intervention/" +
                intervention.id +
                "/" +
                encodeURI(upload) +
                "\")"
            }}
            onClick={e => selectImage(upload)}
            title={upload}
          >
          </div>
          <div className={"copy" + (copied == index && copied >= 0 ? ' copied':'')} onMouseEnter={e => removeCopied(index)}>
            <i className="fas fa-link" onClick={e => copyLink(upload, index)}></i>
          </div>
          <i
            className="fas fa-trash"
            onClick={e => deleteImage(e, upload, index)}
          ></i>
        </div>
      )
    }
  }

  ////////////////////////////////////////////
  /////////Content
  ///////////////////////////////////////////
  return (
    <div className={"mediaLibrary " + props.mediaLibraryVisible}>
      <div className="popup">
        <i className="fas fa-times" onClick={() => hideMediaLibrary()}></i>
        <h4>Bibliotheek {intervention.title}</h4>
        <input
          type="file"
          onChange={e => uploadImage(e.target.files)}
          name="file"
          ref={inputFileRef}
          multiple={true}
        />
        <span className="btn btn-primary" onClick={triggerInputFile}>
          Upload <i className="fas fa-upload"></i>
        </span>
        <div className="items">
          {state.images.length > 0
            ? state.images.map((image, index) => (
                getFile(image, index)
              ))
            : ""}
        </div>
      </div>
      <div className="overlay" onClick={() => hideMediaLibrary()}></div>
    </div>
  );
};

export default MediaLibrary;
