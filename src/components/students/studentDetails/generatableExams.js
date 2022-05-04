import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Flatpickr from 'react-flatpickr'
import { Dutch } from 'flatpickr/dist/l10n/nl.js'
import moment from 'moment'
import apiCall from '../../api'
import { useTranslation } from '../../translate'
import { ExamMomentStatusDisplay } from '../../exam/statusDisplay'

export const StudentDetailsGeneratableExams = ({ studentId, interventions }) => {
  const [intervention, setIntervention] = React.useState({})
  const [selectedId, setSelectedId] = React.useState(-1)
  const [examMoments, setExamMoments] = React.useState([])
  const [newExamMoment, setNewExamMoment] = React.useState({
    startDate: moment().format('DD-MM-YYYY HH:mm'),
    endDate: moment().add(1, 'd').format('DD-MM-YYYY HH:mm')
  })

  const { interventionId } = useParams()
  const history = useHistory()
  const t = useTranslation()
  const auth = useSelector(state => state.auth)

  React.useEffect(() => {
    setIntervention(interventions.find(i => i.id === interventionId))
    setSelectedId(interventions.find(i => i.id === interventionId).settings.generatableExamTypes[0].id)
  }, [interventions, interventionId])

  React.useEffect(() => {
    if (selectedId >= 0) {
      apiCall({
        action: 'get_exam_moments',
        token: auth.token,
        data: { userId: studentId, examTypeId: selectedId }
      }).then(resp => {
        setExamMoments(resp.examMoments)
      })
    }
  }, [selectedId, studentId])

  const addExamMoment = () => {
    apiCall({
      action: 'generate_exam',
      token: auth.token,
      data: { userId: studentId, examTypeId: selectedId }
    }).then(resp => {
      apiCall({
        action: 'add_exam_moment',
        token: auth.token,
        data: {
          startDate: moment(newExamMoment.startDate, 'DD-MM-YYYY HH:mm').format(),
          endDate: moment(newExamMoment.endDate, 'DD-MM-YYYY HH:mm').format(),
          examId: resp.exam.id
        }
      }).then(resp2 => {
        setNewExamMoment({
          startDate: moment().format('DD-MM-YYYY HH:mm'),
          endDate: moment().add(1, 'd').format('DD-MM-YYYY HH:mm')
        })
        setExamMoments([...examMoments, resp2.examMoment])
      })
    })
  }

  const viewExam = (examMomentId) => {
    history.push(`/exam/view/${ examMomentId }`)
  }

  const removeExam = (examMomentId) => {

  }

  const updateDate = (type, date) => {
    setNewExamMoment({ ...newExamMoment, [type]: date })
  }

  return <div>
    <h3>{ intervention.settings ? intervention.settings.generatableExamTypes.find(e => +e.id === +selectedId).title : '' }</h3>
    { intervention && intervention.settings ? <>
        { intervention.settings.generatableExamTypes.length > 1 &&
        <select className="custom-select" onChange={ e => setSelectedId(+e.target.value) } value={ selectedId }>
          { intervention.settings.generatableExamTypes.map(({ id, title }) => <option key={ +id } value={ +id }>
            { title }
          </option>) }
        </select> }

        <div className="row justify-content-center p-3">
          <button className="btn btn-outline-info" data-toggle="modal" data-target="#newExamMomentModal">
            { t('Add exam moment') } <i className="fa fa-plus" />
          </button>
        </div>

        <table className="table">
          <thead className="thead">
          <tr>
            <th>{ t('Start date time') }</th>
            <th>{ t('End date time') }</th>
            <th>{ t('Status') }</th>
            <th />
          </tr>
          </thead>
          <tbody>
          { examMoments.map(examMoment => <tr>
            <td>{ moment(examMoment.startDate).format('DD-MM-YYYY HH:mm') } </td>
            <td>{ moment(examMoment.endDate).format('DD-MM-YYYY HH:mm') }</td>
            <td><ExamMomentStatusDisplay status={examMoment.status}/></td>
            <td>
              <i className="fa fa-search pointer mr-2" onClick={ e => viewExam(examMoment.id) } />
              <i className="fa fa-trash pointer ml-2" onClick={ e => removeExam(examMoment.id) } />
            </td>
          </tr>) }
          </tbody>
        </table>
        <div id="newExamMomentModal" className="modal fade" data-backdrop="static" data-keyboard="false" tabIndex="-1"
             aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Add new exam moment</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="newStartDateTime">{ t('Start date time') }</label>
                  <Flatpickr
                    options={ { locale: Dutch, dateFormat: 'd-m-Y H:i' } }
                    data-enable-time
                    name="newStartDateTime"
                    className="form-control pl-2 pr-2"
                    value={ newExamMoment.startDate }
                    onChange={ dateChanged => {
                      updateDate('startDate', dateChanged)
                    } } />
                </div>
                <div className="form-group">
                  <label htmlFor="newEndDateTime">{ t('End date time') }</label>
                  <Flatpickr
                    options={ { locale: Dutch, dateFormat: 'd-m-Y H:i' } }
                    data-enable-time
                    name="newEndDateTime"
                    className="form-control pl-2 pr-2"
                    value={ newExamMoment.endDate }
                    onChange={ dateChanged => {
                      updateDate('endDate', dateChanged)
                    } } />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-success" onClick={ () => addExamMoment() }
                        data-dismiss="modal">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
      : '' }
  </div>
}
