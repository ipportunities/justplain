import React from 'react';

const QuestionTextarea = (props) => {
  return (
    <div>
      <h4>Vraag</h4>
      <input
        type="text"
        name={`part_${props.index}`}
        label=""
        placeholder="Korte omschrijving"
        defaultValue={props.part.question}
        onChange={(e) => props.updatePart(props.index, 'question', e.target.value)}
        />
      <textarea disabled></textarea>
    </div>
  );
}

export default QuestionTextarea;
