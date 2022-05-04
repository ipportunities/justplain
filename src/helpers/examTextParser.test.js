import React from 'react'
import { ParseText } from './examTextParser'

const examMock = {
  questions: [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ]
}

describe('Exam text parser', () => {
  it('should return a empty string when null is given as text', () => {
    const text = ParseText(null, examMock)
    expect(text).toEqual('')
  })

  it('should return a the string when null is given as exam', () => {
    const varText = 'A string'
    const text = ParseText(varText, null)
    expect(text).toEqual('A string')
  })

  it('should replace number of questions', () => {
    const varText = 'A string of text with the _number_of_questions variable in it.'
    const text = ParseText(varText, examMock)
    expect(text).toEqual('A string of text with the 8 variable in it.')
  })

  it('should replace number of questions multiple times', () => {
    const varText = 'A string of text with the _number_of_questions variable twice in it. So the number of questions is _number_of_questions'
    const text = ParseText(varText, examMock)
    expect(text).toEqual('A string of text with the 8 variable twice in it. So the number of questions is 8')
  })
})
