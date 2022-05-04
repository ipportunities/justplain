import React from 'react'
import { useTranslation } from '../translate'

const statusColorMap = {
  'generated': 'primary',
  'checked': 'success',
  'filled': 'warning',
  'overdue': 'danger',
  'started': 'info'
}

export const ExamMomentStatusDisplay = ({ status }) => {
  const t = useTranslation()
  if (status) {
    return <h5>
      <span className={ `badge badge-pill badge-${ statusColorMap[status] }` }>
        { t(status) }
      </span>
    </h5>
  } else {
    return <div />
  }
}