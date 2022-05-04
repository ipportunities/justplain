import React from 'react';
import parse from 'html-react-parser';

const QuestionTextfield = (props) => {
  return (
    <div>
      <h4>Vraag</h4>
      {parse(props.part.question)}
      <input type="text" value=""/>
    </div>
  );
}

export default QuestionTextfield;
