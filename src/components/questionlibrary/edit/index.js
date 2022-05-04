import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import EditQuestion from './editQuestion'
import { useTranslation } from '../../translate'
import apiCall from '../../api'
import Saved from "../../intervention/saved";
import { setSavingStatus } from "../../../actions";

const QuestionLibraryEdit = () => {
  const t = useTranslation()
  const { id: categoryId } = useParams()
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const history = useHistory()

  const [questionCategory, setQuestionCategory] = React.useState({})
  const [questions, setQuestions] = React.useState([])
  const [categoryNameTimeout, setCategoryNameTimeout] = React.useState(-1)
  const [removing, setRemoving] = React.useState(-1)

  const categoryNameRef = React.useRef()
  categoryNameRef.current = questionCategory.name

  const getCategory = () => {
    apiCall({
      action: 'get_question_category',
      token: auth.token,
      data: { id: categoryId }
    }).then(resp => {
      setQuestionCategory(resp.category)
    })
  }

  const getQuestions = () => {
    apiCall({
      action: 'get_questions',
      token: auth.token,
      data: { categoryId: categoryId }
    }).then(resp => {
      setQuestions(resp.questions.map(q => {
        return {
          ...q,
          answers: q.answers.map(a => {return { ...a, correct: a.correct === '1', order: +a.order }})
        }
      }))
    })
  }

  React.useEffect(() => {
    getCategory()
    getQuestions()
  }, [categoryId])

  const setNewCategoryName = e => {
    setQuestionCategory({ ...questionCategory, name: e.target.value })
    clearTimeout(categoryNameTimeout)
    setCategoryNameTimeout(setTimeout(saveQuestionCategory, 500))
  }

  const saveQuestionCategory = () => {
    apiCall({
      action: 'update_question_category',
      token: auth.token,
      data: { id: categoryId, name: categoryNameRef.current }
    }).then(resp => {
      setQuestionCategory(resp.category)
    })
  }

  const saveQuestion = (question) => {
    if (questionCategory.subjects.findIndex(s => s === question.subject) <= -1) {
      getCategory()
    }
    let editedQuestions = questions
    editedQuestions.splice(editedQuestions.findIndex(q => +q.id === +question.id), 1)
    setQuestions([...editedQuestions, question])
  }

  const addQuestion = () => {
    apiCall({
      action: 'add_question',
      token: auth.token,
      data: {
        categoryId: categoryId,
        question: '',
        type: 'OPEN',
        subject: '',
        difficulty: 'EASY',
        maxPoints: 0,
        tags: [],
        answers: [
          {
            id: -1,
            answer: '',
            correct: true,
            order: 0
          }
        ]
      }
    }).then(resp => {
      setQuestions([...questions, {
        ...resp.question,
        newTag: '',
        editing: true,
        answers: resp.question.answers.map(a => {return { ...a, correct: a.correct === '1', order: +a.order }})
      }])
    })
  }

  const removeQuestion = (question) => {
    setRemoving(question.id)
    let newQuestions = questions
    apiCall({
      action: 'remove_question',
      token: auth.token,
      data: { id: +question.id }
    }).then(resp => {
      newQuestions.splice(newQuestions.findIndex(q => +q.id === +question.id), 1)
      setQuestions([...newQuestions])
      setRemoving(-1)
    })
  }

  return Object.keys(questionCategory).length > 0 ? <div className="whiteWrapper">
  <nav className="navbar navbar-expand-lg navbar-light overRule">
    <h2>
      <span className="pointer" onClick={ () => history.push(`/question-library`) }>
          { t("Vragen bibliotheek") } >
      </span> <span className="pointer">
        { t('Categorie') }
      </span>
    </h2>
  </nav>
  <Saved/>
  <div className="settings_container edit_question">
    <input type="text" className="form-control" id="categoryName" value={ questionCategory.name } onChange={ setNewCategoryName } />

   <table className="settings">
     <thead>
     <tr className="text-center">
       <th className="border-right" />
       { questionCategory.difficulties.map(d => <th colSpan={ 2 } key={ d } className="border-left">
         { d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() }
       </th>) }
       <th className="border-left" colSpan={ 2 }>{ t('Total') }</th>
     </tr>
     </thead>
     <tbody>
     { questionCategory.subjects.map(s => <tr key={ s }>
       <th className="border-right">{ s === '' ? 'No Subject' : s }</th>
       { questionCategory.difficulties.map(d => <React.Fragment key={ `${ d }-${ s }` }>
         <td className="border-left text-center">
           { questions.filter(q => q.difficulty === d && q.subject === s).length } {t("vragen")}
         </td>
         <td className="text-center">
           { questions.filter(q => q.difficulty === d && q.subject === s).reduce((total, q) => total + parseFloat(q.maxPoints || 0), 0) } {t("pnt")}
         </td>
       </React.Fragment>)
       }
       <td className="border-left text-center">
         { questions.filter(q => q.subject === s).length } {t("vragen")}
       </td>
       <td className="text-center">
         { questions.filter(q => q.subject === s).reduce((total, q) => total + parseFloat(q.maxPoints || 0), 0) } {t("pnt")}
       </td>
     </tr>) }
     </tbody>
     <tfoot>
     <tr>
       <th className="border-right">
         { t('Total') }
       </th>
       { questionCategory.difficulties.map(d => <React.Fragment key={ `${ d }-total` }>
         <td className="border-left text-center">
           { questions.filter(q => q.difficulty === d).length } {t("vragen")}
         </td>
         <td className="text-center">
           { questions.filter(q => q.difficulty === d).reduce((total, q) => total + parseFloat(q.maxPoints || 0), 0) } {t("pnt")}
         </td>
       </React.Fragment>) }
       <td className="border-left text-center">
         { questionCategory.amountOfQuestions } {t("vragen")}
       </td>
       <td className="text-center">
         { questions.reduce((total, q) => total + parseFloat(q.maxPoints || 0), 0) } {t("pnt")}
       </td>
     </tr>
     </tfoot>
   </table>

   <h3>{t("Vragen")}</h3>
   <span className="btn btn-primary edit add" onClick={ e => addQuestion() }>
      <i className="fa fa-plus" />
   </span>
    { questions.sort((a, b) => b.id - a.id).map((question, index) => {
      return <div className="question"
                  key={ question.id }>
        <EditQuestion question={ { ...question, id: +question.id } } saveQuestion={ saveQuestion }
                      deleteQuestionConfirm={ question }
                      removeQuestion={ removeQuestion }
                      removeLoading={ removing === question.id } />
      </div>
    }) }

  </div></div> : ''
}

export default QuestionLibraryEdit
