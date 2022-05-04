import React, { useState, useEffect } from "react";
import { getClone } from "../utils";
import { useSelector } from "react-redux";
import t from "../translate";
import apiCall from "../api";
import ConfirmBox from "../alert/confirm";
import {appSettings} from "../../custom/settings";
import parse from 'html-react-parser';

const InterventionLinks = props => {
  const [interventions, setInterventions] = useState([])
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    setInterventions(props.interventions)
  }, [props]);

  ///Delete item
  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteId, setToDeleteId] = useState(-1);

  function deleteInterventionConfirm(e, intervention_id, intervention_title) {
    e.stopPropagation();
    let confirmOptionsToSet = {
      show: "true",
      text: "<h4>"+t("Verwijderen ") +"<b>"+ intervention_title +"</b></h4>"+t("Weet u zeker dat u deze interventie wilt verwijderen?"),
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deleteIntervention(intervention_id)
    };
    setToDeleteId(intervention_id);
    setConfirmOptions(confirmOptionsToSet);
  }

  function deleteIntervention(id){
    apiCall({
      action: "save_intervention",
      token: auth.token,
      data: {
        intervention: {
          id: id,
          removeIntervention: true,
        }
      }
    }).then(resp => {
      if(resp.error == 0){
        props.getInterventions(); /// gewoon nog een keer ophalen
      }
    });
  }

  function stopPropagation(e){
    e.stopPropagation();
  }

  //////////////////////
  ///Sorting
  const [draggedElIndex, setDraggedElIndex] = useState('');
  const [droppedElIndex, setDroppedElIndex] = useState('');

  function dragEnd(e){
    e.target.classList.remove("isDragged");
  }
  function dragStart(e){
    setDraggedElIndex(e.target.getAttribute('index'));
    e.target.classList.add("isDragged")
  }
  function dragOver(e){
    if(droppedElIndex != e.currentTarget.getAttribute('index'))
    {
      setDroppedElIndex(e.currentTarget.getAttribute('index'));
      removeDropClass()

      e.currentTarget.classList.add("drop_here")
    }

    e.stopPropagation();
    e.preventDefault();
  }
  function drop(e){
    let newInterventions = interventions;
    let element = newInterventions[draggedElIndex];

    newInterventions.splice(draggedElIndex, 1);
    newInterventions.splice(droppedElIndex, 0, element);

    let interventionOrderToSave = [];
    for(let iv = 0 ; iv < newInterventions.length ; iv++){
      interventionOrderToSave.push(newInterventions[iv].id);
    }

    saveInterventionOrder(interventionOrderToSave)
    setInterventions(newInterventions)
    setDraggedElIndex(e.currentTarget.getAttribute('index'));

    removeDropClass()
    for(let i = 0 ; i < newInterventions.length ; i++)
    {
      var el = document.getElementById("intervention_" + newInterventions[i].id);
      el.setAttribute('draggable', "false")
      el.classList.remove("isDragged");
      if(i == droppedElIndex)
      {
        el.classList.add("hovered");
      } else {
        el.classList.remove("hovered");
      }
    }
  }
  function activeDragAndDrop(){
    //ReactTooltip.hide()
    for(let i = 0 ; i < interventions.length ; i++)
    {
      var element = document.getElementById("intervention_" + interventions[i].id);
      element.setAttribute('draggable', "true")
    }
  }
  function removeDropClass()
  {
    for(let i = 0 ; i < interventions.length ; i++)
    {
      var element = document.getElementById("intervention_" + interventions[i].id);
      element.classList.remove("drop_here");
    }
  }

  function saveInterventionOrder(interventionOrder){
    apiCall({
      action: "save_intervention_order",
      token: auth.token,
      intervention_order: interventionOrder
    }).then(resp => {
      if(resp.error == 0){
        props.getInterventions(); /// gewoon nog een keer ophalen
      }
    });
  }

  return (
    <div className="intervention_links clearfix card_holder">
      {interventions.map((intervention, index) => {
        return (
          <div
            id={"intervention_" + intervention.id}
            index={index}
            key={intervention.id}
            className={"card" + (toDeleteId == intervention.id ? ' to_delete':'')}
            onDragStart={(e) => dragStart(e)}
            onDrop={(e) => drop(e)}
            onDragOver={(e) => dragOver(e)}
            onDragEnd={(e) => dragEnd(e)}
            onClick={event => props.onClickHandler(event, intervention)}
          >
            <div className="image" style={{ backgroundImage: "url('"+(typeof intervention.settings.coverPhoto != "undefined" && intervention.settings.coverPhoto != "" ? intervention.settings.coverPhoto:'')+"')" }}>
            </div>
            <div className="content">
              <h2>{intervention.title}</h2>
              {appSettings.lesson_subtitle_in_overview == true && intervention.settings.subtitle ?
                parse(intervention.settings.subtitle)
                :''}
              <div className="actions">
                {auth.userType == "admin" ?
                  <div className="more" onMouseDown={e => activeDragAndDrop()}>
                    <i className="fas fa-ellipsis-h"></i>
                    <div className="the_actions">
                      {interventions.length > 1 ?
                        <i className="fas fa-expand-arrows-alt" onClick={(e)=>stopPropagation(e)}></i>
                        :''}
                      <i className="far fa-trash-alt" onClick={(e)=>deleteInterventionConfirm(e, intervention.id, intervention.title)}></i>
                    </div>
                  </div>
                :false}
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>
        );
      })}
      <ConfirmBox
        confirmOptions={confirmOptions}
        setConfirmOptions={setConfirmOptions}
        setToDeleteIndex={setToDeleteId}
      />
    </div>
  );
};

export default InterventionLinks;
