import React from 'react'
import { shallow } from 'enzyme'
import { StudentExamList } from './index'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

const examTypeMock = {}
const setExamStartDataMock = jest.fn()

describe('Student Exam List', () => {
  it('should render correctly', () => {
    const component = shallow(<StudentExamList examType={ examTypeMock } setExamStartData={ setExamStartDataMock } />)
    expect(component).toMatchSnapshot()
  })
})
