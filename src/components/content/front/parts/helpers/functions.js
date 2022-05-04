import React from "react";
import parse from 'html-react-parser';

export const getQuestion = (part) => {
  let question = part.question
  if(part.must){
    let split_question_p = part.question.split("</p>");
    let split_question_br = part.question.split("<br>");

    ///laatste element is </p>
    if(split_question_p[split_question_p.length - 1] == ""){
      split_question_p[split_question_p.length - 2] = split_question_p[split_question_p.length - 2] + " *";
      question = split_question_p.join("")
      ///laatste element is <br>
    } else if(split_question_br[split_question_br.length - 1] == ""){
      split_question_br[split_question_br.length - 2] = split_question_br[split_question_br.length - 2] + " *";
      question = split_question_br.join("")
      ///gewone tekst
    } else {
      question = question + " *";
    }
  }
  return parse(question);
}
