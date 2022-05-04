import React from 'react'
import { shallow } from 'enzyme'
import { ExamMomentStatusDisplay } from './statusDisplay'

//   'generated': 'primary',
//   'checked': 'success',
//   'filled': 'warning',
//   'overdue': 'danger',
//   'started': 'info'

describe('Exam Moment Status Display', () => {
  it('should render correctly with status generated', () => {
    const component = shallow(<ExamMomentStatusDisplay status='generated' />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with status checked', () => {
    const component = shallow(<ExamMomentStatusDisplay status='checked' />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with status filled', () => {
    const component = shallow(<ExamMomentStatusDisplay status='filled' />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with status overdue', () => {
    const component = shallow(<ExamMomentStatusDisplay status='overdue' />)
    expect(component).toMatchSnapshot()
  })
  it('should render correctly with status started', () => {
    const component = shallow(<ExamMomentStatusDisplay status='started' />)
    expect(component).toMatchSnapshot()
  })

  it('should return div when no status is given', () => {
    const component = shallow(<ExamMomentStatusDisplay />)
    expect(component).toMatchSnapshot()
  })
})
