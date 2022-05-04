import React, {useState, useEffect} from 'react';

const Routing = props => {

   const [routableParts, setRoutableParts] = useState([]);
   const [routingAvailable, setRoutingAvailable] = useState(false);

   useEffect(() => {
     if(props.parts !== "")
     {
        getRoutableParts();
     }
  }, [props]); /// deze vullen als je na state change use effect wil aanroepen

   function getRoutableParts(){
      /// get next page
      let routablePartsUpdate = [];
      let pageCounter = 0;
      let currentPage = false;
      let routingAvailableTemp = false;

      for(let i = 0 ; i< props.parts.length; i++ )
      {
          /// get current page index of item
          if(i === parseInt(props.index)) {
             currentPage = pageCounter;
          }
          if(props.parts[i].subtype === "einde pagina")
          {
             pageCounter++;
          } else {
            let checkAgainst = currentPage
            if(typeof props.skipNext !== "undefined" && props.skipNext === 'true'){
              checkAgainst = currentPage + 1

            }

             if(pageCounter > checkAgainst && currentPage !== false)
             {
               /// get parts next page
               routablePartsUpdate.push(props.parts[i]);
               routingAvailableTemp = true;

             }
          }
      }
      setRoutingAvailable(routingAvailableTemp)
      props.setRoutingAvailable(routingAvailableTemp)
      setRoutableParts(routablePartsUpdate);
   }

   function getQuestionReference(part){
      if(part.question === "" && typeof part.content !== "undefined")
      {
         return part.content.substring(0,20).replace(/<[^>]*>?/gm, '');
      } else {
         return part.question.replace(/<[^>]*>?/gm, '')
      }
   }
   
   return(
     <div className={"setRouting" + (routingAvailable && props.routingOn ? '':' hide')}>
      {routingAvailable ?
         <select onChange={(e)=>props.updateRouting(e.target.value, props.item_id)} value={props.routing}>
            <option value="">Geen routing</option>
            {routableParts.map((part, index) =>
               <option key={index} value={part.id}>
                  {getQuestionReference(part)}
               </option>
            )}
         </select>
         :''}
     </div>
   )
}

export default Routing;
