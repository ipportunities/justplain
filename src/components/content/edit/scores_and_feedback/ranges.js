import React, {useState, useEffect} from 'react';
import t from "../../../translate";
import { Editor } from '@tinymce/tinymce-react';
import { useSelector, useDispatch } from 'react-redux';
import { setChosenImage } from "../../../../actions";
import ContentEditable from "react-contenteditable";
import ReactTooltip from 'react-tooltip'
import uuid from "uuid";
import { getClone } from "../../../utils";
import AddImage from "../parts/helpers/addImage";
import {appSettings} from "../../../../custom/settings";

const Ranges = (props) => {

  const [activeRange, setActiveRange] = useState(false)
  const [ranges, setRanges] = useState([])

  //console.log('activeRange');
  //console.log(activeRange);

  useEffect(() => {
    if (typeof props.ranges != "undefined" && props.ranges != "") {
      setRanges(props.ranges);
    }
  }, [props]);

  const url = useSelector(state => state.url);
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //console.log('medialibrary');
  //console.log(medialibrary);

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == 1)
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    imageAction(medialibrary.chosen_image);
  }

  function addRange(){
    let rangesToSet = ranges;
    rangesToSet.push({min:"",max:"",feedback:"", id:uuid.v4()})
    updateRanges(rangesToSet)
  }

  function deleteRange(index){
    let rangesToSet = ranges;
    rangesToSet.splice(index, 1);
    updateRanges(rangesToSet)
  }

  function updateRanges(rangesToSet){
    setRanges(rangesToSet)
    props.setStateHandler({ranges: rangesToSet})
  }

  function updateMin(min, index){
    let rangesToSet = ranges;
    rangesToSet[index].min = min
    updateRanges(rangesToSet)
  }
  function updateMax(max, index){
    let rangesToSet = ranges;
    rangesToSet[index].max = max
    updateRanges(rangesToSet)
  }
  function updateFeedback(index, content){
    let rangesToSet = ranges;
    rangesToSet[index].feedback = content
    updateRanges(rangesToSet)
  }
  function copyRange(index){
    let rangesToSet = [...ranges];
    let toCopy = getClone(rangesToSet[index])
    toCopy.id = uuid.v4()
    rangesToSet.splice(index, 0, JSON.parse(JSON.stringify(toCopy)));
    updateRanges(rangesToSet)
  }
  function swapRange(indexA, indexB){
    let rangesToSet = ranges;
    var a = rangesToSet[indexA];
    rangesToSet[indexA] = rangesToSet[indexB];
    rangesToSet[indexB] = a;
    updateRanges(rangesToSet)
  }

  //////////////////////
  ///Set selected image
  //////////////////////
  function imageAction(image){
    let rangesToSet = ranges;
    rangesToSet[activeRange].image = url + "/uploads/intervention/" + medialibrary.chosen_image
    updateRanges(rangesToSet)
  }
  //////////////////////
  ///Delete image
  //////////////////////
  function deleteImage(index, item_idex){
    ///item index meegeven omdat anders hij de verkeerde pakt...
    let rangesToSet = ranges;
    rangesToSet[item_idex].image = ''
    updateRanges(rangesToSet)
  }

  return(
    <div>
      <div className="minmax">
        <span>{t("Eindscore ")}</span>
        <span>{t('min')} {props.range["rangeMin"]} </span>
        <span>{t('max')} {props.range["rangeMax"]} </span>
      </div>
      <div className="ranges">
        {ranges.map((range, index)=>
          <div key={range.id} className="range">
            <div className="options">
              {index != 0 ? (
                <button
                  type="button"
                  onClick={() => swapRange(index, index - 1)}
                  data-tip={t("Naar boven")}
                >
                  <i className="fa fa-chevron-up"></i>
                </button>
              ) : (
                ""
              )}
              {index != ranges.length - 1 ? (
                <button
                  type="button"
                  onClick={() => swapRange(index, index + 1)}
                  data-tip={t("Naar beneden")}
                >
                  <i className="fa fa-chevron-down"></i>
                </button>
              ) : (
                ""
              )}
              <button type="button" onClick={() => copyRange(index)} data-tip={t("Kopieer range")}>
                <i className="fa fa-copy"></i>
              </button>
              <button type="button" onClick={() => deleteRange(index)} data-tip={t("Verwijder range")}>
                <i className="fa fa-trash"></i>
              </button>
            </div>
            <table className="min_max">
              <tbody>
                <tr>
                  <td>
                    Feedback bij een score
                  </td>
                  <td>
                    van
                  </td>
                  <td>
                    <ContentEditable
                      html={range.min}
                      disabled={false}
                      onChange={e => updateMin(e.target.value, index)}
                      className=""
                      placeholder="Min"
                    />
                  </td>
                  <td>
                    tot en met
                  </td>
                  <td>
                    <ContentEditable
                      html={range.max}
                      disabled={false}
                      onChange={e => updateMax(e.target.value, index)}
                      className=""
                      placeholder="Max"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="editor_holder">
            <Editor
              apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
              inline
              //initialValue={range.feedback}
              ///initialValue -> value caret jump opeens 11-08-2021
              value={range.feedback}
              init={{
                menubar:false,
                plugins: 'link image code lists advlist',
                relative_urls : false,
                remove_script_host : true,
                document_base_url : appSettings.domain_url,
                toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | link ",
                setup: editor => {
                  //Keep bg image dark if on focus
                  editor.on('keydown', function(e){

                    if(e.target.nextSibling.classList)
                    {
                      if(e.target.nextSibling.classList.contains('placeholder_editor')){
                        e.target.nextSibling.classList.add("hide")
                      }
                    }

                  });
                  editor.on('focus', function(e){

                  });
                  //Remove dark bg on focus out
                  editor.on('blur', function(e){

                  });
                }
                /*myCustomToolbarButton
                setup: (editor) => {
                  editor.ui.registry.addButton('myCustomToolbarButton', {
                    text: 'My Custom Button',
                    onAction: () => props.showMediaLibrary()
                  });

                }  */
              }}
              onEditorChange={(content, editor) => updateFeedback(index, content)}
              />

              {range.feedback == "" ?
                <div className="placeholder_editor">
                  Plaats hier de feedback...
                </div>
              :''}

            </div>

            <br/>
            <div onClick={()=>setActiveRange(index)}>
              <AddImage image={typeof range.image !== 'undefined'?range.image:''} showMediaLibrary={props.showMediaLibrary} index={1} deleteImage={deleteImage} item_index={index}/>
            </div>
          </div>
        )}
      </div>
      <span className="add btn btn-primary showOnHover" onClick={(e) => addRange('')} >{t("Item toevoegen")} <i className="fa fa-plus"></i></span>
    </div>
  );
}

export default Ranges
