import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { EditConstraint } from './editConstraint'
import apiCall from '../../api'
import { useTranslation } from '../../translate'
import Saved from "../../intervention/saved";
import { setSavingStatus } from "../../../actions";

export const EditExamTypeCategory = ({ examTypeId, category, examTypeCategory, setExamTypeCategory, updateQuestionsTotal, updateMaxPointRange }) => {
  const [enabled, setEnabled] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const [id, setId] = React.useState(-1)
  const [amountOfQuestions, setAmountOfQuestions] = React.useState({})
  const dispatch = useDispatch();

  const t = useTranslation()
  const auth = useSelector(state => state.auth)

  React.useEffect(() => {
    setEnabled(examTypeCategory !== undefined)
    let newAmountOfQuestions = {}
    if (examTypeCategory !== undefined) {
      category.subjects.forEach(s => {
        newAmountOfQuestions[s] = {}
        category.difficulties.forEach(d => {
          newAmountOfQuestions[s][d] = examTypeCategory.constraints.find(c => c.subject === s && c.difficulty === d)
            ? +examTypeCategory.constraints.find(c => c.subject === s && c.difficulty === d).amountOfQuestions
            : 0
        })
      })
      setId(examTypeCategory.id)
    } else {
      let difficulties = {}
      category.difficulties.forEach(d => difficulties[d] = 0)
      category.subjects.forEach(s => newAmountOfQuestions[s] = difficulties)
    }
    setAmountOfQuestions(newAmountOfQuestions)
  }, [examTypeCategory, category])

  const switchExamTypeCategoryEnabled = () => {
    const newEnabled = !enabled
    if (newEnabled) {
      apiCall({
        action: 'add_exam_category',
        token: auth.token,
        data: { examTypeId: examTypeId, categoryId: category.id, amountOfQuestions: 0 }
      }).then(resp => {
        setExamTypeCategory(resp.examTypeCategory)
        setId(resp.examTypeCategory.id)
      })
    } else {
      apiCall({
        action: 'remove_exam_category',
        token: auth.token,
        data: { id: id }
      }).then(() => {
        setId(-1)
      })
    }
    setEnabled(newEnabled)
  }

  const saveCategory = () => {
    if (enabled) {
      let constraints = []
      Object.entries(amountOfQuestions).forEach(([subject, a]) => {
        Object.entries(a).forEach(([difficulty, amount]) => {
          constraints.push({
            subject: subject,
            difficulty: difficulty,
            amountOfQuestions: amount
          })
        })
      })
      apiCall({
        action: 'update_exam_category',
        token: auth.token,
        data: {
          examTypeId: +examTypeCategory.examTypeId,
          categoryId: +examTypeCategory.categoryId,
          amountOfQuestions: 0,
          constraints: constraints
        }
      }).then(resp => {
        dispatch(setSavingStatus("saved"));
      })
    }
  }

  React.useEffect(() => {
    dispatch(setSavingStatus("not_saved"));
    saveCategory()
    updateQuestionsTotal(Object.keys(amountOfQuestions).reduce(
      (total, s) => total + Object.keys(amountOfQuestions[s]).reduce(
        (subTotal, d) => subTotal + parseFloat(amountOfQuestions[s][d] || 0), 0
      ), 0)
    )
  }, [amountOfQuestions])

  const updateAmountOfQuestions = (subject, difficulty, amount) => {
    setAmountOfQuestions({
      ...amountOfQuestions,
      [subject]: {
        ...amountOfQuestions[subject],
        [difficulty]: +amount
      }
    })
  }

  return (
    <>
      <div className="row">
        <div className="col-10 pt-1">
          <input type="checkbox" className="form-check-input" checked={ enabled }
                 onChange={ switchExamTypeCategoryEnabled } id={ `examTypeCategoryEnabled-${ category.id }` } />
          <label className="form-check-label"
                 htmlFor={ `examTypeCategoryEnabled-${ category.id }` }>{ category.name }</label>
        </div>
        <div className="col-2 pt-1 text-right align-self-center">
          { enabled ?
            saving ?
              <div className="spinner-border text-primary" />
              : saved ?
              <div className="fa fa-2x fa-check text-success" />
              : <div />
            : <div />
          }
        </div>
      </div>
      { enabled && <>
        <table className="table">
          <thead>
          <tr>
            <th />
            { category.difficulties.map(d => <th
              key={ d }>{ d.charAt(0).toUpperCase() + d.slice(1).toLowerCase() }</th>) }
            <th className="border-left">{ t('Total') }</th>
          </tr>
          </thead>
          <tbody>
          { category.subjects.map(s => <tr className="border-top" key={ s }>
            <th>{ s === '' ? 'No Subject' : s }</th>
            { category.difficulties.map(d => <td key={ `${ d }-${ s }` }>
              <EditConstraint categoryId={ category.id } difficulty={ d } subject={ s } amount={ amountOfQuestions[s][d] }
                              setAmount={ (amount) => updateAmountOfQuestions(s, d, amount) }
                              updateMaxPointRange={ updateMaxPointRange } />
            </td>) }
            <td className="border-left">
              { Object.keys(amountOfQuestions[s]).reduce((total, i) => total + parseFloat(amountOfQuestions[s][i] || 0), 0) }
            </td>
          </tr>) }
          <tr className="border-top">
            <th>
              { t('Total') }
            </th>
            { category.difficulties.map(d => <td key={ `${ d }-total` }>{
              `${ Object.keys(amountOfQuestions).reduce((total, i) => total + parseFloat(amountOfQuestions[i][d] || 0), 0) }`
            }</td>) }
            <td className="border-left">{
              Object.keys(amountOfQuestions).reduce(
                (total, s) => total + Object.keys(amountOfQuestions[s]).reduce(
                  (subTotal, d) => subTotal + parseFloat(amountOfQuestions[s][d] || 0), 0
                ), 0)
            }</td>
          </tr>
          </tbody>
        </table>
      </> }
    </>
  )
}
