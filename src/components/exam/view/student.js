import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { ViewQuestion } from './question'
import { useTranslation } from '../../translate'
import apiCall from '../../api'
import { ParseText } from '../../../helpers/examTextParser'

export const ExamViewStudent = () => {
  const t = useTranslation()
  const history = useHistory()
  const { examMomentId } = useParams()
  const auth = useSelector(state => state.auth)

  const [exam, setExam] = React.useState({})
  const [questionIndex, setQuestionIndex] = React.useState(-1)

  React.useEffect(() => {
    apiCall({
      action: 'get_exam_for_moment',
      token: auth.token,
      data: { examMomentId: examMomentId }
    }).then(resp => {
      setExam(resp.exam)
    })
  }, [examMomentId])

  const setAnswer = (answer) => {
    const newQuestions = exam.questions
    newQuestions[questionIndex].givenAnswer = answer
    setExam({ ...exam, questions: [...newQuestions] })
  }

  const finish = () => {
    apiCall({
      action: 'finish_exam',
      token: auth.token,
      data: {
        examMomentId: examMomentId,
        examId: exam.id,
        answers: exam.questions.map(q => {return { id: q.id, answer: q.givenAnswer }})
      }
    }).then(resp => {
      history.push('/courses')
    })
  }

  return exam.title ? <div className="container pt-5">
      <div className="row pt-4 pb-2 border-bottom">
        <h4 className="col">{ exam.title }</h4>
      </div>
      <div className="row min-vh-50 pt-2">
        { questionIndex < 0
          ? <div className="col">
            <div dangerouslySetInnerHTML={ { __html: ParseText(exam.introText, exam) } } />
          </div>
          : questionIndex >= exam.questions.length
            ? <div className="col">
              <div dangerouslySetInnerHTML={ { __html: ParseText(exam.finishText, exam) } } />
            </div>
            : <ViewQuestion setAnswer={ setAnswer } question={ exam.questions[questionIndex] } />
        }
      </div>
      <div className="row pt-4">
        <div className="col-8">
          <div className="progress">
            <div className="progress-bar" role="progressbar"
                 style={ { width: `${ Math.min(Math.max(Math.round(((questionIndex + 1) / exam.questions.length) * 100), 0), 100) }%` } }
                 aria-valuenow={ questionIndex }
                 aria-valuemin="0"
                 aria-valuemax={ exam.questions.length }>
              { `${ Math.min(questionIndex + 1, exam.questions.length) } / ${ exam.questions.length }` }
            </div>
          </div>
        </div>
        <div className="col text-right">
          <div className="btn-group" role="group">
            { questionIndex > -1 &&
            <span className="btn btn-secondary"
                  onClick={ () => setQuestionIndex(prevIndex => prevIndex - 1) }>Back</span>
            }
            { questionIndex < exam.questions.length &&
            <span className="btn btn-primary" onClick={ () => setQuestionIndex(prevIndex => prevIndex + 1) }>Next</span>
            }
            { questionIndex >= exam.questions.length &&
            <span className="btn btn-success" onClick={ () => finish() }>Finish</span>
            }
          </div>
        </div>
      </div>
    </div>
    : <div />
}