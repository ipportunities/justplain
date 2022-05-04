import React from 'react'
import { shallow } from 'enzyme'
import QuestionLibraryEdit from './index'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    id: 0,
  }),
}))

describe('Question Library Edit', () => {
  it('should render correctly', () => {
    const component = shallow(<QuestionLibraryEdit />)
    expect(component).toMatchSnapshot()
  })
})
