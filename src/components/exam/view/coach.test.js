import React from 'react'
import { shallow } from 'enzyme'
import { ExamViewCoach } from './coach'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    examMomentId: 0,
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('Exam View Coach', () => {
  it('should render correctly', () => {
    const component = shallow(<ExamViewCoach />)
    expect(component).toMatchSnapshot()
  })
})
