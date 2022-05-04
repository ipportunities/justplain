import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../../api";
import t from "../../translate";

const LanguageSwitch = () => {

  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);

  const [selectedOption, setSelectedOption] = useState(1); //default dutch
  const [languages, setLanguages] = useState([]);

  useEffect(() => {

    apiCall({
      action: "get_languages",
      token: auth.token,
      data: {}
    }).then(resp => {
      setLanguages(resp.languages);
    });

  }, []);

  useEffect(() => {
    if (auth.user_id !== 0 && auth.preferences !== null && typeof auth.preferences.language_id !== 'undefined')
    {
      setSelectedOption(auth.preferences.language_id);
    }
  }, [auth])

  const onChange = (e) => {
    apiCall({
      action: "change_language_pref",
      token: auth.token,
      data: {
        language_id: e.target.value
      }
    }).then(resp => {
      window.location.reload();
    });

  }

  return (
    <div>
      <select name="language_id" className="custom-select languageSwitch" style={{width: "auto"}} onChange={(e) => onChange(e)} value={selectedOption}>
        {
          languages.map((option, index) => {
            return(
              <option key={index} value={option.id}>{option.language} ({option.code})</option>
              )
          })
        }
      </select>
    </div>
  )
}

export default LanguageSwitch;
