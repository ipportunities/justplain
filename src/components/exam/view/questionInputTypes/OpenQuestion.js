import React from 'react'

export const OpenQuestion = ({ coachView, question, setAnswer, answerView }) => {

  let value
  if (coachView) {
    value = answerView ? question.result.givenAnswer : question.answers[0].answer
  } else {
    value = question.givenAnswer ? question.givenAnswer : ''
  }

  return <div>
    <textarea
      className="form-control p-2"
      rows={ 4 }
      onChange={ coachView ? () => {} : e => setAnswer(e.target.value) }
      value={ value }
    />
  </div>
}
