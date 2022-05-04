import React from 'react'
import { MultipleChoiceQuestion, OpenQuestion } from './questionInputTypes'

export const ViewQuestion = ({ question, coachView, setAnswer, setPoints, setComment }) => {
  let inputTypeMap = {
    'MULTIPLE_CHOICE': MultipleChoiceQuestion,
    'OPEN': OpenQuestion
  }

  return <div className={ coachView ? 'col-8 offset-2' : 'col' }>
    <div className="row pt-2 pb-3">
      <div className="col">
        <div className="row pb-2">
          <div className="col-12">
            { question.question }
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label className="mt-2">{ coachView ? '(Suggested) correct answer' : 'Answer' }</label>
            { question.answers ? React.createElement(inputTypeMap[question.type], {
              coachView,
              question,
              setAnswer
            }) : null }
          </div>
        </div>
        { question.result && coachView ? <>
          <div className="row">
            <div className="col-12">
              <label className="mt-2">Given answer</label>
              { question.answers ? React.createElement(inputTypeMap[question.type], {
                coachView,
                answerView: true,
                question,
                setAnswer
              }) : null }
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <label className="mt-2">Comments</label>
              <textarea className="form-control p-2" value={ question.result.comment } rows={ 4 }
                        onChange={ setComment ? e => setComment(e.target.value) : () => {} }
                        readOnly={ !setComment } />
            </div>
          </div>
        </> : null
        }
      </div>
      { coachView &&
      <div className="col-3">
        <label>Type</label>
        <input type="text" className="form-control pl-1 pr-1"
               value={ (question.type.charAt(0).toUpperCase() + question.type.slice(1).toLowerCase()).replace('_', ' ') } />
        <label>Difficulty</label>
        <input type="text" className="form-control pl-1 pr-1"
               value={ question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1).toLowerCase() } />
        <label>Subject</label>
        <input type="text" className="form-control pl-1 pr-1" value={ question.subject } />
        <label>{ `${ question.type === 'OPEN' ? 'Maximum achievable points' : 'Achievable points' }` }</label>
        <input type="text" className="form-control pl-1 pr-1" value={ question.maxPoints } />
        { question.result ? <>
          <label>Points achieved</label>
          <input type="number" className="form-control pl-1 pr-1" value={ question.result.points }
                 readOnly={ !setPoints }
                 onChange={ setPoints ? e => setPoints(e.target.value) : () => {} } min="0"
                 max={ question.maxPoints } />
        </> : null }
      </div>
      }
    </div>
  </div>
}
