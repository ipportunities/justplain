import React from 'react'
import { shallow } from 'enzyme'
import { ScoreDisplay } from './scoreDisplay'

describe('Exam Score Display', () => {
  it('should render correctly with 0%', () => {
    const component = shallow(<ScoreDisplay score={ 0 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 10%', () => {
    const component = shallow(<ScoreDisplay score={ 10 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 20%', () => {
    const component = shallow(<ScoreDisplay score={ 20 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 30%', () => {
    const component = shallow(<ScoreDisplay score={ 30 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 40%', () => {
    const component = shallow(<ScoreDisplay score={ 40 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 50%', () => {
    const component = shallow(<ScoreDisplay score={ 50 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 60%', () => {
    const component = shallow(<ScoreDisplay score={ 60 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 70%', () => {
    const component = shallow(<ScoreDisplay score={ 70 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 80%', () => {
    const component = shallow(<ScoreDisplay score={ 80 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 90%', () => {
    const component = shallow(<ScoreDisplay score={ 90 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with 100%', () => {
    const component = shallow(<ScoreDisplay score={ 100 } maxScore={ 100 } />)
    expect(component).toMatchSnapshot()
  })
})
