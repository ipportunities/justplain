import React, { useState, useEffect } from "react";
import t from "../translate";
import uuid from "uuid";
import { setSavingStatus } from "../../actions";
import ConfirmBox from "../alert/confirm";
import $ from "jquery";
import ReactTooltip from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";

let saveSettingsTimeout = null;
let time = 3000;

const Texts = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [texts, setTexts] = useState(false);
  const [newText, setNewText] = useState(false); // komt overeen met het aantal sessies
  const [loaded, setLoaded] = useState(false);

  const updateSetNewText = (text, session) => {
    let newTextsTemp = [...newText];
    newTextsTemp[session - 1].text = text;
    setNewText(newTextsTemp)
  }

  useEffect(() => {
    if(intervention.id > 0){
      let apiCallObj = {
        action: "get_texts",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
        }
      };

      apiCall(apiCallObj).then(resp => {
        let tempNewText = []
        for(let i = 0 ; i<parseInt(intervention.settings.chatlessons.length) ; i++){
          tempNewText.push({session:(i+1), text:""})
        };
        setNewText(tempNewText)
        setTexts(resp.texts_object.texts)
        setLoaded(true)
      });
    }
  }, [intervention.id]);

  const addText = (e) => {
    if (e.key === "Enter") {
      let textsTemp = [...texts];
      let index = e.target.getAttribute("data-session") - 1;
      textsTemp[index].texts.push({id:uuid.v4(), text:newText[index].text});
      setTexts(textsTemp)
      updateSetNewText('', e.target.getAttribute("data-session"))
      saveTexts();
    }
  }
  const updateText = (text, key, session) => {
    let textsTemp = [...texts];
    textsTemp[session - 1].texts[key].text = text
    setTexts(textsTemp)
    saveTexts();
  }

  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteIndex, setToDeleteIndex] = useState(-1);

  function deleteTextConfirm(textId, itemKey, session) {
    let confirmOptionsToSet = {
      show: "true",
      text: t("Weet u zeker dat u deze sneltekst wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deleteText(textId, itemKey, session)
    };
    setToDeleteIndex(itemKey);
    setConfirmOptions(confirmOptionsToSet);
  }

  const deleteText = (textId, itemKey, session) => {
    let textsTemp = [...texts];

    var index = textsTemp[session - 1].texts.map(text => {
      return text.id;
    }).indexOf(textId);

    if(index >= 0){
      textsTemp[session - 1].texts.splice(index, 1);
      setTexts(textsTemp)
      saveTexts();
    }
  };

  const saveTexts = () => {
    dispatch(setSavingStatus("not_saved"));
    clearTimeout(saveSettingsTimeout);
    saveSettingsTimeout = setTimeout(() => {
      let apiCallObj = {
        action: "save_texts",
        token: auth.token,
        data: {
          id: intervention.id,
          texts: texts
        }
      };

      apiCall(apiCallObj).then(resp => {
        dispatch(setSavingStatus("saved"));
      });
    }, time);
  }

  //////////////////////
  ///Drag and drop lesson items
  /// mousewheel werkt niet als je aan scrollen bent lijkt html5 dingetje te zijn
  const [draggedEl, setDraggedEl] = useState("");
  const [droppedEl, setDroppedEl] = useState("");
  const [draggedX, setDraggedX] = useState(false);

  function dragEnd(e) {
    e.target.classList.remove("isDragged");
  }
  function dragStart(e) {
    setDraggedEl(e.target);
    setDraggedX(e.pageX);
    e.target.classList.add("isDragged");
  }

  function dragOver(e) {
    if (droppedEl != e.currentTarget) {
      setDroppedEl(e.currentTarget);
      removeDropClass();
      if(draggedEl != e.currentTarget)
      {

          e.currentTarget.classList.add("drop_here");
          if(draggedEl > e.currentTarget){
            e.currentTarget.classList.add("up");
            e.currentTarget.classList.remove("down");
          } else {
            e.currentTarget.classList.add("down");
            e.currentTarget.classList.remove("up");
          }
      }
    }

    e.stopPropagation();
    e.preventDefault();
  }
  function drop(e, session) {
    let textsTemp = [...texts];
    let element = textsTemp[draggedEl.getAttribute("data-session") - 1].texts[draggedEl.getAttribute("index")];
    textsTemp[draggedEl.getAttribute("data-session") - 1].texts.splice(draggedEl.getAttribute("index"), 1);
    textsTemp[droppedEl.getAttribute("data-session") - 1].texts.splice(droppedEl.getAttribute("index"), 0, element);

    setTexts(textsTemp);
    setDraggedEl(false);

    saveTexts();
    removeDropClass();
    setDraggedX(false);
    /*
    for (let i = 0; i < texts.length; i++) {
      var el = document.getElementById("text_" + texts[i].id);
      el.classList.remove("isDragged");
      if (i == droppedEl) {
        el.classList.add("hovered");
      } else {
        el.classList.remove("hovered");
      }
    }
    */
  }
  const [draggable, setDraggable] = useState(false);
  function activeDragAndDrop(e) {
    ReactTooltip.hide();
    setDraggable(true)
  }
  function deActiveDragAndDrop(e) {
    e.stopPropagation();
    setDraggable(false)
  }
  function removeDropClass() {
    /// met jquery lijken de classes wel altijd verwijderd te worden
    $(".texts .item").each(function(){
      $(this).removeClass('drop_here', 'up', 'down')
    })
  }

  return (
    <div className="texts coachInterface students">
      <div className="list listHidden">
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                <h2>{t('Snel teksten')}</h2>
              </td>
            </tr>
          </tbody>
        </table>
        {texts && newText ?
          <>
            {newText.map((session, key) => {
              return (
                <div className="session" key={key}>
                  <h4>{t("Sessie ") + session.session}</h4>
                  {typeof texts[key] != "undefined" ?
                    <div className="items" data-session={session.session}>
                      {texts[key].texts.map((text, key) => {
                        return (
                          <table key={key}
                            index={key}
                            id={"text_" + text.id}
                            data-session={session.session}
                            onMouseDown={e => activeDragAndDrop(e)}
                            onDragStart={e => dragStart(e)}
                            onDrop={e => drop(e, session.session)}
                            onDragOver={e => dragOver(e)}
                            onDragEnd={e => dragEnd(e)}
                            draggable={draggable}
                            >
                            <tbody>
                              <tr>

                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("Sneltekst")}
                                    aria-describedby={"items_" + key}
                                    //value={JSON.parse(window.atob(lesson.settings)).title}
                                    value={text.text}
                                    onChange={e => updateText(e.target.value, key, session.session)}
                                    onMouseDown={e => deActiveDragAndDrop(e)}
                                  />
                                </td>
                                <td>
                                  <i className="fas fa-expand-arrows-alt"></i>
                                </td>
                                <td>
                                <i className="fas fa-minus"
                                  onClick={() => {
                                  deleteTextConfirm(text.id, key, session.session);
                                  }}
                                  ></i>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        );
                      })}
                      {texts[key].texts.length == 0 && draggedEl ?
                        <div
                          index={0}
                          className={"droppableContainer"}
                          data-session={session.session}
                          onDrop={e => drop(e, session.session)}
                          onDragOver={e => dragOver(e)}
                          onDragEnd={e => dragEnd(e)}
                          >
                          {t("Drop hier om sneltekst te verplaatsen naar sessie ")} {session.session}
                        </div>
                        :<></>}
                    </div>
                    :<></>}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control new"
                        placeholder={t("Voeg sneltekst toe")}
                        value={newText[session.session - 1].text}
                        onChange={e => updateSetNewText(e.target.value, session.session)}
                        onKeyPress={addText}
                        data-session={session.session}
                      />
                    </div>
                </div>
              );
            })}
          </>
          :
          <>
            {loaded ?
              <div>
                Aantal sessies is nog niet opgegeven
              </div>
              :<></>}
          </>
        }
      </div>

      <ConfirmBox
        confirmOptions={confirmOptions}
        setConfirmOptions={setConfirmOptions}
        setToDeleteIndex={setToDeleteIndex}
      />
    </div>
  )
}

export default Texts;
