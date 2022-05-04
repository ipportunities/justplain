import React from 'react'
import { shallow } from 'enzyme'
import QuestionLibraryOverview from './index'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

describe('Question Library Overview', () => {
  it('should render correctly', () => {
    const component = shallow(<QuestionLibraryOverview />)
    expect(component).toMatchSnapshot()
  })
})
