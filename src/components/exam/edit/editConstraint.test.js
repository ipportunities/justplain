import React from 'react'
import { shallow } from 'enzyme'
import { EditConstraint } from './editConstraint'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn().mockReturnValue({ auth: { token: 'a' } })
}))

const saveMock = jest.fn()
const initialConstraintMock = { id: 8, amountOfQuestions: 10, difficulty: 'EASY', subject: '' }

describe('Exam Type Constraint Edit', () => {
  it('should render correctly', () => {
    const component = shallow(<EditConstraint initialConstraint={ initialConstraintMock }
                                              subjects={ ['Theoretical', 'Practical'] }
                                              difficulties={ ['EASY', 'HARD'] } className='col-10 pt-4'
                                              maxAmountOfQuestions={ 15 } save={ saveMock } />)
    expect(component).toMatchSnapshot()
  })
})
