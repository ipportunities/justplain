import React, { useState, useEffect } from "react";
import t from "../../../components/translate";
import "./style.scss";
import { useSelector } from "react-redux";
import ContentEditable from 'react-contenteditable'

const PositieveEigenschappen = props => {

  const allAnswers = useSelector(state => state.answersLessons);
  const [names, setNames] = useState([])
  const [childs, setChilds] = useState([])
  const [qualities, setQualities] = useState([])

  useEffect(() => {
    if(props.answer && Array.isArray(props.answer)){
      setQualities(props.answer)
    }
  }, []);

  useEffect(() => {
    for(let i = 0 ; i < allAnswers.answers.length ; i++){
      for(let ii = 0 ; ii < allAnswers.answers[i].answers.length ; i++){
        if(allAnswers.answers[i].answers[ii].answer.koppel_id == "c_1"){
          setNames(allAnswers.answers[i].answers[ii].answer.names);
          break;
        }
      }
    }
  }, [allAnswers]);

  useEffect(() => {
    let tempChilds = []
    for(let i = 0 ; i < names.length ; i++){
      if(names[i].age == "small"){
        let this_qualities_obj = qualities.filter(function (quality) {
          return quality.id === names[i].id
        });
        let this_qualities_obj_index = qualities.indexOf(this_qualities_obj[0]);

        if(this_qualities_obj_index !== -1){
          names[i].qualities = qualities[this_qualities_obj_index]
        } else {
          names[i].qualities = {id:names[i].id, items:[{quality:'', example:''}]}
        }

        tempChilds.push(names[i])
      }
    }
    setChilds(tempChilds)
  }, [names ,qualities]);

  const addRow = (child_index) => {
    let tempChilds = [...childs]

    tempChilds[child_index].qualities.items.push({quality:'', example:''})

    updateChilds(tempChilds)
  }

  const removeRow = (child_index, index) => {
    let tempChilds = [...childs]

    tempChilds[child_index].qualities.items.splice(index, 1)

    updateChilds(tempChilds)
  }

  const updateQuality = (child_index, index_quality, value) => {
    let tempChilds = [...childs]

    tempChilds[child_index].qualities.items[index_quality].quality = value

    updateChilds(tempChilds)
  }

  const updateExample = (child_index, index_quality, value) => {
    let tempChilds = [...childs]

    tempChilds[child_index].qualities.items[index_quality].example = value

    updateChilds(tempChilds)
  }

  const updateChilds = (tempChilds) => {
    let qualities_to_save = []

    for(let i = 0 ; i < tempChilds.length ; i++){
      qualities_to_save.push(tempChilds[i].qualities)
    }

    props.updateAnswer(props.part.id, qualities_to_save)
    setChilds(tempChilds)
  }

  return(
    <div className="positieve_eigenschappen">
      {childs.map((child, index) =>
        <div className="child" key={index}>
          <div className="name">
            {child.name}
          </div>
          <table>
          <thead>
            <tr>
              <th>
                {t("Positieve eigenschappen")}
              </th>
              <th>
                {t("Voorbeeld")}
              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody>
            {child.qualities.items.map((quality, i_q) =>
              <tr>
                <td>
                  <ContentEditable
                      html={quality.quality} // innerHTML of the editable div
                      disabled={false}       // use true to disable editing
                      onChange={(e) => updateQuality(index, i_q, e.target.value)} // handle innerHTML change
                      className=""
                      placeholder="Positieve eigenschap"
                    />
                </td>
                <td>
                  <ContentEditable
                    html={quality.example} // innerHTML of the editable div
                    disabled={false}       // use true to disable editing
                    onChange={(e) => updateExample(index, i_q, e.target.value)} // handle innerHTML change
                    className=""
                    placeholder="Positieve eigenschap"
                  />
                </td>
                <td>
                  {i_q != 0 ?
                    <span className="delete btn showOnHover" onClick={(e) => removeRow(index, i_q)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                    :false}
                </td>
              </tr>
            )}

          </tbody>
          </table>
          <div className="btn edit" onClick={e => addRow(index)}>
            <i className="fas fa-plus"></i>
          </div>
        </div>
      )}
    </div>
  )
}

export default PositieveEigenschappen;
