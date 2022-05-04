// A map of variables in the text to replace.
// The value needs to be a function returning the correct value for that variable.
// The exam object is given to the function.
let varMap = {
  _number_of_questions: exam => exam.questions.length,
  _max_amount_of_points: exam => exam.questions.reduce((sum, q) => sum + parseInt(q.maxPoints), 0)
}

// A function to parse the intro and finish text of the exam to inject variable text.
export const ParseText = (text, exam) => {
  if (text == null) return ''
  if (exam == null) return text
  let re = new RegExp(Object.keys(varMap).join('|'), 'gi')
  return text.replace(re, matched => varMap[matched](exam))
}
