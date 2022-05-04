import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Menu = props => {
  let location = useLocation();
  const history = useHistory();
  const [treePart, setTreePart] = useState([]);
  const [finishedParts, setFinishedParts] = useState([]);
  const curr_id = location.pathname.split("/")[2]

  useEffect(() => {
    if (props.treePart != "") {
      if (props.treePart.children) {
        setTreePart(props.treePart.children);
      }
    }
    /// todo pagehistory wordt nog niet geupdate
    if (props.pagesHistory != "") {
      let tempFinishedParts = []
      for(let i = 0 ; i < props.pagesHistory.length ; i++){
        tempFinishedParts.push(props.pagesHistory[i].the_id)
      }
      setFinishedParts(tempFinishedParts)
    }
  }, [props]);

  function backToDashboard() {
    history.push("/course/" + props.interventionId + "/lessons");
  }

  function goTo(id){
    if(finishedParts.includes(id) || curr_id == id)
    {
      history.push("/lesson/" + id);
      props.changeLessonContent(props.treePart, id)
    }
  }

  return (
    <div className="clearfix">
      <div>
        <span className="btn back" onClick={backToDashboard}>
          Back to dashboard
        </span>
      </div>
      <div className="menu">
        <div className="parent">
          <span onClick={()=>goTo(props.treePart.id)}>{props.treePart.title}</span>
        </div>
        <div className="subparts">
          {treePart.map((part, index) => (
            <div className="title"
              key={index}
              className={
                "part" +
                (props.currentLessonId == part.id ? " active" : "") +
                (props.indexLessonId > index ? " done" : "")
              }
              data-nested={part.nest}
            >
              <span onClick={()=>goTo(part.id)} className={(curr_id == part.id ? 'active':'') + (finishedParts.includes(part.id) ? ' done':' not_done')}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        {part.title}
                      </td>
                      <td>
                      {(finishedParts.includes(part.id) && curr_id != part.id ?
                        <img src={require('../../../../../images/course/standard/done.jpg')}/>
                        :
                        <div>
                          {curr_id == part.id ? '':<img src={require('../../../../../images/course/standard/lock.jpg')}/>}
                        </div>
                      )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
