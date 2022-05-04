import React from 'react'
import { shallow } from 'enzyme'
import { EditExamTypeCategory } from './editCategory'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

const categoryMock = {
  id: 1,
  name: 'Category A',
  amountOfQuestions: 15,
  difficulties: ['EASY', 'HARD'],
  subjects: ['Theoretical', 'Practical']
}
const examTypeCategoryMock = {
  amountOfQuestions: 15,
  examTypeId: 5,
  categoryId: 1,
  constraints: [
    { id: 8, amountOfQuestions: 10, difficulty: 'EASY', subject: '' },
    { id: 9, amountOfQuestions: 5, difficulty: '', subject: 'Theoretical' }
  ]
}

describe('Exam Type Category Edit', () => {
  it('should render correctly', () => {
    const component = shallow(<EditExamTypeCategory category={ categoryMock } examTypeCategory={ examTypeCategoryMock } />)
    expect(component).toMatchSnapshot()
  })
})
