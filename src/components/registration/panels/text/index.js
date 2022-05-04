import { text_14 } from "./14.js";
import { text_24 } from "./24.js";
import { text_25 } from "./25.js";
import { text_30 } from "./30.js";
import parse from 'html-react-parser';

const text = [text_14, text_24, text_25, text_30];

export {text}

export const getText = (id, field) => {
  let text_obj = text.filter(function (intervention_text) {
    return intervention_text.intervention == id
  });

  if(text_obj.length > 0){
    return parse(text_obj[0][field]);
  }

}
