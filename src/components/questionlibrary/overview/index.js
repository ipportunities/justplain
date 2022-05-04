import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from '../../translate'
import apiCall from '../../api'

const QuestionLibraryOverview = () => {
  const t = useTranslation()
  const history = useHistory()
  const auth = useSelector(state => state.auth)

  const [questionCategories, setQuestionCategories] = React.useState([])
  const [newCategoryName, setNewCategoryName] = React.useState('')

  const addCategory = e => {
    if (e.key === 'Enter') {
      apiCall({
        action: 'add_question_category',
        token: auth.token,
        data: { name: newCategoryName }
      }).then(resp => {
        getCategories()
        setNewCategoryName('')
      })
    }
  }

  const removeCategory = id => {
    apiCall({
      action: 'remove_question_category',
      token: auth.token,
      data: { id: id }
    }).then(resp => {
      getCategories()
    })
  }

  const getCategories = () => {
    apiCall({
      action: 'get_question_categories',
      token: auth.token,
      data: {}
    }).then(resp => {
      setQuestionCategories(resp.categories)
    })
  }

  React.useEffect(() => {
    getCategories()
  }, [])

  return <div className="whiteWrapper ">
    <div className="settings_container">
      <h1>{ t('Vragen bibliotheek') }</h1>
      <div className="row pt-5">
        <table className="table">
          <thead className="thead">
          <tr>
            <th>{ t('Categorie') }</th>
            <th>#{ t('Vragen') }</th>
            <th />
          </tr>
          </thead>
          <tbody>
          { questionCategories.map(category => {
            return <tr key={ category.id }>
              <td>{ category.name }</td>
              <td>{ category.amountOfQuestions }</td>
              <td align="right" className="actions">
                <span
                  data-tip={t("Wijzig")}
                  className="btn edit disabled"
                  onClick={ () => history.push(`/question-library/edit/${ category.id }`) }
                >
                  <i className="fas fa-pen"></i>
                </span>
                <span
                  data-tip={t("Verwijder")}
                  className="btn edit disabled"
                  onClick={ e => removeCategory(category.id) }
                >
                  <i className="fas fa-minus"></i>
                </span>
              </td>
            </tr>
          }) }
          <tr>
            <td className="new" colSpan={ 99 }>
              <input
                type="text"
                style={ { backgroundColor: 'transparent' } }
                className="form-control"
                id="newCategory"
                placeholder="Type om een nieuwe categorie toe te voegen"
                value={ newCategoryName }
                onChange={ e => setNewCategoryName(e.target.value) }
                onKeyPress={ addCategory }
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
}

export default QuestionLibraryOverview
