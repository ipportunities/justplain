import $ from "jquery";

export const handlePoints = (gamificationData, id, type, interventions, text) => {
  let points = getPoints(interventions, id, type)
  if(points){
    notification(type, id, text, points)
    return addPointsIntervention(gamificationData, id, points)
  }
}

export const notification = (type, id = false, text, points) => {
  setTimeout(function(){
    $("#notification_" +type+"_"+id).remove();
    $(".pointsContainer").show().prepend('<div class="add_points" id="notification_' +type+'_'+id+'" data-id="'+id+'"><div class="content">'+text+' <i class="fas fa-plus"></i> <span class="points">'+points+'</span></div></div>');
    $("#notification_" +type+"_"+id).animate({marginTop:0})
    setTimeout(function(){
      $("#notification_" +type+"_"+id).fadeOut();
    }, 2500)
  }, 500)

  return false
}

export const addPointsIntervention = (gamificationData, id, points) => {
  let pointsData = gamificationData.points.interventions;

  let this_int_obj = pointsData.filter(function (intervention) {
    return intervention.id === id
  });
  if(this_int_obj.length != 0){
    pointsData[pointsData.indexOf(this_int_obj[0])].points = parseInt(pointsData[pointsData.indexOf(this_int_obj[0])].points) + parseInt(points);
  } else {
    pointsData.push({id:id, points:points})
  }

  return pointsData;
}

export const getPoints = (interventions, id = false, type) => {
  let points = false;

  if(id){
    let this_int_obj = interventions.filter(function (intervention) {
      return intervention.id === id
    });
    if(this_int_obj.length != 0){
      if(typeof this_int_obj[0].settings.gamification != "undefined"){
          points =  this_int_obj[0].settings.gamification.pointsData[type];
      }

    }
  }

  return points;
}
