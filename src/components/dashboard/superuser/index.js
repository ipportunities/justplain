import React from "react";
import { useHistory } from "react-router-dom";
import t from "../../translate";
import LeftMenu from "../leftmenu";

const Superuser = props => {
  let history = useHistory();

  const handleClick = (event, redirectTo) => {
    history.push(redirectTo);
  };

  return (
    <div className="transWrapper">
      <div className="container dashboard_container">
        <LeftMenu />
        <div
          className="card dashboard_card"
          onClick={event => handleClick(event, "users")}
        >
          <div className="card-header dashboard_card_header">
            <i className="fas fa-users color_orange"></i>
            {t("Gebruikers")}
          </div>
          <div className="card-body dashboard_card_body">
            <h5 className="card-title">{t("Beheer gebruikers")} ></h5>
            <p className="card-text text-muted">
              {t(
                "Met deze module kunt u gebruikers aanmaken, hun rechten toewijzen en koppelen aan organisaties..."
              )}
            </p>
          </div>
        </div>

        <div
          className="card dashboard_card"
          onClick={event => handleClick(event, "organisations")}
        >
          <div className="card-header dashboard_card_header">
            <i className="fas fa-landmark color_purple"></i>
            {t("Organisaties")}
          </div>
          <div className="card-body dashboard_card_body">
            <h5 className="card-title">{t("Beheer organisaties")} ></h5>
            <p className="card-text text-muted">
              {t("Met deze module kunt u organisaties beheren...")}
            </p>
          </div>
        </div>

        <div
          className="card dashboard_card"
          onClick={event => handleClick(event, "translations")}
        >
          <div className="card-header dashboard_card_header">
            <i className="fas fa-language color_blue"></i>
            {t("UI Vertalingen")}
          </div>
          <div className="card-body dashboard_card_body">
            <h5 className="card-title">{t("Beheer vertalingen")} ></h5>
            <p className="card-text text-muted">
              {t("Met deze module kunt u de vertalingen van alle strings in de user interface beheren.")}
            </p>
          </div>
        </div>

        {/* <div
          className="card dashboard_card"
          onClick={event => handleClick(event, "stats")}
        >
          <div className="card-header dashboard_card_header">
            <i className="fas fa-chart-bar color_green"></i>
            {t("Statistieken")}
          </div>
          <div className="card-body dashboard_card_body">
            <h5 className="card-title">{t("Bekijk statistieken")} ></h5>
            <p className="card-text text-muted"></p>
          </div>
        </div>

        <div
          className="card dashboard_card"
          onClick={event => handleClick(event, "stats")}
        >
          <div className="card-header dashboard_card_header">
            <i className="fas fa-list color_red"></i>
            {t("Logs")}
          </div>
          <div className="card-body dashboard_card_body">
            <h5 className="card-title">{t("Bekijk logs")} ></h5>
            <p className="card-text text-muted"></p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Superuser;
