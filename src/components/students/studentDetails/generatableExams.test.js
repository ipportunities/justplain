import React from 'react'
import { shallow } from 'enzyme'
import { StudentDetailsGeneratableExams } from './generatableExams'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' }, intervention: { id: 1, title: 'some intervention' } })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    interventionId: 5,
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

const studentIdMock = 0
const interventionsMock = [
  {
    id: 5,
    settings: {
      generatableExamTypes: [
        { id: 2, title: '' }
      ]
    }
  }
]

describe('Student Details Generatable Exams', () => {
  it('should render correctly', () => {
    const component = shallow(<StudentDetailsGeneratableExams studentId={ studentIdMock }
                                                              interventions={ interventionsMock } />)
    expect(component).toMatchSnapshot()
  })
})
