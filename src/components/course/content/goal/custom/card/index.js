import React from "react";
import StandardCard from "./standard.js";
import CustomCard24 from "./24.js";

//// als geen custom card is aangemaakt toon de custom variant
const GetCard = (props) => {

  function getContent(){
    let card = <StandardCard {...props}/>;

    switch(props.activeGoal) {
      case "24":
        card = <CustomCard24 {...props} />;
        break;
    }

    return card;
  }

  return(
    <div>
      {getContent()}
    </div>
  )
}

export default GetCard
