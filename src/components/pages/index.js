import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import { useHistory } from "react-router-dom";
import t from "../translate";
import { setActivePart, setActivePage } from "../../actions";


const Overview = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const intervention = useSelector(state => state.intervention);

  const changeActivePage = (page_id) => {
    dispatch(setActivePart('page'));
    dispatch(setActivePage(page_id));
    history.push("/course/" + intervention.id + "/page/" + page_id);
  }

  return(
    <div className="pages">
      <h1>{t('Meer informatie')}</h1>
      <ul>
        {intervention.settings.pages.map((page, key) => (
          <li onClick={e=>changeActivePage(page.id)} className="cursor" key={key}>
            <img src={require('../../images/course/standard/chevron.png')} className='chevron'/> {page.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Overview;
