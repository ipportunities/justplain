import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import t from '../../translate'
import apiCall from '../../api'
import { question } from '../../../propTypes'
import ContentEditable from 'react-contenteditable'
import { setSavingStatus } from "../../../actions";
import ConfirmBox from "../../alert/confirm";
import { Editor } from '@tinymce/tinymce-react'

let settingSaveTimeout = null;

const EditQuestion = ({ question, saveQuestion, removeQuestion, removeLoading = false }) => {
  const [editing, setEditing] = React.useState(question.editing)
  const [loading, setLoading] = React.useState(false)
  const [changed, setChanged] = React.useState(false)
  const [error, setError] = React.useState('')
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const [removing, setRemoving] = React.useState(-1)

  const saveQuestionData = (e, name) => {
    dispatch(setSavingStatus("not_saved"));
    if(name == "question"){e.target.name = "question"}
    question[e.target.name] = e.target.value
    if (e.target.name === 'type') {
      // if we select multiple choice we need at least 2 answers
      if (e.target.value === 'MULTIPLE_CHOICE' && question.answers.length < 2) {
        for (let i = 0; i < 2 - question.answers.length; i++) {
          addAnswer()
        }
        // if we select open we want to be sure only one answer is saved and it is set to correct
      } else if (e.target.value === 'OPEN' && question.answers.length > 1) {
        question.answers = [{ ...question.answers[0], correct: true }]
      }
    }
    saveQuestion(question)
    saveTimeout();
  }
  const saveQuestionAnswer = (e, answerOrder) => {
    console.log(e);
    dispatch(setSavingStatus("not_saved"));
    question.answers.find(a => a.order === answerOrder)[e.target.name] = e.target.value
    saveQuestion(question)
    saveTimeout();
  }
  const saveQuestionAnswerCorrect = (e, answerOrder) => {
    question.answers.forEach(a => a.correct = a.order === answerOrder)
    setChanged(true)
    saveQuestion(question)
  }
  const moveAnswerOrder = (answerOrder, newAnswerOrder) => {
    let answers = question.answers
    if (newAnswerOrder === -1 || newAnswerOrder === answers.length) return
    let a = answers.splice(answers.findIndex(a => a.order === answerOrder), 1)[0]
    let b = answers.splice(answers.findIndex(a => a.order === newAnswerOrder), 1)[0]
    a.order = +newAnswerOrder
    b.order = +answerOrder
    question.answers = [...answers, a, b]
    setChanged(true)
    saveQuestion(question)
  }
  const removeAnswer = (answerOrder) => {
    let answers = question.answers
    answers.splice(answers.findIndex(a => a.order === answerOrder), 1)
    answers = answers.map(a => {
      if (a.order > answerOrder) {
        a.order--
      }
      return a
    })
    question.answers = [...answers]
    setChanged(true)
    saveQuestion(question)
  }
  const addAnswer = () => {
    let newAnswer = {
      id: -1,
      answer: '',
      correct: false,
      order: question.answers.length
    }
    question.answers = [...question.answers, newAnswer]
    setChanged(true)
    saveQuestion(question)
  }

  React.useEffect(() => {
    if (question.answers.length < 1) {
      addAnswer()
    }
  }, [question])

  const saveNewTag = (e) => {
    if (e.key === 'Enter') {
      let tags = question.tags
      tags.push(question.newTag.replaceAll(' ', '-'))
      question.tags = [...new Set(tags)]
      question.newTag = ''
      setChanged(true)
      saveQuestion(question)
    }
  }
  const removeTag = (tag) => {
    question.tags.splice(question.tags.findIndex(t => t === tag), 1)
    setChanged(true)
    saveQuestion(question)
  }

  const saveTimeout = () => {
    clearTimeout(settingSaveTimeout);
    settingSaveTimeout = setTimeout(function(){
      save()
    }, 3000);
  }
  const save = () => {
    // check data
    if (question.type === 'MULTIPLE_CHOICE' && question.answers.length < 2) {
      setError(t('Een multiple choice vraag heeft op zijn minst 2 antwoordmogelijkheden'))
      setLoading(false)
      return
    }
    if (question.maxPoints <= 0){
      setError(t('Vragen kunnen niet minder dan 1 punt hebben'))
      setLoading(false)
      return
    }
    if (question.newTag && question.newTag !== '') {
      let tags = question.tags
      tags.push(question.newTag.replaceAll(' ', '-'))
      question.tags = [...new Set(tags)]
    }

    apiCall({
      action: 'update_question',
      token: auth.token,
      data: {
        id: question.id,
        question: question.question,
        type: question.type,
        subject: question.subject,
        difficulty: question.difficulty,
        maxPoints: question.maxPoints,
        tags: question.tags,
        answers: question.answers.filter(a => a.answer.length > 0).map(a => { return { ...a, id: +a.id } })
      }
    }).then((resp) => {
      saveQuestion({
        ...resp.question,
        editing: false,
        newTag: '',
        correct: resp.question.answers.map(a => { return { ...a, correct: a.correct === '1', order: +a.order }})
      })
      dispatch(setSavingStatus("saved"));
      setError('')
    })
  }

  function getShortQuestion(this_question){
    if(this_question.length > 70){
      return this_question.substring(0, 70) + "...";
    } else {
      return this_question;
    }
  }

  //////////////////////
  ///Verwijder part
  const [confirmOptions, setConfirmOptions] = useState({});

  function deleteQuestionConfirm(question) {
    let confirmOptionsToSet = {
      show: "true",
      text: "<h4>"+t("Weet u zeker dat u deze vraag wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => removeQuestion(question)
    };
    setRemoving(question.id)
    setConfirmOptions(confirmOptionsToSet);
  }

  return <div className={"holder " + (!editing ? '':'editing') + (removing == question.id ? ' to_delete':'')}>
  <table className="the_question">
    <tbody>
      <tr>
        <td>
        {editing ?
          <h5>{t("De vraag")}</h5>
          :''}
        <ContentEditable
          id={ `question-${ question.id }` }
          html={editing ? question.question : getShortQuestion(question.question)}
          disabled={ !editing }
          onChange={e => saveQuestionData(e, 'question')}
          placeholder="Vraag"
        />


        </td>
        <td>
          <span className="btn edit disabled" onClick={ e => setEditing((editing ? false:true)) }>
            <i className="fas fa-chevron-down"></i>
          </span>
          <span className="btn edit disabled" onClick={  e => deleteQuestionConfirm(question) }>
            <i className="fas fa-minus"></i>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
    { error !== ''
      ? <div className="row">
        <div className="col-10 alert alert-danger" role="alert">
          { error }
        </div>
      </div>
      : <div /> }
    { editing &&
    <div className="answer">
      <table>
        <tbody>
          <tr>
            <td className='editor'>
            { question.type === 'OPEN' &&
            <div className="form-group ">
              <h5>{t("Voorgesteld antwoord")}</h5>
              <Editor
                apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                inline
                value={ question.answers.length > 0 ? question.answers[0].answer : '' }
                init={ {
                  menubar:false,
                  plugins: 'link image code lists advlist',
                  toolbar: [
                    "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify",
                    "bullist numlist outdent indent | table | fontsizeselect | link "],
                } }
                onEditorChange={ (content, editor) => saveQuestionAnswer({ target: { name: 'answer', value: content } }, question.answers.length > 0 ? question.answers[0].order : 0) }
              />

            </div>
            }
            { question.type === 'MULTIPLE_CHOICE' && <>
              <h5 className="radio">{t("Antwoorden")}</h5>
              { question.answers.sort((a, b) => a.order - b.order).map(answer => {
                return <div key={ answer.order } className="form-row">
                  <div className="form-group form-check">
                    <input type="radio" id={ `question-answer-correct-${ answer.order }` }
                           className="form-check-input" checked={ answer.correct }
                           onChange={ e => saveQuestionAnswerCorrect(e, answer.order) } name='correct' />
                    <label className="form-check-label"
                           htmlFor={ `question-answer-correct-${ answer.order }` }></label>
                  </div>
                  <div className="form-group col">
                    <input type="text" className="form-control pl-2 pr-2" name='answer' placeholder={t("antwoord")}
                           id={ `question-answer-${ answer.order }` } value={ answer.answer }
                           onChange={ e => saveQuestionAnswer(e, answer.order) } />
                  </div>
                  <div className="col-2">
                    <i className={"fa fa-chevron-up p-1 pr-2 pointer" + (answer.order === 0 ? ' hidden' : '' )}
                       onClick={ e => moveAnswerOrder(answer.order, answer.order - 1) } />
                    <i className={"fa fa-chevron-down p-1 pr-2 pointer" + (answer.order === question.answers.length - 1 ? ' hidden' : '')}
                       onClick={ e => moveAnswerOrder(answer.order, answer.order + 1) } />
                    <i className="fa fa-trash p-1 pointer" onClick={ e => removeAnswer(answer.order) } />
                  </div>
                </div>
              }) }
              <div className="form-row last">
                <span className="btn btn-primary" onClick={ e => addAnswer()}>
                  <i className="fa fa-plus"></i> {t("Voeg antwoord toe")}
                </span>
              </div>
            </> }
          </td>
          <td>
            <div className="form-group">
              <label htmlFor={ `type-${ question.id }` }>Type</label>
              <select className="form-control" id={ `type-${ question.id }` } name='type'
                      onChange={ e => saveQuestionData(e) } value={ question.type }>
                <option value='OPEN'>{t("Open")}</option>
                <option value='MULTIPLE_CHOICE'>{t("Meerkeuze vraag")}</option>
              </select>
              <label htmlFor={ `difficulty-${ question.id }` }>{t("Moelijkheidsgraad")}</label>
              <select className="form-control" id={ `difficulty-${ question.id }` } name='difficulty'
                      onChange={ e => saveQuestionData(e) } value={ question.difficulty }>
                <option value='EASY'>{t("Makkelijk")}</option>
                <option value='MEDIUM'>{t("Medium")}</option>
                <option value='HARD'>{t("Moeilijk")}</option>
              </select>
              <label htmlFor={ `subject-${ question.id }` }>{t("Onderwerp")}</label>
              <input type="text" className="form-control pl-1 pr-1" name='subject' id={ `subject-${ question.id }` }
                     value={ question.subject }
                     onChange={ e => saveQuestionData(e) } />
              <label htmlFor={ `maxPoints-${ question.id }` }>
                { `${ question.type === 'OPEN' ? t('Maximaal haalbare punten') : t('Haalbare punten') }` }
              </label>
              <input type="number" className="form-control pl-1 pr-1" name='maxPoints' id={ `maxPoints-${ question.id }` }
                     value={ question.maxPoints } onChange={ e => saveQuestionData(e) } min={ 1 } />
              <label htmlFor={ `new-tag-${ question.id }` }>
                {t("Tags")} <i className="fa fa-question-circle"
                        data-tip={t("De combinatie van tags zal gebruikt worden om gelijke vragen te voorkomen in hetzelfde examen.")} />
              </label>
              <input type="text" className="form-control pl-1 pr-1" name='newTag' id={ `new-tag-${ question.id }` }
                     value={ question.newTag } onChange={ e => saveQuestionData(e) }
                     onKeyDown={ e => saveNewTag(e) } />
              <div className="tags">
                { question.tags.map(tag => {
                  return <span className="badge badge-pill badge-primary mr-1" key={ `${ question.id }-tag-${ tag }` }>
                        { tag } <i className="fa fa-times-circle pointer" onClick={ e => removeTag(tag) } />
                      </span>
                }) }
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <ReactTooltip place="right" effect="solid" delayShow={ 200 } multiline />
    </div>
    }

    <ConfirmBox confirmOptions={confirmOptions} setConfirmOptions={setConfirmOptions} setToDeleteIndex={setRemoving}/>
  </div>
}

EditQuestion.propTypes = {
  question: PropTypes.shape(question).isRequired,
  saveQuestion: PropTypes.func.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  removeLoading: PropTypes.bool
}

export default EditQuestion
