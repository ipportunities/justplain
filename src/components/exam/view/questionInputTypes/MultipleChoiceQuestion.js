import React from 'react'

export const MultipleChoiceQuestion = ({ coachView, question, setAnswer, answerView }) => {

  const isChecked = (answer) => {
    if (coachView) {
      return answerView ? +question.result.givenAnswer === +answer.order : +answer.correct
    } else {
      return question.givenAnswer ? question.givenAnswer === answer.order : false
    }
  }

  return question.answers.sort((a, b) => a.order - b.order).map(answer =>
    <div key={ answer.order } className="form-check">
      <input type="checkbox"
             className="form-check-input"
             checked={ isChecked(answer) }
             onChange={ coachView ? () => {} : () => setAnswer(answer.order) }
             id={ `checkbox-answer-${ answer.order }` } />
      <label className="form-check-label" htmlFor={ `checkbox-answer-${ answer.order }` }>
        { answer.answer }
      </label>
    </div>
  )
}