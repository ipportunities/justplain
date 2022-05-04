import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import t from "../translate";
import LogOut from "./logout";
import LinkBox from "../profile/linkBox.js";
import $ from "jquery";
import { setActivePart } from "../../actions";
import { setShowLeftMenu, setActivePage } from "../../actions/";
import {appSettings} from "../../custom/settings";

const MenuStudent = props => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [logoToUse, setLogoToUse] = useState('');

  const activeIntervention = useSelector(state => state.activeIntervention);
  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  /// dit zou een aparte functie component kunnen worden <= wordt bij leftbottom gebruikt
  useEffect(() => {
    if(intervention.id > 0){
      if(typeof intervention.settings.logo != 'undefined' && intervention.settings.logo != '')
      {
        setLogoToUse(intervention.settings.logo)
      } else {
        setLogoToUse(appSettings.logo)
      }
    }
    window.addEventListener('resize', closeAuto)
  }, [intervention]);

  /// close on resize if is open and in desktop view
  function closeAuto(){
    if($("#menu_left").hasClass("open") && !$(".menu .phone").is(":visible")){
      dispatch(setShowLeftMenu(false))
    }
  }

  const changeActivePage = (page_id) => {
    dispatch(setShowLeftMenu(false))
    dispatch(setActivePart('page'));
    dispatch(setActivePage(page_id));
    history.push("/course/" + intervention.id + "/page/" + page_id);
  }

  return (
    <div>
      <img src={logoToUse} className="logo"/>
      <div className="items">

        {intervention.settings.pages.map((page, key) => (
          <div key={key} className="item" onClick={()=>changeActivePage(page.id)}>
            <div className="menu-left-link">{page.title}</div>
          </div>
        ))}

      </div>
      {appSettings.profile != false ? <LinkBox/>:false}
    </div>
  );
};

export default MenuStudent;
