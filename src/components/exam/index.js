import React from 'react'
import LeftMenu from '../leftmenu'
import { Route, Switch } from 'react-router-dom'
import { ExamTypeEdit } from './edit'
import { ExamView } from './view'


const Exam = () => {

  return (
    <div>
      <LeftMenu />
      <Switch>
        <Route path="/exam/edit/:id">
          <ExamTypeEdit />
        </Route>
        <Route path="/exam/view/:examMomentId">
          <ExamView />
        </Route>
      </Switch>
    </div>
  )
}

export default Exam
