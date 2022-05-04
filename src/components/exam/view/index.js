import React from 'react'
import { useSelector } from 'react-redux'
import { ExamViewCoach } from './coach'
import { ExamViewStudent } from './student'

export const ExamView = () => {
  const auth = useSelector(state => state.auth)

  return <div>
    { auth.userType === 'coach' ? <ExamViewCoach /> : <ExamViewStudent /> }
  </div>
}
