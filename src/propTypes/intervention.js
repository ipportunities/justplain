import PropTypes from 'prop-types'

export const language = {
  id: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired
}

export const part = {
  type: PropTypes.string.isRequired,
  subtype: PropTypes.string,
  content: PropTypes.string.isRequired,
  content2: PropTypes.string,
  items: PropTypes.shape({
    content: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired
  }),
  question: PropTypes.string,
  url: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  })),
  id: PropTypes.string.isRequired,
  slideDown: PropTypes.bool.isRequired
}

export const setting = {
  title: PropTypes.string.isRequired,
  parts: PropTypes.arrayOf(PropTypes.shape(part)),
  newPart: PropTypes.bool.isRequired,
  removePart: PropTypes.bool.isRequired,
  image: PropTypes.bool.isRequired
}

export const content = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  parent_id: PropTypes.string.isRequired,
  nest: PropTypes.string.isRequired,
  settings: PropTypes.shape(setting).isRequired
}

export const selfhelp = {
  guided_selfhelp_view_lessons: PropTypes.number,
  guided_selfhelp_view_questionnaires: PropTypes.number,
  guided_selfhelp_view_goals: PropTypes.number,
  guided_selfhelp_view_log: PropTypes.number,
  guided_selfhelp_chat_contact: PropTypes.number,
  lesson_new_title: PropTypes.string.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.shape(content)),
  optionalLessons: PropTypes.arrayOf(PropTypes.shape(content)),
}


export const intervention = {
  id: PropTypes.number.isRequired,
  organisation_id: PropTypes.number.isRequired,
  settings: PropTypes.shape({
    goals: PropTypes.arrayOf(PropTypes.shape(content)),
    intervention_type: PropTypes.string.isRequired,
    languages_id: PropTypes.number.isRequired,
    languages: PropTypes.arrayOf(PropTypes.shape(language)),
    menu: PropTypes.shape({
      modules: PropTypes.string.isRequired,
      objectives: PropTypes.string.isRequired,
      journal: PropTypes.string.isRequired,
      stress: PropTypes.string.isRequired,
      coach: PropTypes.string.isRequired,
    }).isRequired,
    pages: PropTypes.arrayOf(PropTypes.shape(content)),
    questionnaires: PropTypes.arrayOf(PropTypes.shape(content)),
    research: PropTypes.bool.isRequired,
    selfhelp: PropTypes.shape(selfhelp).isRequired,
    stressText: PropTypes.string.isRequired,
    translations: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  title: PropTypes.string.isRequired,
}
