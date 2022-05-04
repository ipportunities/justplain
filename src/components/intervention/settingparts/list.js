import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import { getClone } from "../../utils";
import t from "../../translate";
import ReactTooltip from "react-tooltip";
import apiCall from "../../api";
import ConfirmBox from "../../alert/confirm";
import ListItemSettings from "./list-item-settings";
import $ from "jquery";

import AddImageAltMenu from "./addImageAltMenu";
import MediaLibrary from "../../medialibrary";
import { setChosenImage } from "../../../actions";

let saveSettingsTimeout = null;
let saveOrderTimeout = false;


const InterventionSettingsList = props => {
  const dispatch = useDispatch();

  const history = useHistory();
  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);

  const [newTitle, setnewTitle] = useState("");
  const [items, setItems] = useState([]);
  const [nestedShow, setNestedShow] = useState([]);
  const [nestOfDrop, setNestOfDrop] = useState("0");

  /* ////////////////////////////////////////////
  /////////Media library functies om door te geven
  ///////////////////////////////////////////
  const [mediaLibraryVisible, setMediaLibraryVisible] = useState("hide");
  const medialibrary = useSelector(state => state.mediaLibrary);
  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "")
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    //bepaal lesson_id
    let chosen_image_parts = medialibrary.index.split('_');
    let lesson_id = chosen_image_parts[1];
    let interventionC = getClone(intervention);
    let test = interventionC.settings.selfhelp.lessons.find(lesson => parseInt(lesson.id) === parseInt(lesson_id));

    if (test !== undefined)
    {
      interventionC.settings.selfhelp.lessons.find(lesson => parseInt(lesson.id) === parseInt(lesson_id))["alternative_menu_image"] = url + "/uploads/intervention/" + medialibrary.chosen_image;
    }

    dispatch(
      setIntervention(
        props.intervention.id,
        props.intervention.organisation_id,
        props.intervention.title,
        interventionC.settings
      )
    );

    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        props.intervention.id,
        props.intervention.organisation_id,
        props.intervention.title,
        interventionC.settings
      );
    }, 3000);

  } */


  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.items != "")
    {
      setItems(props.items);
    } else {
      ///reset als is nul en is reeds geopend
      setItems([]);
    }
  }, [props]);

  //////////////////////
  ///Drag and drop lesson items
  const [draggedElIndex, setDraggedElIndex] = useState("");
  const [droppedElIndex, setDroppedElIndex] = useState("");
  const [draggedX, setDraggedX] = useState(false);

  function dragEnd(e) {
    e.target.classList.remove("isDragged");
  }
  function dragStart(e) {
    setDraggedElIndex(e.target.getAttribute("index"));
    setDraggedX(e.pageX);
    e.target.classList.add("isDragged");
  }
  ////TODO nog een keer naar kijken bij listitems in de lest is het sorteren nu wat beter
  function dragOver(e) {
    if (droppedElIndex != e.currentTarget.getAttribute("index")) {
      setDroppedElIndex(e.currentTarget.getAttribute("index"));
      removeDropClass();
      if(draggedElIndex != e.currentTarget.getAttribute("index"))
      {

          e.currentTarget.classList.add("drop_here");
          if(draggedElIndex > e.currentTarget.getAttribute("index")){
            e.currentTarget.classList.add("up");
            e.currentTarget.classList.remove("down");
          } else {
            e.currentTarget.classList.add("down");
            e.currentTarget.classList.remove("up");
          }
      }
    }

    if(props.nest == "true"){
      nest(e.pageX);
    }

    e.stopPropagation();
    e.preventDefault();
  }
  function nest(pageX) {
    let step = 40;
    let difference = pageX - draggedX;
    let nest = Math.floor(difference / step);

    if (nest < 0) {
      nest = 0;
    }
    if (nest > 1) {
      nest = 1;
    }

    setNestOfDrop(nest);
  }
  function drop(e) {
    let tempItems = items;
    let element = tempItems[draggedElIndex];
    element.nest = nestOfDrop;

    tempItems.splice(draggedElIndex, 1);
    tempItems.splice(droppedElIndex, 0, element);

    setItems(tempItems);
    setDraggedElIndex(e.currentTarget.getAttribute("index"));

    saveOrder();
    removeDropClass();
    setDraggedX(false);
    for (let i = 0; i < items.length; i++) {
      var el = document.getElementById("item_" + items[i].id);
      el.classList.remove("isDragged");
      if (i == droppedElIndex) {
        el.classList.add("hovered");
      } else {
        el.classList.remove("hovered");
      }
    }
  }
  function activeDragAndDrop(e) {
    ReactTooltip.hide();
    for (let i = 0; i < items.length; i++) {
      var element = document.getElementById("item_" + items[i].id);
      element.setAttribute("draggable", "true");
    }
  }
  function deActiveDragAndDrop(e) {
    e.stopPropagation();
    for (let i = 0; i < items.length; i++) {
      var element = document.getElementById("item_" + items[i].id);
      element.setAttribute("draggable", "false");
    }
  }
  function removeDropClass() {
    /// met jquery lijken de classes wel altijd verwijderd te worden
    $(".items .item").each(function(){
      $(this).removeClass('drop_here', 'up', 'down')
    })
    /*
    for (let i = 0; i < items.length; i++) {
      var element = document.getElementById("item_" + items[i].id);
      element.classList.remove("drop_here");
      element.classList.remove("up");
      element.classList.remove("down");
    }*/
  }

  //////////////////////
  ///Save order
  function saveOrder() {
    dispatch(setSavingStatus("not_saved"));
    clearTimeout(saveOrderTimeout);
    saveOrderTimeout = setTimeout(() => {
      let order = getOrder();
      let apiCallObj = {};
      apiCallObj = {
        action: "order_" + props.type + "s",
        token: auth.token,
        data: {
          id: props.intervention.id,
          order: order
        }
      };

      apiCall(apiCallObj).then(resp => {
        if (resp.error == 99) {
          //sessie verlopen, uitloggen
          window.location.reload();
        } else {
          if (resp.error == 99) {
            //sessie verlopen, uitloggen
            window.location.reload();
          } else if (typeof resp.error != "undefined" && resp.error == 0) {
            dispatch(setSavingStatus("saved"));
            setItems(resp.items);

            toggleNested(resp.items[droppedElIndex].id, resp.items)
          }
        }
      });
    })


  }
  function getBaseParentId(parent_id, updatedItems) {
    let parent_el = updatedItems.filter(function(item, index) {
      return item.id == parent_id;
    });
    if(parent_el.length == 0)
    {

    } else {
      if (parent_el[0].parent_id == 0) {
        return parent_el[0].id;
      } else {
        return getBaseParentId(parent_el[0].parent_id, updatedItems);
      }
    }

  }
  function getOrder() {
    let order = [];
    let itemss = items;

    for (let i = 0; i < itemss.length; i++) {
      /// eerste element kan niet genest zijn...
      if (i == 0 && itemss[i].nest > 0) {
        itemss[i].nest = 0;
      }
      order.push({
        id: itemss[i].id,
        nest: typeof itemss[i].nest === "undefined" ? 0 : itemss[i].nest
      });
    }

    return order;
  }

  //////////////////////
  ///Update lesson Title
  function updateTitle(input, key) {
    let updatedItems = [...items];
    updatedItems[key].title = input
    setItems(updatedItems)
    //set settings in global state:
    saveInterventionSettings(updatedItems);
  }

  //////////////////////
  ///Add lesson
  const addItem = e => {
    if (e.key === "Enter") {
      let updatedItems = [...items];
      updatedItems.push({
        id: 0,
        title: newTitle,
        settings:{}
      });
      setnewTitle("");

      //set settings in global state:
      saveInterventionSettings(updatedItems, 10);
    }
  };

  //////////////////////
  ///Go to edit lesson screen
  const editItem = itemKey => {
    let editUrl = props.type == "optional_lesson" ? "lesson":props.type
    history.push(
      "/"+editUrl+"/edit/" + items[itemKey].id
    );
    window.scrollTo(0, 0);
  };

  const editQuestionnaireScores = itemKey => {
    history.push(
      "/questionnaire/edit-scores/" +
        items[itemKey].id
    );
    window.scrollTo(0, 0);
  };

  //////////////////////
  ///Copy lesson
  const copyItem = (itemID, itemKey) => {
    let apiCallObj = {};
    apiCallObj = {
      action: "copy_" + props.type,
      token: auth.token,
      data: {
        id: itemID
      }
    };

    apiCall(apiCallObj).then(resp => {
      if (resp.error == 99) {
        //sessie verlopen, uitloggen
        window.location.reload();
      } else {
        let updatedItems = [...items];
        updatedItems.splice(itemKey + 1, 0, {
          id: resp.id,
          title: resp.title,
          nest:resp.nest,
          priority:resp.priority,
        });

        //set settings in global state:
        saveInterventionSettings(updatedItems);
      }
    });
  };

  //////////////////////
  ///insert lesson
  const insertLesson = (itemKey, lesson) => {
    /*
    let interventionC = getClone(intervention);

    interventionC.settings.selfhelp.lessons.splice((itemKey + 1), 0, {
      id: 0,
      title: "",
      nest: lesson.nest.toString(),
      parent_id: lesson.parent_id.toString()
    });

    setnewTitle("")

    setItems(interventionC.settings.selfhelp.lessons)

    //set settings in global state:
    saveInterventionSettings(interventionC, 0, 'true')
    */
  };

  ///Delete item
  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteIndex, setToDeleteIndex] = useState(-1);

  function deleteItemConfirm(itemId, itemKey) {
    let confirmOptionsToSet = {
      show: "true",
      text: t("Weet u zeker dat u deze")+" "+props.itemName+" "+t("wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deleteItem(itemId, itemKey)
    };
    setToDeleteIndex(itemKey);
    setConfirmOptions(confirmOptionsToSet);
  }

  const deleteItem = (itemId, itemKey) => {
    let updatedItems = [...items];

    if (hasChildren(itemId)) {
      let this_nest = items[itemKey].nest;

      for (
        let i = itemKey;
        i < items.length;
        i++
      ) {
        if (items[i].nest > this_nest) {
          /// hier kan evt nog een check waar ze heen moeten ipv
          updatedItems[i].nest = "0"; /// allemaal op 0
          updatedItems[i].parent_id = "0"; /// allemaal op 0
          //updatedItems[i].nest = updatedItems[i].nest - 1;
        } else if (items[i].id != itemId) {
          break;
        }
      }
    }

    updatedItems = updatedItems.filter(
      function(value, index, arr) {
        return index !== itemKey;   ////TODO het laatste item verdwijnt niet........ pas na refresh !== 0 ? misschien
      }
    );
    setItems(updatedItems)
    saveInterventionSettings(updatedItems, 10, items[itemKey].id);
  };

  //////////////////////
  ///Save to intervention settings
  function saveInterventionSettings(updatedItems, time = 3000, deleteItem = false) {
    let interventionC = getClone(props.intervention);
    if(props.type == "lesson"){
      interventionC.settings.selfhelp.lessons = updatedItems
      if(deleteItem){
        interventionC.settings.deleteLesson = deleteItem
      }
    }
    if(props.type == "optional_lesson") {
      interventionC.settings.selfhelp.optionalLessons = updatedItems
      if(deleteItem){
        interventionC.settings.deleteOptionalLesson = deleteItem /// TODO deze worden gesaved???
      }
    }
    if(props.type == "homework") {
      interventionC.settings.homework = updatedItems
      if(deleteItem){
        interventionC.settings.deleteHomework = deleteItem /// TODO deze worden gesaved???
      }
    }
    if(props.type == "chatlesson") {
      interventionC.settings.chatlessons = updatedItems
      if(deleteItem){
        interventionC.settings.deleteChatlesson = deleteItem /// TODO deze worden gesaved???
      }
    }
    if(props.type == "goal"){
      interventionC.settings.goals = updatedItems
      if(deleteItem){
        interventionC.settings.deleteGoal = deleteItem
      }
    }
    if(props.type == "questionnaire"){
      interventionC.settings.questionnaires = updatedItems
      if(deleteItem){
        interventionC.settings.deleteQuestionnaire = deleteItem
      }
    }
    if(props.type == "page"){
      interventionC.settings.pages = updatedItems
      if(deleteItem){
        interventionC.settings.deletePage = deleteItem
      }
    }
    dispatch(
      setIntervention(
        props.intervention.id,
        props.intervention.organisation_id,
        props.intervention.title,
        interventionC.settings
      )
    );

    props.setErrorMessage("");
    dispatch(setSavingStatus("not_saved"));
    clearTimeout(saveSettingsTimeout);
    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        props.intervention.id,
        props.intervention.organisation_id,
        props.intervention.title,
        interventionC.settings
      );
    }, time);
  }

  /// nog verder uitwerken
  function toggleNested(itemId, respItems = 'false') {
    let idsToShow = [...nestedShow];
    let checkItems = [...items]
    if(respItems != 'false'){
      checkItems = [...respItems]
    }
    let baseParentID = getBaseParentId(itemId, checkItems)

    let idsToShowParent = idsToShow.filter(function(parent, index) {
      return parent.id == baseParentID;
    });

    if(idsToShowParent.length == 0){
      idsToShow.push({id:baseParentID, show:'true'})
    } else {
      let index = idsToShow.indexOf(idsToShowParent[0])
      if(respItems != 'false'){
        idsToShow[index].show = 'true'
      } else {
        idsToShow[index].show = idsToShow[index].show == 'true' ? 'false':'true'
      }

    }

    setNestedShow(idsToShow);
  }
  function checkIfVisible(parent_id){
    if(parent_id == 0){
      return true
    } else if(parent_id > 0) {
      let baseParentID = getBaseParentId(parent_id, items)
      let idsToShowParent = nestedShow.filter(function(parent, index) {
        return parent.id == baseParentID;
      });
      if(idsToShowParent.length == 0){
        return false;
      } else {
        if(idsToShowParent[0].show == "true")
        {
          return true;
        } else {
          return false
        }
      }
    }
  }

  function toggleSettings(id){
    let set_el = $("#item_" + id + " .settings:not(.btn)")
    let set_el_btn = $("#item_" + id + " .btn.settings")
    if(set_el.is(":visible")){
      set_el.hide()
      set_el_btn.removeClass("handle").addClass('edit')
    } else {
      set_el.show()
      set_el_btn.addClass("handle").removeClass('edit')
    }
  }

  function hasChildren(parent_id) {
    return items.some(function(el) {
      return el.parent_id === parent_id;
    });
  }

  /*
  <ReactTooltip place="top" effect="solid" delayShow={200}   />
  */
  /*
  <table onClick={() => {
  insertLesson(key, lesson);
  }}><tbody><tr><td>Voeg toe
  </td><td>
  <i className="fas fa-plus"></i></td></tr></tbody></table>
  */

  function toggleVisibilityMenu(key){
    let updatedItems = [...items];
    updatedItems[key].settings.visible = typeof updatedItems[key].settings.visible != "undefined" && updatedItems[key].settings.visible == 'hidden' ? 'visible':'hidden'
    setItems(updatedItems)

    ////newPart + removePart maar toevoegen indien nodig voor de check
    if(typeof updatedItems[key].settings.newPart == "undefined"){
      updatedItems[key].settings.newPart = false;
    }
    if(typeof updatedItems[key].settings.removePart == "undefined"){
      updatedItems[key].settings.removePart = false;
    }

    /// door het cleanen van de settings bij de saveSettings in edit kan ik niks opslaan in de settings via die weg......... gewoon een enkel item saven dan maar
    apiCall({
      action: (props.type == "lesson" || props.type == "optional_lesson") ? "save_lesson":"save_questionnaire",
      token: auth.token,
      data: {
        id: updatedItems[key].id,
        settings: updatedItems[key].settings
      }
    }).then(resp => {

      let interventionC = getClone(intervention);
      interventionC.settings.selfhelp.lessons = updatedItems

      dispatch(
        setIntervention(
          intervention.id,
          intervention.organisation_id,
          intervention.title,
          interventionC.settings
        )
      );

    });
  }
  function isLogGoal(item){
    if(typeof item.settings != "undefined" && typeof item.settings.logOff != "undefined" && item.settings.logOff != ""){
      return true
    }
  }

  /* function showMediaLibrary(index) {
    setMediaLibraryVisible("show");
    document.body.style.overflow = "hidden";

    dispatch(setChosenImage("", index));
  } */

  return (
    <div>
      {/* <MediaLibrary
        mediaLibraryVisible={mediaLibraryVisible}
        setMediaLibraryVisible={setMediaLibraryVisible}
      /> */}
      <div className={"items " + props.type + "s"}>
        {items.map((item, key) => {
          return (
          <div
            index={key}
            key={"item_" + key}
            id={"item_" + item.id}
            onDragStart={e => dragStart(e)}
            onDrop={e => drop(e)}
            onDragOver={e => dragOver(e)}
            onDragEnd={e => dragEnd(e)}
            draggable="true"
            //data-parentId={lesson.parent_id}
            data-nested={
              typeof item.nest !== "undefined" || key == 0 ? item.nest : 0
            }
            onMouseDown={e => activeDragAndDrop(e)}
            className={"item " +
              (toDeleteIndex == key ? " to_delete" : "") +
              (checkIfVisible(typeof item.parent_id == "undefined" ? 0:item.parent_id)
                ? ""
                : " hide") +
              (isLogGoal(item) ? ' logGoal':'')
            }
          >
            <div className="form-group item">
              {isLogGoal(item) ?
                <i className="fas fa-level-up-alt log"></i>
                :''}
              <table>
                <tbody>
                  <tr>
                    <td className="title">
                      <input
                        type="text"
                        className="form-control"
                        id={"items_" + key}
                        name={"items_" + key}
                        placeholder={t(props.placeholderItem)}
                        aria-describedby={"items_" + key}
                        //value={JSON.parse(window.atob(lesson.settings)).title}
                        value={item.title}
                        onChange={e => updateTitle(e.target.value, key)}
                        onMouseDown={e => deActiveDragAndDrop(e)}
                      />
                    </td>
                    <td>
                      <div className="lesson-controls">
                        {/* {
                          (intervention.settings.selfhelp.alternative_menu && parseInt(item.parent_id) === 0) ?
                            <AddImageAltMenu index={'lessonAlternativeMenuImage_'+item.id} showMediaLibrary={showMediaLibrary} image={typeof item.alternative_menu_image != "undefined" ? item.alternative_menu_image : ''} />
                        : <></>
                        } */}
                        {props.type == "optional_lesson" || props.type == "goal" || props.type == "questionnaire" ?
                          <span
                            data-tip={t("Settings")}
                            className="btn edit disabled settings"
                            onClick={() => {
                              toggleSettings(item.id, 'false');
                            }}
                          >
                            <i className="fas fa-cog"></i>
                          </span>
                        :''}
                        {hasChildren(item.id) && item.nest == 0 ? (
                          <span
                            data-tip={t("Bekijk hoofdstukken")}
                            className="btn edit disabled"
                            onClick={() => {
                              toggleNested(item.id, 'false');
                            }}
                          >
                            <i className="fas fa-network-wired"></i>
                          </span>
                        ) : (
                          ""
                        )}
                        {(props.nest == "true" && (item.nest && item.nest != 0)) || props.type == "questionnaire" ?
                          <span
                            data-tip={t("Wijzig zichtbaarheid in menu")}
                            className="btn roundWhite"
                            onClick={() => {
                              toggleVisibilityMenu(key);
                            }}
                          >
                            <i className={"fas fa-eye" + (typeof item.settings !== "undefined" && typeof item.settings.visible !== "undefined" && item.settings.visible === 'hidden' ? '-slash':'')}></i>
                          </span>
                        :''}
                        <span
                          data-tip={t("Wijzig les")}
                          className="btn edit disabled"
                          onClick={() => {
                            editItem(key);
                          }}
                        >
                          <i className="fas fa-pen"></i>
                        </span>
                        {props.type == "questionnaire" ?
                          <span
                            data-tip={t("Zet feedback op eindscore")}
                            className="btn edit disabled"
                            onClick={() => {
                              editQuestionnaireScores(key);
                            }}
                          >
                            <i className="fas fa-star-half-alt"></i>
                          </span>
                        :''}
                        <span className="otherActionsToggle btn">
                          <i className="fas fa-ellipsis-h"></i>
                          <div className="otherActions">
                            <table
                              onClick={() => {
                                copyItem(item.id, key);
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>{t("Kopieer")}</td>
                                  <td>
                                    <i className="fa fa-copy"></i>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              onClick={() => {
                                deleteItemConfirm(item.id, key);
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>{t("Verwijder")}</td>
                                  <td>
                                    <i className="fas fa-minus"></i>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                  <tr className="settings hide">
                    <td colSpan="2">
                      <div className="content">
                        {props.type == "goal" || props.type == "optional_lesson" || props.type == "questionnaire" ?
                          <ListItemSettings type={props.type} saveSettings={props.saveSettings} id={item.id} index={key}/>
                        :''}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )})}
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="new"
          placeholder={props.placeholderNew}
          value={newTitle}
          onChange={e => setnewTitle(e.target.value)}
          onKeyPress={addItem}
        />
      </div>

      <ConfirmBox
        confirmOptions={confirmOptions}
        setConfirmOptions={setConfirmOptions}
        setToDeleteIndex={setToDeleteIndex}
      />
    </div>
  );
};

export default InterventionSettingsList;
