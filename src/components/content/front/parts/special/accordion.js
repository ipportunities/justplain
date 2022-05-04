import React, {useState, useEffect}  from 'react';
import parse from 'html-react-parser';
import { getClone } from "../../../../utils";

const Accordion = (props) => {

  const [state, setState] = useState({
    items:[],
    active_item:0
  });

  const placeholder_title = "";
  const placeholder_text = "";

  //////////////////////
  ///Get content
  //////////////////////
  useEffect(() => {

    if(props.items != "")
    {
      let newState = getClone(state)
      newState.items = props.items
      for(let i = 0 ; i < newState.items.length ; i++){
        newState.items[i].visible = false;
      }
      setState(newState);
    }
  }, [props.items]);


  //////////////////////
  ///Toggle items
  //////////////////////
  function toggleVisibility(index)
  {
    let clonedState = getClone(state);
    if(clonedState.items[index].visible == true)
    {
      clonedState.items[index].visible = false;
      clonedState.active_item = 0
    } else {
      for(let i = 0 ; i < clonedState.items.length ; i ++)
      {
        clonedState.items[i].visible = false;
      }
      clonedState.items[index].visible = clonedState.items[index].visible == true ? false:true;
      clonedState.active_item = index
    }

    setState(clonedState)
  }

  //////////////////////
  ///Content
  //////////////////////
  return (
    <div className="special accordion">
      <div className="items">
        { state.items.map((item, index) =>
          <div key={index} className={"item " + (item.visible == true ? 'content_visible':'')} >

            <div className="title pointer" onClick={() => toggleVisibility(index)}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      {parse(item.content)}
                    </td>
                    <td>
                      <i className={"toggle_content fas fa-chevron-" + (item.visible != true ? 'up':'down')}></i>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div className={(item.visible == true ? 'slideDown':'slideUp')}>
                {parse(item.content2)}
                {typeof item.image != "undefined" && item.image != '' ?
                  <div className="ImageHolderRelative">
                    <img src={item.image}/>
                  </div>
                :''}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Accordion;
