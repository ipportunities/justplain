import React from 'react';
import parse from 'html-react-parser';

const QuestionTextarea = (props) => {
  return (
    <div>
      <h4>Vraag</h4>
      {parse(props.part.question)}
      <textarea></textarea>
    </div>
  );
}

export default QuestionTextarea;
