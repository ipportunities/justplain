import React, {useState, useEffect} from 'react';
import uuid from "uuid";
import { useSelector } from "react-redux";
import parse from 'html-react-parser';
import t from "../../../translate";
import ContentEditable from 'react-contenteditable'

const List = (props) => {

  const intervention  = useSelector(state => state.intervention);
  const activeLesson = useSelector(state => state.activeLesson);
  const allAnswers = useSelector(state => state.answersLessons);

  const [tempCustomContent, setTempCustomContent] = useState(''); /// dit is wat iemand typt om toe te voegen
  const [customAnswers, setCustomAnswers] = useState([]); /// deze zijn toegevoegd aan de voorkant
  const [mergedItems, setMergedITems] = useState([]); // merge items with custom
  const [items, setITems] = useState([]); // dit zijn de originele items
  const [chosenAnswers, setChosenAnswers] = useState([]); /// deze zijn gekozen radio checkbox
  const [otherAnswers, setOtherAnswers] = useState([]); /// other content
  const [showCorrectAnswers, setShowCorrectAnswers] = useState([])

  //////////////////////
  ///Get content
  useEffect(() => {
    if(props.part.items !== "")
    {
      setITems(props.part.items)
      setMergedITems(props.part.items)
    }

    if(typeof props.answer !== 'undefined' && props.answer !== "" && props.part.subtype !== 'cards')
    {
      setCustomAnswers(props.answer.customAnswers)
      updateMerged(props.part.items, props.answer.customAnswers);

      setChosenAnswers(props.answer.chosenAnswers)
      if(typeof props.answer.otherAnswers != "undefined")
      {
        setOtherAnswers(props.answer.otherAnswers)
      }
    }

  }, [props.answer, props.part.items]);

  useEffect(() => {
    if(typeof props.answer != "undefined" && props.answer.checked && props.part.checkable){
      showCorrectAnswer(false)
    } else {
      setShowCorrectAnswers([])
    }
  }, [items, props.answer]);

  const onChange = () => {
    //lege functie om react tevreden te stellen
  }

  //////////////////////
  ///Build input
  function buildInput(item_id){
    let checked = false;
    if (chosenAnswers)
    {
      checked = chosenAnswers.includes(item_id) ? true:false;
    }

    if (props.part.type == "question_checkboxes")
    {
      return <input id={item_id} type="checkbox" value='' checked={checked ? 'checked':''} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true")  ? "disabled" : false}  onChange={onChange} />
    }
    if (props.part.type == "question_radio") {
      return <input id={item_id} type="radio" value='' checked={checked ? 'checked':''} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? "disabled" : false} onChange={onChange} />
    }
  }

  //////////////////////
  ///Add input by user
  function addUserCustomItem()
  {
    addCustomAnswer(tempCustomContent);
    setTempCustomContent("");
  }
  //////////////////////
  ///Remove custom item of user
  function removeCustomItem(id)
  {
    let this_item_obj = customAnswers.filter(function (item) {
      return item.id === id
    });
    let this_item_obj_index = customAnswers.indexOf(this_item_obj[0]);
    customAnswers.splice(this_item_obj_index, 1);

    updateMerged(items, customAnswers);

    saveAnswers(chosenAnswers, customAnswers, otherAnswers)
  }
  //////////////////////
  ///Add Item
  function addCustomAnswer (userInput) {

    let customAnswersUpdated = customAnswers;
    customAnswersUpdated.push({content:userInput, id:uuid.v4(), type:"custom"});
    setCustomAnswers(customAnswersUpdated)

    updateMerged(items, customAnswersUpdated);

    saveAnswers(chosenAnswers, customAnswersUpdated, otherAnswers)
  }
  //////////////////////
  ///Update custom item user
  function updateUserCustomItem(id, userInput)
  {
    if(id == false){
      setTempCustomContent(userInput)
    } else {
      let this_item_obj = customAnswers.filter(function (item) {
        return item.id === id
      });
      let this_item_obj_index = customAnswers.indexOf(this_item_obj[0]);
      if(this_item_obj_index != -1)
      {
        customAnswers[this_item_obj_index].content = userInput;

        updateMerged(items, customAnswers);

        saveAnswers(chosenAnswers, customAnswers, otherAnswers)
      }
    }
  }
  //////////////////////
  ///Voeg items en custom lijst items samen
  function updateMerged(items, customAnswers)
  {
    let itemsWithCustom = [...items, ...customAnswers];
    setMergedITems(itemsWithCustom)
  }
  //////////////////////
  ///Toggle answer
  function toggleAnswer(item_id, type)
  {
    ///alleen bij included vragenlijsten
    if(props.part.include_id && props.part.include_id != ""){

      let this_questionnaire_obj = intervention.settings.questionnaires.filter(function (questionnaire) {
        return parseInt(questionnaire.id) === parseInt(props.part.parentId)
      });

      if(this_questionnaire_obj.length > 0){
        ///finish wordt in get_course_answers meegegeven op basis van setting lockAnswersAfterFinishQuestionnaireInLesson
        let this_answer_obj = allAnswers.answers.filter(function (answer) {
          return answer.the_id === activeLesson
        });

        if(this_answer_obj.length > 0){
          if(this_answer_obj[0].locked.includes(props.part.parentId)){
            return false;
          }
        }

        ///checked wordt opgeslagen antwoord gecheckt is
        if(props.answer.checked && props.part.checkable){
          return false;
        }
      }
    }

    if(props.hasOwnProperty("disabled") && props.disabled === "true"){
      return false;
    }
    if(!(props.part.type == "question_radio" || props.part.type == "question_checkboxes"))
    {
      return false;
    }
    let chosenAnswersUpdated = chosenAnswers

    if(props.part.type == "question_radio"){
      chosenAnswersUpdated = []
    }

    ///remove
    if(chosenAnswers.includes(item_id) && type != "other")
    {
      if(props.part.type == "question_radio"){
        chosenAnswersUpdated = []
      } else {
        let indexChosenAnswer = chosenAnswersUpdated.indexOf(item_id);
        if (indexChosenAnswer > -1) {
          chosenAnswersUpdated.splice(indexChosenAnswer, 1);
        }
      }
    } else { ///add
      if(props.part.type == "question_radio"){
        chosenAnswersUpdated = []
      }
      chosenAnswersUpdated.push(item_id)
    }
    setChosenAnswers(chosenAnswersUpdated)
    saveAnswers(chosenAnswersUpdated, customAnswers, otherAnswers)
  }

  //////////////////////
  ///Update anders namelijk
  function updateOtherAnswer(id, userInput){
    let otherAnswersUpdated = otherAnswers;
    let this_item_obj = otherAnswersUpdated.filter(function (item) {
      return item.id === id
    });
    let this_item_obj_index = otherAnswersUpdated.indexOf(this_item_obj[0]);
    if(this_item_obj_index == -1)
    {
      otherAnswersUpdated.push({id:id, content:userInput})
    } else {
      otherAnswersUpdated[this_item_obj_index].content = userInput;
    }

    setOtherAnswers(otherAnswersUpdated)
    saveAnswers(chosenAnswers, customAnswers, otherAnswersUpdated)

  }
  //////////////////////
  ///Get anders namelijk
  function getOtherContent(id){
    let this_item_obj = otherAnswers.filter(function (item) {
      return item.id === id
    });
    let this_item_obj_index = otherAnswers.indexOf(this_item_obj[0]);
    if(this_item_obj_index == -1)
    {
      return
    } else {
      return otherAnswers[this_item_obj_index].content;
    }
  }

  //////////////////////
  ///Save items
  function saveAnswers(chosenAnswers, customAnswers, otherAnswers) {
    ///check onthouden?
    ///onthoud of is checked
    props.updateAnswer(props.part.id, {"chosenAnswers":chosenAnswers, "customAnswers":customAnswers, "otherAnswers":otherAnswers, 'checked':(props.answer.checked ? props.answer.checked:false)})
  }

  const [showCards, setShowCards] = useState([])

  function flipCard(index){
    let showCardsNew = [...showCards]
    if(showCardsNew.includes(index)){
      let indexOfIndex = showCardsNew.indexOf(index);
      if (indexOfIndex !== -1) showCardsNew.splice(indexOfIndex, 1);
    } else {
      showCardsNew.push(index)
    }
    setShowCards(showCardsNew)
  }

  function checkIfThereIsCorrectAnswer(){
    let thereIsACorrectAnswer = false;
    for(let i = 0 ; i < items.length ; i++){
      if(items[i].correct == 'true'){
        thereIsACorrectAnswer = true;
        break;
      }
    }

    return thereIsACorrectAnswer;
  }

  function showCorrectAnswer(save = true){
    let tempCorrectAnswer = []

    for(let i = 0 ; i < items.length ; i++){
      if(items[i].correct == 'true'){
        tempCorrectAnswer.push(items[i].id);
      }
    }
    /// en zet dat die een keer gecheckt is
    if(save){
      props.updateAnswer(props.part.id, {"chosenAnswers":chosenAnswers, "customAnswers":customAnswers, "otherAnswers":otherAnswers, checked:true})
    }

    setShowCorrectAnswers(tempCorrectAnswer)
  }

  return (
    <div className={"list " + (props.part.type == "list" ? props.part.subtype:"")}>
      <div className="content center">
        {(props.part.content && props.part.content != '') ?
          <span className="header">
            {parse(props.part.content)}
          </span>
        :''}
      <div className="options">
        <ul>
          {mergedItems.map((item, index) =>
            <li key={index} id={"item_" + index} index={index} className={(showCorrectAnswers.includes(item.id) ? 'correct':'') + (props.part.subtype == 'cards' ? (showCards.includes(index) ? 'back':'front'):'')}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      {props.part.type == "list"  ?
                        <span className="before btn">{props.part.subtype == "nummers" ? (index + 1):''}</span>:''}
                    </td>
                    <td>
                      {props.part.subtype == 'cards' ?
                        <div className={"flip-card " + (showCards.includes(index) ? 'back':'front')}>
                          <div className="inner">
                            <div className='front'>
                              {typeof item.image != "undefined" && item.image != "" ?
                                <img src={item.image} className="image"  />
                                :''}
                              {parse(item.content)}
                              {item.buttonText != "" ?
                                <div className='alignCenter'>
                                  <span className='btn btn-primary buttonText' onClick={() => flipCard(index)}>
                                    {parse(item.buttonText)}
                                  </span>
                                </div>
                              :''}
                            </div>
                            <div className='back'>
                              {typeof item.imageBack != "undefined" && item.imageBack != "" ?
                                <img src={item.imageBack} className="image" />
                                :''}
                              {parse(item.content2)}
                              <div className='alignCenter'>
                                <span className='btn btn-primary buttonText' onClick={() => flipCard(index)}>
                                  {t('Draai terug')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        :
                        <div>
                        {buildInput(item.id)}

                        <label htmlFor={item.id} onClick={(e) => toggleAnswer(item.id, item.type)} className={item.type == "other" ? "other":''}>
                          {typeof item.type != "undefined" && item.type == "custom" ?
                          <div>
                            <ContentEditable
                                  html={item.content} // innerHTML of the editable div
                                  disabled={false}       // use true to disable editing
                                  onChange={(e) => updateUserCustomItem(item.id, e.target.value)} // handle innerHTML change
                                  className=""
                                  placeholder="Voeg een item toe"
                                />
                          </div>
                          :
                          <div className={(parse(item.content) != "" ? "has_text":"")}>
                            {(parse(item.content) == "" ? parse('&nbsp;'):parse(item.content))}

                            {item.type == "other" ?
                        <input type="text" className='other' placeholder={t("anders namelijk")} onChange={(e) => updateOtherAnswer(item.id, e.target.value)} value={getOtherContent(item.id)} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") ? true : false}/>:''}

                          </div>
                          }
                          </label>
                        </div>
                      }



                    </td>

                    <td>


                    </td>
                    <td>
                      {item.type == "custom" ? <span className="delete btn showOnHover" onClick={(e) => removeCustomItem(item.id)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>:''}
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          )}
          {props.part.subtype == "aanvulbare lijst" ?
            <li className='gu-unselectable'>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div className="btn before"></div>
                    </td>
                    <td>
                      <label>
                      <ContentEditable
                            id={"custom_new_" + props.part.id }
                            html={tempCustomContent} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={(e) => updateUserCustomItem(false, e.target.value)} // handle innerHTML change
                            className=""
                            placeholder="Voeg een item toe"
                          />

                      </label>
                    </td>
                    <td>

                    </td>
                    <td>
                    <div className="btn edit" onClick={e => addUserCustomItem()}>
                      <i className="fas fa-plus"></i>
                    </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          :''}
        </ul>
        </div>
      </div>
      {props.part.checkable && !props.answer.checked && checkIfThereIsCorrectAnswer() ?
        <div className="checkAnswer">
          {showCorrectAnswers.length != 0?
            false
            :
            <span className="btn btn-primary" onClick={()=>showCorrectAnswer()}>
              {t("Check antwoord")}
            </span>
          }

        </div>
        :false}
    </div>
  );
}

export default List;
