import React, {useState, useEffect} from "react";
import ContentEditable from 'react-contenteditable'

const Badges = props => {

  const [showBadges, setShowBadges] = useState(false)
  const [badges, setBadges] = useState([])

  function toggleBadges(){
    setShowBadges(showBadges ? false:true)
  }


  useEffect(() => {
    if(typeof props.value != "undefined"){
      setBadges(props.value.split(","));
    }

  }, [props]);

  function getBadge(option){
    let image = 1;
    if(typeof props.badgetsData[props.type + "_badges"] != "undefined"){
      let this_badge_obj = props.badgetsData[props.type + "_badges"].filter(function (badge) {
        return badge.option === option
      });

      if(this_badge_obj.length != 0){
        if(typeof this_badge_obj[0].image != "undefined"){
            image = this_badge_obj[0].image
        }
      }
    }

    return image;

  }

  return(
    <div>
      {props.type}
      <ContentEditable
        html={typeof props.value != "undefined" ? props.value:''}
        disabled={false}
        onChange={(e) => props.updateBadges(props.type, e.target.value)}
        placeholder={props.placeholder}
      />
      {badges.length > 0 ?
        <span data-tip="Wijzig les" className="btn edit disabled" onClick={()=>toggleBadges()}><i className="fas fa-images"></i></span>
        :''}
      {showBadges ?
        <div className="setBadges">
          {badges.map((option, index) => (
            <span onClick={()=>props.setSetBadgesOption(props.type + "_" + option)}>
              <img src={require('../../../../custom/images/badges/'+getBadge(option)+'.png')} />
              {option}
            </span>
          ))}
        </div>
        :''}
    </div>
  )
}

export default Badges
