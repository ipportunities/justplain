import React from 'react'
import { shallow } from 'enzyme'
import EditQuestion from './editQuestion'

const questionMock = {
  id: 1,
  question: 'Some question to ask?',
  type: 'OPEN',
  subject: 'subject',
  difficulty: 'EASY',
  tags: ['tag', 'tog', 'tig'],
  newTag: '',
  answers: [
    {
      id: 1,
      answer: 'A',
      correct: true,
      order: 0
    }
  ],
  editing: false
}

const saveQuestionMock = jest.fn()
const removeQuestionMock = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

describe('Edit question', () => {
  it('should render correctly', () => {
    const component = shallow(<EditQuestion question={ questionMock } saveQuestion={ saveQuestionMock }
                                            removeQuestion={ removeQuestionMock } removeLoading={ false } />)
    expect(component).toMatchSnapshot()
  })
})
