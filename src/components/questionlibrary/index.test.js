import React from 'react'
import { shallow } from 'enzyme'
import QuestionLibrary from './index'

describe('Question Library', () => {
  it('should render correctly', () => {
    const component = shallow(<QuestionLibrary />)
    expect(component).toMatchSnapshot()
  })
})
