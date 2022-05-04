import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import uuid from "uuid";
import Title from "./parts/title.js";
import AddPart from "./parts/helpers/addPart.js";
import Menu from "./parts/helpers/menu.js";
import ScoresAndFeedback from "./scores_and_feedback";
import CoursesEditContent from "./parts/helpers/content.js";
import { componentOptions } from "./parts/helpers/options.js";
import { getClone } from "../../utils";
import apiCall from "../../api";
import t from "../../translate";
import MediaLibrary from "../../medialibrary";
import ConfirmBox from "../../alert/confirm";
import { setChosenImage } from "../../../actions";
import { setIntervention } from "../../../actions";
import Saved from "../../intervention/saved";
import { setSavingStatus } from "../../../actions";

let teller = 0; // nog laten staan ivm autosaven
let save = false;
let saveTimeout = false;
let isAnimating = false;
let menuIndex = false;

const ContentEdit = props => {
  teller++;

  let timeout = false;

  const [state, setState] = useState({
    newPart: false,
    removePart: false,
    title: "",
    image: "",
    parts: [],
    ranges: []
  });

  let history = useHistory();

  const [showHideMenu, setShowHideMenu] = useState(false);
  const [action, setAction] = useState(false);
  const [save, setSave] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const dispatch = useDispatch();

  //////////////////////
  /// filter part options based on set optionos
  let filteredComponentOptions = [];
  for (let i = 0; i < componentOptions.length; i++) {
    if (props.options.indexOf(componentOptions[i].content.type) != -1) {
      filteredComponentOptions.push(componentOptions[i]);
    }
  }

  /////////////////////////////////////////////
  ///////Data handling with server
  ////////////////////////////////////////////

  //////////////////////
  ///Get content
  useEffect(() => {
    if (props.content != "") {
      setState(props.content);
    }
    if (props.action != "") {
      setAction(props.action);
    }
  }, []);

  //save content direct na state-update i.g.v. delete en ook i.g.v. addpart
  useEffect(() => {
    if (state.removePart !== false || state.newPart !== false)
    {
      saveContent();
    }
  }, [state.newPart, state.removePart]);

  //////////////////////
  ///Save function content
  function saveContent() {

    //api aanroepen
    apiCall({
      action: props.saveAction,
      token: auth.token,
      data: {
        id: props.id,
        settings: state
      }
    }).then(resp => {
      dispatch(setSavingStatus("saved"));
      let newState = getClone(state);
      if (newState.newPart !== false || newState.removePart !== false)
      {
        newState.newPart = false;
        newState.removePart = false;
        setState(newState);
      }

      /// dispatchen in interventie hier wenselijk
      /// maar settings worden anders opgehaald in edit.js waardoor dispatch error oplevert <= aanpassen zetten interventie na 1 mei in router
      /*
      let interventionC = getClone(intervention);

      if (props.type == "lesson" && props.url == "options-lessons") {
        interventionC.settings.selfhelp.optionalLessons[props.id] = newState;
      } else if (props.type == "lesson") {
        interventionC.settings.selfhelp.lessons[props.id] = newState;
      }
      if (props.type == "questionnaire") {
        interventionC.settings.questionnaires[props.id] = newState;
      }
      if (props.type == "goal") {
        interventionC.settings.goals[props.id] = newState;
      }
      if (props.type == "pages") {
        interventionC.settings.pages[props.id] = newState;
      }

      dispatch(
        setIntervention(
          intervention.id,
          intervention.organisation_id,
          intervention.title,
          interventionC.settings
        )
      );
      */

    });
  }

  //////////////////////
  ///Save function after timeout maar niet pas na useEffect
  if (teller > 2) {
    clearTimeout(saveTimeout);
    dispatch(setSavingStatus("not_saved"));
    saveTimeout = setTimeout(() => {
      saveContent();
    }, 3000);
  }

  /////////////////////////////////////////////
  ///////Component handlers
  ////////////////////////////////////////////

  //////////////////////
  ///Wijzige type part
  function onChangePartType(index, type) {
    let parts = [...state.parts];
    parts[index].type = type;
    setStateHandler({ parts: parts });
  }

  //////////////////////
  ///Swap part
  function swapPart(indexA, indexB) {
    let parts = [...state.parts];
    var a = parts[indexA];
    parts[indexA] = parts[indexB];
    parts[indexB] = a;
    setStateHandler({ parts: parts });
  }

  //////////////////////
  ///Kopieer part
  function copyPart(index) {
    if (!(state.newPart === false && state.removePart === false)) {
      // prevent tegelijke handelingen
      return false;
    }
    let parts = [...state.parts];
    addPart(index + 1, JSON.parse(JSON.stringify(parts[index])), true);
  }

  //////////////////////
  ///Voeg part toe
  function addPart(
    index,
    options_content = {
      type: "wysiwyg",
      content: "",
      items: [""],
      question: "",
      must: true,
      images: [""]
    },
    copy = false
  ) {
    if (!(state.newPart === false && state.removePart === false)) {
      // prevent tegelijke handelingen
      return false;
    }
    isAnimating = true;

    let newState = getClone(state);
    let parts = [...newState.parts];
    index = index === false ? parts.length : index;

    /// set new ids
    options_content.id = uuid.v4();
    if (copy) {
      options_content.question = options_content.question + " copy";
      //options_content.nest = options_content.nest;
      //options_content.parent_id = options_content.parent_id;
    }
    for (let i = 0; i < options_content.items.length; i++) {
      options_content.items[i].id = uuid.v4();
    }
    for (let i = 0; i < options_content.images.length; i++) {
      options_content.images[i].id = uuid.v4();
    }

    let insertIndex = index;
    parts.splice(insertIndex, 0, options_content);
    newState.parts = parts;
    //newState.newPart = insertIndex;
    setState(newState);

    timeout = setTimeout(function() {
      let newState_1 = getClone(newState);
      newState_1.parts[insertIndex].slideDown = true;
      setState(newState_1);
      setTimeout(function() {
        let newState_2 = getClone(newState_1);
        newState_2.parts[insertIndex].slideDown = false;
        newState_2.newPart = newState_2.parts[insertIndex].id; //tbv directe save
        setState(newState_2);
        isAnimating = false;
      }, 500);
    }, 100);
  }

  //////////////////////
  ///Verwijder part
  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteIndex, setToDeleteIndex] = useState(-1);

  function deletePartConfirm(index) {
    let confirmOptionsToSet = {
      show: "true",
      text: "<h4>"+t("Weet u zeker dat u dit deel wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deletePart(index)
    };
    setToDeleteIndex(index);
    setConfirmOptions(confirmOptionsToSet);
  }

  function deletePart(index) {
    if (!(state.newPart === false && state.removePart === false)) {
      // prevent tegelijke handelingen
      return false;
    }

    isAnimating = true;
    let newState = getClone(state);
    newState.parts[index].to_remove = true;
    setState(newState);

    timeout = setTimeout(function() {
      let newState_1 = getClone(newState);
      newState_1.parts[index].slideUp = true;
      setState(newState_1);
      setTimeout(function() {
        let newState_2 = getClone(newState_1);
        newState_2.parts[index].slideUp = true;
        //newState_2.removePart = false;
        newState_2.removePart =  newState.parts[index].id; //zorgt dmv useEffect voor directe save
        newState_2.parts.splice(index, 1);
        setState(newState_2);
        isAnimating = false;
      }, 200);
    }, 500);
  }

  //////////////////////
  ///Toggle padding
  function togglePadding(index){
    let parts = [...state.parts];
    let currPadding = typeof parts[index].padding == "undefined" ? 'normal':state.parts[index].padding
    parts[index].padding = currPadding == "normal" ? "minimal":"normal"
    setStateHandler({parts:parts});
  }

  //////////////////////
  ///Update part
  function updatePart(index, key, value) {
    let parts = [...state.parts];
    parts[index][key] = value;
    setStateHandler({ parts: parts });
  }

  ////////////////////////////////////////////
  /////////local state updater
  ///////////////////////////////////////////
  function setStateHandler(newStateToSet) {
    if (isAnimating == true) {
      // als er nog een state change komt door een settimeout
      return false;
    }

    let newState = getClone(state);
    for (var key in newStateToSet) {
      newState[key] = newStateToSet[key];
    }
    setState(newState);
  }

  ////////////////////////////////////////////
  /////////Toggle menu
  ///////////////////////////////////////////
  function showAddMenu(index) {
    menuIndex = index;
    setShowHideMenu(true);
  }
  function hideMenu() {
    setShowHideMenu(false);
  }

  ////////////////////////////////////////////
  /////////Media library functies om door te geven
  ///////////////////////////////////////////
  const [mediaLibraryVisible, setMediaLibraryVisible] = useState("hide");
  const [filterTypes, setFilterTypes] = useState([]);

  //////////////////////
  ///show mediaLibrary
  function showMediaLibrary(index, types) {
    setMediaLibraryVisible("show");
    document.getElementsByTagName('html')[0].style.overflow = "hidden";

    if (types && types != "") {
      setFilterTypes(types);
    } else {
      setFilterTypes([]);
    }

    /// empty store + set index
    dispatch(setChosenImage("", index));
  }

  function editQuestionnaireScores() {
    setAction("editScores");
  }

  function editQuestionnaire() {
    setAction("edit");
  }

  /// TODO na aanpassing zetplek interventie object kan dit hier ingekort worden
  function updateTitle(newStateToSet) {
    setStateHandler(newStateToSet);

    let interventionC = getClone(intervention);

    if (props.type == "lesson" && props.url == "options-lessons") {
      interventionC.settings.selfhelp.optionalLessons[props.contentIndex].title =
        newStateToSet.title;
    } else if (props.type == "lesson") {
      interventionC.settings.selfhelp.lessons[props.contentIndex].title =
        newStateToSet.title;
    }
    if (props.type == "questionnaire") {
      interventionC.settings.questionnaires[props.contentIndex].title =
        newStateToSet.title;
    }
    if (props.type == "goal") {
      interventionC.settings.goals[props.contentIndex].title =
        newStateToSet.title;
    }
    if (props.type == "pages") {
      interventionC.settings.pages[props.contentIndex].title =
        newStateToSet.title;
    }

    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        interventionC.settings
      )
    );
  }

  const viewJson = e => {
    e.preventDefault();
    //alert("JO: /lesson/json/"+props.id)
    history.push("/lesson/json/" + props.id);
  };

  function goTo (url) {
    history.push(url)
    window.scrollTo(0, 0);
  }

  ////////////////////////////////////////////
  /////////Content
  ///////////////////////////////////////////
  return (
    <div className="lessoncontent edit">
      <Saved />
      <nav className="navbar navbar-expand-lg navbar-light overRule">
        <h2>
          {auth.userType == 'admin' ?
            <span className="pointer" onClick={()=>goTo("/intervention/edit/" + intervention.id + "/general/")}>{" " + intervention.title + " "}</span>
          :
            <span>
              {" " + intervention.title + " "}
            </span>
          }

          >   <span className="pointer" onClick={()=>goTo("/intervention/edit/" + intervention.id + "/" + props.url)}> {props.name} </span>
        </h2>
      </nav>
      {props.type == "questionnaire" ?
        <div className="center">
          <div className="toggleQuestionaireEditScore">
            {action == "editScores" ?
              <div>
                <button className="btn btn-primary" onClick={()=>editQuestionnaire()}>{t("Bewerk vragenlijst")}</button>
              </div>
              :
              <div>
                <button className="btn btn-primary" onClick={()=>editQuestionnaireScores()}>{t("Bewerk feedback")}</button>
              </div>
            }
          </div>
        </div>
      :''}
      {props.type == "questionnaire" && action == "editScores"?
        <div>
          <h3 className="center">{t("Scores en feedback")}</h3>
          <Title title={state.title} updateTitle={updateTitle} setStateHandler={setStateHandler} image={state.image} type={props.type} showMediaLibrary={showMediaLibrary}/>
          <ScoresAndFeedback
            parts={[...state.parts]}
            ranges={[...state.ranges]}
            setStateHandler={setStateHandler}
            showMediaLibrary={showMediaLibrary}
            />
          <MediaLibrary
            mediaLibraryVisible={mediaLibraryVisible}
            setMediaLibraryVisible={setMediaLibraryVisible}
            filterTypes={filterTypes}
          />
        </div>
      :
        <div>
        <MediaLibrary
          mediaLibraryVisible={mediaLibraryVisible}
          setMediaLibraryVisible={setMediaLibraryVisible}
          filterTypes={filterTypes}
        />
        <Menu
          menuIndex={menuIndex}
          addPart={addPart}
          options={filteredComponentOptions}
          showHideMenu={showHideMenu}
          hideMenu={hideMenu}
        />
        <form>
          <div className="center">
          <br /><br /><br />
          {/*<span className="pointer" onClick={viewJson}>View JSON object</span>*/}

          </div>

          <Title title={state.title} updateTitle={updateTitle} setStateHandler={setStateHandler} image={state.image} type={props.type} showMediaLibrary={showMediaLibrary}/>
          <div className="component_holder">
            {state.parts.map((part, index) => (
              <div
                key={part.id}
                className={
                  "component " +
                  (state.newPart === index ? " new_element" : "") +
                  (state.removePart === index ? " to_remove" : "") +
                  (part.slideUp ? " slideUp" : "") +
                  (part.slideDown ? " slideDown" : "") +
                  (toDeleteIndex == index ? " to_delete" : "") +
                  (typeof part.padding == "undefined" || part.padding == "normal" ? '':' minimal-padding')
                }
              >
                <div className="center">
                  <div className="addButton" onClick={() => showAddMenu(index)}>
                    <i className="fa fa-plus"></i>
                  </div>
                </div>
                <div className="actions">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <button
                            type="button"
                            onClick={()=>togglePadding(index)}
                            className="padding"
                          >
                          <i className={"fas fa-" + (typeof part.padding == "undefined" || part.padding == "normal" ? "expand":"compress") +"-alt"}></i>
                          </button>
                          {index != 0 ? (
                            <button
                              type="button"
                              onClick={() => swapPart(index, index - 1)}
                            >
                              <i className="fa fa-chevron-up"></i>
                            </button>
                          ) : (
                            ""
                          )}
                          {index != state.parts.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => swapPart(index, index + 1)}
                            >
                              <i className="fa fa-chevron-down"></i>
                            </button>
                          ) : (
                            ""
                          )}
                          <button type="button" onClick={() => copyPart(index)}>
                            <i className="fa fa-copy"></i>
                          </button>
                          <button type="button" onClick={() => deletePartConfirm(index)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <CoursesEditContent
                  index={index}
                  part={part}
                  allPart={[...state.parts]}
                  interventionSettings={intervention.settings}
                  type={props.type}
                  showMediaLibrary={showMediaLibrary}
                  updatePart={updatePart}
                  options={props.options}
                />
              </div>
            ))}
          </div>
        </form>
        <AddPart
          addPart={addPart}
          showHideMenu={showHideMenu}
          //showHideOptions={showHideOptions}
          options={filteredComponentOptions}
        />
        </div>
      }

      <ConfirmBox confirmOptions={confirmOptions} setConfirmOptions={setConfirmOptions} setToDeleteIndex={setToDeleteIndex}/>
    </div>
  );
};

export default ContentEdit;
