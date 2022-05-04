import React from 'react'

import { Route, Switch } from 'react-router-dom'
import QuestionLibraryOverview from './overview'
import QuestionLibraryEdit from './edit'
import LeftMenu from '../leftmenu'

const QuestionLibrary = () => <div className="question_library">
  <LeftMenu />
  <Switch>
    <Route path="/question-library" exact>
      <QuestionLibraryOverview />
    </Route>
    <Route path="/question-library/edit/:id">
      <QuestionLibraryEdit />
    </Route>
  </Switch>
</div>

export default QuestionLibrary
