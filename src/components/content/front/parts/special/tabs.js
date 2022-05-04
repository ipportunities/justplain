import React, {useState, useEffect}  from 'react';
import parse from 'html-react-parser';
import { getClone } from "../../../../utils";

const Tabs = (props) => {

  const [state, setState] = useState({
    items:[],
    active_item:0
  });

  const placeholder_title = "blalalsd asd asd";
  const placeholder_text = "blalala caldjsaf safjasljdasjldbasljdhasj asdffjasljdasjldbasl asd asd asd asd asd asd asd asd asd";

  //////////////////////
  ///Get content
  useEffect(() => {

    if(props.items != "")
    {
      let newState = getClone(state)
      newState.items = props.items
      for(let i = 0 ; i < newState.items.length ; i ++)
      {
        if(newState.items[i].visible != false){
          newState.active_item = i;
        }
      }
      setState(newState);
    }
  }, [props]);

  //////////////////////
  ///Toggle visibility item
  function toggleVisibility(index)
  {
    let clonedState = getClone(state);
    for(let i = 0 ; i < clonedState.items.length ; i ++)
    {
      clonedState.items[i].visible = false;
    }
    clonedState.items[index].visible = clonedState.items[index].visible == true ? false:true;
    clonedState.active_item = index
    setState(clonedState)
  }

  //////////////////////
  ///Content
  return (
    <div className="special accordion">
      <div className="tabs">
        { state.items.map((item, index) =>
          <div key={index} className={"item " + (item.visible == true ? 'content_visible':'')} onClick={() => toggleVisibility(index)}>
            <div className="title">
              {item.content}
            </div>
          </div>

        )}
      </div>
      <div className="tabContent">
        { state.items.map((item, index) =>
          <div key={index} className={"item " + (item.visible == true ? 'content_visible':'')}>
            <div className="content">
              <div className='phone'>
                {item.content}
              </div>
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

export default Tabs;
