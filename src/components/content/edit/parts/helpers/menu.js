import React, { useState, useEffect } from "react";
import t from "../../../../translate";
import {upperFirst} from "../../../../helpers/text.js";

const Menu = props => {

  const [showOptions, setShowOptions] = useState(false);
  const [showSecondaryMenu, toggleSecondaryMenu] = useState(false);
  const [showSecondaryOption, toggleSecondaryOptions] = useState(false);
  const [selectedComponent, setselectedComponent] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.showHideMenu != ""){
      setShowMenu(props.showHideMenu)
    }
  }, [props]);

  ////////////////////////////////////////////
  /////////Menu click functions
  ///////////////////////////////////////////
  function handleFirstLevelMenuClick(option){
    if(option.subtypes.length == 0)
    {
      toggleSecondaryMenu(false);
      props.addPart(props.menuIndex, JSON.parse(JSON.stringify(option.content)))
    } else if(option.subtypes.length == 1) /// enkele meer keuze optie items hebben er nog maar 1 nu...
    {
      toggleSecondaryMenu(false);
      let tempSelectedComponent = option;
      tempSelectedComponent.content.subtype = option.subtypes[0].ref;
      props.addPart(props.menuIndex, JSON.parse(JSON.stringify(tempSelectedComponent.content)))
    } else {
      toggleSecondaryOptions(false);
      toggleSecondaryMenu(true);
      setTimeout(function(){
        setselectedComponent(option);
        toggleSecondaryOptions(true);
      },250);
    }
  }
  function handleSecondLevelMenuClick(selectedComponent, chosenSubtype)
  {
    selectedComponent.content.subtype = chosenSubtype;
    hideMenu()
    props.addPart(props.menuIndex, JSON.parse(JSON.stringify(selectedComponent.content)))

  }

  ////////////////////////////////////////////
  /////////Hide menu
  ///////////////////////////////////////////
  function hideMenu(){
    props.hideMenu()
    setShowMenu(false)
    toggleSecondaryMenu(false);
  }

  function handleParentGroupClick(group){
    setShowOptions(group)
    toggleSecondaryMenu(false)
    if(group != showOptions){
      setselectedComponent(false)
    }

  }

  //console.log(props.options);

  return(
    <div>
    <div className={"menu " + (showMenu == true ? 'show' : '')}>
      <div className={"left " + (showSecondaryMenu == false ? 'shadow' : '')}>
        <div className="holderClose"><i className="fas fa-times" onClick={() => hideMenu()}></i></div>
        <div className="components">
          {props.options.map((option, index) =>
            <div key={index}>
              {option.title == "Tekst" ?
                <div className={"group" + (showOptions == "text" ? ' active':'')} onClick={()=>handleParentGroupClick("text")}>
                  {t("Content")}
                </div>
                :''}
              {option.title == "Video" ?
                <div className={"group" + (showOptions == "media" ? ' active':'')} onClick={()=>handleParentGroupClick("media")}>
                  {t("Media")}
                </div>
                :''}
              {option.title == "Checkboxes" ?
                <div className={"group" + (showOptions == "questions" ? ' active':'')} onClick={()=>handleParentGroupClick("questions")}>
                  {t("Vragen")}
                </div>
                :''}
              {option.title == "Speciaal" ?
                <div className={"group" + (showOptions == "special" ? ' active':'')} onClick={()=>handleParentGroupClick("special")}>
                  {t("Speciaal")}
                </div>
                :''}
                {showOptions == option.parentGroup ?
                  <div key={index} onClick={() => handleFirstLevelMenuClick(option)} className={"part" + (selectedComponent.title == option.title ? ' selected' : '')}>
                    <i className={option.icon}></i>{t(option.niceName)}
                  </div>
                  :false}
            </div>
          )}
        </div>
      </div>
      <div className={"right " + (showSecondaryMenu != false ? 'show' : '')} >
        <ul className={(showSecondaryOption != false ? 'show' : 'hide')}>
          {selectedComponent != false ? selectedComponent.subtypes.map((chosenSubtype, index) =>
            <li key={index} onClick={() => handleSecondLevelMenuClick(selectedComponent, chosenSubtype.ref)}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <i className={selectedComponent.icon}></i>
                    </td>
                    <td>
                      {upperFirst(chosenSubtype.niceName)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          ) : ''}
        </ul>
      </div>
    </div>
    <div
      className={"menuOverlay " + (showMenu == true ? 'show' : '')}
      onClick={() => hideMenu()}
      ></div>
    </div>
  )
}

export default Menu;
