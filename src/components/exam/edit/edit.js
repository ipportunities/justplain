import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { EditExamTypeCategory } from './editCategory'
import { useTranslation } from '../../translate'
import apiCall from '../../api'
import { Editor } from '@tinymce/tinymce-react'
import Saved from "../../intervention/saved";
import { setSavingStatus } from "../../../actions";

export const ExamTypeEdit = () => {
  const t = useTranslation()
  const history = useHistory()
  const { id } = useParams()
  const auth = useSelector(state => state.auth)
  const intervention = useSelector(state => state.intervention)

  const [examType, setExamType] = React.useState({})
  const [categories, setCategories] = React.useState([])
  const [examTitleTimeout, setExamTitleTimeout] = React.useState(-1)
  const [questionTotal, setQuestionTotal] = React.useState([])
  const [maxPointsRangeTotal, setMaxPointsRangeTotal] = React.useState({})
  const dispatch = useDispatch();

  const examTitleRef = React.useRef()
  examTitleRef.current = examType.title
  const examIntroTextRef = React.useRef()
  examIntroTextRef.current = examType.introText
  const examFinishTextRef = React.useRef()
  examFinishTextRef.current = examType.finishText

  const getExamType = () => {
    apiCall({
      action: 'get_exam_type',
      token: auth.token,
      data: { id: id }
    }).then(resp => {
      setExamType(resp.examType)
    })
  }

  const getCategories = () => {
    apiCall({
      action: 'get_question_categories',
      token: auth.token,
      data: { withSubjects: true, withDifficulties: true }
    }).then(resp => {
      setCategories(resp.categories)
    })
  }

  React.useEffect(() => {
    if (id >= 0) {
      getExamType()
      getCategories()
    }
  }, [id])

  const setExamData = e => {
    setExamType({ ...examType, [e.target.name]: e.target.value })
    clearTimeout(examTitleTimeout)
    dispatch(setSavingStatus("not_saved"));
    setExamTitleTimeout(setTimeout(saveExamType, 500))
  }
  const saveExamType = () => {
    apiCall({
      action: 'update_exam_type',
      token: auth.token,
      data: {
        id: id,
        title: examTitleRef.current,
        introText: examIntroTextRef.current,
        finishText: examFinishTextRef.current
      }
    }).then(resp => {
      dispatch(setSavingStatus("saved"));
      setExamType({ ...examType, ...resp.examType })
    })
  }

  const updateTotal = (index, amount) => {
    let newQuestionTotal = questionTotal
    newQuestionTotal[index] = +amount
    setQuestionTotal([...newQuestionTotal])
  }

  const updateMaxPointRange = (index, range) => {
    let newMaxPointsRangeTotal = maxPointsRangeTotal
    newMaxPointsRangeTotal[index] = range
    setMaxPointsRangeTotal({ ...newMaxPointsRangeTotal })
  }

  return (
    <div className="whiteWrapper">
      <div className="lessoncontent exam edit">
        <nav className="navbar navbar-expand-lg navbar-light overRule">
          <h2>
            <span className="pointer" onClick={ () => history.push(`/intervention/edit/${ intervention.id }/general/`) }>
                { `${ intervention.title } > ` }
            </span>
            <span className="pointer"
                  onClick={ () => history.push(`/intervention/edit/${ intervention.id }/exam-types/`) }>
              { t('Examens') }
            </span>
          </h2>
        </nav>
        <Saved/>
        <div className="settings_container">
          <h1>{ t('Wijzig examen') }</h1>
          <div className="row pb-1 pt-5">
            <div className="col-6">
              <div className="form-group">
                <label htmlFor="categoryName">{ t('Titel') }</label>
                <input type="text" className="form-control pl-2 pr-2" id="examTitle"
                       value={ examType.title } name="title" onChange={ setExamData } />
              </div>
            </div>
            <div className="col-4 align-self-center bleu">
              {t("Vragen")}{ ` :  ${ questionTotal.reduce((a, b) => a + b, 0) }` }
              <br />
              {t("Punten")}{ ` :  ${ Object.values(maxPointsRangeTotal).reduce((a, b) => a + b[0], 0) } - ${ Object.values(maxPointsRangeTotal).reduce((a, b) => a + b[1], 0) } ` }
            </div>
          </div>
          <div className="row pb-2">
            <div className="col">
              <div className="form-group">
                <label htmlFor="introText">{ t('Intro') }</label>
                <Editor
                  apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                  inline
                  value={ examType.introText }
                  init={ {
                    menubar:false,
                    plugins: 'link image code lists advlist',
                    toolbar: [
                      "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify",
                      "bullist numlist outdent indent | table | fontsizeselect | link "],
                  } }
                  onEditorChange={ (content, editor) => setExamData({ target: { name: 'introText', value: content } }) }
                />
              </div>
            </div>
          </div>
          <div className="row pb-2">
            <div className="col">
              <div className="form-group">
                <label htmlFor="finishText">{ t('Afsluiting') }</label>
                <Editor
                  apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                  inline
                  value={ examType.finishText }
                  init={ {
                    menubar:false,
                    plugins: 'link image code lists advlist',
                    toolbar: [
                      "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify",
                      "bullist numlist outdent indent | table | fontsizeselect | link "],
                  } }
                  onEditorChange={ (content, editor) => setExamData({
                    target: {
                      name: 'finishText',
                      value: content
                    }
                  }) }
                />
              </div>
            </div>
          </div>
          { examType.examTypeCategories !== undefined ? <>
            <label>{ t('Onderdelen') }</label>
            { categories.filter(c => +c.amountOfQuestions > 0).sort((a, b) => a.id - b.id).map((category, index) => {
              return <div className={ `settings_container examtype_category` }
                          key={ category.id }>
                <EditExamTypeCategory
                  category={ category }
                  examTypeId={ examType.id }
                  updateMaxPointRange={ updateMaxPointRange }
                  updateQuestionsTotal={ (amount) => updateTotal(index, amount) }
                  examTypeCategory={ examType.examTypeCategories.find(ec => ec.categoryId === category.id) }
                  setExamTypeCategory={ examTypeCategory => setExamType({
                    ...examType,
                    examTypeCategories: [...examType.examTypeCategories, examTypeCategory]
                  }) } />
              </div>
            }) }
          </> : null }
        </div>
      </div>
    </div>
  )
}
