import React from 'react';
import EditorPart from '../editor_part.js';

const TextOnImage = (props) => {

  const bg_image = typeof props.images[0] !== 'undefined' ? props.images[0].url:'';

  return(
    <>
      {(props.part.subtype === "tekst op afbeelding") ?
        <div className={"imageHolder" + (bg_image === "" ? ' empty':'')}>
          <div className="holder">
            <div className="imageAsBg" style={{ backgroundImage: "url('"+bg_image+"')" }}></div>
            <div className="text">
              <div className="center">
                <EditorPart index={props.index} updatePart={props.updatePart} part_content={props.part.content} update_field="content" />
              </div>
            </div>
          </div>

          <span className='btn btn-primary showOnHover' onClick={() => props.showMediaLibrary(props.index)}>Wijzig afbeelding <i className="fas fa-pen"></i></span>
        </div>
      :''}
    </>
  )
}

export default TextOnImage;
