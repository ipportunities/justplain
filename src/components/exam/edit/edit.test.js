import React from 'react'
import { shallow } from 'enzyme'
import { ExamTypeEdit } from './edit'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' }, intervention: { id: 1, title: 'some intervention' } })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    id: 0,
  }),
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('Exam Type Edit', () => {
  it('should render correctly', () => {
    const component = shallow(<ExamTypeEdit />)
    expect(component).toMatchSnapshot()
  })
})
