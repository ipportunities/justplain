import React from "react";
import { useHistory } from "react-router-dom";
import t from "../../translate";
import LogOut from "./logout";
import LanguageSwitch from "./languageswitch";
import $ from "jquery";

const MenuSuperUser = props => {
  let history = useHistory();

  const handleClick = (event, redirectTo) => {
    $("#menu_left").animate(
      {
        marginRight: "-405px"
      },
      600
    );
    $("#nav-icon-wrapper, #menu_left").removeClass("open");
    $(".overlay").fadeOut();
    history.push("/"+redirectTo);
  };

  return (
    <div>
      <div className="pointer" onClick={event => handleClick(event, "")}>
        <i className="fas fa-home"></i>
        <div className="menu-left-link">{t("Dashboard")}</div>
      </div>
      <div className="pointer" onClick={event => handleClick(event, "users")}>
        <i className="fas fa-users color_orange"></i>
        <div className="menu-left-link">{t("Gebruikers")}</div>
      </div>
      <div
        className="pointer"
        onClick={event => handleClick(event, "organisations")}
      >
        <i className="fas fa-landmark color_purple"></i>
        <div className="menu-left-link">{t("Organisaties")}</div>
      </div>
      <div
        className="pointer"
        onClick={event => handleClick(event, "translations")}
      >
        <i className="fas fa-language color_blue"></i>
        <div className="menu-left-link">{t("UI Vertalingen")}</div>
      </div>
      {/* <div className="pointer" onClick={event => handleClick(event, "stats")}>
        <i className="fas fa-chart-bar color_green"></i>
        <div className="menu-left-link">{t("Statistieken")}</div>
      </div>
      <div className="pointer" onClick={event => handleClick(event, "logs")}>
        <i className="fas fa-list color_red"></i>
        <div className="menu-left-link">{t("Logs")}</div>
      </div> */}
      <LogOut />
      <LanguageSwitch />
    </div>
  );
};

export default MenuSuperUser;
