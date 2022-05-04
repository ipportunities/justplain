import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../translate";
import Lesson from "./lesson";

const TranslateLessons = () => {

  const intervention = useSelector(state => state.intervention);

  const [activeLessonId, setActiveLessonId] = useState(0);
  useEffect(() => {
    if(intervention.settings.selfhelp.lessons[0])
    {
      setActiveLessonId(intervention.settings.selfhelp.lessons[0].id);
    }
  }, [intervention.settings.selfhelp.lessons[0]])

  const selectLesson = (e) => {
    setActiveLessonId(e.target.value);
  }

  return (
    <div>
      <select className="custom-select" onChange={(e) => selectLesson(e)}>
      {
        intervention.settings.selfhelp.lessons.map((lesson, index) => {
          return (
            <option key={index} value={lesson.id}>
              {
                parseInt(lesson.parent_id) === 0 ? '' : ' - - - - - - '
              }
              {lesson.title}
            </option>
          )
        })
      }
      </select>
      <br /><br />
      <Lesson activeLessonId={activeLessonId} />

    </div>
  )

}

export default TranslateLessons;
