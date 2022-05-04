import React from 'react';
import parse from 'html-react-parser';

const TextOnImage = (props) => {

  const bg_image = typeof props.images[0] != 'undefined' ? props.images[0].url:'';

  return(
    <>
      {(props.part.subtype == "tekst op afbeelding") ?
        <div className={"imageHolder" + (bg_image == "" ? ' empty':'')}>
          <div className="holder">
            <div className="imageAsBg" style={{ backgroundImage: "url('"+bg_image+"')" }}></div>
            <div className="text">
              <div className="center">
                <div>
                  {parse(props.part.content)}
                </div>
              </div>
            </div>
          </div>
        </div>
      :''}
    </>
  )
}

export default TextOnImage;
