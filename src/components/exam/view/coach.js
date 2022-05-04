import React from 'react'
import { useTranslation } from '../../translate'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import apiCall from '../../api'
import { ViewQuestion } from './question'
import moment from 'moment'
import { ExamMomentStatusDisplay } from '../statusDisplay'
import { ParseText } from '../../../helpers/examTextParser'

export const ExamViewCoach = () => {
  const t = useTranslation()
  const history = useHistory()
  const { examMomentId } = useParams()
  const auth = useSelector(state => state.auth)
  const intervention = useSelector(state => state.intervention)

  const [exam, setExam] = React.useState({})

  const setPoints = (questionId, points) => {
    if (exam.moment.status !== 'generated') {
      const newQuestions = exam.questions
      const maxPoints = newQuestions.find(q => q.id === questionId).maxPoints
      if (points > maxPoints) {
        points = maxPoints
      }
      newQuestions.find(q => q.id === questionId).result.points = points
      setExam({ ...exam, questions: newQuestions })
    }
  }

  const setComment = (questionId, comment) => {
    if (exam.moment.status !== 'generated') {
      const newQuestions = exam.questions
      newQuestions.find(q => q.id === questionId).result.comment = comment
      setExam({ ...exam, questions: newQuestions })
    }
  }

  React.useEffect(() => {
    apiCall({
      action: 'get_exam_for_moment',
      token: auth.token,
      data: { examMomentId: examMomentId }
    }).then(resp => {
      setExam(resp.exam)
    })
  }, [examMomentId])

  const mark = () => {
    apiCall({
      action: 'mark_exam',
      token: auth.token,
      data: {
        examMomentId: examMomentId,
        answers: exam.questions.map(q => {
          return {
            questionId: q.id,
            points: q.result.points,
            comment: q.result.comment
          }
        })
      }
    }).then(() => {
      history.push(`/students/${ intervention.id }`, { user: +exam.userId, tab: 'generatableExamTypes' })
    })
  }

  return Object.keys(exam).length > 0 ? <div>
      <nav className="navbar navbar-expand-lg navbar-light overRule">
        <h2>
          <span className="pointer" onClick={ () => history.push(`/`) }>
              { `${ intervention.title } > ` }
          </span>
          <span className="pointer" onClick={ () => history.push(`/students/${ intervention.id }`) }>
              { `${ t('deelnemers') } > ` }
          </span>
          <span className="pointer"
                onClick={ () => history.push(`/students/${ intervention.id }/`, { user: +exam.userId }) }>
            { `${ exam.userFirstname } ${ exam.userLastname } > ` }
          </span>
          <span className="pointer"
                onClick={ () => history.push(`/students/${ intervention.id }/`, {
                  user: +exam.userId,
                  tab: 'generatableExamTypes'
                }) }>
            { t('Exams') }
          </span>
        </h2>
      </nav>
      <div className="row pt-3">
        <h4 className="col-8 offset-2">{ exam.title }</h4>
      </div>
      <div className="row border-bottom pt-4 pb-3">
        { exam.moment && <>
          <div className="col-4 offset-2">
            { `This exam can be made between ${ moment(exam.moment.startDate).format('DD-MM-YYYY HH:mm') } and ${ moment(exam.moment.endDate).format('DD-MM-YYYY HH:mm') }` }
            <br />
            <ExamMomentStatusDisplay status={ exam.moment.status } />
          </div>
          <div className="col-2">
            { exam.questions.reduce((sum, q) => sum + parseInt(q.maxPoints), 0) } points available <br />
            { exam.questions.reduce((sum, q) => sum + parseInt(q.result ? q.result.points : 0), 0) } points achieved
          </div>
          <div className="col-2 text-right">
            { exam.moment.status !== 'generated' ? <button className="btn btn-success" onClick={ mark }>
              { `${ t('Save') } ${ exam.moment.status === 'filled' ? `& ${ t('Mark checked') }` : '' }` }
            </button> : null }
          </div>
        </>
        }
      </div>
      <div className="row border-bottom pt-2 pb-3">
        <div className="col-8 offset-2" dangerouslySetInnerHTML={ { __html: ParseText(exam.introText, exam) } } />
      </div>
      { exam.questions && exam.questions.map(q => <div className="row border-bottom" key={ q.id }>
        <ViewQuestion question={ q } coachView
                      setPoints={ exam.moment.status !== 'generated' ? (points) => setPoints(q.id, points) : false }
                      setComment={ exam.moment.status !== 'generated' ? (comment) => setComment(q.id, comment) : false } />
      </div>) }
      <div className="row border-bottom pt-2 pb-3">
        <div className="col-8 offset-2" dangerouslySetInnerHTML={ { __html: ParseText(exam.finishText, exam) } } />
      </div>
    </div>
    : <div />
}
