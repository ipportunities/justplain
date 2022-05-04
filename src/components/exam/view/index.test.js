import React from 'react'
import { shallow } from 'enzyme'
import { ExamView } from './index'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { userType: 'coach' } })
}))

describe('Exam View', () => {
  it('should render correctly with coach view', () => {
    const component = shallow(<ExamView />)
    expect(component).toMatchSnapshot()
  })

  it('should render correctly with student view', () => {
    jest.mock('react-redux', () => ({
      ...jest.requireActual('react-redux'),
      useSelector: jest.fn().mockReturnValue({ auth: { userType: 'student' } })
    }))

    const component = shallow(<ExamView />)
    expect(component).toMatchSnapshot()
  })
})
