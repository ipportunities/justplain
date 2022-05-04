import apiCall from "../api";
import store from "../../reducers/store";

export const useTranslation = () => {
  // TODO this can be made better but for now uses the default translation function below
  return t
}

export default function t(str) {


    if (str === undefined || str.length < 1)
    {
        return str;
    }
    let translation = [];
    const state = store.getState();
    //if (typeof state.intervention.settings.ui_translation !== 'undefined')
    if (parseInt(state.uiTranslation.language_id) !== 1)
    {
        translation = state.uiTranslation.translation;

        //// hij loopt bij een nieuw account vast op translation...
        if(typeof translation == "undefined"){
          return str;
        } else {
          const trans = translation.find(item => {
              return item[0] === str;
          })

          if (typeof trans !== 'undefined')
          {
              return trans[1];
          }
          else
          {
              //string niet gevonden...
              apiCall({
                  action: "save_translation_string",
                  data: {
                      string: str
                  }
                }).then(resp => {
                });
              return str;

          }
        }
    }
    else
    {
        return str;
    }

}
