import React from 'react'
import { useSelector } from 'react-redux'
import apiCall from '../../api'
import { ScoreDisplay } from '../scoreDisplay'
import moment from 'moment'

export const StudentExamList = ({ examType, setExamStartData }) => {
  const [examMoments, setExamMoments] = React.useState([])
  const auth = useSelector(state => state.auth)

  React.useEffect(() => {
    apiCall({
      action: 'get_exam_moments',
      token: auth.token,
      data: { examTypeId: examType.id }
    }).then(resp => {
      setExamMoments(resp.examMoments)
    })
  }, [examType.id])

  return examMoments.length > 0
    ? <div className="pt-5 pb-2">
      <h3>{ examType.title }</h3>
      <div className="container">
        { examMoments.map(em => <div className="row pt-3 pb-1">
          <div
            className="col-7">{ `${ moment(em.startDate).format('DD-MM-YYYY HH:mm') } - ${ moment(em.endDate).format('DD-MM-YYYY HH:mm') }` }</div>
          <div className="col-5">
            { em.status === 'generated'
              ? moment(em.startDate) < moment() && moment(em.endDate) > moment()
                ? <i className="fa fa-play pointer" data-toggle="modal" data-target="#examMomentStart"
                     onClick={ () => setExamStartData(em) } />
                : 'Exam overdue'
              : em.status === 'checked'
                ? <ScoreDisplay score={ em.pointsAchieved } maxScore={ em.maxPoints } />
                : 'Exam not yet checked'
            }
          </div>
        </div>) }
      </div>
    </div>
    : <div />

}