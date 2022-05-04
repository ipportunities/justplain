import React from "react";
import { componentOptions } from "./helpers/options.js";
import Accordion from "./special/accordion.js";
import Tabs from "./special/tabs.js";
import Table from "./special/table.js";
import DownloadFile from "./special/download_file.js";
import Cards from "./special/cards.js";
import Speechballoon from "./special/speech_balloon.js";
import t from "../../../translate";

const Special = props => {
  //////////////////////
  ///Beschikbare subtypes
  const this_componentOptions = componentOptions.filter(function(option) {
    return option.title === "Speciaal";
  });
  const available_subtypes = this_componentOptions[0].subtypes;

  function getContent() {
    if (props.part.subtype == "accordion") {
      return (
        <Accordion
          items={props.part.items}
          index={props.index}
          updatePart={props.updatePart}
          showMediaLibrary={props.showMediaLibrary}
        />
      );
    }
    if (props.part.subtype == "tabs") {
      return (
        <Tabs
          items={props.part.items}
          index={props.index}
          updatePart={props.updatePart}
          showMediaLibrary={props.showMediaLibrary}
        />
      );
    }
    if (props.part.subtype == "tabel") {
      return (
        <Table
          part={props.part}
          index={props.index}
          updatePart={props.updatePart}
        />
      );
    }
    if (props.part.subtype == "download bestand") {
      return (
        <DownloadFile
          part={props.part}
          index={props.index}
          showMediaLibrary={props.showMediaLibrary}
          updatePart={props.updatePart}
        />
      );
    }
    if (props.part.subtype == "cards") {
      return (
        <Cards
          part={props.part}
          index={props.index}
          //showMediaLibrary={props.showMediaLibrary}
          updatePart={props.updatePart}
          showMediaLibrary={props.showMediaLibrary}
        />
      );
    }
    if (props.part.subtype == "spreekballon") {
      return (
        <Speechballoon
          part={props.part}
          index={props.index}
          showMediaLibrary={props.showMediaLibrary}
          updatePart={props.updatePart}
        />
      );
    }
  }

  const upperFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  return (
    <div>
      <select
        className="subtypeChanger"
        onChange={e => props.updatePart(props.index, "subtype", e.target.value)}
        value={props.part.subtype}
      >
        {available_subtypes.map((subtype, index) => (
          <option key={index} value={subtype.ref}>{upperFirst(t(subtype.niceName))}</option>
        ))}
      </select>
      <div className="center">{getContent()}</div>
    </div>
  );
};

export default Special;
