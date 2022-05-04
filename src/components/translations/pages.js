import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../translate";
import Page from "./page";

const TranslatePages = () => {

  const intervention = useSelector(state => state.intervention);

  const [activePageId, setActivePageId] = useState(0);
  useEffect(() => {
    if(intervention.settings.pages[0]){
        setActivePageId(intervention.settings.pages[0].id);
    }

  }, [intervention.settings.pages[0]])

  const selectPage = (e) => {
    setActivePageId(e.target.value);
  }

  return (
    <div>
      <select className="custom-select" onChange={(e) => selectPage(e)}>
      {
        intervention.settings.pages.map((page, index) => {
          return (
            <option key={index} value={page.id}>
              {
                parseInt(page.parent_id) === 0 ? '' : ' - - - - - - '
              }
              {page.title}
            </option>
          )
        })
      }
      </select>
      <br /><br />
      <Page activePageId={activePageId} />

    </div>
  )

}

export default TranslatePages;
