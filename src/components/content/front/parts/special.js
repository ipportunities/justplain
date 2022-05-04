import React from "react";
import Accordion from "./special/accordion.js";
import Tabs from "./special/tabs.js";
import Matrix from "./special/matrix.js";
import Table from "./special/table.js";
import DownloadFile from "./special/download_file.js";
import Speechballoon from "./special/speech_balloon.js";
import Cards from "./special/cards.js";

const Special = props => {

  function getContent() {
    if (props.part.subtype == "accordion") {
      return (
        <Accordion
          items={props.part.items}
          index={props.index}
          updatePart={props.updatePart}

        />
      );
    }
    if (props.part.subtype == "tabs") {
      return (
        <Tabs
          items={props.part.items}
          index={props.index}
          updatePart={props.updatePart}

        />
      );
    }
  if (props.part.subtype == "matrix") {
    return (
      <Matrix
        part={props.part}
        index={props.index}
        updatePart={props.updatePart}
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
    if (props.part.subtype == "cards") {
      return (
        <Cards
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
          file={typeof props.part.file !== "undefined"?props.part.file:''}
          updatePart={props.updatePart}
        />
      );
    }
    if (props.part.subtype == "spreekballon") {
      return (
        <Speechballoon
          part={props.part}
          index={props.index}
          updatePart={props.updatePart}
        />
      );
    }
  }

  return (
    <div>
      <div className="center">{getContent()}</div>
    </div>
  );
};

export default Special;
