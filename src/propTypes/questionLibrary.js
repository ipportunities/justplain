import PropTypes from 'prop-types'

export const questionCategory = {
  id: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  amountOfQuestions: PropTypes.number.isRequired
}

const answer = {
  answer: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired
}

export const question = {
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  answers: PropTypes.arrayOf(PropTypes.shape(answer)).isRequired,
  newTag: PropTypes.string,
  editing: PropTypes.bool
}