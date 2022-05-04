import React from "react";
import EditorPart from '../content/edit/parts/editor_part.js';
import TranslateImages from './translate_images'
import t from "../translate";

const GenerateTranslationPart = (props) => {

  const getTranslation = (translation, mainId, field, value) => {

    if (typeof translation[mainId+"_"+field] !== 'undefined')
    {
       return translation[mainId+"_"+field];
    }
    else
    {
      //onderstaande is om oude manier van opslaan nog te ondersteunen...
      if (typeof translation[field] !== 'undefined')
      {
        return translation[field];
      }
      else
      {
        return value;
      }
    }
  }

  if (props.part.type === 'wysiwyg')
  {
    switch (props.part.subtype) {

      case "paragraaf":
      case "met afbeelding links":
      case "met afbeelding rechts":
      case "met afbeelding links kwart":
      case "met afbeelding rechts kwart":
      case "twee kolommen":
        return (
          <div className="translation_item" key={props.index}>
            <label>{t("Paragraaf")}</label><br />
            <div className="clearfix">
              <div className="original" dangerouslySetInnerHTML={{__html: props.part.content}} />

              <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_content', props.part.content)} update_field={props.mainId+'_'+props.part.id+'_content'} />
            </div>
            {
              props.part.subtype === 'twee kolommen' ?
                <span>
                  <br />
                  <label>{t("Paragraaf")}</label><br />
                  <div className="clearfix">
                    <div className="original" dangerouslySetInnerHTML={{__html: props.part.content2}} />

                    <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_content2', props.part.content2)} update_field={props.mainId+'_'+props.part.id+'_content2'} />
                  </div>
                </span>
              :
                ''
            }
            <TranslateImages props={props} />
          </div>
        )
        break;

      case "koptekst":
        return (
          <div className="translation_item" key={props.index}>
          <label>{t("Koptekst")}</label><br />
            <div className="clearfix">
              <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

              <div className="editor_holder">
                <input type="text" name={props.mainId+'_'+props.part.id+'_question'} onChange={(e) => props.onChange(e)} value={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} />
              </div>
            </div>
          </div>
        )
        break;

      case "paragraaf met koptekst":
        return (
        <div className="translation_item clearfix" key={props.index}>
            <label>{t("Koptekst")}</label><br />
            <div className="clearfix">
              <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />
              <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
            </div>
            <br />
            <label>{t("Paragraaf")}</label><br />
            <div className="clearfix">
              <div className="original" dangerouslySetInnerHTML={{__html: props.part.content}} />

              <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_content', props.part.content)} update_field={props.mainId+'_'+props.part.id+'_content'} />
            </div>

          </div>
        )
        break;

      default:
        return (<span></span>)
    }
  }
  else if (props.part.type === 'video')
  {
    return (
    <div className="translation_item" key={props.index}>
      <label>{t("Url")}</label><br />
      <div className="clearfix">
        <div className="original">
          <a href={props.part.url} target="_blank">{props.part.url}</a>
        </div>
        <div className="editor_holder">
          <input type="text" name={props.mainId+'_'+props.part.id+'_url'} onChange={(e) => props.onChange(e)} value={getTranslation(props.translation, props.mainId, props.part.id+'_url', props.part.url)} />
        </div>
      </div>
    </div>
    )
  }
  else if (props.part.type === 'list')
  {
    return (
      <div className="translation_item list" key={props.index}>
        <label>{t("Lijst")}</label><br />
        <div className="clearfix">
          <div className="original list">
            <ul>
              {
                props.part.items.map((item, index) => {
                  return (
                  <li key={index} dangerouslySetInnerHTML={{__html: item.content}} />
                  )
                })
              }
            </ul>
          </div>
          {
            props.part.items.map((item, index) => {
              return (
                <EditorPart index={index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} />
              )
            })
          }
        </div>
      </div>
    )
  }
  else if (props.part.type === 'quote')
  {
    return (
      <div className="translation_item" key={props.index}>
      <label>{t("Quoter")}</label><br />
        <div className="clearfix">
          <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

          <div className="editor_holder">
            <input type="text" name={props.mainId+'_'+props.part.id+'_question'} onChange={(e) => props.onChange(e)} value={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} />
          </div>
        </div>
        <br />
        <label>{t("Quote")}</label><br />
        <div className="clearfix">
          <div className="original" dangerouslySetInnerHTML={{__html: props.part.content}} />

          <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_content', props.part.content)} update_field={props.mainId+'_'+props.part.id+'_content'} />
          </div>
      </div>
    )
  }
  else if (props.part.type === 'question_checkboxes' || props.part.type === 'select' || props.part.type === 'question_radio' || props.part.type === 'question_open' || props.part.type === 'slider' || props.part.type === 'datepicker') {
    return (
      <div className="translation_item list" key={props.index}>
        <label>{t("Vraag")}</label><br />
        <div className="clearfix">
          <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

          <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
        </div>
        {
          (props.part.type !== 'question_open' && props.part.type !== 'slider' && props.part.type !== 'datepicker') ?
          <span>
            <br />
            <label>{t("Antwoord opties")}</label><br />
            <div className="clearfix">
            <div className="original list">
              <ul>
                {
                  props.part.items.map((item, index) => {
                    return (
                    <li key={index} dangerouslySetInnerHTML={{__html: item.content}} />
                    )
                  })
                }
              </ul>
            </div>
            {
              props.part.items.map((item, index) => {
                return (
                  <EditorPart index={index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} />
                )
              })
            }
          </div>
          </span>
        :
            <>
            {
              (props.part.type == 'slider') ?

                <span>
                  <br />
                    <label>{t("Min")}</label><br />
                    <div className="clearfix">
                      <div className="original">
                        {props.part.min}
                      </div>
                      <EditorPart updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_min', props.part.min)} update_field={props.mainId+'_'+props.part.id+'_min'} />
                    </div>
                  <br />
                    <label>{t("Max")}</label><br />
                    <div className="clearfix">
                      <div className="original">
                        {props.part.max}
                      </div>
                      <EditorPart updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_max', props.part.max)} update_field={props.mainId+'_'+props.part.id+'_max'} />
                    </div>

                </span>

              : ''
            }
            </>
        }
      </div>
    )
  }
  else if (props.part.type === 'matrix')
  {
    return (
      <div className="translation_item" key={props.index}>
        <label>{t("Vraag")}</label><br />
        <div className="clearfix">
          <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

          <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
        </div>
        <br/>
        {
          props.part.tableContent.map((row, indexRow) => {

            return (
              <span key={indexRow}>
              {
                (indexRow === 0) ?
                  <span>
                   {
                    row.map((column, indexColumn) => {
                      if (indexColumn > 0)
                      {
                        return(
                          <span key={indexColumn}>
                          <label>{t("Cel")}</label><br />
                            <div className="clearfix">
                              <div className="original" dangerouslySetInnerHTML={{__html: column}} />

                              <EditorPart index={indexRow+'_'+indexColumn} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_'+indexRow+'_'+indexColumn, column)} update_field={props.mainId+'_'+props.part.id+'_'+indexRow+'_'+indexColumn} />
                          </div>
                          {props.part.tableContent.lenght - 1 != indexColumn ? <br />:''}
                          </span>
                        )
                      }
                    })
                  }
                  </span>
                :
                  <span>
                  {
                    row.map((column, indexColumn) => {
                      if (indexColumn < 1)
                      {
                        return(
                          <span key={indexColumn}>
                          <label>{t("Cel")}</label><br />
                            <div className="clearfix">
                              <div className="original" dangerouslySetInnerHTML={{__html: column.cell_content}} />

                              <EditorPart index={indexRow+'_'+indexColumn} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_'+indexRow+'_'+indexColumn, column.cell_content)} update_field={props.mainId+'_'+props.part.id+'_'+indexRow+'_'+indexColumn} />
                            </div>
                            <br />
                          </span>
                        )
                      }
                    })
                  }
                  </span>
              }
              </span>
            )
          })
        }

      </div>
    )
  }
  else if (props.part.type === 'special' && props.part.subtype === 'accordion')
  {
    return (
    <div className="translation_item" key={props.index}>

      {
        props.part.items.map((item, index) => {
          return (
            <span key={index}>
            <label>{t("Accordion header")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.content}} />

                <EditorPart index={index+'_h'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} />
              </div>
                  <br />
            <label>{t("Accordion inhoud")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.content2}} />

                <EditorPart index={index+'_i'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content2', item.content2)} update_field={props.mainId+'_'+item.id+'_content2'} />
              </div>
              {index != (props.part.items.length - 1) ? <br/>:''}
            </span>
          )
        })
      }
      <TranslateImages props={props} />
    </div>
    )
  }
  else if (props.part.type === 'special' && props.part.subtype === 'tabs')
  {
    return (
    <div className="translation_item" key={props.index}>

      {
        props.part.items.map((item, index) => {
          return (
            <span key={index}>
            <label>{t("Tab")}</label><br />
              <div className="clearfix">
              <div className="original" dangerouslySetInnerHTML={{__html: item.content}} />

              <EditorPart index={index+'_h'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} /><br />
              </div>
              <br />
              <label>{t("Tab inhoud")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.content2}} />

                <EditorPart index={index+'_i'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content2', item.content2)} update_field={props.mainId+'_'+item.id+'_content2'} /><br />
              </div>
              {props.part.items.lenght - 1 != index ? <br/>:'' }
            </span>
          )
        })
      }
    	<TranslateImages props={props} />
    </div>
    )
  }
  else if (props.part.type === 'special' && props.part.subtype === 'cards')
  {
    return (
    <div className="translation_item" key={props.index}>

      {
        props.part.items.map((item, index) => {
          return (
            <span key={index}>
            <label>{t("Voorkant kaart")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.content}} />

                <EditorPart index={index+'_i'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} />
              </div>
              <br />
              <label>{t("Achterkant kaart")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.content2}} />
                <EditorPart index={index+'_i'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content2', item.content2)} update_field={props.mainId+'_'+item.id+'_content2'} />
              </div>
              <br />
              <label>{t("Button")}</label><br />
              <div className="clearfix">
                <div className="original" dangerouslySetInnerHTML={{__html: item.buttonText}} />
                <EditorPart index={index+'_i'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_buttonText', item.buttonText)} update_field={props.mainId+'_'+item.id+'_buttonText'} />
              </div>
            <br /><br></br>
            </span>
          )
        })
      }

    </div>
    )
  }
  else if (props.part.type === 'special' && props.part.subtype === 'tabel')
  {
    return (
      <div className="translation_item" key={props.index}>
      <label>{t("Vraag")}</label><br />
      <div className="clearfix">
        <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

        <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
      </div>
        {
          props.part.tableContent.map((row, indexRow) => {

            return (

                  <span key={indexRow}>
                  {
                    row.map((column, indexColumn) => {
                        return(
                          <span>
                          <label>{t("Cel")}</label><br />
                          <div className="clearfix">
                            <div className="original" dangerouslySetInnerHTML={{__html: column}} />

                            <EditorPart index={indexRow+'_'+indexColumn} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_'+indexRow+'_'+indexColumn, column)} update_field={props.mainId+'_'+props.part.id+'_'+indexRow+'_'+indexColumn} />
                          </div>
                          {row.lenght - 1 != indexColumn ? <br />:''}
                          </span>
                        )
                    })
                  }
                  </span>

            )
          })
        }

      </div>
    )
  }
  else if (props.part.type === 'feedback')
  {
    return (
    <div className="translation_item" key={props.index}>
      <label>{t(props.part.subtype.charAt(0).toUpperCase() + props.part.subtype.slice(1) +" intro")}</label><br />
      <div className="clearfix">
        <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

          <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
      </div>
      {
        props.part.subtype === 'feedback' ?
          <span>
          <br/>
          {
            props.part.items.map((item, index) => {
              return (
                <span key={index}>
                  <label>{t("Feedback")}</label><br />
                  <div className="clearfix">
                    <div className="original" dangerouslySetInnerHTML={{__html: item.content}} />

                    <EditorPart index={index+'_h'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} /><br />
                  </div>
                  <br />
                </span>
              )
            })
          }
          </span>
        : ''
      }

    </div>
    )
  }
  else if (props.part.type === 'chart')
  {
    return (
    <div className="translation_item" key={props.index}>
      <label>{t("Titel diagram")}</label><br />
      <div className="clearfix">
        <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

        <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
      </div>
      <br />
      <label>{t("Label items")}</label><br />
      <div className="clearfix">
        <div className="original" dangerouslySetInnerHTML={{__html: props.part.label_items}} />

        <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_label_items', props.part.label_items)} update_field={props.mainId+'_'+props.part.id+'_label_items'} />
      </div>
      <br />
      <label>{t("Label values")}</label><br />
      <div className="clearfix">
        <div className="original" dangerouslySetInnerHTML={{__html: props.part.label_value}} />

        <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_label_value', props.part.label_value)} update_field={props.mainId+'_'+props.part.id+'_label_value'} />
      </div>
      <br />

      {

            props.part.items.map((item, index) => {
              return (
                <span key={index}>
                  <label>{t("Item label")}</label><br />
                  <div className="clearfix">
                    <div className="original" dangerouslySetInnerHTML={{__html: item.content}} />

                    <EditorPart index={index+'_h'} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, item.id+'_content', item.content)} update_field={props.mainId+'_'+item.id+'_content'} /><br />
                  </div>
                  {props.part.items.lenght - 1 != index ? <br />:''}
                </span>
              )
            })
      }

    </div>
    )
  }
  else if (props.part.type === 'image' || (props.part.type === 'special' && props.part.subtype === 'download bestand') || props.part.type === 'audio')
  {
    return (
      <div className="translation_item" key={props.index}>
        <TranslateImages props={props} />
        <br />
        <label>{t("Button tekst")}</label><br />
        <div className="clearfix">
          {
          props.part.type !== 'audio' ?
          <>
            <div className="original" dangerouslySetInnerHTML={{__html: props.part.content}} />

            <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_content', props.part.content)} update_field={props.mainId+'_'+props.part.id+'_content'} />
          </>
          :
          <>
            <div className="original" dangerouslySetInnerHTML={{__html: props.part.question}} />

            <EditorPart index={props.index} updatePart={props.onChangeEditor} part_content={getTranslation(props.translation, props.mainId, props.part.id+'_question', props.part.question)} update_field={props.mainId+'_'+props.part.id+'_question'} />
          </>
          }
        </div>
      </div>
    )
  }
  else
  {
    return (<span></span>)
  }

}

export default GenerateTranslationPart;
