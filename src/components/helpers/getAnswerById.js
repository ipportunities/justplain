export const getAnswerById = (id, answers) => {
  let answer = answers.filter(function (answer) {
    return answer.id === id
  });

  if(Object.keys(answer).length)
  {
    return answer[0].answer
  } else {
    return '';
  }
}
