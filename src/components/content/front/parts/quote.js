import React   from 'react';
import parse from 'html-react-parser';

const Quote = (props) => {

  return (
    <div>
      <div className="center">
        <div className={"quote " + props.part.subtype}>
          {parse(props.part.content)}
          {parse(props.part.question) != "" ?
            <div className="quoter">
              {parse(props.part.question)}
            </div>
          :<></>}

        </div>
      </div>
    </div>
  );
}

export default Quote;
