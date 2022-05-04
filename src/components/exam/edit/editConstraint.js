import React from 'react'
import { useSelector } from 'react-redux'
import apiCall from '../../api'

export const EditConstraint = ({ categoryId, subject, difficulty, amount, setAmount, updateMaxPointRange }) => {
  const [maxAmountOfQuestions, setMaxAmountOfQuestions] = React.useState(0)
  const auth = useSelector(state => state.auth)
  const [maxPointsRange, setMaxPointsRange] = React.useState([0, 0])

  React.useEffect(() => {
    apiCall({
      action: 'get_max_amount_of_questions_for_constraint',
      token: auth.token,
      data: { categoryId: categoryId, subject: subject, difficulty: difficulty }
    }).then(resp => {
      if (+resp.maxAmountOfQuestions < amount) {
        setAmount(+resp.maxAmountOfQuestions)
      }
      setMaxAmountOfQuestions(resp.maxAmountOfQuestions)
    })
  }, [subject, difficulty])

  React.useEffect(() => {
    if (amount > 0) {
      apiCall({
        action: 'get_max_points_range',
        token: auth.token,
        data: { categoryId: categoryId, subject: subject, difficulty: difficulty, amountOfQuestions: amount }
      }).then(resp => {
        updateMaxPointRange(`${categoryId}-${subject}-${difficulty}`, resp.maxPointsRange)
        setMaxPointsRange(resp.maxPointsRange)
      })
    }
  }, [subject, difficulty, amount])

  const setNewAmount = (value) => {
    setAmount(value <= maxAmountOfQuestions ? value : maxAmountOfQuestions)
  }

  return <div className="row m-0">
    <input type="number" className="form-control col-4 pl-2 pr-2" id="AmountOfQuestionsRange"
           onChange={ e => setNewAmount(+e.target.value) } min={ 0 } max={ maxAmountOfQuestions }
           name="amountOfQuestions" value={ amount } disabled={ +maxAmountOfQuestions === 0 } />
    <div className="col">{ `/ ${ maxAmountOfQuestions } (${ maxPointsRange[0] }-${ maxPointsRange[1] } pnts)` }</div>
  </div>
}