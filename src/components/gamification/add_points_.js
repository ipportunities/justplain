import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import { getClone } from "../utils";
import t from "../translate";
import $ from "jquery";
import { setGamification } from "../../actions";

let addPointsTimeout = null

const AddPoints = (props) => {

  const intervention = useSelector(state => state.intervention);
  const gamification = useSelector(state => state.gamification);
  const [gamificationLocal, setGamificationLocal] = useState(false);
  const [addPointsNotifications, setAddPointsNotifications] = useState([])

  const dispatch = useDispatch();

  const notification_types = [
    {type:'login', text:"Ingelogd" },
    {type:'start_intervention', text:"Start interventie" },
  ];

  useEffect(() => {
    if(intervention.id > 0){
      ///misschien niet nodig...
      let tempGamification = getClone(gamification)
      let points = 0;
      let add_points_to_total = 0;
      if(typeof intervention.settings.gamification.pointsData != "undefined"){

        for(let i=0 ; i < notification_types.length ; i++){
          if(tempGamification.notifications[notification_types[i].type]){
            points = intervention.settings.gamification.pointsData[notification_types[i].type];

            ///Snel achterelkaar zetten vookomen?
            ///add to notifications to show
            tempGamification.notificationsToShow.push({
              points:points,
              text:notification_types[i].text,
              id:intervention.id,
              type:notification_types[i].type
            })
            ///set to false
            tempGamification.notifications[notification_types[i].type] = false;

            ////add points to total
            let this_gam_int_obj = tempGamification.points.interventions.filter(function (interventionn) {
              return intervention.id === interventionn.id
            });
            if(this_gam_int_obj.length != 0){
              tempGamification.points.interventions[tempGamification.points.interventions.indexOf(this_gam_int_obj[0])].points = points;
            } else {
              tempGamification.points.interventions.push({id:intervention.id, points:points})
            }
          }
        }
        ///update in redux
        dispatch(setGamification(getClone(tempGamification)))
        setGamificationLocal(getClone(tempGamification))
      }
    }
  }, [intervention]);

  useEffect(() => {
    if(gamificationLocal){
      ///set in component
      setAddPointsNotifications([...gamificationLocal.notificationsToShow])

      //animate
      $(document).ready(function(){
        let top = (gamificationLocal.notificationsToShow.length * 70);
        $(".pointsContainer").css({"top":(20 - top) + "px"}).show();
        clearTimeout(addPointsTimeout);
        addPointsTimeout = setTimeout(function(){
          if($(".pointsContainer").length){
            $(".add_points").each(function(index ){
              $(this).show();
              $(".pointsContainer").delay(500).animate({top:parseInt($(".pointsContainer").css("top")) + 70 + (index * 70) + "px"});
            });
            setTimeout(function(){
              let total_add_points = $(".add_points").length;
              $($(".add_points").get().reverse()).each(function (index) {
                  $(this).delay(1000 * index).fadeOut();
                  removeNotificationToShow(this.id.replace("notification_", ""), $(this).attr("data-id"));
              });
              //$(".pointsContainer").animate({top:-50});
            }, 2000);
          }
        }, 1000);
      });
    }

  }, [gamificationLocal]);


  ///kunnen notificaties elkaar in de weg zitten..... dit is nog wel een dingetje
  function removeNotificationToShow(type, id, index){
    let this_notification_obj
    if(type == "login"){
      this_notification_obj = gamification.notificationsToShow.filter(function (notification) {
        return notification.type === type
      });
    } else {
      this_notification_obj = gamification.notificationsToShow.filter(function (notification) {
        return notification.type === type && notification.id === id
      });
    }

    if(this_notification_obj.length != 0){
      gamification.notificationsToShow.splice(gamification.notificationsToShow.indexOf(this_notification_obj[0]), 1);
      dispatch(setGamification(gamification))
      setTimeout(function(){
        setGamificationLocal(gamification)
      }, 1000)

    }
  }


  return(
    <>
    {addPointsNotifications.length > 0 ?
      <div className="pointsContainer">
        {addPointsNotifications.map((notification, index) =>(
          <div key={index} className="add_points" id={"notification_" + notification.type} data-id={notification.id}>
            <div className="content">
              {notification.text} <i className="fas fa-plus"></i> <span className="points">{notification.points}</span>
            </div>
          </div>
        ))}
      </div>
      :''}
    </>
  )
}

export default AddPoints
