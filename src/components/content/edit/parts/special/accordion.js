import React, {useState, useEffect}  from 'react';
import ContentEditable from 'react-contenteditable'
import { setChosenImage } from "../../../../../actions";
import { useSelector, useDispatch } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { getClone } from "../../../../utils";
import uuid from "uuid";
import AddImage from "../helpers/addImage";
import t from "../../../../translate";
import ReactTooltip from 'react-tooltip';
import {appSettings} from "../../../../../custom/settings";

const Accordion = (props) => {

  const [state, setState] = useState({
    items:[],
    active_item:0 /// deze wordt gebruikt bij zetten van de geuploade afbeelding
  });
  const url = useSelector(state => state.url);
  const medialibrary = useSelector(state => state.mediaLibrary);
  const dispatch = useDispatch();

  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == props.index)
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    imageAction(medialibrary.chosen_image);
  }

  //////////////////////
  ///Get content
  //////////////////////
  useEffect(() => {

    if(props.items != "")
    {
      let newState = getClone(state)
      newState.items = props.items
      setState(newState);
    }
  }, []);
  //////////////////////
  ///Delete item
  //////////////////////
  function deleteItem(index) {
    ReactTooltip.hide()
    let clonedState = getClone(state);
    clonedState.items.splice(index, 1);
    saveChange(clonedState)
  }
  //////////////////////
  ///Add item
  //////////////////////
  function addItem(){
    let clonedState = getClone(state);
    for(let i = 0 ; i < clonedState.items.length ; i ++)
    {
      clonedState.items[i].visible = false;
    }
    clonedState.items.push({content:'', id:uuid.v4(), content2:'', visible:true, image:'', flip:'front', buttonText:''});
    clonedState.active_item = clonedState.items.length - 1
    saveChange(clonedState)
  }
  //////////////////////
  ///Toggle items
  //////////////////////
  function toggleVisibility(index)
  {
    let clonedState = getClone(state);
    if(clonedState.items[index].visible == true)
    {
      clonedState.items[index].visible = false;
      clonedState.active_item = 0
    } else {
      for(let i = 0 ; i < clonedState.items.length ; i ++)
      {
        clonedState.items[i].visible = false;
      }
      clonedState.items[index].visible = clonedState.items[index].visible == true ? false:true;
      clonedState.active_item = index
    }

    saveChange(clonedState)
  }
  //////////////////////
  ///Update content
  //////////////////////
  function updateContent(index, value){
    let clonedState = getClone(state);
    clonedState.items[index].content = value
    saveChange(clonedState)
  }
  //////////////////////
  ///Update content 2
  //////////////////////
  function updateContent2(index, value){
    let clonedState = getClone(state);
    clonedState.items[index].content2 = value
    saveChange(clonedState)
  }
  //////////////////////
  ///Swap item positions
  //////////////////////
  function swapItem(indexA, indexB){
     let clonedState = getClone(state);
     var a = clonedState.items[indexA];
     clonedState.items[indexA] = clonedState.items[indexB];
     clonedState.items[indexB] = a;
     saveChange(clonedState)
   }
   //////////////////////
   ///Set selected image
   //////////////////////
   function imageAction(){
     let clonedState = getClone(state);
     clonedState.items[state.active_item].image = url + "/uploads/intervention/" + medialibrary.chosen_image
     saveChange(clonedState)
   }
   //////////////////////
   ///Delete image
   //////////////////////
   function deleteImage(){
     let clonedState = getClone(state);
     clonedState.items[state.active_item].image = ''
     saveChange(clonedState)
   }
 ///Save
  function saveChange(clonedState){
    setState(clonedState)
    props.updatePart(props.index, 'items', clonedState.items)
  }

  //////////////////////
  ///Content
  //////////////////////
  return (
    <div className="special accordion">
      <div className="items">
        { state.items.map((item, index) =>
          <div key={index} className={"item " + (item.visible == true ? 'content_visible':'')}>

            <div className="title">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <ContentEditable
                            html={item.content != "" ? item.content:""} // innerHTML of the editable div
                            disabled={false}       // use true to disable editing
                            onChange={(e) => updateContent(index, e.target.value)} // handle innerHTML change
                            placeholder={t("Plaats hier uw tekst")+"..."}
                          />
                    </td>
                    <td>
                      <i onClick={() => toggleVisibility(index)} className={"toggle_content fa fa-" + (item.visible != true ? 'plus':'minus')}></i>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
            <div className={(item.visible == true ? 'slideDown':'slideUp')}>
              <div className="editor_holder">
              <Editor
                apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
                inline
                ///initialValue -> value caret jump opeens 11-08-2021
                value={item.content2 != '' ? item.content2 : ''}
                init={{
                  menubar:false,
                  plugins: 'link image code lists advlist',
                  relative_urls : false,
                  remove_script_host : true,
                  document_base_url : appSettings.domain_url,
                  toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | fontsizeselect | forecolor | link ",
                  setup: editor => {
                    //Keep bg image dark if on focus
                    editor.on('keydown', function(e){
                      if(e.target.nextSibling.nextSibling.classList)
                      {

                        if(e.target.nextSibling.nextSibling.classList.contains('placeholder_editor')){
                          e.target.nextSibling.nextSibling.classList.add("hide")
                        }
                      }
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
                onEditorChange={(content, editor) => updateContent2(index, content)}
                />
                {item.content2 == "" || typeof item.content2 == 'undefined' ?
                  <div className="placeholder_editor">
                    {t("Plaats hier uw tekst")}...
                  </div>
                :''}
            </div>
                <br/>
                <AddImage image={typeof item.image !== 'undefined'?item.image:''} showMediaLibrary={props.showMediaLibrary} index={props.index} deleteImage={deleteImage} />

                <div className="accordion_actions">
                  {index != 0 ? <div>
                    <span className="btn grey swap" onClick={() => swapItem(index, index - 1)} data-tip={t("Item naar boven")}>
                      <i className="fa fa-chevron-up"></i>
                    </span>
                  </div>:''}
                  {index != state.items.length - 1 ? <div>
                    <span className="btn grey swap" onClick={() => swapItem(index, index+1)} data-tip={t("Item naar onder")}>
                      <i className="fa fa-chevron-down"></i>
                    </span>
                  </div>:''}
                  <div>
                    <span className="addd btn grey" onClick={(e) => addItem(index, '')} data-tip={t("Item toevoegen")}><i className="fa fa-plus"></i></span>
                  </div>
                  <div>
                    <span className="delete btn" onClick={(e) => deleteItem(index, e)} data-tip={t("Verwijder tab")}><i className="fa fa-minus"></i></span>
                  </div>
                </div>
            </div>
            <ReactTooltip place="top" effect="solid" delayShow={200}   />
          </div>
        )}

      </div>
    </div>
  );
}

export default Accordion;
