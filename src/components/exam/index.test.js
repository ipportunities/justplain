import React from 'react'
import { shallow } from 'enzyme'
import Exam from './index'

describe('Exam', () => {
  it('should render correctly', () => {
    const component = shallow(<Exam />)
    expect(component).toMatchSnapshot()
  })
})
