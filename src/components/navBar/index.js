import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../translate";
import {appSettings} from "../../custom/settings";
import { useLocation } from 'react-router-dom'

const NavBar = () => {

  const auth = useSelector(state => state.auth);
  let location = useLocation();

  /*
  <span className={(auth.user_id !== 0) ? 'loggedInAs' : 'hidden'} >
    {t("Ingelogd als: ")} {auth.name} ({auth.userType})
  </span>
  */

  //// link is nu nog niet dynamisch
  return (
    <div>
      {auth.userType != "student" ?
      <nav className="navbar navbar-expand-lg navbar-light">
        {appSettings.home_url_extern != false && location.pathname == "/" ?
          <a href={appSettings.home_url_extern}>
            <img src={appSettings.logo} className="logo"/>
          </a>
          :
          <Link to="/">
            <img src={appSettings.logo} className="logo"/>
          </Link>
        }
      </nav>
      :'' }
    </div>
  );
};

export default NavBar;
