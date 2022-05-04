import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import ConfirmBox from '../../alert/confirm'
import { useTranslation } from '../../translate'
import apiCall from '../../api'

export const InterventionSettingsExamType = () => {
  const t = useTranslation()
  const auth = useSelector(state => state.auth)
  const history = useHistory()
  const { interventionId } = useParams()

  const [examTypes, setExamTypes] = React.useState([])
  const [newExamTypeName, setNewExamTypeName] = React.useState('')
  const [deleteId, setDeleteId] = React.useState(-1)

  const getExamTypes = () => {
    apiCall({
      action: 'get_exam_types',
      token: auth.token,
      data: { interventionId: +interventionId }  // Make sure the id is send as number
    }).then(resp => {
      setExamTypes(resp.examTypes)
    })
  }

  React.useEffect(() => {
    getExamTypes()
  }, [interventionId])

  const duplicate = examTypeId => {

  }
  const deleteConfirmed = () => {
    apiCall({
      action: 'remove_exam_type',
      token: auth.token,
      data: { id: deleteId }
    }).then(() => {
      getExamTypes()
      setDeleteId(-1)
    })
  }
  const addNew = e => {
    if (e.key === 'Enter') {
      apiCall({
        action: 'add_exam_type',
        token: auth.token,
        data: { title: newExamTypeName, interventionId: interventionId }
      }).then(resp => {
        setExamTypes([...examTypes, resp.examType])
        setNewExamTypeName('')
      })
    }
  }

  return (
    <div>
      <div className={ 'items exam-types' }>
        { examTypes.map((examType) => (
          <div
            key={ examType.id }
            id={ examType.id }
            className={ `item container-fluid pr-0 pl-0${ deleteId === examType.id ? ' to_delete' : '' }` }>
            <div className="form-group item ">
              <table>
                <tbody>
                  <tr>
                    <td className="title">
                      <span className="form-control">
                        { examType.title }
                      </span>
                    </td>
                    <td>
                      <div className="lesson-controls">
                        <span
                          data-tip={ t('Edit exam type') }
                          className="btn edit disabled"
                          onClick={ () => history.push(`/exam/edit/${ examType.id }`) }>
                          <i className="fas fa-pen" />
                        </span>
                        <span className="otherActionsToggle btn col-6">
                          <i className="fas fa-ellipsis-h" />
                          <div className="otherActions">
                            <table
                              onClick={() => {
                                duplicate(examType.id)
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>{t("Kopieer")}</td>
                                  <td>
                                    <i className="fa fa-copy"></i>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table
                              onClick={() => {
                                setDeleteId(examType.id);
                              }}
                            >
                              <tbody>
                                <tr>
                                  <td>{t("Verwijder")}</td>
                                  <td>
                                    <i className="fas fa-minus"></i>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )) }
      </div>
      <div className="form-group new">
        <input
          type="text"
          className="form-control"
          id="new"
          placeholder={ t('Voeg nieuw examen type toe') }
          value={ newExamTypeName }
          onChange={ e => setNewExamTypeName(e.target.value) }
          onKeyPress={ addNew }
        />
      </div>

      <ConfirmBox
        confirmOptions={ {
          show: deleteId >= 0,
          text: t('Weet u zeker dat u dit examen type wilt verwijderen'),
          cancelText: t('Cancel'),
          confirmText: t('Verwijderen'),
          confirmAction: () => deleteConfirmed()
        } }
        setConfirmOptions={ () => {} }
        setToDeleteIndex={ setDeleteId }
      />
    </div>
  )
}
