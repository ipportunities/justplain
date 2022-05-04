import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import t from "../../../translate";
import {appSettings} from "../../../../custom/settings";

const EditorPart = (props) => {

  return (
    <div className="editor_holder">
    <Editor
      apiKey="k68mc81xjxepc3s70sz7ns6ddgsx6bcgzpn3xgftlxgshmb3"
      inline
      ///initialValue -> value caret jump opeens 11-08-2021
      value={props.part_content != '' ? props.part_content : ''}
      init={{
        menubar:false,
        plugins: 'link image code lists advlist',
        style_formats_merge: true,
        relative_urls : false,
        remove_script_host : true,
        document_base_url : appSettings.domain_url,
        style_formats: [
          {
            title: 'Button',
            items: [
                { title: 'Normal', inline: 'span', classes : "btn btn-primary" },
            ]
          }
        ],
        toolbar: [
          "undo redo | styleselect | removeformat | bold italic underline | alignleft aligncenter alignright alignjustify",
          "bullist numlist outdent indent | table | fontsizeselect | forecolor | link "],
        setup: editor => {
          //Keep bg image dark if on focus
          editor.on('keydown', function(e){
            try {
              if(e.target.nextSibling.nextSibling.classList)
              {

                if(e.target.nextSibling.nextSibling.classList.contains('placeholder_editor')){
                  e.target.nextSibling.nextSibling.classList.add("hide")
                }
              }
            } catch(err) {} //tbv traslations
          });
          editor.on('focus', function(e){
            try {
              if(e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList)
              {
                if (e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList.contains('imageAsBg')) {
                  e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList.add("editting")
                }
              }
            }
            catch(err) {} //tbv translations...
          });
          //Remove dark bg on focus out
          editor.on('blur', function(e){
            try {
              if(e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList)
              {
                if (e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList.contains('imageAsBg')) {
                  e.target.targetElm.parentElement.parentElement.parentElement.previousSibling.classList.remove("editting")
                }
              }
            }
            catch(err) {} //tbv translations
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
      onEditorChange={(content, editor) => props.updatePart(props.index, props.update_field, (content == "<br>" ? "":content))}
      />
      {/*
      2022-2-17 als leeg dan komt <br data-mce-bogus="1"> en wordt de placeholder niet getoond. props.part_content plaatsen indien leeg lost dit op blijkbaar....
      */}
      {props.part_content == "" ? props.part_content:''}
        {props.part_content == "" ?
          <div className="placeholder_editor">
            {t("Plaats hier uw tekst")}...
          </div>
        :''}

      </div>
  )
};

export default EditorPart;
