import React from 'react'
import { shallow } from 'enzyme'
import { ViewQuestion } from './question'

const openQuestionMock = {
  id: 0,
  question: 'Question 0 - OPEN ?',
  answers: [
    { answer: 'A', correct: true, order: 0 }
  ],
  result: {
    answer: 'A',
  },
  type: 'OPEN',
  difficulty: 'EASY',
  subject: 'A',
  maxPoints: 10
}
const multipleChoiceQuestionMock = {
  id: 1,
  question: 'Question 1 - MULTIPLE_CHOICE ?',
  answers: [
    { answer: 'A', correct: true, order: 0 },
    { answer: 'B', correct: false, order: 1 },
    { answer: 'C', correct: false, order: 2 }
  ],
  result: {
    answer: 'B',
  },
  type: 'MULTIPLE_CHOICE',
  difficulty: 'MEDIUM',
  subject: 'B',
  maxPoints: 5
}

describe('View Question Coach', () => {
  it('should render correctly open answer', () => {
    const component = shallow(<ViewQuestion question={ openQuestionMock } coachView={ true } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly multiple choice answer', () => {
    const component = shallow(<ViewQuestion question={ multipleChoiceQuestionMock } coachView={ true } />)
    expect(component).toMatchSnapshot()
  })
})

describe('View Question Student', () => {
  it('should render correctly open answer', () => {
    const component = shallow(<ViewQuestion question={ openQuestionMock } setAnswer={ jest.fn() } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly open answer with given answer', () => {
    const q = openQuestionMock
    q.givenAnswer = 'A'
    const component = shallow(<ViewQuestion question={ q } setAnswer={ jest.fn() } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly multiple choice answer', () => {
    const component = shallow(<ViewQuestion question={ multipleChoiceQuestionMock } setAnswer={ jest.fn() } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly multiple choice answer with given answer', () => {
    const q = openQuestionMock
    q.givenAnswer = 1
    const component = shallow(<ViewQuestion question={ multipleChoiceQuestionMock } setAnswer={ jest.fn() } />)
    expect(component).toMatchSnapshot()
  })
})
