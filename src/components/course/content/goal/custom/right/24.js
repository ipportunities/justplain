import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../../../../../translate";

const CustomRight = () => {

  const auth = useSelector(state => state.auth);
  const [language_id, setLanguageId] = useState(1); //dutch is default

  useEffect(() => {
    //welke taal??
    if (typeof auth.preferences !== 'undefined' && Array.isArray(auth.preferences)) {
      for (const pref of auth.preferences) {
        if (pref.option === 'language_id')
        {
          setLanguageId(pref.value);
          break;
        }
      }
    }
  }, []);

  return(
    <>
    {
    (parseInt(language_id) === 1) ?
      <div className="customRight">
        <h2>Evalueer hoe het gaat</h2>
        <ul>
          <li>
            Is het je gelukt om je niveau van spanning te verlagen door de oefeningen?
          </li>
          <li>
            Op welke tijdstippen van de dag is het je het beste gelukt om je te ontspannen?
          </li>
          <li>
            Op welke plek is het je het beste gelukt om te ontspannen?
          </li>
          <li>
            Hoe wil je verder gaan met de ontspanningsoefeningen? Op welke tijd en op welke plek?
          </li>
        </ul>
        <div className="tip">
          <span>TIP:</span> Oefening baart kunst. Probeer liefst minimaal vier keer per week de ontspanningsoefening te doen.
        </div>
      </div>
    :
      <div className="customRight">
        <h2>Evaluate hoe you feel</h2>
        <ul>
          <li>
            Have you managed to lower your level of tension through the exercises?
          </li>
          <li>
            At what times of the day did you best relax?
          </li>
          <li>
            Where did you manage to relax best?
          </li>
          <li>
            How do you want to continue with the relaxation exercises? At what time and in which place?
          </li>
        </ul>
        <div className="tip">
          <span>TIP:</span> Practice makes perfect. Try to do the relaxation exercise at least four times a week.
        </div>
      </div>
    }
    </>
  )
}

export default CustomRight
