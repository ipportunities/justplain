import React   from 'react';
import parse from 'html-react-parser';

const Wysiswg = (props) => {

  const heading_text = "";

  return (
    <div>
      <div className={"center text " + props.part.subtype}>
        {(props.part.subtype == "koptekst" || props.part.subtype == "paragraaf met koptekst") && props.part.question != '' ? parse('<span class="header">'+ props.part.question+'</span>'):''}
        {props.part.subtype == "paragraaf" || props.part.subtype == "paragraaf met koptekst" || props.part.subtype == "omkaderd tekstblok" ? parse(props.part.content):''}

        {props.part.subtype == "met afbeelding links" || props.part.subtype == "met afbeelding rechts" || props.part.subtype == "met afbeelding links kwart" || props.part.subtype == "met afbeelding rechts kwart" ?
          <div className="with_image clearfix">
            <div className="image ">
              <div className="ImageHolderRelative">
                <img src={props.part.image} />
              </div>
            </div>
            <div className='text'>
              {parse(props.part.content)}
            </div>
          </div>
        :''}

        {props.part.subtype == "twee kolommen" ?
          <div className="columns grid-2 clearfix">
            <div className='column'>
              {parse(props.part.content)}
            </div>
            <div className='column'>
              {parse(props.part.content2)}
            </div>
          </div>
        :''}
      </div>
    </div>
  );
}

export default Wysiswg;
